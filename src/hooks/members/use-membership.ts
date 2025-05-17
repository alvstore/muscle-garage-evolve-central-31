
import { useState, useEffect } from 'react';
import { MembershipPlan } from '@/types/membership';

interface UseMembershipReturn {
  memberships: MembershipPlan[] | null;
  isLoading: boolean;
  error: Error | null;
}

export const useMembership = (): UseMembershipReturn => {
  const [memberships, setMemberships] = useState<MembershipPlan[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        // Mock data for now, replace with actual API call
        const mockMemberships: MembershipPlan[] = [
          {
            id: '1',
            name: 'Basic Plan',
            description: 'Access to basic facilities',
            price: 999,
            duration_days: 30,
            allowed_classes: 'basic-only',
            status: 'active',
            benefits: ['Gym access', 'Locker access'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Premium Plan',
            description: 'Access to all facilities and classes',
            price: 1999,
            duration_days: 90,
            allowed_classes: 'all',
            status: 'active',
            benefits: ['Gym access', 'All classes', 'Personal trainer session', 'Locker access'],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        setMemberships(mockMemberships);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch memberships'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberships();
  }, []);

  return { memberships, isLoading, error };
};
