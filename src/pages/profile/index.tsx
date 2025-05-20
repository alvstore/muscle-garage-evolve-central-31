
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
import { Loader2, Camera, Key, UserIcon, UserCog } from 'lucide-react';
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
  gender?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
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
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        fetchProfile(data.user);
      } else {
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

      if (error) throw error;

      setProfile(data);
      setFullName(data.full_name || '');
      setEmail(user.email || '');
      setPhone(data.phone || '');
      setGender(data.gender || '');
      setAddress(data.address || '');
      setCity(data.city || '');
      setState(data.state || '');
      setCountry(data.country || '');
      setDateOfBirth(data.date_of_birth ? new Date(data.date_of_birth) : undefined);
    } catch (error) {
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
      
      // Upload avatar to storage
      const avatarUrl = await uploadImage({
        file,
        folder: 'avatars'
      });
      
      if (!avatarUrl) {
        throw new Error('Failed to upload avatar');
      }
      
      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      // Update local state
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
      
      toast.success('Your profile picture has been updated successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('There was an error uploading your avatar');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const updateProfile = async () => {
    try {
      setUpdating(true);
      
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone,
          gender,
          address,
          city,
          state,
          country,
          date_of_birth: dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);
      
      if (error) throw error;
      
      // Update email if changed
      if (email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email,
        });
        
        if (emailError) throw emailError;
      }
      
      toast.success('Your profile information has been updated successfully');
      
      // Refresh profile data
      if (user) fetchProfile(user);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || 'There was an error updating your profile');
    } finally {
      setUpdating(false);
    }
  };

  const updatePassword = async () => {
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
      
      if (error) throw error;
      
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
                <span className="text-muted-foreground">Joined</span>
                <span>{profile?.updated_at ? format(new Date(profile.updated_at), 'MMM yyyy') : 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Edit Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="personal" className="flex items-center gap-1">
                  <UserIcon className="h-4 w-4" />
                  Personal Info
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-1">
                  <Key className="h-4 w-4" />
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
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
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
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  placeholder="Enter your address"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Enter your city"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input 
                    id="state" 
                    value={state} 
                    onChange={(e) => setState(e.target.value)} 
                    placeholder="Enter your state"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input 
                    id="country" 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)} 
                    placeholder="Enter your country"
                  />
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={updateProfile} 
                  disabled={updating}
                  className="w-full md:w-auto"
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </Button>
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
              
              <div className="pt-4">
                <Button 
                  onClick={updatePassword} 
                  disabled={updating || !newPassword || newPassword !== confirmPassword}
                  className="w-full md:w-auto"
                >
                  {updating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : 'Update Password'}
                </Button>
              </div>
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
