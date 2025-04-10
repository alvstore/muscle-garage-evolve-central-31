
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect, useCallback } from "react";

/**
 * A hook to filter data based on the current user's role.
 * For admin/staff, returns all data.
 * For members, filters to only show data belonging to the current user.
 * For trainers, shows data for their assigned members.
 */
export const useMemberSpecificData = <T extends { memberId?: string }>(
  allData: T[],
  filterFn?: (item: T, userId: string) => boolean
) => {
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState<T[]>([]);

  const filterData = useCallback(() => {
    if (!user) {
      setFilteredData([]);
      return;
    }

    // For admin or staff, show all data
    if (user.role === 'admin' || user.role === 'staff') {
      setFilteredData(allData);
      return;
    }

    // For members, filter to only show their own data
    if (user.role === 'member') {
      if (filterFn) {
        // Use custom filter function if provided
        setFilteredData(allData.filter(item => filterFn(item, user.id)));
      } else {
        // Default filter by memberId
        setFilteredData(allData.filter(item => item.memberId === user.id));
      }
      return;
    }

    // For trainers, show data for their assigned members
    if (user.role === 'trainer') {
      // If a custom filter function is provided, use it
      if (filterFn) {
        setFilteredData(allData.filter(item => filterFn(item, user.id)));
      } else {
        // For now, show all data for trainers
        // In a real app, you'd filter based on the trainer's assigned members
        setFilteredData(allData);
      }
      return;
    }

    // Default to showing all data
    setFilteredData(allData);
  }, [allData, user, filterFn]);

  useEffect(() => {
    filterData();
  }, [filterData, allData, user]);

  return {
    data: filteredData,
    isFiltered: user?.role === 'member' || user?.role === 'trainer',
    currentUserId: user?.id,
    filterForMembersOnly: user?.role === 'member'
  };
};
