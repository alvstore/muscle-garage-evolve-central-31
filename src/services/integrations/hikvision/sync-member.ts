import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import hikvisionAccessControlService from '@/services/integrations/hikvision/hikvisionAccessControlService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user is admin or staff
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || !['admin', 'staff'].includes(profile.role)) {
      return res.status(403).json({ message: 'Only administrators and staff can sync member access' });
    }

    // Get member ID and branch ID from request body
    const { memberId, branchId } = req.body;
    
    if (!memberId || !branchId) {
      return res.status(400).json({ message: 'Member ID and Branch ID are required' });
    }

    // Verify member exists
    const { data: member, error: memberError } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('id', memberId)
      .single();

    if (memberError || !member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Verify branch exists
    const { data: branch, error: branchError } = await supabase
      .from('branches')
      .select('id, name')
      .eq('id', branchId)
      .single();

    if (branchError || !branch) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Sync member access
    const success = await hikvisionAccessControlService.syncMemberAccess(memberId, branchId);

    if (!success) {
      return res.status(500).json({ message: 'Failed to sync member access' });
    }

    // Return success
    return res.status(200).json({ 
      message: `Access privileges synced for ${member.first_name} ${member.last_name} at ${branch.name}` 
    });
  } catch (error) {
    console.error('Error syncing member access:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
