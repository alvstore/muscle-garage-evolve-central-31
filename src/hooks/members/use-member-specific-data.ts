
import { useState, useEffect } from 'react';
import { useAuth } from './use-auth';

// This is a custom hook to fetch data that is specific to a member
// It helps prevent the infinite update depth exceeded error by properly managing dependencies
export const useMemberSpecificData = <T, R = T>(
  data: T,
  filterFunction: (item: T, userId: string) => R
) => {
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState<R | T>(data);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Only proceed if we have a user and they are a member
    if (!user || user.role !== 'member') {
      setFilteredData(data);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      // Apply the filter function
      const result = filterFunction(data, user.id);
      setFilteredData(result);
      setError(null);
    } catch (err) {
      console.error('Error processing member data:', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, data, filterFunction]);

  return { data: filteredData, isLoading, error, setData: setFilteredData };
};
