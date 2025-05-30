
import { InvoiceTotalProps } from "@/types/payment/invoice";

export const InvoiceTotal = ({ amount }: InvoiceTotalProps) => (
  <div className="flex justify-end mt-4">
    <div className="bg-gray-50 p-2 rounded">
      <span className="font-medium">Total Amount: </span>
      <span className="font-bold">
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount)}
      </span>
    </div>
  </div>
);

