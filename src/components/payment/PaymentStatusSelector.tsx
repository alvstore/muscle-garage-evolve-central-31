import React from 'react';
import { 
  FormControl, 
  FormLabel, 
  Select, 
  FormHelperText,
  FormErrorMessage 
} from '@chakra-ui/react';
import { PaymentStatus, PAYMENT_STATUSES } from '@/types/payment/payment';

interface PaymentStatusSelectorProps {
  value: PaymentStatus;
  onChange: (value: PaymentStatus) => void;
  isRequired?: boolean;
  helperText?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}

export const PaymentStatusSelector: React.FC<PaymentStatusSelectorProps> = ({
  value,
  onChange,
  isRequired = true,
  helperText = 'Select the payment status',
  isInvalid = false,
  errorMessage,
  isDisabled = false
}) => {
  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel>Payment Status</FormLabel>
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as PaymentStatus)}
        isDisabled={isDisabled}
      >
        {PAYMENT_STATUSES.map((status) => (
          <option key={status.value} value={status.value}>
            {status.label}
          </option>
        ))}
      </Select>
      {!isInvalid && helperText && (
        <FormHelperText>{helperText}</FormHelperText>
      )}
      {isInvalid && errorMessage && (
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      )}
    </FormControl>
  );
};
