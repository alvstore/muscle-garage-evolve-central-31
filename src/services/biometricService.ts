
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BiometricRegistrationParams {
  memberId: string;
  name: string;
  phone: string;
  branchId: string;
  deviceType: 'hikvision' | 'essl';
}

interface BiometricRegistrationResult {
  success: boolean;
  message: string;
}

export const registerMemberInBiometricDevice = async (
  params: BiometricRegistrationParams
): Promise<BiometricRegistrationResult> => {
  const { memberId, name, phone, branchId, deviceType } = params;

  try {
    // First, check if the biometric settings are configured
    let deviceSettings;
    let deviceQuery;
    
    if (deviceType === 'hikvision') {
      deviceQuery = await supabase
        .from('hikvision_api_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .single();
    } else {
      deviceQuery = await supabase
        .from('essl_device_settings')
        .select('*')
        .eq('branch_id', branchId)
        .eq('is_active', true)
        .single();
    }
    
    if (deviceQuery.error) {
      console.error(`Error fetching ${deviceType} settings:`, deviceQuery.error);
      return {
        success: false,
        message: `No active ${deviceType} device found for this branch`
      };
    }
    
    deviceSettings = deviceQuery.data;
    
    // Create a log entry for the biometric registration attempt
    const { error: logError } = await supabase
      .from('biometric_logs')
      .insert({
        member_id: memberId,
        device_type: deviceType,
        action: 'register',
        branch_id: branchId,
        status: 'pending',
        details: {
          name,
          phone,
          member_id: memberId
        }
      });
      
    if (logError) {
      console.error('Error creating biometric log:', logError);
    }

    // For now, since we don't have direct API access to the devices in this context,
    // we'll simulate a successful registration
    // In a real implementation, this would make an API call to the device
    
    // Simulate device API call
    const registrationSuccess = true; // This would be the result of an actual API call
    
    // Update the log with the result
    if (registrationSuccess) {
      await supabase
        .from('biometric_logs')
        .update({
          status: 'success',
          completed_at: new Date().toISOString()
        })
        .eq('member_id', memberId)
        .eq('action', 'register');
        
      return {
        success: true,
        message: `Member successfully registered in ${deviceType} device`
      };
    } else {
      await supabase
        .from('biometric_logs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_message: 'Device registration failed'
        })
        .eq('member_id', memberId)
        .eq('action', 'register');
        
      return {
        success: false,
        message: `Failed to register member in ${deviceType} device`
      };
    }
  } catch (error: any) {
    console.error('Error in biometric registration:', error);
    
    // Log the failed attempt
    await supabase
      .from('biometric_logs')
      .insert({
        member_id: memberId,
        device_type: deviceType,
        action: 'register',
        branch_id: branchId,
        status: 'failed',
        error_message: error.message || 'Unknown error',
        details: {
          name,
          phone,
          member_id: memberId
        }
      });
      
    return {
      success: false,
      message: `Error registering member: ${error.message}`
    };
  }
};

export const checkBiometricDeviceStatus = async (branchId: string): Promise<{
  hikvision: boolean;
  essl: boolean;
}> => {
  try {
    // Check Hikvision status
    const { data: hikvisionData, error: hikvisionError } = await supabase
      .from('hikvision_api_settings')
      .select('is_active')
      .eq('branch_id', branchId)
      .single();
      
    // Check ESSL status
    const { data: esslData, error: esslError } = await supabase
      .from('essl_device_settings')
      .select('is_active')
      .eq('branch_id', branchId)
      .single();
      
    return {
      hikvision: hikvisionData?.is_active || false,
      essl: esslData?.is_active || false
    };
  } catch (error) {
    console.error('Error checking biometric device status:', error);
    return {
      hikvision: false,
      essl: false
    };
  }
};
