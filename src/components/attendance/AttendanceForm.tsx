import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AttendanceFormProps {
  memberId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type AttendanceRecord = {
  id?: string;
  member_id: string;
  check_in_time: string;
  check_out_time?: string | null;
  notes?: string | null;
  status: 'checked-in' | 'checked-out';
};

const AttendanceForm: React.FC<AttendanceFormProps> = ({ memberId, onSuccess, onCancel }) => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [checkInTime, setCheckInTime] = useState<string>(format(new Date(), 'HH:mm'));
  const [checkOutTime, setCheckOutTime] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<'checked-in' | 'checked-out'>('checked-in');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Format the date and times for database
      const checkInDateTime = new Date(date);
      const [checkInHours, checkInMinutes] = checkInTime.split(':').map(Number);
      checkInDateTime.setHours(checkInHours, checkInMinutes);

      let checkOutDateTime = null;
      if (status === 'checked-out' && checkOutTime) {
        checkOutDateTime = new Date(date);
        const [checkOutHours, checkOutMinutes] = checkOutTime.split(':').map(Number);
        checkOutDateTime.setHours(checkOutHours, checkOutMinutes);
      }

      const attendanceRecord: AttendanceRecord = {
        member_id: memberId,
        check_in_time: checkInDateTime.toISOString(),
        check_out_time: checkOutDateTime ? checkOutDateTime.toISOString() : null,
        notes: notes || null,
        status
      };

      const { data, error } = await supabase
        .from('attendance')
        .insert(attendanceRecord)
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: 'Attendance Recorded',
        description: 'The attendance record has been saved successfully.',
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error recording attendance:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to record attendance',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkInTime">Check-in Time</Label>
        <Input
          id="checkInTime"
          type="time"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={status} 
          onValueChange={(value: 'checked-in' | 'checked-out') => setStatus(value)}
        >
          <SelectTrigger className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="checked-in">Checked In</SelectItem>
            <SelectItem value="checked-out">Checked Out</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {status === 'checked-out' && (
        <div className="space-y-2">
          <Label htmlFor="checkOutTime">Check-out Time</Label>
          <Input
            id="checkOutTime"
            type="time"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
            required={status === 'checked-out'}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Input
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
          placeholder="Any additional notes..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Attendance'}
        </Button>
      </div>
    </form>
  );
};

export default AttendanceForm;
