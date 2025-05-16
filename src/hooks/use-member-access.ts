
import { useState } from 'react';
import { hikvisionService, HikvisionApiSettings, HikvisionPerson, HikvisionAccessPrivilege } from '@/services/hikvisionService';
import { useHikvisionSettings } from './use-hikvision-settings';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';

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
    if (!settings || !settings.is_active) {
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
        const person: HikvisionPerson = {
          personId: '',
          name: member.name,
          gender: member.gender?.toLowerCase() || 'male',
          phone: member.phone,
          email: member.email,
          personType: 1, // Member
          picture
        };

        personId = await hikvisionService.addPerson(settings, person);
        
        // Save the credential
        await saveMemberCredential(member.id, personId);
        
        toast.success('Member registered with access control system');
      } else {
        // Update existing person
        const person: HikvisionPerson = {
          personId,
          name: member.name,
          gender: member.gender?.toLowerCase() || 'male',
          phone: member.phone,
          email: member.email,
          picture
        };

        await hikvisionService.updatePerson(settings, person);
        toast.success('Member information updated in access control system');
      }

      // Fetch devices and sync to all of them
      const devices = await hikvisionService.getDevices(settings);
      if (devices.length > 0) {
        await hikvisionService.syncPersonToDevices(
          settings, 
          personId, 
          devices.map(d => d.serialNumber)
        );
      }

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
    if (!settings || !settings.is_active) return false;

    setIsProcessing(true);
    try {
      const credential = await getMemberCredential(memberId);
      if (!credential) return true; // Already not registered

      const personId = credential.credential_value;
      
      // Remove from Hikvision
      await hikvisionService.deletePerson(settings, personId);
      
      // Update credential status
      await supabase
        .from('member_access_credentials')
        .update({ is_active: false })
        .eq('id', credential.id);
        
      toast.success('Member access credentials revoked');
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
    if (!settings || !settings.is_active) return false;
    
    setIsProcessing(true);
    try {
      const credential = await getMemberCredential(memberId);
      if (!credential) {
        toast.error('Member is not registered with access control system');
        return false;
      }

      const personId = credential.credential_value;
      
      const privilege: HikvisionAccessPrivilege = {
        personId,
        deviceSerialNo,
        doorList,
        validStartTime,
        validEndTime
      };
      
      await hikvisionService.configureAccess(settings, privilege);
      toast.success('Access permissions granted successfully');
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
    if (!settings || !settings.is_active) return false;
    
    setIsProcessing(true);
    try {
      const credential = await getMemberCredential(memberId);
      if (!credential) return true; // No credentials to revoke
      
      const personId = credential.credential_value;
      
      await hikvisionService.removeAccess(settings, personId, deviceSerialNo);
      toast.success('Access permissions revoked successfully');
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
