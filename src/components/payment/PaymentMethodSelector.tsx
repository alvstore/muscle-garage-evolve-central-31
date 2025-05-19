import React from 'react';
import { 
  FormControl, 
  FormLabel, 
  Select, 
  FormHelperText,
  FormErrorMessage 
} from '@chakra-ui/react';
import { PaymentMethod, PAYMENT_METHODS } from '@/types/paymenttypes';

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  isRequired?: boolean;
  helperText?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isDisabled?: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  value,
  onChange,
  isRequired = true,
  helperText = 'Select the payment method',
  isInvalid = false,
  errorMessage,
  isDisabled = false
}) => {
  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid}>
      <FormLabel>Payment Method</FormLabel>
      <Select
        placeholder="Select payment method"
        value={value}
        onChange={(e) => onChange(e.target.value as PaymentMethod)}
        isDisabled={isDisabled}
      >
        {PAYMENT_METHODS.map((method) => (
          <option key={method.value} value={method.value}>
            {method.label}
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
