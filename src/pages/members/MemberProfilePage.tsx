import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CalendarDays, Mail, Phone, Loader2, Plus, CreditCard, ReceiptText, User, Edit, Dumbbell, ClipboardList, Activity, Clock, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Alert, AlertDescription } from "@/components/ui/alert";
import MembershipAssignmentForm from '@/components/membership/MembershipAssignmentForm';
import { useBranch } from '@/hooks/use-branch';
import { membershipService } from '@/services/membershipService';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/utils/stringUtils';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AttendanceHistory from "@/components/attendance/AttendanceHistory";
import BodyMeasurementForm from '@/components/fitness/BodyMeasurementForm';
import ProfileImageUpload from '@/components/members/ProfileImageUpload';

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
  profile_picture?: string;  // Added this property
}

interface Invoice {
  id: string;
  amount: number;
  status: string;
  issued_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  description?: string;
}

interface Measurement {
  id: string;
  measurement_date: string;
  weight?: number;
  height?: number;
  bmi?: number;
  body_fat_percentage?: number;
}

interface MembershipData {
  id: string;
  membership_id: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  amount_paid: number;
  payment_status: string;
  memberships: {
    name: string;
    price: number;
    duration_days: number;
  };
}

const MemberProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const navigate = useNavigate();
  const [member, setMember] = useState<MemberData | null>(null);
  const [trainer, setTrainer] = useState<any>(null);
  const [activeMemberships, setActiveMemberships] = useState<MembershipData[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMembershipOpen, setIsAddMembershipOpen] = useState(false);
  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("overview");
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchMemberData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let memberId = id;
        
        // Handle case where id is 'edit' (invalid UUID)
        if (memberId === 'edit') {
          setError('Invalid member ID');
          setIsLoading(false);
          return;
        }
        
        // If no ID is provided and the current user is a member, show their own profile
        if (!memberId && user?.role === 'member') {
          const { data: memberData, error: memberError } = await supabase
            .from('members')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (memberError) throw memberError;
          if (memberData) {
            setMember(memberData);
            memberId = memberData.id;
          }
        }
        
        // If ID is provided, fetch that specific member
        else if (memberId) {
          const { data, error: memberError } = await supabase
            .from('members')
            .select('*')
            .eq('id', memberId)
            .single();
            
          if (memberError) throw memberError;
          setMember(data);
        } else {
          setError('No member ID provided');
          setIsLoading(false);
          return;
        }
        
        // Fetch trainer if assigned
        if (member?.trainer_id) {
          const { data: trainerData, error: trainerError } = await supabase
            .from('profiles')
            .select('id, full_name, email, phone, avatar_url')
            .eq('id', member.trainer_id)
            .single();
            
          if (!trainerError && trainerData) {
            setTrainer(trainerData);
          }
        }
        
        // Fetch active memberships
        if (memberId) {
          const memberships = await membershipService.getMemberActiveMemberships(memberId);
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
            .from('attendance')
            .select('*')
            .eq('member_id', memberId)
            .order('check_in_time', { ascending: false });
            
          if (!attendanceError && attendanceData) {
            setAttendanceRecords(attendanceData);
          }
        }
      } catch (err: any) {
        console.error('Error fetching member:', err);
        setError(err.message || 'Failed to load member data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMemberData();
  }, [id, user, member?.trainer_id]);

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
    return (
      <Container>
        <div className="flex h-[calc(100vh-200px)] items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4">Loading member data...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </Container>
    );
  }

  if (!member) {
    return (
      <Container>
        <div className="py-6">
          <Alert>
            <AlertDescription>Member not found</AlertDescription>
          </Alert>
        </div>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <div className="py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Member Profile</h1>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => navigate(`/members/${member.id}/edit`)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button onClick={() => setIsAddMembershipOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Membership
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={member.profile_picture || ""} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{member.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    ID: {member.id.substring(0, 8)}
                  </p>
                  {member.membership_status && (
                    <div className="mt-1">
                      {getMembershipStatusBadge(member.membership_status)}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                  <div className="space-y-2 mt-2">
                    {member.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    {member.date_of_birth && (
                      <div className="flex items-center">
                        <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{new Date(member.date_of_birth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Personal Details</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {member.gender && (
                      <div>
                        <p className="text-xs text-muted-foreground">Gender</p>
                        <p>{member.gender}</p>
                      </div>
                    )}
                    {member.occupation && (
                      <div>
                        <p className="text-xs text-muted-foreground">Occupation</p>
                        <p>{member.occupation}</p>
                      </div>
                    )}
                  </div>
                </div>

                {member.address && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                    <p className="mt-1">
                      {member.address}
                      {member.city && `, ${member.city}`}
                      {member.state && `, ${member.state}`}
                      {member.country && ` ${member.country}`}
                    </p>
                  </div>
                )}

                {member.goal && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Fitness Goal</h4>
                    <p className="mt-1">{member.goal}</p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Payment Summary</h4>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Total Paid</p>
                      <p className="font-medium text-green-600">{formatCurrency(getTotalPaid())}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Total Due</p>
                      <p className="font-medium text-red-600">{formatCurrency(getTotalDue())}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="col-span-1 md:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-5 mb-4">
                  <TabsTrigger value="overview">
                    <User className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="memberships">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Memberships
                  </TabsTrigger>
                  <TabsTrigger value="invoices">
                    <ReceiptText className="h-4 w-4 mr-2" />
                    Invoices
                  </TabsTrigger>
                  <TabsTrigger value="progress">
                    <Activity className="h-4 w-4 mr-2" />
                    Progress
                  </TabsTrigger>
                  <TabsTrigger value="attendance">
                    <Clock className="h-4 w-4 mr-2" />
                    Attendance
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Current Membership</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {activeMemberships.length > 0 ? (
                          <div>
                            <p className="font-medium">{activeMemberships[0].memberships.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Expires: {new Date(activeMemberships[0].end_date).toLocaleDateString()}
                            </p>
                            <div className="flex justify-between mt-2">
                              <p className="text-sm">Total: {formatCurrency(activeMemberships[0].total_amount)}</p>
                              <p className="text-sm">Paid: {formatCurrency(activeMemberships[0].amount_paid)}</p>
                            </div>
                            <div className="mt-2">
                              {activeMemberships[0].payment_status === 'paid' ? (
                                <Badge className="bg-green-500">Paid</Badge>
                              ) : activeMemberships[0].payment_status === 'partial' ? (
                                <Badge variant="secondary" className="bg-amber-500">Partial</Badge>
                              ) : (
                                <Badge variant="outline">Pending</Badge>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">No active membership</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => setIsAddMembershipOpen(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Membership
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Measurements</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {measurements.length > 0 ? (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              Last updated: {new Date(measurements[0].measurement_date).toLocaleDateString()}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                              {measurements[0].weight && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Weight</p>
                                  <p className="font-medium">{measurements[0].weight} kg</p>
                                </div>
                              )}
                              {measurements[0].bmi && (
                                <div>
                                  <p className="text-xs text-muted-foreground">BMI</p>
                                  <p className="font-medium">{measurements[0].bmi}</p>
                                </div>
                              )}
                              {measurements[0].body_fat_percentage && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Body Fat %</p>
                                  <p className="font-medium">{measurements[0].body_fat_percentage}%</p>
                                </div>
                              )}
                            </div>
                            <Button
                              variant="link"
                              className="p-0 h-auto"
                              onClick={() => setActiveTab("progress")}
                            >
                              View all measurements
                            </Button>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-muted-foreground">No measurements recorded</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => setIsAddMeasurementOpen(true)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Measurement
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {trainer && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Assigned Trainer</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={trainer.avatar_url || ""} alt={trainer.full_name} />
                              <AvatarFallback>{getInitials(trainer.full_name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{trainer.full_name}</p>
                              {trainer.email && (
                                <p className="text-sm text-muted-foreground">{trainer.email}</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Summary</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <p className="font-medium">Total Paid</p>
                            <p className="font-medium text-green-600">{formatCurrency(getTotalPaid())}</p>
                          </div>
                          <div className="flex justify-between">
                            <p className="font-medium">Total Due</p>
                            <p className="font-medium text-red-600">{formatCurrency(getTotalDue())}</p>
                          </div>
                          <div className="pt-2">
                            <Button
                              variant="link"
                              className="p-0 h-auto"
                              onClick={() => setActiveTab("invoices")}
                            >
                              View all invoices
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
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
                                  <Button variant="outline" size="sm" onClick={() => navigate(`/finance/invoices?memberId=${member.id}`)}>
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
                      <Button variant="outline" onClick={() => navigate(`/finance/invoices/new?memberId=${member.id}`)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Invoice
                      </Button>
                    </CardHeader>
                    <CardContent>
                      {invoices.length > 0 ? (
                        <div className="space-y-2">
                          {invoices.map((invoice) => (
                            <div key={invoice.id} className="flex items-center justify-between border-b py-2">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  <Badge variant="outline" className="rounded-full w-10 h-10 flex items-center justify-center">
                                    <ReceiptText className="h-5 w-5" />
                                  </Badge>
                                </div>
                                <div>
                                  <p className="font-medium">{invoice.description || `Invoice #${invoice.id.substring(0, 8)}`}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(invoice.issued_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="font-medium">{formatCurrency(invoice.amount)}</p>
                                  <div>{getInvoiceStatusBadge(invoice.status)}</div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => navigate(`/finance/invoices/${invoice.id}`)}
                                >
                                  View
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No invoices found</p>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
                            onClick={() => navigate(`/finance/invoices/new?memberId=${member.id}`)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Invoice
                          </Button>
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
                  <AttendanceHistory memberId={id || ''} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Container>

      {/* Add Membership Dialog */}
      <Dialog open={isAddMembershipOpen} onOpenChange={setIsAddMembershipOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Assign Membership</DialogTitle>
            <DialogDescription>
              Assign a membership plan to {member.name}
            </DialogDescription>
          </DialogHeader>
          <MembershipAssignmentForm
            memberId={member.id}
            onSuccess={handleAddMembershipSuccess} />
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
              currentUser={user!}
              onSave={async (data) => {
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
                  setMeasurements([newMeasurement, ...measurements]);
                  
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
  );
};

export default MemberProfilePage;
