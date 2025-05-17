
import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabaseClient';
import { toast } from 'sonner';
import { BodyMeasurement } from '@/types/measurements';

interface UseMemberMeasurementsResult {
  measurements: BodyMeasurement[];
  latestMeasurement: BodyMeasurement | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMemberMeasurements = (memberId: string): UseMemberMeasurementsResult => {
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [latestMeasurement, setLatestMeasurement] = useState<BodyMeasurement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeasurements = async () => {
    if (!memberId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Fetch measurements from the database
      const { data, error } = await supabase
        .from('measurements')
        .select('*')
        .eq('member_id', memberId)
        .order('measurement_date', { ascending: false });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Map the data to our BodyMeasurement type
        const formattedData: BodyMeasurement[] = data.map(item => ({
          id: item.id,
          memberId: item.member_id,
          date: item.measurement_date,
          height: item.height || undefined,
          weight: item.weight || undefined,
          bmi: item.bmi || undefined,
          chest: item.chest || undefined,
          waist: item.waist || undefined,
          hips: item.hips || undefined,
          biceps: item.arms || undefined,
          thighs: item.thighs || undefined,
          bodyFat: item.body_fat_percentage || undefined,
          addedBy: {
            id: item.recorded_by || 'system',
            role: 'admin', // Default role
            name: 'System',
          },
          notes: item.notes || undefined,
        }));
        
        setMeasurements(formattedData);
        setLatestMeasurement(formattedData[0]);
      } else {
        setMeasurements([]);
        setLatestMeasurement(null);
        toast.info(`No measurement records found for this member.`);
      }
    } catch (err) {
      console.error('Error fetching measurements:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      toast.error('Failed to load measurement data');
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    if (!memberId) return;
    
    fetchMeasurements();
    
    // Set up real-time subscription for new measurements
    const channel = supabase
      .channel(`measurements_${memberId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'measurements',
          filter: `member_id=eq.${memberId}`
        }, 
        (payload) => {
          console.log('Measurement data changed:', payload);
          fetchMeasurements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [memberId]);

  return {
    measurements,
    latestMeasurement,
    isLoading,
    error,
    refetch: fetchMeasurements
  };
};
