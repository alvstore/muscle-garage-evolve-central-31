
import React, { useState } from 'react';
import { Container } from "@/components/ui/container";
import { useNavigate } from "react-router-dom";
import ClassForm from "@/components/classes/ClassForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { GymClass } from "@/types/class";

const NewClassPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (classData: Partial<GymClass>) => {
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

  return (
    <Container>
      <div className="py-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Class</CardTitle>
            <CardDescription>Add a new fitness class to your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <ClassForm 
              onSubmit={handleSubmit} 
              loading={loading} 
              onCancel={() => navigate("/classes")}
            />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default NewClassPage;
