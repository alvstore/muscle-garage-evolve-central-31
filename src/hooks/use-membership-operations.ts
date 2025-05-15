
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MembershipPlan } from '@/types/membership';
import { useMemberships } from './use-membership-data';

export const useMembershipPlans = () => {
  const { 
    memberships, 
    isLoading, 
    error, 
    fetchMemberships 
  } = useMemberships();
  
  // Convert the memberships to the expected format with proper property names
  const membershipPlans = memberships.map(membership => ({
    id: membership.id,
    name: membership.name,
    description: membership.description,
    price: membership.price,
    duration_days: membership.duration_days,
    durationDays: membership.duration_days, // For backward compatibility
    features: membership.features?.features || [],
    is_active: membership.is_active,
    isActive: membership.is_active, // For backward compatibility
    status: membership.status || (membership.is_active ? 'active' : 'inactive'),
    branch_id: membership.branch_id,
    created_at: membership.created_at,
    updated_at: membership.updated_at,
    memberCount: 0 // Default value, would be populated from real data
  }));
  
  const refetch = fetchMemberships;
  
  return {
    membershipPlans,
    isLoading,
    error,
    refetch
  };
};

// Additional membership operations can be added here
