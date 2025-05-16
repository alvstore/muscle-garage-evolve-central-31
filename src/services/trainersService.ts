
// Mock service until real implementation is provided
const trainersService = {
  getTrainers: async () => [],
  getTrainerById: async (id: string) => null,
  createTrainer: async (data: any) => ({ id: 'mock-id', ...data }),
  updateTrainer: async (id: string, data: any) => ({ id, ...data }),
  deleteTrainer: async (id: string) => true,
};

export default trainersService;
