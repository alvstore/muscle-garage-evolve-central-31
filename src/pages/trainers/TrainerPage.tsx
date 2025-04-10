
import { Container } from "@/components/ui/container";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DumbbellIcon, Calendar, Mail, Phone, MoreHorizontal, Star, Plus } from "lucide-react";

const TrainerPage = () => {
  // Mock trainers data - in a real app would come from API
  const trainers = [
    {
      id: "t1",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "+1 (555) 123-4567",
      avatar: "/placeholder.svg",
      specialty: "Yoga, Pilates",
      bio: "Certified yoga instructor with 5 years of experience. Specializes in vinyasa and restorative yoga practices.",
      rating: 4.8,
      classesCount: 15,
      membersCount: 28
    },
    {
      id: "t2",
      name: "Mike Johnson",
      email: "mike.johnson@example.com",
      phone: "+1 (555) 987-6543",
      specialty: "Strength Training, HIIT",
      bio: "Former competitive bodybuilder with expertise in strength training and high-intensity workouts.",
      rating: 4.6,
      classesCount: 12,
      membersCount: 35
    },
    {
      id: "t3",
      name: "Robert Chen",
      email: "robert.chen@example.com",
      phone: "+1 (555) 456-7890",
      avatar: "/placeholder.svg",
      specialty: "Functional Training, Rehabilitation",
      bio: "Physical therapist with a focus on functional movement and injury prevention techniques.",
      rating: 4.9,
      classesCount: 8,
      membersCount: 22
    },
    {
      id: "t4",
      name: "Sarah Williams",
      email: "sarah.williams@example.com",
      phone: "+1 (555) 234-5678",
      specialty: "Zumba, Dance Fitness",
      bio: "Professional dancer with experience in various dance styles, bringing fun and energy to every class.",
      rating: 4.7,
      classesCount: 10,
      membersCount: 40
    }
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <Container>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Trainer Management</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Trainer
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainers.map((trainer) => (
            <Card key={trainer.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <CardTitle>{trainer.name}</CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Schedule</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>{trainer.specialty}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={trainer.avatar} alt={trainer.name} />
                    <AvatarFallback>{getInitials(trainer.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span className="font-medium">{trainer.rating}</span>
                      <span className="text-sm text-muted-foreground ml-1">rating</span>
                    </div>
                    <div className="flex space-x-2 mt-1">
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        <DumbbellIcon className="mr-1 h-3 w-3" />
                        {trainer.classesCount} Classes
                      </Badge>
                      <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        {trainer.membersCount} Members
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{trainer.bio}</p>
                
                <div className="space-y-1 text-sm">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{trainer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{trainer.phone}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </Button>
                  <Button size="sm">View Profile</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default TrainerPage;
