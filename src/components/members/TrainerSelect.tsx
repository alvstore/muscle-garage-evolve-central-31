
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import trainersService from '@/services/trainersService';

interface TrainerSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

const TrainerSelect: React.FC<TrainerSelectProps> = ({ value, onChange, className = "", label = "Trainer" }) => {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const data = await trainersService.getTrainers();
        setTrainers(data);
      } catch (error) {
        console.error("Failed to fetch trainers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  return (
    <Select value={value} onValueChange={onChange} disabled={isLoading}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={`Select ${label}`} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">None</SelectItem>
        {trainers.map((trainer) => (
          <SelectItem key={trainer.id} value={trainer.id}>
            {trainer.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TrainerSelect;
