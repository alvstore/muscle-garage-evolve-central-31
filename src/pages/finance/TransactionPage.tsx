
import { Container } from "@/components/ui/container";
import TransactionList from "@/components/finance/TransactionList";

const TransactionPage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Financial Transactions</h1>
        <TransactionList />
      </div>
    </Container>
  );
};

export default TransactionPage;
