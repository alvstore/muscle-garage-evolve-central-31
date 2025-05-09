
import { useState, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Plus, Mail, Phone, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import PageHeader from "@/components/layout/PageHeader";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useBranch } from "@/hooks/use-branch";
import { useNavigate } from "react-router-dom";

interface Trainer {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  avatar_url?: string;
  rating?: number;
  specialty?: string;
  is_active: boolean;
  branch_id?: string;
}

const TrainersListPage = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const { currentBranch } = useBranch();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentBranch?.id) {
      fetchTrainers();
    }
  }, [currentBranch?.id]);

  const fetchTrainers = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from("profiles")
        .select("*")
        .eq("role", "trainer")
        .eq("is_active", true);
      
      if (currentBranch?.id) {
        query = query.eq("branch_id", currentBranch.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setTrainers(data || []);
    } catch (error) {
      console.error("Error fetching trainers:", error);
      toast({
        title: "Error",
        description: "Failed to load trainers",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (name: string = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRatingStars = (rating: number = 0) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-3 w-3 ${
              i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const filteredTrainers = trainers.filter(trainer => 
    searchQuery 
      ? trainer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        trainer.specialty?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trainer.email?.toLowerCase().includes(searchQuery.toLowerCase())
      : true
  );

  return (
    <Container>
      <PageHeader 
        title="Trainers" 
        description="View and manage your trainers"
        actions={
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Add Trainer
          </Button>
        }
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Trainers Directory</CardTitle>
          <CardDescription>View all trainers in your gym</CardDescription>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search trainers..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading trainers...</div>
          ) : filteredTrainers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No trainers found
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTrainers.map((trainer) => (
                <div
                  key={trainer.id}
                  className="flex flex-col sm:flex-row justify-between gap-4 p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={trainer.avatar_url || ""} alt={trainer.full_name} />
                      <AvatarFallback>{getInitials(trainer.full_name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{trainer.full_name}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {trainer.email}
                      </div>
                      {trainer.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {trainer.phone}
                        </div>
                      )}
                      {trainer.specialty && (
                        <Badge variant="secondary" className="mt-1">
                          {trainer.specialty}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 sm:ml-auto">
                    {trainer.rating !== undefined && (
                      <div className="hidden sm:block">
                        {getRatingStars(trainer.rating)}
                      </div>
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/trainers/${trainer.id}`)}>
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>View Scheduled Classes</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Deactivate
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default TrainersListPage;
