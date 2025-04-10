
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Gift,
  Download,
  RefreshCw,
  Check,
  X,
  Mail,
  UserPlus,
  Search
} from "lucide-react";
import { Referral, ReferralStatus } from "@/types/marketing";
import { toast } from "sonner";

// Mock data for referrals
const mockReferrals: Referral[] = [
  {
    id: "1",
    referrerId: "member-1",
    referrerName: "John Smith",
    referredEmail: "friend1@example.com",
    referredName: "Michael Brown",
    status: "pending",
    promoCodeId: "promo-1",
    promoCode: "REFER10",
    createdAt: "2023-05-10T14:30:00Z"
  },
  {
    id: "2",
    referrerId: "member-2",
    referrerName: "Sarah Wilson",
    referredEmail: "friend2@example.com",
    referredName: "Emma Johnson",
    referredId: "member-10",
    status: "approved",
    promoCodeId: "promo-1",
    promoCode: "REFER10",
    createdAt: "2023-05-08T11:15:00Z",
    convertedAt: "2023-05-15T09:30:00Z",
    rewardAmount: 10,
    rewardDescription: "$10 account credit",
    rewardStatus: "pending"
  },
  {
    id: "3",
    referrerId: "member-3",
    referrerName: "Robert Taylor",
    referredEmail: "friend3@example.com",
    status: "pending",
    promoCodeId: "promo-1",
    promoCode: "REFER10",
    createdAt: "2023-05-12T16:45:00Z"
  },
  {
    id: "4",
    referrerId: "member-1",
    referrerName: "John Smith",
    referredEmail: "friend4@example.com",
    referredName: "James Anderson",
    referredId: "member-11",
    status: "approved",
    promoCodeId: "promo-1",
    promoCode: "REFER10",
    createdAt: "2023-05-05T10:20:00Z",
    convertedAt: "2023-05-11T14:10:00Z",
    rewardAmount: 10,
    rewardDescription: "$10 account credit",
    rewardStatus: "processed"
  },
  {
    id: "5",
    referrerId: "member-4",
    referrerName: "Amy Davis",
    referredEmail: "friend5@example.com",
    status: "rejected",
    promoCodeId: "promo-1",
    promoCode: "REFER10",
    createdAt: "2023-05-01T09:00:00Z"
  },
  {
    id: "6",
    referrerId: "member-5",
    referrerName: "David Miller",
    referredEmail: "friend6@example.com",
    referredName: "Christine Lee",
    referredId: "member-12",
    status: "rewarded",
    promoCodeId: "promo-1",
    promoCode: "REFER10",
    createdAt: "2023-04-28T15:30:00Z",
    convertedAt: "2023-05-04T11:20:00Z",
    rewardAmount: 10,
    rewardDescription: "$10 account credit",
    rewardStatus: "processed"
  }
];

const ReferralList = () => {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReferrals(mockReferrals);
      setFilteredReferrals(mockReferrals);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply search filter when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = referrals.filter(referral => 
        referral.referrerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.referredEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (referral.referredName && referral.referredName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (referral.promoCode && referral.promoCode.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredReferrals(filtered);
    } else {
      setFilteredReferrals(referrals);
    }
  }, [searchTerm, referrals]);

  const handleApprove = (id: string) => {
    // In a real app, this would be an API call
    setReferrals(referrals.map(ref => 
      ref.id === id ? { ...ref, status: "approved" as ReferralStatus } : ref
    ));
    setFilteredReferrals(filteredReferrals.map(ref => 
      ref.id === id ? { ...ref, status: "approved" as ReferralStatus } : ref
    ));
    toast.success("Referral approved successfully");
  };

  const handleReject = (id: string) => {
    // In a real app, this would be an API call
    setReferrals(referrals.map(ref => 
      ref.id === id ? { ...ref, status: "rejected" as ReferralStatus } : ref
    ));
    setFilteredReferrals(filteredReferrals.map(ref => 
      ref.id === id ? { ...ref, status: "rejected" as ReferralStatus } : ref
    ));
    toast.success("Referral rejected");
  };

  const handleResendEmail = (referral: Referral) => {
    // In a real app, this would be an API call to resend the invitation
    toast.success(`Invitation resent to ${referral.referredEmail}`);
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Status badge color mapping
  const getStatusBadge = (status: ReferralStatus) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Pending</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Approved</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Rejected</Badge>;
      case "rewarded":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Rewarded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Referrals</CardTitle>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Create Manual Referral
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or promo code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setReferrals(mockReferrals);
                    setFilteredReferrals(mockReferrals);
                    setLoading(false);
                  }, 1000);
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Showing {filteredReferrals.length} referrals
            </p>
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-t-primary animate-spin"></div>
              <p className="text-sm text-muted-foreground">Loading referrals...</p>
            </div>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="text-center py-10">
            <Gift className="h-10 w-10 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No referrals found</h3>
            <p className="mt-1 text-sm text-muted-foreground mb-4">
              {searchTerm 
                ? "No referrals match your search"
                : "Start by creating a referral or wait for members to refer friends"}
            </p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Referred Person</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Promo Code</TableHead>
                  <TableHead>Reward</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">
                      {referral.referrerName}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {referral.referredName && <span>{referral.referredName}</span>}
                        <span className="text-xs text-muted-foreground">{referral.referredEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs">Created: {formatDate(referral.createdAt)}</span>
                        {referral.convertedAt && (
                          <span className="text-xs">Converted: {formatDate(referral.convertedAt)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {referral.promoCode && (
                        <span className="font-mono text-xs">{referral.promoCode}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.rewardAmount ? (
                        <div className="flex flex-col">
                          <span>${referral.rewardAmount}</span>
                          <span className="text-xs text-muted-foreground">
                            {referral.rewardStatus === "processed" ? "Processed" : "Pending"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {referral.status === "pending" && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-green-600"
                              onClick={() => handleApprove(referral.id)}
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 text-red-600"
                              onClick={() => handleReject(referral.id)}
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleResendEmail(referral)}
                              title="Resend Email"
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {referral.status !== "pending" && (
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleResendEmail(referral)}
                            title="Resend Email"
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralList;
