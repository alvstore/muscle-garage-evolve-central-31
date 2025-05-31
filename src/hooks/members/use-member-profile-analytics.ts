
import { useState, useEffect, useMemo } from 'react';
import { MembershipData, MeasurementData, AttendanceData } from './use-member-profile-data';

// Utility functions for analytics
const getMonthName = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('default', { month: 'short' });
};

const getWeekNumber = (date: Date | string): number => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const firstDayOfYear = new Date(d.getFullYear(), 0, 1);
  const pastDaysOfYear = (d.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Main hook for analyzing member profile data
export const useMemberProfileAnalytics = (
  measurements: MeasurementData[],
  attendance: AttendanceData[],
  memberships: MembershipData[]
) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');
  
  // Calculate weight trends
  const weightTrend = useMemo(() => {
    if (!measurements?.length) return [];

    // Sort by date ascending
    const sortedMeasurements = [...measurements].sort(
      (a, b) => new Date(a.measurement_date).getTime() - new Date(b.measurement_date).getTime()
    );
    
    return sortedMeasurements.map((m, index) => ({
      date: m.measurement_date,
      weight: m.weight || 0,
      // Calculate change from previous measurement
      change: index > 0 ? (m.weight || 0) - (sortedMeasurements[index - 1].weight || 0) : 0,
      bmi: m.bmi || 0,
      bodyFatPercentage: m.body_fat_percentage || 0
    }));
  }, [measurements]);

  // Calculate attendance stats
  const attendanceStats = useMemo(() => {
    if (!attendance?.length) return { 
      frequency: 0, 
      consistency: 0, 
      averageDuration: 0, 
      byDay: {}, 
      byMonth: {} 
    };

    // Calculate stats
    const byDay: Record<string, number> = {};
    const byMonth: Record<string, number> = {};
    let totalDuration = 0;
    let durationCount = 0;

    // Group attendance by day and month
    attendance.forEach(record => {
      const date = new Date(record.date || record.check_in_time);
      const dayName = date.toLocaleString('default', { weekday: 'short' });
      const monthName = getMonthName(date);
      
      byDay[dayName] = (byDay[dayName] || 0) + 1;
      byMonth[monthName] = (byMonth[monthName] || 0) + 1;
      
      if (record.duration) {
        totalDuration += record.duration;
        durationCount++;
      }
    });
    
    // Calculate frequency (avg visits per week)
    const earliestDate = new Date(attendance[attendance.length - 1].date || attendance[attendance.length - 1].check_in_time);
    const latestDate = new Date(attendance[0].date || attendance[0].check_in_time);
    const totalWeeks = Math.max(1, Math.ceil((latestDate.getTime() - earliestDate.getTime()) / (7 * 24 * 60 * 60 * 1000)));
    const frequency = attendance.length / totalWeeks;
    
    // Calculate consistency (percentage of weeks with at least one visit)
    const weekMap: Record<string, boolean> = {};
    attendance.forEach(record => {
      const date = new Date(record.date || record.check_in_time);
      const weekKey = `${date.getFullYear()}-${getWeekNumber(date)}`;
      weekMap[weekKey] = true;
    });
    const weeksWithVisits = Object.keys(weekMap).length;
    const consistency = (weeksWithVisits / totalWeeks) * 100;
    
    // Calculate average duration
    const averageDuration = durationCount > 0 ? totalDuration / durationCount : 0;
    
    return {
      frequency,
      consistency,
      averageDuration, 
      byDay,
      byMonth
    };
  }, [attendance]);
  
  // Calculate membership value
  const membershipValue = useMemo(() => {
    if (!memberships?.length) return { 
      totalSpent: 0, 
      averageMonthly: 0, 
      renewalRate: 0 
    };
    
    // Filter to only include active and past memberships
    const relevantMemberships = [...memberships]
      .filter(m => m.status === 'active' || m.status === 'inactive' || m.status === 'expired');
    
    if (!relevantMemberships.length) return { 
      totalSpent: 0, 
      averageMonthly: 0, 
      renewalRate: 0 
    };
    
    // Calculate total spent
    const totalSpent = relevantMemberships.reduce(
      (sum, membership) => sum + (membership.amount_paid || 0),
      0
    );
    
    // Calculate average monthly spend
    let totalDays = 0;
    relevantMemberships.forEach(membership => {
      const startDate = new Date(membership.start_date);
      const endDate = new Date(membership.end_date);
      totalDays += (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    });
    
    const totalMonths = totalDays / 30;
    const averageMonthly = totalMonths > 0 ? totalSpent / totalMonths : 0;
    
    // Calculate renewal rate based on sequential memberships
    const sortedMemberships = [...relevantMemberships].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    
    let renewals = 0;
    for (let i = 1; i < sortedMemberships.length; i++) {
      const prevEnd = new Date(sortedMemberships[i-1].end_date);
      const currStart = new Date(sortedMemberships[i].start_date);
      
      // If the next membership started within 7 days of previous ending, count as renewal
      if (Math.abs(currStart.getTime() - prevEnd.getTime()) <= 7 * 24 * 60 * 60 * 1000) {
        renewals++;
      }
    }
    
    const renewalRate = sortedMemberships.length > 1 
      ? (renewals / (sortedMemberships.length - 1)) * 100 
      : 0;
    
    return {
      totalSpent,
      averageMonthly,
      renewalRate
    };
  }, [memberships]);

  return {
    weightTrend,
    attendanceStats,
    membershipValue,
    timeframe,
    setTimeframe
  };
};
