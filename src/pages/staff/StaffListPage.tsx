
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit, Mail, Phone, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useBranch } from "@/hooks/use-branch";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  branchId: string;
  avatar?: string;
  status: "active" | "inactive";
  joined: string;
}

const MOCK_STAFF: StaffMember[] = [
  {
    id: "staff1",
    name: "Daniel Wilson",
    email: "daniel.wilson@example.com",
    phone: "+1 (555) 123-4567",
    position: "Branch Manager",
    department: "Management",
    branchId: "branch-1",
    avatar: "/placeholder.svg",
    status: "active",
    joined: "2022-01-15",
  },
  {
    id: "staff2",
    name: "Sophia Martinez",
    email: "sophia.martinez@example.com",
    phone: "+1 (555) 987-6543",
    position: "Front Desk Executive",
    department: "Customer Service",
    branchId: "branch-1",
    avatar: "/placeholder.svg",
    status: "active",
    joined: "2022-03-10",
  },
  {
    id: "staff3",
    name: "James Taylor",
    email: "james.taylor@example.com",
    phone: "+1 (555) 765-4321",
    position: "Maintenance Supervisor",
    department: "Facilities",
    branchId: "branch-1",
    avatar: "/placeholder.svg",
    status: "active",
    joined: "2022-05-22",
  },
  {
    id: "staff4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    phone: "+1 (555) 432-1098",
    position: "Membership Coordinator",
    department: "Sales",
    branchId: "branch-2",
    avatar: "/placeholder.svg",
    status: "inactive",
    joined: "2021-11-05",
  },
];

const StaffListPage = () => {
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<StaffMember | null>(null);
  const { currentBranch } = useBranch();
  
  const filteredStaff = staff.filter(s => 
    (currentBranch?.id ? s.branchId === currentBranch.id : true) &&
    (s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
     s.position.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const activeStaff = filteredStaff.filter(s => s.status === "active");
  const inactiveStaff = filteredStaff.filter(s => s.status === "inactive");
  
  const handleAddStaff = () => {
    toast.info("Add staff functionality will be implemented");
  };
  
  const confirmDelete = (staff: StaffMember) => {
    setStaffToDelete(staff);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (staffToDelete) {
      setStaff(staff.filter(s => s.id !== staffToDelete.id));
      toast.success(`${staffToDelete.name} has been removed`);
      setDeleteDialogOpen(false);
      setStaffToDelete(null);
    }
  };
  
  const StaffList = ({ staffMembers }: { staffMembers: StaffMember[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {staffMembers.length === 0 ? (
        <div className="col-span-3 text-center py-10">
          <p className="text-muted-foreground">No staff members found</p>
        </div>
      ) : (
        staffMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="pb-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <CardDescription>{member.position}</CardDescription>
                  </div>
                </div>
                <Badge variant={member.status === "active" ? "success" : "secondary"}>
                  {member.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="text-sm mt-1">
                  <span className="text-muted-foreground">Department: </span>
                  <span>{member.department}</span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Joined: </span>
                  <span>{new Date(member.joined).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="flex justify-between w-full">
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => confirmDelete(member)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remove
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
  
  return (
    <Container>
      <div className="py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Staff Management</h1>
            <p className="text-muted-foreground">
              Manage your gym staff and employees
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search staff..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleAddStaff}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Staff
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Staff ({activeStaff.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Staff ({inactiveStaff.length})</TabsTrigger>
            <TabsTrigger value="all">All Staff ({filteredStaff.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            <StaffList staffMembers={activeStaff} />
          </TabsContent>
          
          <TabsContent value="inactive">
            <StaffList staffMembers={inactiveStaff} />
          </TabsContent>
          
          <TabsContent value="all">
            <StaffList staffMembers={filteredStaff} />
          </TabsContent>
        </Tabs>
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Confirm Staff Removal</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              Are you sure you want to remove <span className="font-semibold">{staffToDelete?.name}</span>?
              This action cannot be undone.
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Container>
  );
};

export default StaffListPage;
