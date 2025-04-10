
// Mock service for Hikvision integration

export interface HikvisionEvent {
  eventId: string;
  eventType: "entry" | "exit" | "denied";
  eventTime: string;
  doorId: string;
  doorName?: string;
  personId?: string;
  personName?: string;
  cardNo?: string;
  isProcessed?: boolean;
}

export const hikvisionService = {
  /**
   * Get events from the Hikvision system
   */
  getEvents: async (startTime: string, endTime?: string): Promise<HikvisionEvent[]> => {
    // In a real app, this would be an API call to the Hikvision system
    
    // For demo, return mock data
    const mockEvents: HikvisionEvent[] = [
      {
        eventId: "evt-" + Date.now() + "-1",
        eventType: "entry",
        eventTime: new Date().toISOString(),
        doorId: "door-1",
        doorName: "Main Entrance",
        personId: "member-1",
        personName: "John Member",
        cardNo: "12345",
        isProcessed: false
      },
      {
        eventId: "evt-" + Date.now() + "-2",
        eventType: "exit",
        eventTime: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
        doorId: "door-1",
        doorName: "Main Entrance",
        personId: "member-2",
        personName: "Jane Member",
        cardNo: "23456",
        isProcessed: true
      },
      {
        eventId: "evt-" + Date.now() + "-3",
        eventType: "denied",
        eventTime: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
        doorId: "door-2",
        doorName: "Staff Entrance",
        personId: "visitor-1",
        personName: "Unknown Person",
        isProcessed: true
      }
    ];
    
    return Promise.resolve(mockEvents);
  },
  
  /**
   * Process attendance from access control events
   */
  processAttendance: async (events: HikvisionEvent[]): Promise<number> => {
    // In a real app, this would process events and create attendance records
    
    // Filter for unprocessed entry events
    const unprocessedEntryEvents = events.filter(
      event => event.eventType === "entry" && !event.isProcessed
    );
    
    // Mark all events as processed
    events.forEach(event => {
      event.isProcessed = true;
    });
    
    // Return count of processed events
    return Promise.resolve(unprocessedEntryEvents.length);
  },
  
  /**
   * Simulate an access control event (for testing)
   */
  simulateEvent: async (
    memberId: string,
    eventType: "entry" | "exit" | "denied"
  ): Promise<HikvisionEvent> => {
    // Create a mock event
    const mockEvent: HikvisionEvent = {
      eventId: "evt-" + Date.now(),
      eventType,
      eventTime: new Date().toISOString(),
      doorId: "door-1",
      doorName: "Main Entrance",
      personId: memberId,
      personName: "John Member",
      cardNo: "12345",
      isProcessed: false
    };
    
    return Promise.resolve(mockEvent);
  }
};
