<<<<<<< Updated upstream
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { supabase } from '@/services/api/supabaseClient';
import MemberProfile from '@/components/members/MemberProfile';
import MembershipAssignmentDialog from '@/components/members/MembershipAssignmentDialog';
import { toast } from 'sonner';
import { format, parseISO, differenceInDays } from "date-fns";
import { CalendarIcon, User, Mail, Phone, MapPin, CreditCard, Calendar, Loader2, Activity, LineChart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemberProfileData } from '@/hooks/members/use-member-profile-data';
import { useMemberProfileAnalytics } from '@/hooks/members/use-member-profile-analytics';

// Component for Member Membership Table
const MembershipTable = ({ memberships }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "membership_plan.name",
        header: "Plan",
        cell: ({ row }) => {
          const plan = row.original.membership_plan;
          return <div>{plan?.name || 'Unknown Plan'}</div>;
        }
      },
      {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.start_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "end_date",
        header: "End Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.end_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          return (
            <Badge variant={row.original.status === 'active' ? 'default' : 'secondary'}>
              {row.original.status}
            </Badge>
          );
        }
      },
      {
        accessorKey: "total_amount",
        header: "Amount",
        cell: ({ row }) => {
          return <div>₹{row.original.total_amount.toLocaleString()}</div>;
        }
      },
      {
        accessorKey: "payment_status",
        header: "Payment",
        cell: ({ row }) => {
          return (
            <Badge variant={
              row.original.payment_status === 'paid' ? 'success' : 
              row.original.payment_status === 'partial' ? 'warning' : 'destructive'
            }>
              {row.original.payment_status}
            </Badge>
          );
        }
      }
    ],
    []
  );

  return <DataTable columns={columns} data={memberships || []} />;
};
=======
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/auth/use-auth';
import { useBranch } from '@/contexts/BranchContext';
import { supabase } from '@/services/api/supabaseClient';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Container } from "@/components/ui/container";
import { 
  FileText, 
  User, 
  CreditCard, 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Plus, 
  Upload,
  CalendarDays, 
  Mail, 
  Phone, 
  ReceiptText, 
  Edit, 
  Dumbbell, 
  ClipboardList, 
  Activity, 
  Check, 
  X, 
  Eye 
} from 'lucide-react';
import { membershipService } from '@/services/members/membershipService';
import AttendanceHistory from "@/components/attendance/AttendanceHistory";
import BodyMeasurementForm from '@/components/fitness/BodyMeasurementForm';
import AvatarUpload from '@/components/avatar/AvatarUpload';
import { registerMemberInBiometricDevice, checkBiometricDeviceStatus } from '@/services/settings/biometricService';
import MembershipAssignmentForm from '@/components/membership/MembershipAssignmentForm';
import { formatCurrency } from '@/utils/stringUtils';


interface Measurement {
  id: string;
  member_id: string;
  weight?: number;
  height?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  bmi?: number;
  body_fat_percentage?: number;
  measurement_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface MemberData {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  date_of_birth?: string;
  goal?: string;
  trainer_id?: string;
  membership_id?: string;
  membership_start_date?: string;
  membership_end_date?: string;
  status?: string;
  membership_status?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  gender?: string;
  occupation?: string;
  profile_picture?: string;
  created_at: string;
}

interface InvoiceItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
  [key: string]: any; // Allow additional properties
}

interface Invoice {
  id: string;
  invoice_number: string;
  member_id: string;
  amount: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled' | string;
  issued_date: string;
  due_date: string;
  paid_date?: string | null;
  payment_method?: string | null;
  description?: string | null;
  items?: InvoiceItem[];
  created_at?: string;
  updated_at?: string;
}
>>>>>>> Stashed changes

// Component for Member Invoice Table
const InvoiceTable = ({ invoices }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "description",
        header: "Description",
      },
      {
        accessorKey: "issued_date",
        header: "Issue Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.issued_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "due_date",
        header: "Due Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.due_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          return <div>₹{row.original.amount.toLocaleString()}</div>;
        }
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          return (
            <Badge variant={
              row.original.status === 'paid' ? 'success' : 
              row.original.status === 'pending' ? 'warning' : 'destructive'
            }>
              {row.original.status}
            </Badge>
          );
        }
      },
      {
        accessorKey: "payment_method",
        header: "Method",
        cell: ({ row }) => {
          return row.original.payment_method || "—";
        }
      }
    ],
    []
  );

  return <DataTable columns={columns} data={invoices || []} />;
};

<<<<<<< Updated upstream
// Component for Member Measurements Table
const MeasurementsTable = ({ measurements }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "measurement_date",
        header: "Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.measurement_date), "PP")}</div>;
        }
      },
      {
        accessorKey: "weight",
        header: "Weight (kg)",
        cell: ({ row }) => row.original.weight ? `${row.original.weight} kg` : "—"
      },
      {
        accessorKey: "height",
        header: "Height (cm)",
        cell: ({ row }) => row.original.height ? `${row.original.height} cm` : "—"
      },
      {
        accessorKey: "bmi",
        header: "BMI",
        cell: ({ row }) => row.original.bmi ? row.original.bmi.toFixed(1) : "—"
      },
      {
        accessorKey: "body_fat_percentage",
        header: "Body Fat %",
        cell: ({ row }) => row.original.body_fat_percentage ? `${row.original.body_fat_percentage}%` : "—"
      },
      {
        accessorKey: "chest",
        header: "Chest (cm)",
        cell: ({ row }) => row.original.chest ? `${row.original.chest} cm` : "—"
      },
      {
        accessorKey: "waist",
        header: "Waist (cm)",
        cell: ({ row }) => row.original.waist ? `${row.original.waist} cm` : "—"
      }
    ],
    []
  );

  return <DataTable columns={columns} data={measurements || []} />;
};
=======
type BiometricStatus = {
  hasDevices: boolean;
  hikvision?: {
    configured: boolean;
    online: boolean;
    lastCheck: string | null;
    deviceCount: number;
  };
  essl?: {
    configured: boolean;
    online: boolean;
    lastCheck: string | null;
    deviceCount: number;
  };
}
>>>>>>> Stashed changes

// Component for Member Attendance Table
const AttendanceTable = ({ attendance }) => {
  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.date), "PP")}</div>;
        }
      },
      {
        accessorKey: "check_in_time",
        header: "Check In",
        cell: ({ row }) => {
          return <div>{format(parseISO(row.original.check_in_time), "p")}</div>;
        }
      },
      {
        accessorKey: "check_out_time",
        header: "Check Out",
        cell: ({ row }) => {
          return row.original.check_out_time ? 
            <div>{format(parseISO(row.original.check_out_time), "p")}</div> : "—";
        }
      },
      {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => {
          if (!row.original.duration) return "—";
          const minutes = row.original.duration;
          const hours = Math.floor(minutes / 60);
          const mins = Math.floor(minutes % 60);
          return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
        }
      },
      {
        accessorKey: "activity_type",
        header: "Activity",
        cell: ({ row }) => row.original.activity_type || "General"
      }
    ],
    []
  );

  return <DataTable columns={columns} data={attendance || []} />;
};

// Enhanced Member Profile Page
const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
<<<<<<< Updated upstream
  const [member, setMember] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Use the enhanced custom hooks for data fetching and analytics
  const { 
    data, 
    loading, 
    errors, 
    assignMembership, 
    addMeasurement,
    recordAttendance 
  } = useMemberProfileData(id as string);
  
  const { 
    weightTrend, 
    attendanceStats, 
    membershipValue 
  } = useMemberProfileAnalytics(
    data.measurements, 
    data.attendance,
    [...(data.memberships.active || []), ...(data.memberships.past || [])]
  );
  
  // Fetch the basic member profile data
  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*, trainer:trainer_id(*)')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setMember(data);
      } catch (error: any) {
        toast.error(`Error fetching member: ${error.message}`);
      } finally {
=======
  const { user } = useAuth();
  const { currentBranch } = useBranch();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State variables
  const [member, setMember] = useState<MemberData | null>(null);
  const [trainer, setTrainer] = useState<any>(null);
  const [activeMemberships, setActiveMemberships] = useState<MembershipData[]>([]);
  const [invoices, setInvoices] = useState<Array<Invoice & { invoice_number: string; member_id: string }>>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [isRegistrationInProgress, setIsRegistrationInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMembershipOpen, setIsAddMembershipOpen] = useState(false);
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState<BiometricStatus>({
    hasDevices: false,
    hikvision: {
      configured: false,
      online: false,
      lastCheck: new Date().toISOString(),
      deviceCount: 0
    }
  });
  const [isBiometricRegistering, setIsBiometricRegistering] = useState(false);
  const [memberId, setMemberId] = useState<string>('');
  const [isEditMode, setIsEditMode] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");

  const checkBiometricStatus = async (fingerprintId: string) => {
    try {
      const status = await checkBiometricDeviceStatus(fingerprintId);
      // Check if any biometric device is configured and online
      const isDeviceConfigured = 
        (status.hikvision?.configured && status.hikvision.online) || 
        (status.essl?.configured && status.essl.online);
        
      const newStatus: BiometricStatus = {
        hasDevices: status.hasDevices,
        hikvision: status.hikvision ? {
          configured: status.hikvision.configured,
          online: status.hikvision.online,
          lastCheck: status.hikvision.lastCheck || new Date().toISOString(),
          deviceCount: status.hikvision.deviceCount || 0
        } : undefined,
        essl: status.essl ? {
          configured: status.essl.configured,
          online: status.essl.online,
          lastCheck: status.essl.lastCheck || new Date().toISOString(),
          deviceCount: status.essl.deviceCount || 0
        } : undefined
      };
      
      setBiometricStatus(newStatus);
      return isDeviceConfigured;
    } catch (error) {
      console.error('Error checking biometric status:', error);
      return false;
    }
  };

  const fetchMemberData = useCallback(async (memberId?: string) => {
    const targetId = memberId || id;
    if (!targetId) {
      console.error('No member ID provided');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if we need to get the ID from the user
      if (!targetId || targetId === 'new') {
        // Handle new member case or if ID is missing
        if (targetId === 'new') {
          // Initialize empty member object for new member
          setMember({
            id: '',
            name: '',
            email: '',
            phone: '',
            created_at: new Date().toISOString(),
            status: 'active',
            membership_status: 'inactive',
            profile_image_url: ''
          } as MemberData);
          setIsLoading(false);
          return;
        }

        // If no ID is provided and we're not creating a new member, show error
        setError('Member ID is required');
>>>>>>> Stashed changes
        setIsLoading(false);
        return;
      }
<<<<<<< Updated upstream
    };
    
    fetchMember();
  }, [id]);
  
  // Handle membership assignment
  const handleMembershipAssignment = async (membershipData) => {
    if (!id) return;
    
    const result = await assignMembership({
      ...membershipData,
      branch_id: member.branch_id
    });
    
    if (result.success) {
      setIsDialogOpen(false);
    }
  };
  
  // Error states
  if (!id) {
=======

      try {
        // Fetch member data with related membership info
        const { data: memberData, error: memberError } = await supabase
          .from('members')
          .select(`
            *,
            memberships (
              id,
              name,
              price,
              duration_days,
              start_date,
              end_date,
              status
            )
          `)
          .eq('id', targetId)
          .single();

        if (memberError) throw memberError;
        if (!memberData) {
          setError('Member not found');
          setIsLoading(false);
          return;
        }

        setMember(memberData as unknown as MemberData);

        // Set active memberships if any
        if (memberData.memberships && memberData.memberships.length > 0) {
          setActiveMemberships(memberData.memberships as MembershipData[]);
          setMembership(memberData.memberships[0] as MembershipData);
        } else {
          setActiveMemberships([]);
          setMembership(null);
        }

        // Fetch invoice history
        const invoices = await membershipService.getMemberInvoiceHistory(targetId);
        setInvoices(invoices || []);

        // Fetch attendance history
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('attendance')
          .select('*')
          .eq('member_id', targetId)
          .order('check_in', { ascending: false });

        if (attendanceError) console.error('Error fetching attendance:', attendanceError);
        setAttendanceRecords(attendanceData || []);

        // Fetch body measurements
        const { data: measurementsData, error: measurementsError } = await supabase
          .from('body_measurements')
          .select('*')
          .eq('member_id', targetId)
          .order('measured_at', { ascending: false });

        if (measurementsError) console.error('Error fetching measurements:', measurementsError);
        setMeasurements(measurementsData || []);

        // Check biometric registration status if member has a fingerprint ID
        if (memberData.fingerprint_id) {
          checkBiometricStatus(memberData.fingerprint_id);
        }
      } catch (err) {
        console.error('Error fetching member data:', err);
        setError('Failed to load member data');
        throw err;
      }
    } catch (error) {
      console.error('Error fetching member data:', error);
      setError('Failed to load member data');
    } finally {
      setIsLoading(false);
    }
  }, [id, user, currentBranch?.id]);

  const fetchRelatedData = useCallback(async (memberId: string) => {
    if (!memberId) {
      console.error('No member ID provided');
      return;
    }

    try {
      setIsLoading(true);

      // Fetch member data
      const { data: memberData, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();

      try {
        if (memberError) throw memberError;
        if (!memberData) throw new Error('Member not found');

        setMember(memberData as unknown as MemberData);

        // Fetch trainer data if trainer_id exists
        if (memberData.trainer_id) {
          const { data: trainerData, error: trainerError } = await supabase
            .from('profiles')
            .select('id, full_name, email, phone, avatar_url')
            .eq('id', memberData.trainer_id)
            .single();

          if (!trainerError && trainerData) {
            setTrainer(trainerData);
          }
        }
      } catch (err) {
        console.error('Error fetching member or trainer data:', err);
      }

      // Check biometric registration status
      try {
        if (currentBranch?.id) {
          const status = await checkBiometricDeviceStatus(currentBranch.id);
          setBiometricStatus(status);
        }
      } catch (err) {
        console.error('Error checking biometric status:', err);
      }

      setActiveMemberships(memberships);

      // Fetch invoice history
      const invoiceHistory = await membershipService.getMemberInvoiceHistory(memberId);
      setInvoices(invoiceHistory);

      // Fetch measurements
      const { data: measurementsData, error: measurementsError } = await supabase
        .from('measurements')
        .select('*')
        .eq('member_id', memberId)
        .order('measurement_date', { ascending: false });

      if (!measurementsError && measurementsData) {
        setMeasurements(measurementsData);
      }

      // Fetch attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('member_attendance') // Changed from 'attendance' to 'member_attendance'
        .select('*')
        .eq('member_id', memberId)
        .order('check_in', { ascending: false });

      if (!attendanceError && attendanceData) {
        setAttendanceRecords(attendanceData);
      }

      // Check biometric registration status
      if (currentBranch?.id) {
        const status = await checkBiometricDeviceStatus(currentBranch.id);
        setBiometricStatus(status);
      }
    } catch (err) {
      console.error('Error fetching related data:', err);
    }
  });

  const handleMembershipSuccess = useCallback((newMembership: any) => {
    // Refresh the member data to show the new membership
    fetchMemberData();

    // Show success message
    toast({
      title: 'Membership assigned',
      description: 'The membership has been assigned successfully.',
      variant: 'default',
    });

    // Close the dialog
    setIsAddMembershipOpen(false);
  }, [fetchMemberData, toast]);

  const handleAddMembershipSuccess = async () => {
    if (member?.id) {
      setIsAddMembershipOpen(false);
      toast({
        title: "Membership assigned",
        description: "Membership has been successfully assigned to this member",
      });

      // Refresh memberships
      const memberships = await membershipService.getMemberActiveMemberships(member.id);
      setActiveMemberships(memberships);

      // Refresh invoices
      const invoiceHistory = await membershipService.getMemberInvoiceHistory(member.id);
      setInvoices(invoiceHistory);
    }
  };

  const handleBiometricRegistration = async () => {
    if (!member?.id) return;

    setIsRegistrationInProgress(true);
    setIsBiometricRegistering(true);

    try {
      const result = await registerMemberInBiometricDevice({
        memberId: member.id,
        name: member.full_name || '',
        phone: member.phone || ''
      });

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Biometric registration initiated successfully',
          variant: 'default'
        });

        // Check status after a delay
        setTimeout(async () => {
          const status = await checkBiometricDeviceStatus(member.id);
          setBiometricStatus(status);
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to register biometric');
      }
    } catch (error) {
      console.error('Error registering biometric:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to register biometric',
        variant: 'destructive'
      });
    } finally {
      setIsRegistrationInProgress(false);
      setIsBiometricRegistering(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getMembershipStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="secondary">None</Badge>;
    }
  };

  const getInvoiceStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'partially_paid':
        return <Badge variant="secondary" className="bg-amber-500">Partial</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTotalPaid = () => {
    return invoices
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  const getTotalDue = () => {
    return invoices
      .filter(inv => inv.status === 'pending' || inv.status === 'overdue')
      .reduce((sum, inv) => sum + inv.amount, 0);
  };

  if (isLoading) {
>>>>>>> Stashed changes
    return (
      <Container>
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Invalid Member ID</h2>
          <p>No member ID was provided in the URL.</p>
        </div>
      </Container>
    );
  }
  
  if (isLoading || loading.memberships || loading.invoices) {
    return (
      <Container>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Container>
    );
  }
  
  if (!member) {
    return (
      <Container>
        <div className="py-10 text-center">
          <h2 className="text-2xl font-bold mb-2">Member Not Found</h2>
          <p>The member you're looking for doesn't exist or has been removed.</p>
        </div>
      </Container>
    );
  }
  
  // Active membership - show the latest active membership or null if none exists
  const activeMembership = data.memberships.active[0];
  
  // Calculate days left in current membership, if any
  const daysLeft = activeMembership ? 
    differenceInDays(new Date(activeMembership.end_date), new Date()) : 0;
  
  return (
    <Container>
      <div className="space-y-6 py-6">
        {/* Member Profile Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold">{member.name}'s Profile</h1>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
            >
              Back
            </Button>
            <Button 
              onClick={() => setIsDialogOpen(true)}
            >
              Assign Membership
            </Button>
          </div>
        </div>
        
        <MemberProfile member={member} onEdit={() => console.log('Edit')} />
        
        {/* Enhanced Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="memberships">Memberships</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="measurements">Measurements</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
          </TabsList>
          
          {/* Memberships Tab */}
          <TabsContent value="memberships">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Membership History</CardTitle>
                <Button onClick={() => setIsDialogOpen(true)}>Assign New</Button>
              </CardHeader>
              <CardContent>
                {errors.memberships && (
                  <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
                    {errors.memberships}
                  </div>
                )}
                
                {/* Active Memberships */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Active Membership</h3>
                  {data.memberships.active.length > 0 ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Current Plan</div>
                            <div className="text-2xl font-bold">
                              {activeMembership?.membership_plan?.name || 'Unknown'}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">Days Left</div>
                            <div className="text-2xl font-bold">
                              {daysLeft}
                            </div>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4">
                            <div className="text-sm text-muted-foreground">End Date</div>
                            <div className="text-2xl font-bold">
                              {activeMembership ? format(parseISO(activeMembership.end_date), "PP") : 'N/A'}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      <MembershipTable memberships={data.memberships.active} />
                    </>
                  ) : (
                    <div className="p-8 text-center bg-muted rounded-md">
                      <div className="text-lg font-medium">No Active Membership</div>
                      <div className="text-muted-foreground mt-1">This member doesn't have any active memberships.</div>
                      <Button onClick={() => setIsDialogOpen(true)} className="mt-4">Assign Membership</Button>
                    </div>
                  )}
                </div>
                
                {/* Past Memberships */}
                {data.memberships.past.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Past Memberships</h3>
                    <MembershipTable memberships={data.memberships.past} />
                  </div>
                )}
                
                {/* Future Memberships */}
                {data.memberships.upcoming.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Upcoming Memberships</h3>
                    <MembershipTable memberships={data.memberships.upcoming} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <Card>
              <CardHeader>
                <CardTitle>Invoice History</CardTitle>
              </CardHeader>
              <CardContent>
                {errors.invoices && (
                  <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
                    {errors.invoices}
                  </div>
                )}
                
                {data.invoices.length > 0 ? (
                  <InvoiceTable invoices={data.invoices} />
                ) : (
                  <div className="p-8 text-center bg-muted rounded-md">
                    <div className="text-lg font-medium">No Invoices Found</div>
                    <div className="text-muted-foreground mt-1">This member doesn't have any invoices yet.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Measurements Tab */}
          <TabsContent value="measurements">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Body Measurements</CardTitle>
                <Button>Add Measurement</Button>
              </CardHeader>
              <CardContent>
                {errors.measurements && (
                  <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
                    {errors.measurements}
                  </div>
                )}
                
                {weightTrend.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Weight Trend</h3>
                    <div className="h-60 bg-muted/20 rounded-md p-4 flex items-center justify-center">
                      <LineChart className="h-10 w-10 text-muted-foreground" />
                      <span className="ml-2 text-muted-foreground">Weight chart visualization would appear here</span>
                    </div>
                  </div>
                )}
                
                {data.measurements.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Measurement History</h3>
                    <MeasurementsTable measurements={data.measurements} />
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted rounded-md">
                    <div className="text-lg font-medium">No Measurements Recorded</div>
                    <div className="text-muted-foreground mt-1">This member doesn't have any body measurements recorded yet.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Attendance Tab */}
          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                {errors.attendance && (
                  <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
                    {errors.attendance}
                  </div>
                )}
                
                {/* Attendance Stats */}
                {data.attendance.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-medium mb-4">Attendance Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Weekly Visits</div>
                          <div className="text-2xl font-bold">
                            {attendanceStats.frequency.toFixed(1)}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Consistency</div>
                          <div className="text-2xl font-bold">
                            {attendanceStats.consistency.toFixed(0)}%
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-sm text-muted-foreground">Avg. Duration</div>
                          <div className="text-2xl font-bold">
                            {Math.floor(attendanceStats.averageDuration / 60)}h {Math.floor(attendanceStats.averageDuration % 60)}m
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
<<<<<<< Updated upstream
                )}
                
                {data.attendance.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
                    <AttendanceTable attendance={data.attendance} />
                  </div>
                ) : (
                  <div className="p-8 text-center bg-muted rounded-md">
                    <div className="text-lg font-medium">No Attendance Records</div>
                    <div className="text-muted-foreground mt-1">This member doesn't have any attendance records yet.</div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Membership Assignment Dialog */}
      {isDialogOpen && (
        <MembershipAssignmentDialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          memberId={id}
          onAssign={handleMembershipAssignment}
        />
      )}
    </Container>
=======
                </TabsContent>

                <TabsContent value="memberships">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Membership History</CardTitle>
                        <CardDescription>All active and past memberships</CardDescription>
                      </div>
                      <Button onClick={() => setIsAddMembershipOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Membership
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {activeMemberships.length > 0 ? (
                        <div className="space-y-4">
                          {activeMemberships.map((membership) => (
                            <div key={membership.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h3 className="font-medium">{membership.memberships.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(membership.start_date).toLocaleDateString()} to {new Date(membership.end_date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="outline">Active</Badge>
                              </div>
                              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Total Amount</p>
                                  <p className="font-medium">{formatCurrency(membership.total_amount)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Amount Paid</p>
                                  <p className="font-medium">{formatCurrency(membership.amount_paid)}</p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">Payment Status</p>
                                  <p className="font-medium capitalize">{membership.payment_status}</p>
                                </div>
                              </div>
                              {membership.total_amount > membership.amount_paid && (
                                <div className="mt-4">
                                  <Button variant="outline" size="sm" onClick={() => navigate(`/finance/invoices/new?memberId=${member.id}`)}>
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    Pay Remaining
                                  </Button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No memberships found</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => setIsAddMembershipOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Membership
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="invoices">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Invoice History</CardTitle>
                        <CardDescription>All invoices and payment records</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddMembershipOpen(true)}
                          disabled={!member}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Assign Membership
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => navigate(`/finance/invoices/new?memberId=${member?.id}`)}
                          disabled={!member}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          New Invoice
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Total Invoices</CardDescription>
                            <CardTitle className="text-2xl">{invoices.length}</CardTitle>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Total Paid</CardDescription>
                            <CardTitle className="text-2xl text-green-600">
                              {formatCurrency(invoices
                                .filter(i => i.status === 'paid')
                                .reduce((sum, inv) => sum + (inv.amount || 0), 0)
                              )}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardDescription>Outstanding</CardDescription>
                            <CardTitle className="text-2xl text-amber-600">
                              {formatCurrency(invoices
                                .filter(i => ['pending', 'overdue'].includes(i.status))
                                .reduce((sum, inv) => sum + (inv.amount || 0), 0)
                              )}
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      </div>

                      {invoices.length > 0 ? (
                        <div className="border rounded-lg overflow-hidden">
                          <Table>
                            <TableHeader className="bg-muted/50">
                              <TableRow>
                                <TableHead>INVOICE</TableHead>
                                <TableHead>DATE</TableHead>
                                <TableHead>DUE DATE</TableHead>
                                <TableHead className="text-right">AMOUNT</TableHead>
                                <TableHead>STATUS</TableHead>
                                <TableHead className="text-right">ACTIONS</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {invoices.map((invoice) => {
                                const isOverdue = invoice.status === 'pending' && 
                                                new Date(invoice.due_date) < new Date();
                                const status = isOverdue ? 'overdue' : invoice.status;
                                
                                return (
                                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                      <div className="flex flex-col">
                                        <span>INV-{invoice.id.slice(0, 8).toUpperCase()}</span>
                                        <span className="text-xs text-muted-foreground">
                                          {invoice.items?.[0]?.name || 'Membership'}
                                        </span>
                                      </div>
                                    </TableCell>
                                    <TableCell>{format(new Date(invoice.issued_date), 'MMM dd, yyyy')}</TableCell>
                                    <TableCell>
                                      <div className="flex flex-col">
                                        <span>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</span>
                                        {isOverdue && (
                                          <span className="text-xs text-amber-600">
                                            {Math.ceil((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24))} days overdue
                                          </span>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                      {formatCurrency(invoice.amount)}
                                    </TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={
                                          status === 'paid' ? 'success' : 
                                          status === 'overdue' ? 'destructive' : 'outline'
                                        }
                                      >
                                        {status.toUpperCase()}
                                      </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <div className="flex justify-end space-x-2">
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          onClick={() => window.open(`/finance/invoices/${invoice.id}`, '_blank')}
                                          className="h-8"
                                        >
                                          <ReceiptText className="h-4 w-4 mr-1" /> View
                                        </Button>
                                        {status !== 'paid' && (
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8"
                                            onClick={() => {
                                              navigate(`/finance/payments/new?invoiceId=${invoice.id}`);
                                            }}
                                          >
                                            <CreditCard className="h-4 w-4 mr-1" /> Pay
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ) : (
                        <div className="text-center py-12 border rounded-lg">
                          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                          <h3 className="text-lg font-medium">No invoices found</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            This member doesn't have any invoices yet.
                          </p>
                          <div className="mt-6 space-x-3">
                            <Button 
                              variant="outline" 
                              onClick={() => setIsAddMembershipOpen(true)}
                              disabled={!member}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Assign Membership
                            </Button>
                            <Button 
                              variant="default" 
                              onClick={() => navigate(`/finance/invoices/new?memberId=${member?.id}`)}
                              disabled={!member}
                            >
                              <Plus className="h-4 w-4 mr-1" /> Create Invoice
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="progress">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Fitness Progress</CardTitle>
                        <CardDescription>Measurements and body statistics</CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:text-gray-900 dark:focus:text-gray-100"
                        onClick={() => setIsAddMeasurementOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Measurement
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {measurements.length > 0 ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {measurements[0].weight && (
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold">{measurements[0].weight} kg</p>
                                    <p className="text-sm text-muted-foreground">Current Weight</p>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {measurements[0].bmi && (
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold">{measurements[0].bmi}</p>
                                    <p className="text-sm text-muted-foreground">Body Mass Index</p>
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                            {measurements[0].body_fat_percentage && (
                              <Card>
                                <CardContent className="pt-6">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold">{measurements[0].body_fat_percentage}%</p>
                                    <p className="text-sm text-muted-foreground">Body Fat Percentage</p>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>

                          <div>
                            <h3 className="text-lg font-medium mb-4">Measurement History</h3>
                            <div className="space-y-2">
                              {measurements.map((measurement) => (
                                <div key={measurement.id} className="flex justify-between border-b py-2">
                                  <div>
                                    <p className="font-medium">
                                      {new Date(measurement.measurement_date).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <div className="flex space-x-6">
                                    {measurement.weight && (
                                      <div>
                                        <p className="text-sm text-muted-foreground">Weight</p>
                                        <p>{measurement.weight} kg</p>
                                      </div>
                                    )}
                                    {measurement.bmi && (
                                      <div>
                                        <p className="text-sm text-muted-foreground">BMI</p>
                                        <p>{measurement.bmi}</p>
                                      </div>
                                    )}
                                    {measurement.body_fat_percentage && (
                                      <div>
                                        <p className="text-sm text-muted-foreground">Body Fat</p>
                                        <p>{measurement.body_fat_percentage}%</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No measurements recorded yet</p>
                          <Button
                            variant="outline"
                            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                            onClick={() => setIsAddMeasurementOpen(true)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First Measurement
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="attendance">
                  <AttendanceHistory memberId={member.id || ''} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Container>

      <Dialog open={isAddMembershipOpen} onOpenChange={setIsAddMembershipOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Assign New Membership</DialogTitle>
            <DialogDescription>
              Assign a membership plan to {member?.name}
            </DialogDescription>
          </DialogHeader>
          {member && (
            <MembershipAssignmentForm
              isOpen={isAddMembershipOpen}
              onClose={() => setIsAddMembershipOpen(false)}
              memberId={member.id}
              memberName={member.name}
              onSuccess={() => {
                // Refresh member data after successful assignment
                if (member?.id) {
                  fetchMemberData(member.id);
                }
                toast({
                  title: 'Success',
                  description: 'Membership assigned successfully',
                });
                setIsAddMembershipOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Measurement Dialog */}
      <Dialog open={isAddMeasurementOpen} onOpenChange={setIsAddMeasurementOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Body Measurement</DialogTitle>
            <DialogDescription>
              Record new body measurements for this member.
            </DialogDescription>
          </DialogHeader>
          {member && (
            <BodyMeasurementForm
              memberId={member.id}
              onSubmit={async (data) => {
                try {
                  // Convert the data to match the database schema
                  const measurementData = {
                    member_id: member.id,
                    measurement_date: data.date,
                    weight: data.weight,
                    height: data.height,
                    bmi: data.bmi,
                    body_fat_percentage: data.bodyFat,
                    chest: data.chest,
                    waist: data.waist,
                    hips: data.hips,
                    biceps: data.biceps,
                    thighs: data.thighs,
                    notes: data.notes
                  };

                  // Save to database
                  const { data: newMeasurement, error } = await supabase
                    .from('measurements')
                    .insert(measurementData)
                    .select()
                    .single();

                  if (error) throw error;

                  // Update the measurements list
                  setMeasurements(prev => [newMeasurement, ...prev]);

                  toast({
                    title: "Success",
                    description: "Measurement added successfully"
                  });

                  setIsAddMeasurementOpen(false);
                } catch (error: any) {
                  console.error('Error adding measurement:', error);
                  toast({
                    title: "Error",
                    description: error.message || "Failed to add measurement",
                    variant: "destructive"
                  });
                }
              }}
              onCancel={() => setIsAddMeasurementOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
>>>>>>> Stashed changes
  );
};

export default MemberProfilePage;