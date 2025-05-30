
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Phone, Mail, Calendar } from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

interface ChurnMember {
  id: string;
  name: string;
  avatar?: string;
  churnRisk: number;
  lastVisit: string;
  missedClasses?: number;
  subscriptionEnd?: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  factors: { 
    name: string; 
    impact: 'high' | 'medium' | 'low' 
  }[];
}

interface ChurnPredictionWidgetProps {
  members: ChurnMember[];
  isLoading?: boolean;
}

const ChurnPredictionWidget = ({ members, isLoading = false }: ChurnPredictionWidgetProps) => {
  // Helper to get risk color
  const getRiskColor = (risk: number) => {
    if (risk >= 70) return "text-red-500";
    if (risk >= 50) return "text-amber-500";
    return "text-yellow-500";
  };
  
  // Helper to get risk bg color for progress
  const getRiskBgColor = (risk: number) => {
    if (risk >= 70) return "bg-red-500";
    if (risk >= 50) return "bg-amber-500";
    return "bg-yellow-500";
  };
  
  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    switch(impact) {
      case 'high':
        return <Badge variant="destructive" className="ml-2">High</Badge>;
      case 'medium':
        return <Badge variant="warning" className="ml-2 bg-amber-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="ml-2">Low</Badge>;
      default:
        return null;
    }
  };
  
  // Helper to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <div className="mt-3">
                    <Skeleton className="h-4 w-full mb-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h3 className="text-lg font-semibold mb-1">No Churn Risk Data</h3>
        <p className="text-muted-foreground">
          There's currently no churn risk data available for members in this branch
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <Card key={member.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-12 w-12">
                {member.avatar ? (
                  <AvatarImage src={member.avatar} alt={member.name} />
                ) : (
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{member.name}</h3>
                  <span className={`font-bold ${getRiskColor(member.churnRisk)}`}>
                    {member.churnRisk}% Risk
                  </span>
                </div>
                
                <div className="text-sm text-muted-foreground mb-2">
                  Last visit: {member.lastVisit}
                </div>
                
                <Progress 
                  value={member.churnRisk} 
                  className="h-2 mt-1 mb-3" 
                  indicatorClassName={getRiskBgColor(member.churnRisk)}
                />
                
                <div className="flex flex-wrap gap-2 mt-3">
                  {member.factors.map((factor, idx) => (
                    <div key={idx} className="flex items-center text-sm">
                      <span>{factor.name}</span>
                      {getImpactBadge(factor.impact)}
                    </div>
                  ))}
                </div>
                
                {(member.subscriptionEnd || member.contactInfo.email || member.contactInfo.phone) && (
                  <div className="flex items-center gap-3 mt-3 pt-2 border-t text-sm">
                    {member.subscriptionEnd && (
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>Expires: {member.subscriptionEnd}</span>
                      </div>
                    )}
                    
                    <div className="flex-1" />
                    
                    {member.contactInfo.phone && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Call">
                        <Phone className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {member.contactInfo.email && (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" aria-label="Email">
                        <Mail className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ChurnPredictionWidget;
