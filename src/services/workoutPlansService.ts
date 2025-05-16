
// Mock service until real implementation is provided
const workoutPlansService = {
  getWorkoutPlans: async () => [],
  getWorkoutPlanById: async (id: string) => null,
  createWorkoutPlan: async (data: any) => ({ id: 'mock-id', ...data }),
  updateWorkoutPlan: async (id: string, data: any) => ({ id, ...data }),
  deleteWorkoutPlan: async (id: string) => true,
};

export default workoutPlansService;
