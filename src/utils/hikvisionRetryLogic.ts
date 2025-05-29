
import { getHikvisionErrorMessage, shouldRetry, getErrorSeverity } from './hikvisionErrorCodes';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

interface ApiCall<T> {
  (): Promise<T>;
}

export class HikvisionRetryManager {
  private defaultOptions: Required<RetryOptions> = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 30000,
    backoffFactor: 2
  };

  async executeWithRetry<T>(
    apiCall: ApiCall<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const opts = { ...this.defaultOptions, ...options };
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
      try {
        const result = await apiCall();
        
        // Check if result has errorCode property
        if (this.hasErrorCode(result)) {
          const errorCode = this.extractErrorCode(result);
          
          if (errorCode !== '0') {
            const errorMessage = getHikvisionErrorMessage(errorCode);
            const severity = getErrorSeverity(errorCode);
            
            console.error(`[HikvisionRetry] API Error - Code: ${errorCode}, Message: ${errorMessage}, Severity: ${severity}`);
            
            if (!shouldRetry(errorCode) || attempt === opts.maxRetries) {
              throw new Error(`Hikvision API Error: ${errorMessage} (Code: ${errorCode})`);
            }
            
            // Wait before retry
            const delay = Math.min(
              opts.initialDelay * Math.pow(opts.backoffFactor, attempt),
              opts.maxDelay
            );
            
            console.log(`[HikvisionRetry] Retrying in ${delay}ms (attempt ${attempt + 1}/${opts.maxRetries + 1})`);
            await this.sleep(delay);
            continue;
          }
        }
        
        return result;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        console.error(`[HikvisionRetry] Attempt ${attempt + 1} failed:`, lastError.message);
        
        if (attempt === opts.maxRetries) {
          break;
        }
        
        // Wait before retry
        const delay = Math.min(
          opts.initialDelay * Math.pow(opts.backoffFactor, attempt),
          opts.maxDelay
        );
        
        console.log(`[HikvisionRetry] Retrying in ${delay}ms (attempt ${attempt + 1}/${opts.maxRetries + 1})`);
        await this.sleep(delay);
      }
    }
    
    throw lastError || new Error('Maximum retries exceeded');
  }

  private hasErrorCode(result: any): boolean {
    return result && typeof result === 'object' && 'errorCode' in result;
  }

  private extractErrorCode(result: any): string {
    return String(result.errorCode || '0');
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility method for rate limiting
  async withRateLimit<T>(
    apiCall: ApiCall<T>,
    rateLimitMs: number = 100
  ): Promise<T> {
    const start = Date.now();
    const result = await apiCall();
    const elapsed = Date.now() - start;
    
    if (elapsed < rateLimitMs) {
      await this.sleep(rateLimitMs - elapsed);
    }
    
    return result;
  }
}

export const hikvisionRetryManager = new HikvisionRetryManager();

// Convenience function for common retry scenarios
export const withHikvisionRetry = <T>(
  apiCall: ApiCall<T>,
  options?: RetryOptions
): Promise<T> => {
  return hikvisionRetryManager.executeWithRetry(apiCall, options);
};
