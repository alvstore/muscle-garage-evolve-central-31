
import api from "./api";
import { BodyMeasurement, PTPlan } from "@/types/measurements";

// In a real application, these would be actual API calls
// For now, we'll use mock data and simulated responses

// Mock data storage (would be replaced by actual API calls)
let mockMeasurements: BodyMeasurement[] = [];
let mockPTPlans: PTPlan[] = [];

export const measurementService = {
  // Body measurement methods
  getAllMeasurements: async (memberId: string): Promise<BodyMeasurement[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMeasurements.filter(m => m.memberId === memberId));
      }, 500);
    });
  },
  
  getMeasurement: async (id: string): Promise<BodyMeasurement | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const measurement = mockMeasurements.find(m => m.id === id);
        resolve(measurement || null);
      }, 300);
    });
  },
  
  getLatestMeasurement: async (memberId: string): Promise<BodyMeasurement | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const memberMeasurements = mockMeasurements.filter(m => m.memberId === memberId);
        if (memberMeasurements.length === 0) {
          resolve(null);
          return;
        }
        
        // Sort by date descending and get the first one
        const latestMeasurement = [...memberMeasurements].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        
        resolve(latestMeasurement);
      }, 300);
    });
  },
  
  addMeasurement: async (measurement: Omit<BodyMeasurement, "id">): Promise<BodyMeasurement> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMeasurement: BodyMeasurement = {
          ...measurement,
          id: `measurement-${Date.now()}`
        };
        
        mockMeasurements.push(newMeasurement);
        resolve(newMeasurement);
      }, 500);
    });
  },
  
  updateMeasurement: async (id: string, measurement: Partial<BodyMeasurement>): Promise<BodyMeasurement> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockMeasurements.findIndex(m => m.id === id);
        if (index === -1) {
          reject(new Error("Measurement not found"));
          return;
        }
        
        const updatedMeasurement = {
          ...mockMeasurements[index],
          ...measurement
        };
        
        mockMeasurements[index] = updatedMeasurement;
        resolve(updatedMeasurement);
      }, 500);
    });
  },
  
  deleteMeasurement: async (id: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockMeasurements.findIndex(m => m.id === id);
        if (index === -1) {
          reject(new Error("Measurement not found"));
          return;
        }
        
        mockMeasurements.splice(index, 1);
        resolve();
      }, 500);
    });
  },
  
  // PT Plan methods
  getAllPTPlans: async (trainerId?: string, memberId?: string): Promise<PTPlan[]> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        let plans = [...mockPTPlans];
        
        if (trainerId) {
          plans = plans.filter(p => p.trainerId === trainerId);
        }
        
        if (memberId) {
          plans = plans.filter(p => p.memberId === memberId);
        }
        
        resolve(plans);
      }, 500);
    });
  },
  
  getPTPlan: async (id: string): Promise<PTPlan | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = mockPTPlans.find(p => p.id === id);
        resolve(plan || null);
      }, 300);
    });
  },
  
  getActivePTPlan: async (memberId: string): Promise<PTPlan | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const plan = mockPTPlans.find(p => p.memberId === memberId && p.isActive);
        resolve(plan || null);
      }, 300);
    });
  },
  
  addPTPlan: async (plan: Omit<PTPlan, "id">): Promise<PTPlan> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const newPlan: PTPlan = {
          ...plan,
          id: `ptplan-${Date.now()}`
        };
        
        mockPTPlans.push(newPlan);
        resolve(newPlan);
      }, 500);
    });
  },
  
  updatePTPlan: async (id: string, plan: Partial<PTPlan>): Promise<PTPlan> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPTPlans.findIndex(p => p.id === id);
        if (index === -1) {
          reject(new Error("PT Plan not found"));
          return;
        }
        
        const updatedPlan = {
          ...mockPTPlans[index],
          ...plan
        };
        
        mockPTPlans[index] = updatedPlan;
        resolve(updatedPlan);
      }, 500);
    });
  },
  
  deletePTPlan: async (id: string): Promise<void> => {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockPTPlans.findIndex(p => p.id === id);
        if (index === -1) {
          reject(new Error("PT Plan not found"));
          return;
        }
        
        mockPTPlans.splice(index, 1);
        resolve();
      }, 500);
    });
  }
};

export default measurementService;
