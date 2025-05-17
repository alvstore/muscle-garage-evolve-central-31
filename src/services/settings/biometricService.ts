
import { supabase } from '@/integrations/supabase/client';
import { getHikvisionToken } from '@/services/integrations/hikvisionTokenService';
import { Member } from '@/types/members/member';

interface RegisterMemberParams {
  memberId: string;
  name: string;
  phone: string;
  email?: string;
  branchId: string;
  deviceType: 'hikvision' | 'essl';
  profilePicture?: string;
}

/**
 * Checks the status of biometric devices for a branch
 * @param branchId - The ID of the branch to check devices for
 * @returns Status information about configured devices
 */
export async function checkBiometricDeviceStatus(branchId: string): Promise<{
  hasDevices: boolean;
  hikvision?: {
    configured: boolean;
    online: boolean;
    lastCheck: string | null;
    deviceCount: number;
  };
  essl?: {
    configured: boolean;
    online: boolean;
    lastCheck: string | null;
    deviceCount: number;
  };
}> {
  try {
    // Check for Hikvision devices
    const { data: hikvisionSettings } = await supabase
      .from('hikvision_api_settings')
      .select('*')
      .eq('branch_id', branchId)
      .eq('is_active', true)
      .maybeSingle();

    // Check for ESSL devices
    const { data: esslSettings } = await supabase
      .from('essl_device_settings')
      .select('*')
      .eq('branch_id', branchId)
      .eq('is_active', true)
      .maybeSingle();
      
    // Get device mapping count for Hikvision
    const { data: hikvisionDevices, error: hikError } = await supabase
      .from('device_mappings')
      .select('id')
      .eq('branch_id', branchId)
      .eq('device_type', 'hikvision')
      .eq('is_active', true);
      
    // Get device mapping count for ESSL
    const { data: esslDevices, error: esslError } = await supabase
      .from('device_mappings')
      .select('id')
      .eq('branch_id', branchId)
      .eq('device_type', 'essl')
      .eq('is_active', true);
      
    // Get latest status check
    const { data: latestHikStatus } = await supabase
      .from('integration_statuses')
      .select('created_at, is_online')
      .eq('branch_id', branchId)
      .eq('integration_type', 'hikvision')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
      
    const { data: latestEsslStatus } = await supabase
      .from('integration_statuses')
      .select('created_at, is_online')
      .eq('branch_id', branchId)
      .eq('integration_type', 'essl')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const result: ReturnType<typeof checkBiometricDeviceStatus> = {
      hasDevices: Boolean(hikvisionSettings || esslSettings)
    };
    
    if (hikvisionSettings) {
      result.hikvision = {
        configured: true,
        online: latestHikStatus?.is_online ?? false,
        lastCheck: latestHikStatus?.created_at || null,
        deviceCount: hikvisionDevices?.length || 0
      };
    }
    
    if (esslSettings) {
      result.essl = {
        configured: true,
        online: latestEsslStatus?.is_online ?? false,
        lastCheck: latestEsslStatus?.created_at || null,
        deviceCount: esslDevices?.length || 0
      };
    }
    
    return result;
  } catch (error) {
    console.error('Error checking biometric device status:', error);
    return { 
      hasDevices: false 
    };
  }
}

/**
 * Register a member in a biometric device
 */
export async function registerMemberInBiometricDevice(params: RegisterMemberParams): Promise<{
  success: boolean;
  message: string;
  personId?: string;
}> {
  try {
    // Get member data from database
    const { data: memberData, error: memberError } = await supabase
      .from('members')
      .select('*')
      .eq('id', params.memberId)
      .single();
    
    if (memberError || !memberData) {
      console.error('Member not found:', memberError);
      return { 
        success: false, 
        message: `Member not found: ${memberError?.message || 'Unknown error'}` 
      };
    }
    
    // Log the registration attempt
    const { data: logEntry } = await supabase
      .from('biometric_logs')
      .insert({
        member_id: params.memberId,
        branch_id: params.branchId,
        device_type: params.deviceType,
        action: 'register',
        status: 'pending',
        details: {
          name: params.name,
          phone: params.phone,
          email: params.email,
          device_type: params.deviceType
        },
      })
      .select()
      .single();
      
    // Process based on device type
    if (params.deviceType === 'hikvision') {
      return await registerWithHikvision(params, memberData, logEntry?.id);
    } else if (params.deviceType === 'essl') {
      return await registerWithEssl(params, memberData, logEntry?.id);
    } else {
      const errorMsg = `Unsupported device type: ${params.deviceType}`;
      
      // Update log entry with error
      await updateLogStatus(logEntry?.id, 'failed', errorMsg);
      
      return { 
        success: false, 
        message: errorMsg 
      };
    }
  } catch (error: any) {
    console.error('Error in registerMemberInBiometricDevice:', error);
    return { 
      success: false, 
      message: `Error registering in biometric device: ${error.message}`
    };
  }
}

/**
 * Register a member with Hikvision device
 */
async function registerWithHikvision(
  params: RegisterMemberParams, 
  memberData: Member,
  logId?: string
): Promise<{
  success: boolean;
  message: string;
  personId?: string;
}> {
  try {
    // First check if we already have a credential for this member
    const { data: existingCredential } = await supabase
      .from('member_access_credentials')
      .select('*')
      .eq('member_id', params.memberId)
      .eq('credential_type', 'hikvision')
      .eq('is_active', true)
      .maybeSingle();
    
    if (existingCredential) {
      console.log('Member already registered with Hikvision:', existingCredential.credential_value);
      await updateLogStatus(logId, 'success', `Member already registered with ID: ${existingCredential.credential_value}`);
      
      return { 
        success: true, 
        message: 'Member already registered with Hikvision',
        personId: existingCredential.credential_value
      };
    }
    
    // Get Hikvision API settings
    const { data: apiSettings, error: settingsError } = await supabase
      .from('hikvision_api_settings')
      .select('*')
      .eq('branch_id', params.branchId)
      .eq('is_active', true)
      .maybeSingle();
    
    if (settingsError || !apiSettings) {
      const errorMsg = `Hikvision API settings not found: ${settingsError?.message || 'Not configured'}`;
      await updateLogStatus(logId, 'failed', errorMsg);
      
      return { 
        success: false, 
        message: errorMsg
      };
    }
    
    // Get a valid token
    const accessToken = await getHikvisionToken(params.branchId);
    if (!accessToken) {
      const errorMsg = 'Failed to get Hikvision access token';
      await updateLogStatus(logId, 'failed', errorMsg);
      
      return { 
        success: false, 
        message: errorMsg
      };
    }
    
    // Find a device to register to
    if (!apiSettings.devices || apiSettings.devices.length === 0) {
      const errorMsg = 'No Hikvision devices configured';
      await updateLogStatus(logId, 'failed', errorMsg);
      
      return { 
        success: false, 
        message: errorMsg
      };
    }
    
    // Use the first device by default
    const deviceId = apiSettings.devices[0].id || apiSettings.devices[0].deviceId || apiSettings.devices[0].serialNumber;
    if (!deviceId) {
      const errorMsg = 'Invalid device configuration (no ID/serial)';
      await updateLogStatus(logId, 'failed', errorMsg);
      
      return { 
        success: false, 
        message: errorMsg
      };
    }
    
    // Prepare the person data
    const personData = {
      name: params.name,
      gender: memberData.gender || 'unknown',
      cardNo: memberData.id, // Use member ID as card number
      phone: params.phone || '',
      email: params.email || memberData.email || '',
      personType: 1, // Normal person
      pictures: params.profilePicture ? [params.profilePicture] : []
    };
    
    // Call the edge function to register the person
    const { data: response, error } = await supabase.functions.invoke('hikvision-proxy', {
      body: {
        action: 'register-person',
        apiUrl: apiSettings.api_url,
        accessToken,
        deviceId,
        personData,
        memberData,
        branchId: params.branchId
      }
    });
    
    console.log('Hikvision registration response:', response);
    
    if (error) {
      await updateLogStatus(logId, 'failed', `Edge function error: ${error.message}`);
      return { 
        success: false, 
        message: `Edge function error: ${error.message}` 
      };
    }
    
    if (!response.success) {
      await updateLogStatus(logId, 'failed', response.message || response.error || 'Unknown error');
      return { 
        success: false, 
        message: response.message || response.error || 'Unknown error'
      };
    }
    
    // After person is successfully registered, assign access privileges
    const { data: privilegeResponse, error: privilegeError } = await supabase.functions.invoke('hikvision-proxy', {
      body: {
        action: 'assign-privileges',
        apiUrl: apiSettings.api_url,
        accessToken,
        deviceId,
        personId: response.personId,
        doorList: [1], // Default to first door
        branchId: params.branchId
      }
    });
    
    console.log('Hikvision privilege response:', privilegeResponse);
    
    if (privilegeError) {
      console.warn('Warning: Failed to assign privileges:', privilegeError);
    }
    
    // Even if privileges fail, registration is considered successful
    await updateLogStatus(logId, 'success', `Successfully registered with ID: ${response.personId}`);
    
    return { 
      success: true,
      message: 'Successfully registered with Hikvision device',
      personId: response.personId
    };
  } catch (error: any) {
    console.error('Error registering with Hikvision:', error);
    await updateLogStatus(logId, 'failed', error.message);
    
    return { 
      success: false, 
      message: `Error registering with Hikvision: ${error.message}`
    };
  }
}

/**
 * Register a member with ESSL device
 */
async function registerWithEssl(
  params: RegisterMemberParams, 
  memberData: Member,
  logId?: string
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // First check if we already have a credential for this member
    const { data: existingCredential } = await supabase
      .from('member_access_credentials')
      .select('*')
      .eq('member_id', params.memberId)
      .eq('credential_type', 'essl')
      .eq('is_active', true)
      .maybeSingle();
    
    if (existingCredential) {
      console.log('Member already registered with ESSL:', existingCredential.credential_value);
      await updateLogStatus(logId, 'success', `Member already registered with ESSL ID: ${existingCredential.credential_value}`);
      
      return { 
        success: true, 
        message: 'Member already registered with ESSL device'
      };
    }
    
    // Get ESSL device settings
    const { data: esslSettings, error: settingsError } = await supabase
      .from('essl_device_settings')
      .select('*')
      .eq('branch_id', params.branchId)
      .eq('is_active', true)
      .maybeSingle();
    
    if (settingsError || !esslSettings) {
      const errorMsg = `ESSL device settings not found: ${settingsError?.message || 'Not configured'}`;
      await updateLogStatus(logId, 'failed', errorMsg);
      
      return { 
        success: false, 
        message: errorMsg
      };
    }
    
    // For this basic implementation, we'll just create a credential entry
    // In a real implementation, you'd call the ESSL API
    const credentialValue = `ESSL-${params.memberId.substring(0, 8)}`;
    
    // Create a credential entry
    const { data: credential, error: credentialError } = await supabase
      .from('member_access_credentials')
      .insert({
        member_id: params.memberId,
        credential_type: 'essl',
        credential_value: credentialValue,
        is_active: true,
        issued_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (credentialError) {
      const errorMsg = `Failed to create ESSL credential: ${credentialError.message}`;
      await updateLogStatus(logId, 'failed', errorMsg);
      
      return {
        success: false,
        message: errorMsg
      };
    }
    
    await updateLogStatus(logId, 'success', `Simulated registration with ESSL ID: ${credentialValue}`);
    
    return {
      success: true,
      message: 'Successfully registered with ESSL device (simulated)'
    };
  } catch (error: any) {
    console.error('Error registering with ESSL:', error);
    await updateLogStatus(logId, 'failed', error.message);
    
    return {
      success: false,
      message: `Error registering with ESSL: ${error.message}`
    };
  }
}

/**
 * Update log status in the biometric_logs table
 */
async function updateLogStatus(logId?: string, status: 'pending' | 'success' | 'failed', message?: string): Promise<void> {
  if (!logId) return;
  
  try {
    await supabase
      .from('biometric_logs')
      .update({
        status,
        error_message: status === 'failed' ? message : null,
        details: status === 'success' ? { message } : undefined,
        completed_at: status !== 'pending' ? new Date().toISOString() : null
      })
      .eq('id', logId);
  } catch (error) {
    console.error('Error updating biometric log status:', error);
  }
}
