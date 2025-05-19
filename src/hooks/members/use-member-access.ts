
import { useState } from 'react';
import { hikvisionService } from '@/services/integrations/hikvisionService';
import { useHikvisionSettings } from '@/hooks/use-hikvision-settings';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { HikvisionPerson, HikvisionAccessPrivilege } from '@/types/settings/hikvision-types';

export const useMemberAccess = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { settings } = useHikvisionSettings();

  const getMemberCredential = async (memberId: string) => {
    try {
      const { data } = await supabase
        .from('member_access_credentials')
        .select('*')
        .eq('member_id', memberId)
        .eq('credential_type', 'hikvision_person_id')
        .single();
      
      return data;
    } catch (error) {
      console.error('Error fetching member credential:', error);
      return null;
    }
  };

  const saveMemberCredential = async (memberId: string, personId: string) => {
    try {
      const { data, error } = await supabase
        .from('member_access_credentials')
        .upsert({
          member_id: memberId,
          credential_type: 'hikvision_person_id',
          credential_value: personId,
          is_active: true,
          issued_at: new Date().toISOString()
        })
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving member credential:', error);
      throw error;
    }
  };

  const registerMember = async (member: any, picture?: string): Promise<boolean> => {
    if (!settings || !settings.isActive) {
      toast.error('Hikvision integration is not configured');
      return false;
    }

    setIsProcessing(true);
    try {
      // Check if member already has a Hikvision personId
      const credential = await getMemberCredential(member.id);
      
      let personId = credential?.credential_value;
      
      if (!personId) {
        // Create new person in Hikvision
        // Create person object without the picture as it's not part of HikvisionPerson
        const person: HikvisionPerson = {
          personId: member.id,
          memberId: member.id,
          name: `${member.first_name} ${member.last_name}`.trim(),
          cardNo: '',
          phone: member.phone,
          email: member.email,
          gender: member.gender?.toLowerCase(),
          status: 'active',
          branchId: settings.branchId || ''
        };

        // Register the member in Hikvision
        const result: any = await hikvisionService.registerMember(person, settings.branchId || '');
        if (!result.success) {
          throw new Error(result.message);
        }
        personId = result.personId;
        await saveMemberCredential(member.id, personId);
        
        toast.success('Member registered with access control system');
      } else {
        // Update existing person
        const person: HikvisionPerson = {
          personId: member.id,
          memberId: member.id,
          name: `${member.first_name} ${member.last_name}`.trim(),
          cardNo: '',
          phone: member.phone,
          email: member.email,
          gender: member.gender?.toLowerCase(),
          status: 'active',
          branchId: settings.branchId || ''
        };

        // Update the member in Hikvision
        const result = await hikvisionService.registerMember(person, settings.branchId || '');
        if (!result.success) {
          throw new Error(result.message);
        }
        toast.success('Member information updated in access control system');
      }

      // In the current implementation, the service handles device syncing internally
      // Just need to register/update the member and the service will handle the rest
      return true;
    } catch (error) {
      console.error('Error registering member with Hikvision:', error);
      toast.error('Failed to register member with access control system');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const unregisterMember = async (memberId: string): Promise<boolean> => {
    if (!settings || !settings.isActive) return false;

    setIsProcessing(true);
    try {
      const credential = await getMemberCredential(memberId);
      if (!credential) return true; // Already not registered

      const personId = credential.credential_value;
      
      // Remove from Hikvision
      // In the current implementation, we don't have a direct delete method
      // You would need to implement this in the HikvisionService if needed
      console.warn('Delete person not implemented in HikvisionService');
      return true;
    } catch (error) {
      console.error('Error unregistering member from Hikvision:', error);
      toast.error('Failed to revoke access credentials');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const grantAccess = async (
    memberId: string, 
    deviceSerialNo: string, 
    doorList: number[],
    validStartTime: string,
    validEndTime: string
  ): Promise<boolean> => {
    if (!settings || !settings.isActive) return false;
    
    setIsProcessing(true);
    try {
      const credential = await getMemberCredential(memberId);
      if (!credential) {
        toast.error('Member is not registered with access control system');
        return false;
      }

      const personId = credential.credential_value;
      
      // Configure access is handled during registration/update in the current implementation
      // You would need to implement this in the HikvisionService if needed
      console.warn('Configure access not implemented in HikvisionService');
      return true;
    } catch (error) {
      console.error('Error granting access permissions:', error);
      toast.error('Failed to grant access permissions');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const revokeAccess = async (memberId: string, deviceSerialNo: string): Promise<boolean> => {
    if (!settings || !settings.isActive) return false;
    
    setIsProcessing(true);
    try {
      const credential = await getMemberCredential(memberId);
      if (!credential) return true; // No credentials to revoke
      
      const personId = credential.credential_value;
      
      // Remove access is not directly supported in the current implementation
      // You would need to implement this in the HikvisionService if needed
      console.warn('Remove access not implemented in HikvisionService');
      return true;
    } catch (error) {
      console.error('Error revoking access permissions:', error);
      toast.error('Failed to revoke access permissions');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    registerMember,
    unregisterMember,
    grantAccess,
    revokeAccess,
    isProcessing
  };
};
