
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { useNavigate } from "react-router-dom";
import ClassForm from "@/components/classes/ClassForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GymClass } from "@/types/class";
import { usePermissions } from "@/hooks/use-permissions";
import { Loader } from "@/components/ui/loader";

const NewClassPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { canCreateClass } = usePermissions();

  const handleSubmit = async (classData: GymClass) => {
    setLoading(true);
    
    try {
      // Simulate API call to create a new class
      setTimeout(() => {
        toast.success("Class created successfully");
        navigate("/classes");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error creating class:", error);
      toast.error("Failed to create class");
      setLoading(false);
    }
  };

  // Redirect if user doesn't have permission
  if (!canCreateClass) {
    toast.error("You don't have permission to create classes");
    navigate("/classes");
    return null;
  }

  return (
    <Container>
      <div className="py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Class</CardTitle>
            <CardDescription>Add a new fitness class to your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitting ? (
              <div className="flex items-center justify-center p-8">
                <Loader size="md" />
              </div>
            ) : (
              <ClassForm
                initialData={{
                  id: "",
                  name: "",
                  trainerId: "",
                  capacity: 10,
                  enrolled: 0,
                  startTime: new Date().toISOString(),
                  endTime: new Date(Date.now() + 3600000).toISOString(),
                  type: "Yoga",
                  location: "Main Studio"
                } as GymClass}
                handleSubmit={handleSubmit} 
                isLoading={loading} 
                onCancel={() => navigate("/classes")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default NewClassPage;
