
// Mock service until real implementation is provided
export default {
  getDietPlans: async () => [],
  getDietPlanById: async (id: string) => null,
  createDietPlan: async (data: any) => ({ id: 'mock-id', ...data }),
  updateDietPlan: async (id: string, data: any) => ({ id, ...data }),
  deleteDietPlan: async (id: string) => true,
};
