
import { useState, useEffect, useCallback } from "react";
import { BodyMeasurement, PTPlan } from "@/types/measurements";
import { measurementService } from "@/services/measurementService";
import { toast } from "sonner";
import { useAuth } from "./use-auth";

export const useBodyMeasurements = (memberId?: string) => {
  const { user } = useAuth();
  const [measurements, setMeasurements] = useState<BodyMeasurement[]>([]);
  const [latestMeasurement, setLatestMeasurement] = useState<BodyMeasurement | null>(null);
  const [activePTPlan, setActivePTPlan] = useState<PTPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // If current user is a member and no memberId is provided, use the current user's ID
  const effectiveMemberId = useCallback(() => {
    if (memberId) return memberId;
    if (user && user.role === 'member') return user.id;
    return undefined;
  }, [memberId, user]);

  const fetchMeasurements = useCallback(async () => {
    const targetMemberId = effectiveMemberId();
    if (!targetMemberId) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await measurementService.getAllMeasurements(targetMemberId);
      setMeasurements(data);
      
      // Get latest measurement
      if (data.length > 0) {
        const latest = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )[0];
        setLatestMeasurement(latest);
      } else {
        setLatestMeasurement(null);
      }
      
      // Get active PT plan
      const plan = await measurementService.getActivePTPlan(targetMemberId);
      setActivePTPlan(plan);
    } catch (err) {
      setError(err as Error);
      toast.error("Failed to load measurement data");
    } finally {
      setIsLoading(false);
    }
  }, [effectiveMemberId]);

  useEffect(() => {
    if (effectiveMemberId()) {
      fetchMeasurements();
    } else {
      setMeasurements([]);
      setLatestMeasurement(null);
      setActivePTPlan(null);
      setIsLoading(false);
    }
  }, [effectiveMemberId, fetchMeasurements]);

  const addMeasurement = async (measurement: Omit<BodyMeasurement, "id">) => {
    try {
      const newMeasurement = await measurementService.addMeasurement(measurement);
      setMeasurements(prev => [...prev, newMeasurement]);
      
      // Update latest measurement if this is newer
      if (!latestMeasurement || 
          new Date(newMeasurement.date) > new Date(latestMeasurement.date)) {
        setLatestMeasurement(newMeasurement);
      }
      
      toast.success("Measurement added successfully");
      return newMeasurement;
    } catch (err) {
      toast.error("Failed to add measurement");
      throw err;
    }
  };

  const updateMeasurement = async (id: string, measurement: Partial<BodyMeasurement>) => {
    try {
      const updatedMeasurement = await measurementService.updateMeasurement(id, measurement);
      setMeasurements(prev => 
        prev.map(m => m.id === id ? updatedMeasurement : m)
      );
      
      // Update latest measurement if this was the latest
      if (latestMeasurement && latestMeasurement.id === id) {
        setLatestMeasurement(updatedMeasurement);
      } else if (latestMeasurement && 
                new Date(updatedMeasurement.date) > new Date(latestMeasurement.date)) {
        setLatestMeasurement(updatedMeasurement);
      }
      
      toast.success("Measurement updated successfully");
      return updatedMeasurement;
    } catch (err) {
      toast.error("Failed to update measurement");
      throw err;
    }
  };

  const deleteMeasurement = async (id: string) => {
    try {
      await measurementService.deleteMeasurement(id);
      
      const newMeasurements = measurements.filter(m => m.id !== id);
      setMeasurements(newMeasurements);
      
      // Update latest measurement if this was the latest
      if (latestMeasurement && latestMeasurement.id === id) {
        if (newMeasurements.length > 0) {
          const latest = [...newMeasurements].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];
          setLatestMeasurement(latest);
        } else {
          setLatestMeasurement(null);
        }
      }
      
      toast.success("Measurement deleted successfully");
    } catch (err) {
      toast.error("Failed to delete measurement");
      throw err;
    }
  };

  return {
    measurements,
    latestMeasurement,
    activePTPlan,
    isLoading,
    error,
    refetch: fetchMeasurements,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
    hasPTPlan: !!activePTPlan
  };
};
