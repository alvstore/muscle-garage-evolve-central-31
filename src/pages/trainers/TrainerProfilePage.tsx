
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CameraIcon, User, Mail, Phone, MapPin, Briefcase, Clock, Award, Pencil, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface TrainerData {
  email: string;
  name: string;
  phone: string;
  specialization: string;
  experience: string;
  bio: string;
  certifications: string[];
  address: Address;
  avatar: string;
  joinDate: string;
}

const TrainerProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mock trainer data - in a real app, this would come from an API
  const [trainerData, setTrainerData] = useState<TrainerData>({
    email: user?.email || "trainer@example.com",
    name: user?.name || "Alex Johnson",
    phone: "+91 9876543210",
    specialization: "Strength Training, HIIT, Weight Loss",
    experience: "5 years",
    bio: "Certified personal trainer with expertise in strength training and high-intensity workouts. Specializes in weight loss and muscle building programs.",
    certifications: [
      "NASM Certified Personal Trainer",
      "ACE Fitness Nutrition Specialist",
      "Functional Training Specialist"
    ],
    address: {
      street: "123 Fitness Avenue",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
      country: "India"
    },
    avatar: user?.avatar || "/placeholder.svg",
    joinDate: "January 12, 2023"
  });
  
  const [formData, setFormData] = useState<TrainerData>({...trainerData});
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSave = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setTrainerData(formData);
      setEditing(false);
      setLoading(false);
      toast.success("Profile updated successfully!");
    }, 1000);
  };
  
  const handleCancel = () => {
    setFormData({...trainerData});
    setEditing(false);
  };
  
  const handleAvatarChange = () => {
    // In a real app, this would open a file picker dialog
    toast.info("This would open a file picker in a real application");
  };
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          {!editing ? (
            <Button onClick={() => setEditing(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <>Saving...</>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
        
        <Tabs defaultValue="personal">
          <TabsList className="mb-6">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional">Professional</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src={formData.avatar} alt={formData.name} />
                      <AvatarFallback className="text-4xl">{getInitials(formData.name)}</AvatarFallback>
                    </Avatar>
                    {editing && (
                      <Button variant="outline" size="sm" onClick={handleAvatarChange}>
                        <CameraIcon className="mr-2 h-4 w-4" />
                        Change Photo
                      </Button>
                    )}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Joined on</p>
                      <p className="font-medium">{trainerData.joinDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        {editing ? (
                          <Input 
                            id="name" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleInputChange} 
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 border rounded-md">
                            <User className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{trainerData.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        {editing ? (
                          <Input 
                            id="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleInputChange} 
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 border rounded-md">
                            <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{trainerData.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        {editing ? (
                          <Input 
                            id="phone" 
                            name="phone" 
                            value={formData.phone} 
                            onChange={handleInputChange} 
                          />
                        ) : (
                          <div className="flex items-center h-10 px-3 border rounded-md">
                            <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                            <span>{trainerData.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      {editing ? (
                        <Textarea 
                          id="bio" 
                          name="bio" 
                          value={formData.bio} 
                          onChange={handleInputChange} 
                          rows={4}
                        />
                      ) : (
                        <div className="p-3 border rounded-md min-h-[100px]">
                          <p>{trainerData.bio}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="professional">
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      {editing ? (
                        <Input 
                          id="specialization" 
                          name="specialization" 
                          value={formData.specialization} 
                          onChange={handleInputChange} 
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 border rounded-md">
                          <Briefcase className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{trainerData.specialization}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      {editing ? (
                        <Input 
                          id="experience" 
                          name="experience" 
                          value={formData.experience} 
                          onChange={handleInputChange} 
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 border rounded-md">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span>{trainerData.experience}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Certifications</Label>
                    <div className="border rounded-md p-3">
                      {trainerData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center mb-2 last:mb-0">
                          <Award className="h-4 w-4 text-primary mr-2" />
                          <span>{cert}</span>
                        </div>
                      ))}
                    </div>
                    
                    {editing && (
                      <div className="pt-2">
                        <Button variant="outline" size="sm">
                          Add Certification
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="address">
            <Card>
              <CardHeader>
                <CardTitle>Address Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Street Address</Label>
                    {editing ? (
                      <Input 
                        id="street" 
                        name="address.street" 
                        value={formData.address.street} 
                        onChange={handleInputChange} 
                      />
                    ) : (
                      <div className="flex items-center h-10 px-3 border rounded-md">
                        <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                        <span>{trainerData.address.street}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      {editing ? (
                        <Input 
                          id="city" 
                          name="address.city" 
                          value={formData.address.city} 
                          onChange={handleInputChange} 
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 border rounded-md">
                          <span>{trainerData.address.city}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      {editing ? (
                        <Input 
                          id="state" 
                          name="address.state" 
                          value={formData.address.state} 
                          onChange={handleInputChange} 
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 border rounded-md">
                          <span>{trainerData.address.state}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Postal/Zip Code</Label>
                      {editing ? (
                        <Input 
                          id="zipCode" 
                          name="address.zipCode" 
                          value={formData.address.zipCode} 
                          onChange={handleInputChange} 
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 border rounded-md">
                          <span>{trainerData.address.zipCode}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      {editing ? (
                        <Input 
                          id="country" 
                          name="address.country" 
                          value={formData.address.country} 
                          onChange={handleInputChange} 
                        />
                      ) : (
                        <div className="flex items-center h-10 px-3 border rounded-md">
                          <span>{trainerData.address.country}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
};

export default TrainerProfilePage;
