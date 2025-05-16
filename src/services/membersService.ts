
// Mock service until real implementation is provided
const membersService = {
  getMembers: async () => [],
  getMember: async (id: string) => null,
  getMemberById: async (id: string) => null,
  createMember: async (data: any) => ({ id: 'mock-id', ...data }),
  updateMember: async (id: string, data: any) => ({ id, ...data }),
  deleteMember: async (id: string) => true,
};

export default membersService;
