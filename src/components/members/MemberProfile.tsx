import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Member } from "@/types";
import { CalendarIcon, Edit2Icon, MapPinIcon, UserIcon } from "lucide-react";
import { format } from "date-fns";
import MemberProfileForm from "./MemberProfileForm";

interface MemberProfileProps {
  member: Member;
  onUpdate: (updatedMember: Member) => void;
}

const MemberProfile = ({ member, onUpdate }: MemberProfileProps) => {
  const [editing, setEditing] = useState(false);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "inactive":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "expired":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleUpdate = (updatedMember: Member) => {
    onUpdate(updatedMember);
    setEditing(false);
  };
  
  if (editing) {
    return <MemberProfileForm member={member} onSave={handleUpdate} onCancel={() => setEditing(false)} />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Member Profile</CardTitle>
          <CardDescription>View and manage member details</CardDescription>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => setEditing(true)}
        >
          <Edit2Icon className="h-4 w-4" />
          Edit Profile
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="space-y-4">
          <TabsList>
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="membership">Membership</TabsTrigger>
            <TabsTrigger value="fitness">Fitness Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="h-24 w-24">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="text-2xl">{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                  <p className="font-medium">{member.name}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">{member.email}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Phone</p>
                  <p className="font-medium">{member.phone || "Not provided"}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="font-medium flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    {member.date_of_birth ? format(new Date(member.date_of_birth), "MMMM d, yyyy") : "Not provided"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* New Address Tab */}
          <TabsContent value="address" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="font-medium flex items-start gap-1">
                  <MapPinIcon className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span>{member.address || "No address provided"}</span>
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">City</p>
                <p className="font-medium">{member.city || "Not provided"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">State</p>
                <p className="font-medium">{member.state || "Not provided"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Postal Code</p>
                <p className="font-medium">{member.zipCode || "Not provided"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Country</p>
                <p className="font-medium">{member.country || "India"}</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="membership" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Membership Status</p>
                <p className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getStatusColor(member.membership_status)}`}>
                  {member.membership_status.charAt(0).toUpperCase() + member.membership_status.slice(1)}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Membership ID</p>
                <p className="font-medium">{member.membership_id || "Not assigned"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p className="font-medium">
                  {member.membership_start_date ? format(new Date(member.membership_start_date), "MMMM d, yyyy") : "Not set"}
                </p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">End Date</p>
                <p className="font-medium">
                  {member.membership_end_date ? format(new Date(member.membership_end_date), "MMMM d, yyyy") : "Not set"}
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="fitness" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Fitness Goal</p>
                <p className="font-medium">{member.goal || "Not set"}</p>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Assigned Trainer</p>
                <p className="font-medium flex items-center gap-1">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  {member.trainerId ? "Trainer ID: " + member.trainerId : "None assigned"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MemberProfile;
