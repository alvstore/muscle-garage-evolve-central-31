
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Utensils } from 'lucide-react';

interface DietItem {
  id: string;
  name: string;
  description: string;
}

interface DietRecommendationsProps {
  recommendations: DietItem[];
}

const DietRecommendations: React.FC<DietRecommendationsProps> = ({ recommendations }) => {
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
    <div className="space-y-3">
      {recommendations.map((diet) => (
        <div key={diet.id} className="p-3 border rounded-lg">
          <h3 className="font-medium">{diet.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{diet.description}</p>
        </div>
      ))}
    </div>
  );
};

export default DietRecommendations;
