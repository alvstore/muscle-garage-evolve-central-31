import React from 'react';
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack
} from '@chakra-ui/react';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { PaymentStatusSelector } from './PaymentStatusSelector';
import { PaymentMethod, PaymentStatus } from '@/types/payment';

export interface PaymentDetailsFormData {
  method: PaymentMethod;
  status: PaymentStatus;
  transaction_id?: string;
  reference_number?: string;
  payment_date?: string;
  notes?: string;
  amount: number;
}

interface PaymentDetailsFormProps {
  value: PaymentDetailsFormData;
  onChange: (value: PaymentDetailsFormData) => void;
  showAmount?: boolean;
  showStatusField?: boolean;
  isSubmitting?: boolean;
}

export const PaymentDetailsForm: React.FC<PaymentDetailsFormProps> = ({
  value,
  onChange,
  showAmount = true,
  showStatusField = true,
  isSubmitting = false
}) => {
  const handleChange = (field: keyof PaymentDetailsFormData) => (val: any) => {
    onChange({
      ...value,
      [field]: val
    });
  };

  return (
    <Box>
      <VStack spacing={4}>
        {showAmount && (
          <FormControl isRequired>
            <FormLabel>Amount</FormLabel>
            <Input
              type="number"
              value={value.amount || ''}
              onChange={(e) => handleChange('amount')(parseFloat(e.target.value) || 0)}
              min={0}
              step="0.01"
              isDisabled={isSubmitting}
            />
          </FormControl>
        )}

        <HStack spacing={4} width="100%" alignItems="flex-start">
          <Box flex={1}>
            <PaymentMethodSelector
              value={value.method}
              onChange={handleChange('method')}
              isDisabled={isSubmitting}
            />
          </Box>
          
          {showStatusField && (
            <Box flex={1}>
              <PaymentStatusSelector
                value={value.status}
                onChange={handleChange('status')}
                isDisabled={isSubmitting}
              />
            </Box>
          )}
        </HStack>

        <HStack spacing={4} width="100%" alignItems="flex-start">
          <FormControl flex={1}>
            <FormLabel>Transaction ID</FormLabel>
            <Input
              value={value.transaction_id || ''}
              onChange={(e) => handleChange('transaction_id')(e.target.value)}
              placeholder="e.g., TXN123456"
              isDisabled={isSubmitting}
            />
          </FormControl>

          <FormControl flex={1}>
            <FormLabel>Reference Number</FormLabel>
            <Input
              value={value.reference_number || ''}
              onChange={(e) => handleChange('reference_number')(e.target.value)}
              placeholder="e.g., REF789012"
              isDisabled={isSubmitting}
            />
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>Payment Date</FormLabel>
          <Input
            type="date"
            value={value.payment_date || ''}
            onChange={(e) => handleChange('payment_date')(e.target.value)}
            isDisabled={isSubmitting}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Notes</FormLabel>
          <Textarea
            value={value.notes || ''}
            onChange={(e) => handleChange('notes')(e.target.value)}
            placeholder="Any additional payment details..."
            isDisabled={isSubmitting}
            rows={3}
          />
        </FormControl>
      </VStack>
    </Box>
  );
};
