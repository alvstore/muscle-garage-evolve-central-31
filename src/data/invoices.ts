
// Sample invoice data for development purposes
export const invoicesData = [
  {
    id: "INV-001",
    memberId: "MEM-001",
    memberName: "John Doe",
    amount: 1999,
    status: "paid",
    dueDate: "2023-12-15",
    issuedDate: "2023-12-01",
    paidDate: "2023-12-10",
    paymentMethod: "credit_card"
  },
  {
    id: "INV-002",
    memberId: "MEM-002",
    memberName: "Jane Smith",
    amount: 2499,
    status: "pending",
    dueDate: "2023-12-20",
    issuedDate: "2023-12-05",
    paymentMethod: null
  },
  {
    id: "INV-003",
    memberId: "MEM-003",
    memberName: "Robert Johnson",
    amount: 1799,
    status: "overdue",
    dueDate: "2023-12-01",
    issuedDate: "2023-11-15",
    paymentMethod: null
  },
  {
    id: "INV-004",
    memberId: "MEM-001",
    memberName: "John Doe",
    amount: 999,
    status: "paid",
    dueDate: "2023-11-15",
    issuedDate: "2023-11-01",
    paidDate: "2023-11-10",
    paymentMethod: "bank_transfer"
  }
];
