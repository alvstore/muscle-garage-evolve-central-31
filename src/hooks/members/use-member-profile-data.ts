
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface MembershipData {
  id: string;
  membership_id: string;
  membership_plan_id?: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'expired';
  total_amount: number;
  amount_paid: number;
  payment_status: string;
  membership_plan?: {
    name: string;
    price: number;
    duration_days: number;
    description?: string;
  };
}

export interface InvoiceData {
  id: string;
  amount: number;
  status: string;
  issued_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  description?: string;
  membership_plan?: {
    name: string;
  };
  items?: any[];
}

export interface MeasurementData {
  id: string;
  measurement_date: string;
  height?: number;
  weight?: number;
  bmi?: number;
  body_fat_percentage?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  hips?: number;
  thighs?: number;
  notes?: string;
}

export interface AttendanceData {
  date: string;
  check_in_time: string;
  check_out_time?: string;
  duration?: number;
  activity_type?: string;
}

export interface MemberProfileData {
  memberships: {
    active: MembershipData[];
    past: MembershipData[];
    upcoming: MembershipData[];
  };
  invoices: InvoiceData[];
  measurements: MeasurementData[];
  attendance: AttendanceData[];
}

export const useMemberProfileData = (memberId: string) => {
  const [data, setData] = useState<MemberProfileData>({
    memberships: { active: [], past: [], upcoming: [] },
    invoices: [],
    measurements: [],
    attendance: []
  });
  const [loading, setLoading] = useState<{
    memberships: boolean;
    invoices: boolean;
    measurements: boolean;
    attendance: boolean;
  }>({
    memberships: false,
    invoices: false,
    measurements: false,
    attendance: false
  });
  const [errors, setErrors] = useState<{
    memberships?: string;
    invoices?: string;
    measurements?: string;
    attendance?: string;
  }>({});

  // Optimized membership fetching with proper categorization
  const fetchMemberships = useCallback(async () => {
    if (!memberId) return;
    
    setLoading(prev => ({ ...prev, memberships: true }));
    setErrors(prev => ({ ...prev, memberships: undefined }));

    try {
      const { data: memberships, error } = await supabase
        .from('member_memberships')
        .select(`
          *,
          membership_plan:memberships(
            name,
            price,
            duration_days,
            description
          )
        `)
        .eq('member_id', memberId)
        .order('start_date', { ascending: false });

      if (error) throw error;

      const currentDate = new Date().toISOString().split('T')[0];
      
      const categorized = (memberships || []).reduce((acc, membership) => {
        if (membership.status === 'active' && membership.end_date >= currentDate) {
          acc.active.push(membership);
        } else if (membership.start_date > currentDate) {
          acc.upcoming.push(membership);
        } else {
          acc.past.push(membership);
        }
        return acc;
      }, { active: [] as MembershipData[], past: [] as MembershipData[], upcoming: [] as MembershipData[] });

      setData(prev => ({ ...prev, memberships: categorized }));
    } catch (error: any) {
      console.error('Error fetching memberships:', error);
      setErrors(prev => ({ ...prev, memberships: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, memberships: false }));
    }
  }, [memberId]);

  // Fetch invoices with pagination and proper joining
  const fetchInvoices = useCallback(async (page = 0, pageSize = 10) => {
    if (!memberId) return;
    
    setLoading(prev => ({ ...prev, invoices: true }));
    setErrors(prev => ({ ...prev, invoices: undefined }));

    try {
      const { data: invoices, error } = await supabase
        .from('invoices')
        .select(`
          *,
          membership_plan:membership_plan_id(name)
        `)
        .eq('member_id', memberId)
        .order('issued_date', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1);

      if (error) throw error;
      
      setData(prev => ({ ...prev, invoices: invoices || [] }));
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      setErrors(prev => ({ ...prev, invoices: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, invoices: false }));
    }
  }, [memberId]);

  // Fetch measurements with time-based organization
  const fetchMeasurements = useCallback(async () => {
    if (!memberId) return;
    
    setLoading(prev => ({ ...prev, measurements: true }));
    setErrors(prev => ({ ...prev, measurements: undefined }));

    try {
      const { data: measurements, error } = await supabase
        .from('body_measurements')
        .select('*')
        .eq('member_id', memberId)
        .order('measurement_date', { ascending: false });

      if (error) throw error;
      
      setData(prev => ({ ...prev, measurements: measurements || [] }));
    } catch (error: any) {
      console.error('Error fetching measurements:', error);
      setErrors(prev => ({ ...prev, measurements: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, measurements: false }));
    }
  }, [memberId]);

  // Fetch attendance with proper formatting
  const fetchAttendance = useCallback(async (limitDays = 30) => {
    if (!memberId) return;
    
    setLoading(prev => ({ ...prev, attendance: true }));
    setErrors(prev => ({ ...prev, attendance: undefined }));

    try {
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - limitDays);

      const { data: attendance, error } = await supabase
        .from('member_attendance')
        .select('*')
        .eq('member_id', memberId)
        .gte('check_in', startDate.toISOString())
        .lte('check_in', endDate.toISOString())
        .order('check_in', { ascending: false });

      if (error) throw error;

      const formattedAttendance = (attendance || []).map(record => ({
        date: record.check_in.split('T')[0],
        check_in_time: record.check_in,
        check_out_time: record.check_out,
        duration: record.check_out 
          ? (new Date(record.check_out).getTime() - new Date(record.check_in).getTime()) / (1000 * 60) 
          : undefined,
        activity_type: record.activity_type
      }));
      
      setData(prev => ({ ...prev, attendance: formattedAttendance }));
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      setErrors(prev => ({ ...prev, attendance: error.message }));
    } finally {
      setLoading(prev => ({ ...prev, attendance: false }));
    }
  }, [memberId]);

  // Function to fetch all member data in parallel
  const fetchAllMemberData = useCallback(async () => {
    if (!memberId) return;

    Promise.allSettled([
      fetchMemberships(),
      fetchInvoices(),
      fetchMeasurements(),
      fetchAttendance()
    ]);
  }, [memberId, fetchMemberships, fetchInvoices, fetchMeasurements, fetchAttendance]);

  // Initialize data fetching
  useEffect(() => {
    if (memberId) {
      fetchAllMemberData();
    }
  }, [memberId, fetchAllMemberData]);

  // Function to assign a membership with proper business rule validation
  const assignMembership = async (membershipData: {
    membership_plan_id: string;
    branch_id: string;
    start_date: Date;
    end_date: Date;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    notes?: string;
  }) => {
    if (!memberId) {
      toast.error("Member ID is required");
      return { success: false, error: "Member ID is required" };
    }
    
    try {
      // Use the optimized RPC (stored procedure) for membership assignment
      const { data, error } = await supabase.rpc('assign_membership_with_payment', {
        p_member_id: memberId,
        p_membership_plan_id: membershipData.membership_plan_id,
        p_branch_id: membershipData.branch_id,
        p_start_date: membershipData.start_date.toISOString(),
        p_end_date: membershipData.end_date.toISOString(),
        p_total_amount: membershipData.total_amount,
        p_payment_method: membershipData.payment_method,
        p_payment_status: membershipData.payment_status,
        p_notes: membershipData.notes || '',
        p_recorded_by: null // The current user's ID would go here
      });

      if (error) throw error;

      // Refresh the memberships data
      await fetchMemberships();
      await fetchInvoices();
      
      toast.success('Membership assigned successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Error assigning membership:', error);
      toast.error(error.message || 'Failed to assign membership');
      return { success: false, error: error.message };
    }
  };

  // Add a new measurement with validation
  const addMeasurement = async (measurementData: Omit<MeasurementData, 'id'>) => {
    if (!memberId) {
      toast.error("Member ID is required");
      return { success: false };
    }

    try {
      // Calculate BMI if height and weight are provided
      let bmi = measurementData.bmi;
      if (!bmi && measurementData.height && measurementData.weight) {
        // Height in meters, weight in kg
        const heightInMeters = measurementData.height / 100;
        bmi = measurementData.weight / (heightInMeters * heightInMeters);
      }

      const { data, error } = await supabase
        .from('body_measurements')
        .insert({
          ...measurementData,
          member_id: memberId,
          bmi: bmi ? parseFloat(bmi.toFixed(2)) : null
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh measurements data
      await fetchMeasurements();
      
      toast.success('Measurement added successfully');
      return { success: true, data };
    } catch (error: any) {
      console.error('Error adding measurement:', error);
      toast.error(error.message || 'Failed to add measurement');
      return { success: false, error: error.message };
    }
  };

  // Record attendance for member
  const recordAttendance = async (activityType: string) => {
    if (!memberId) {
      toast.error("Member ID is required");
      return { success: false };
    }

    try {
      const { data, error } = await supabase
        .from('member_attendance')
        .insert({
          member_id: memberId,
          check_in: new Date().toISOString(),
          activity_type: activityType
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh attendance data
      await fetchAttendance();
      
      toast.success('Attendance recorded');
      return { success: true, data };
    } catch (error: any) {
      console.error('Error recording attendance:', error);
      toast.error(error.message || 'Failed to record attendance');
      return { success: false, error: error.message };
    }
  };

  // Save checkout time for attendance
  const recordCheckout = async (attendanceId: string) => {
    try {
      const { data, error } = await supabase
        .from('member_attendance')
        .update({
          check_out: new Date().toISOString()
        })
        .eq('id', attendanceId)
        .select()
        .single();

      if (error) throw error;

      // Refresh attendance data
      await fetchAttendance();
      
      toast.success('Checkout recorded');
      return { success: true, data };
    } catch (error: any) {
      console.error('Error recording checkout:', error);
      toast.error(error.message || 'Failed to record checkout');
      return { success: false, error: error.message };
    }
  };

  return {
    data,
    loading,
    errors,
    fetchMemberships,
    fetchInvoices,
    fetchMeasurements,
    fetchAttendance,
    fetchAllMemberData,
    assignMembership,
    addMeasurement,
    recordAttendance,
    recordCheckout
  };
};
