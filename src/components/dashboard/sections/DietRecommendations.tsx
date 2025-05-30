
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Utensils, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface DietItem {
  id: string;
  name: string;
  description: string;
}

interface DietRecommendationsProps {
  recommendations: DietItem[];
}

const DietRecommendations: React.FC<DietRecommendationsProps> = ({ recommendations }) => {
  const handlePrintPlan = async () => {
    try {
      const element = document.getElementById('diet-plan-content');
      if (!element) {
        toast.error("Could not generate PDF");
        return;
      }

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      // Calculate dimensions to fit the content
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('diet-plan.pdf');
      
      toast.success("Diet plan downloaded successfully");
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error("Failed to generate PDF");
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-10">
        <Utensils className="h-10 w-10 mx-auto text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No diet recommendations</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Your personalized diet plan will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div id="diet-plan-content" className="space-y-3">
        {recommendations.map((diet) => (
          <div key={diet.id} className="p-3 border rounded-lg">
            <h3 className="font-medium">{diet.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{diet.description}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handlePrintPlan}
          className="flex items-center gap-2"
        >
          <Printer className="h-4 w-4" />
          Print Plan
        </Button>
      </div>
    </div>
  );
};

export default DietRecommendations;
