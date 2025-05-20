
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Loader2, Camera, Key, UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { DatePicker } from '@/components/ui/date-picker';
import { useUploadImage } from '@/hooks/utils/use-upload-image';

interface Profile {
  id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  date_of_birth?: string;
  phone?: string;
  role?: string;
  branch_id?: string;
  updated_at?: string;
  is_staff?: boolean;
  is_trainer?: boolean;
}

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const { uploadImage } = useUploadImage();
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | undefined>(undefined);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          throw error;
        }
        
        if (data?.user) {
          setUser(data.user);
          await fetchProfile(data.user);
        }
      } catch (error) {
        console.error('Error getting user:', error);
        toast.error('Failed to load user information');
      } finally {
        setLoading(false);
      }
    };
    
    getUser();
  }, []);

  const fetchProfile = async (user: User) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }

      setProfile(data);
      setFullName(data?.full_name || '');
      setEmail(user.email || '');
      setPhone(data?.phone || '');
      setDateOfBirth(data?.date_of_birth ? new Date(data.date_of_birth) : undefined);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    
    try {
      setUploadingAvatar(true);
      
      // Upload to storage
      const avatarUrl = await uploadImage({
        file,
        folder: 'avatars',
      });
      
      if (!avatarUrl) {
        throw new Error('Failed to upload avatar');
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user?.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      
      toast.success('Your profile picture has been updated successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error(error.message || 'There was an error uploading your avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const updateProfile = async () => {
    if (!user?.id) {
      toast.error('User information not available');
      return;
    }

    try {
      setUpdating(true);
      
      // Validate inputs
      if (!fullName.trim()) {
        toast.error('Full name is required');
        return;
      }
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          date_of_birth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      if (error) {
        throw error;
      }
      
      // Update email if changed
      if (email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });
        
        if (emailError) {
          throw emailError;
        }
        
        toast.info('A confirmation email has been sent to your new email address');
      }
      
      toast.success('Your profile information has been updated successfully');
      
      // Refresh profile data
      const updatedUserData = await supabase.auth.getUser();
      if (updatedUserData.data?.user) {
        fetchProfile(updatedUserData.data.user);
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'There was an error updating your profile');
    } finally {
      setUpdating(false);
    }
  };

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error('Please enter both password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation must match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    try {
      setUpdating(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success('Your password has been updated successfully');
      
      // Clear password fields
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'There was an error updating your password');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Profile</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary Card */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || 'User'} />
                <AvatarFallback className="text-2xl">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <label 
                htmlFor="avatar-upload" 
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer"
              >
                {uploadingAvatar ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </label>
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
            </div>
            
            <div className="text-center space-y-1">
              <h3 className="text-xl font-semibold">{profile?.full_name || 'User'}</h3>
              <p className="text-muted-foreground">{profile?.role || 'Member'}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <div className="flex justify-center gap-2 mt-2">
                {profile?.is_staff && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Staff
                  </span>
                )}
                {profile?.is_trainer && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Trainer
                  </span>
                )}
              </div>
            </div>
            
            <Separator />
            
            <div className="w-full space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member since</span>
                <span>{profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Edit Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="personal">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Key className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent>
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <DatePicker 
                    selected={dateOfBirth}
                    onSelect={setDateOfBirth}
                    disabled={(date) => date > new Date()}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  type="password" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)} 
                  placeholder="Enter new password"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm new password"
                />
              </div>
            </TabsContent>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button 
              onClick={activeTab === 'personal' ? updateProfile : updatePassword} 
              disabled={updating}
            >
              {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
