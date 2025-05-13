import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';
import hikvisionAccessControlService from '@/services/integrations/hikvisionAccessControlService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Check if user is admin
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    return res.status(403).json({ message: 'Only administrators can manage access control devices' });
  }

  // Get branch ID from query
  const { branchId } = req.query;
  
  if (!branchId || typeof branchId !== 'string') {
    return res.status(400).json({ message: 'Branch ID is required' });
  }

  try {
    // Handle different HTTP methods
    switch (req.method) {
      case 'GET':
        // Get devices for branch
        const devices = await hikvisionAccessControlService.getAccessDoors(branchId);
        return res.status(200).json(devices);

      case 'POST':
        // Add new device
        const { door_name, door_number, hikvision_door_id, zone_id, device_id } = req.body;
        
        if (!door_name || !hikvision_door_id || !zone_id || !device_id) {
          return res.status(400).json({ 
            message: 'Door name, Hikvision door ID, zone ID, and device ID are required' 
          });
        }
        
        // Verify zone exists
        const { data: zone, error: zoneError } = await supabase
          .from('access_zones')
          .select('id')
          .eq('id', zone_id)
          .eq('branch_id', branchId)
          .single();
          
        if (zoneError || !zone) {
          return res.status(404).json({ message: 'Zone not found in this branch' });
        }
        
        // Verify device exists
        const { data: deviceSettings, error: deviceError } = await supabase
          .from('hikvision_api_settings')
          .select('id')
          .eq('id', device_id)
          .eq('branch_id', branchId)
          .single();
          
        if (deviceError || !deviceSettings) {
          return res.status(404).json({ message: 'Device not found in this branch' });
        }
        
        // Add door
        const { data: newDoor, error: doorError } = await supabase
          .from('access_doors')
          .insert({
            door_name,
            door_number,
            hikvision_door_id,
            zone_id,
            branch_id: branchId,
            device_id,
            is_active: true
          })
          .select()
          .single();
          
        if (doorError) {
          return res.status(500).json({ 
            message: 'Failed to add door', 
            error: doorError.message 
          });
        }
        
        return res.status(201).json(newDoor);

      case 'PUT':
        // Update device
        const { id, is_active } = req.body;
        
        if (!id) {
          return res.status(400).json({ message: 'Door ID is required' });
        }
        
        // Update door
        const { data: updatedDoor, error: updateError } = await supabase
          .from('access_doors')
          .update({
            is_active: is_active !== undefined ? is_active : undefined,
            door_name: req.body.door_name,
            door_number: req.body.door_number,
            hikvision_door_id: req.body.hikvision_door_id,
            zone_id: req.body.zone_id,
            device_id: req.body.device_id
          })
          .eq('id', id)
          .eq('branch_id', branchId)
          .select()
          .single();
          
        if (updateError) {
          return res.status(500).json({ 
            message: 'Failed to update door', 
            error: updateError.message 
          });
        }
        
        return res.status(200).json(updatedDoor);

      case 'DELETE':
        // Delete device
        const { doorId } = req.query;
        
        if (!doorId) {
          return res.status(400).json({ message: 'Door ID is required' });
        }
        
        // Delete door
        const { error: deleteError } = await supabase
          .from('access_doors')
          .delete()
          .eq('id', doorId)
          .eq('branch_id', branchId);
          
        if (deleteError) {
          return res.status(500).json({ 
            message: 'Failed to delete door', 
            error: deleteError.message 
          });
        }
        
        return res.status(200).json({ message: 'Door deleted successfully' });

      default:
        return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error managing access doors:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
