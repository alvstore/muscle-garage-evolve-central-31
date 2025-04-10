
import { Container } from "@/components/ui/container";
import InvoiceList from "@/components/finance/InvoiceList";

const InvoicePage = () => {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Invoice Management</h1>
        <InvoiceList />
      </div>
    </Container>
  );
};

export default InvoicePage;
