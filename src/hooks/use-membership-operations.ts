
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
    description: membership.description || '',
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
    benefits: membership.features?.features || [], // Add benefits for backward compatibility
    memberCount: 0, // Default value, would be populated from real data
    duration_label: getDurationLabel(membership.duration_days), // Add duration_label
    allowed_classes: 'all' // Default value for allowed_classes
  }));
  
  const refetch = fetchMemberships;
  
  return {
    membershipPlans,
    isLoading,
    error,
    refetch
  };
};

// Helper function to get duration label from days
function getDurationLabel(days: number): string {
  if (!days) return '1-month'; // Default
  
  if (days <= 31) return '1-month';
  if (days <= 93) return '3-month';
  if (days <= 186) return '6-month';
  return '12-month';
}

// Additional membership operations can be added here
