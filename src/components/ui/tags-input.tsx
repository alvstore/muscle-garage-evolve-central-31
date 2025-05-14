
import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TagsInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagsInput({ value, onChange, placeholder = "Add tag...", disabled = false }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    if (inputValue.trim() !== '') {
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border rounded-md focus-within:border-primary">
      {value.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="gap-1">
          {tag}
          <button
            type="button"
            onClick={() => handleRemoveTag(tag)}
            className="rounded-full hover:bg-muted"
            disabled={disabled}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag}</span>
          </button>
        </Badge>
      ))}
      <Input
        type="text"
        value={inputValue}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleAddTag}
        placeholder={value.length === 0 ? placeholder : ''}
        className="flex-1 border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={disabled}
      />
    </div>
  );
}
