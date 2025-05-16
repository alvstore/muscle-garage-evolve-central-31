
// Mock service until real implementation is provided
export default {
  getIntegrations: async () => [],
  getIntegrationById: async (id: string) => null,
  updateIntegration: async (id: string, data: any) => ({ id, ...data }),
  saveSettings: async (data: any) => ({ id: 'mock-id', ...data }),
  testConnection: async (data: any) => ({ success: true }),
};
