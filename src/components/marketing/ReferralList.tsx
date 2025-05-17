
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
import { useReferrals } from '@/hooks/members/use-referrals';
import CreateReferralDialog from './CreateReferralDialog';

const ReferralList = () => {
  const { referrals, isLoading, refetch, approveReferral, rejectReferral, resendInvitation } = useReferrals();
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Apply search filter when search term changes
  useEffect(() => {
    if (searchTerm && referrals) {
      const filtered = referrals.filter(referral => 
        (referral.referrer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        referral.referred_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (referral.referred_name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        (referral.promo_code?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      );
      setFilteredReferrals(filtered);
    } else {
      setFilteredReferrals(referrals || []);
    }
  }, [searchTerm, referrals]);

  const handleApprove = (id: string) => {
    approveReferral(id);
  };

  const handleReject = (id: string) => {
    rejectReferral(id);
  };

  const handleResendEmail = (referral: Referral) => {
    resendInvitation(referral);
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

  const handleRefresh = () => {
    refetch();
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Referrals</CardTitle>
          <CreateReferralDialog />
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
                onClick={handleRefresh}
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

        {isLoading ? (
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
                      {referral.referrer_name}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        {referral.referred_name && <span>{referral.referred_name}</span>}
                        <span className="text-xs text-muted-foreground">{referral.referred_email}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(referral.status)}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs">Created: {formatDate(referral.created_at)}</span>
                        {referral.converted_at && (
                          <span className="text-xs">Converted: {formatDate(referral.converted_at)}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {referral.promo_code && (
                        <span className="font-mono text-xs">{referral.promo_code}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.reward_amount ? (
                        <div className="flex flex-col">
                          <span>${referral.reward_amount}</span>
                          <span className="text-xs text-muted-foreground">
                            {referral.reward_status === "processed" ? "Processed" : "Pending"}
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
