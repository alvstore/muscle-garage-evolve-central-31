
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Member } from "@/types";
import { useNavigate } from "react-router-dom";
import { Calendar, Edit, Save, X } from "lucide-react";

interface MemberProfileProps {
  member: Member;
  onUpdate: (updatedMember: Member) => void;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ member, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(member);
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(
    member.dateOfBirth ? new Date(member.dateOfBirth) : undefined
  );
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedMember = {
      ...formData,
      dateOfBirth: dateOfBirth ? dateOfBirth.toISOString().split('T')[0] : undefined,
    };
    
    onUpdate(updatedMember);
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData(member);
    setDateOfBirth(member.dateOfBirth ? new Date(member.dateOfBirth) : undefined);
    setEditMode(false);
  };

  const viewAttendanceHistory = () => {
    navigate(`/members/attendance/${member.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Member Information</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={viewAttendanceHistory}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Attendance History
          </Button>
          
          {!editMode ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setEditMode(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCancel}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit"
                form="profile-form"
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Member Profile Form */}
      <form id="profile-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    disabled={!editMode}
                    className={!editMode ? "opacity-70" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    disabled={!editMode}
                    className={!editMode ? "opacity-70" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    disabled={!editMode}
                    className={!editMode ? "opacity-70" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <DatePicker
                    id="dateOfBirth"
                    date={dateOfBirth}
                    onSelect={setDateOfBirth}
                    disabled={!editMode}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Membership Information */}
          <Card>
            <CardHeader>
              <CardTitle>Membership Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="membershipId">Membership Plan</Label>
                  <Select
                    disabled={!editMode}
                    value={formData.membershipId || ''}
                    onValueChange={(value) => handleSelectChange('membershipId', value)}
                  >
                    <SelectTrigger id="membershipId">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="premium">Premium</SelectItem>
                      <SelectItem value="platinum">Platinum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="membershipStatus">Membership Status</Label>
                  <Select
                    disabled={!editMode}
                    value={formData.membershipStatus}
                    onValueChange={(value) => handleSelectChange('membershipStatus', value as "active" | "inactive" | "expired")}
                  >
                    <SelectTrigger id="membershipStatus">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trainerId">Assigned Trainer</Label>
                  <Select
                    disabled={!editMode}
                    value={formData.trainerId || ''}
                    onValueChange={(value) => handleSelectChange('trainerId', value)}
                  >
                    <SelectTrigger id="trainerId">
                      <SelectValue placeholder="Select a trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="trainer1">John Smith</SelectItem>
                      <SelectItem value="trainer2">Sarah Johnson</SelectItem>
                      <SelectItem value="trainer3">Mike Brown</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goal">Fitness Goal</Label>
                  <Input
                    id="goal"
                    name="goal"
                    value={formData.goal || ''}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    disabled={!editMode}
                    className={!editMode ? "opacity-70" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  readOnly={!editMode}
                  disabled={!editMode}
                  className={!editMode ? "opacity-70" : ""}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
};

export default MemberProfile;
