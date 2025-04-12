
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

// This is a custom hook to fetch data that is specific to a member
// It helps prevent the infinite update depth exceeded error by properly managing dependencies
export const useMemberSpecificData = <T>(
  fetchFunction: (userId: string) => Promise<T>,
  defaultValue: T
) => {
  const { user } = useAuth();
  const [data, setData] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only proceed if we have a user and they are a member
    if (!user || user.role !== 'member') {
      setIsLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const result = await fetchFunction(user.id);
        setData(result);
        setError(null);
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user.id, not the fetchFunction itself

  return { data, isLoading, error, setData };
};
