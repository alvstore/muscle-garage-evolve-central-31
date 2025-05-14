
// Define types
export interface HikvisionDevice {
  id: string;
  name: string;
  serialNumber: string;
  type: string;
  ip: string;
  active: boolean;
}

export interface HikvisionEvent {
  id: string;
  event_id: string;
  event_type: string;
  event_time: string;
  device_id: string;
  device_name: string;
  door_id: string;
  doorName: string; // Property for compatibility
  person_id?: string;
  personName?: string; // Property for compatibility
  face_id?: string;
  card_no?: string;
  processed: boolean;
}

// Hikvision service functions
export const HikvisionService = {
  getDevices: async (): Promise<HikvisionDevice[]> => {
    // This would be an API call in a real implementation
    return [
      {
        id: '1',
        name: 'Main Entrance',
        serialNumber: 'HIK12345',
        type: 'Door Controller',
        ip: '192.168.1.100',
        active: true
      },
      {
        id: '2',
        name: 'Gym Access',
        serialNumber: 'HIK67890',
        type: 'Door Controller',
        ip: '192.168.1.101',
        active: true
      }
    ];
  },

  processEvent: async (event: HikvisionEvent): Promise<boolean> => {
    // This would process an event from Hikvision
    console.log('Processing Hikvision event:', event);
    return true;
  }
};

// For backwards compatibility
export const hikvisionService = HikvisionService;
export default HikvisionService;
