import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PhoneCall, Mail, MessageSquare } from "lucide-react";

interface ChurnMemberData {
  id: string;
  name: string;
  avatar?: string;
  churnRisk: number; // 0-100
  lastVisit: string;
  missedClasses: number;
  subscriptionEnd: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  factors: {
    name: string;
    impact: "high" | "medium" | "low";
  }[];
}

interface ChurnPredictionWidgetProps {
  members: ChurnMemberData[];
}

const ChurnPredictionWidget = ({ members }: ChurnPredictionWidgetProps) => {
  const sortedMembers = [...members].sort((a, b) => b.churnRisk - a.churnRisk);
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return "text-red-600";
    if (risk >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  const getRiskProgressColor = (risk: number) => {
    if (risk >= 70) return "bg-red-600";
    if (risk >= 40) return "bg-yellow-600";
    return "bg-green-600";
  };

  const getImpactBadgeColor = (impact: "high" | "medium" | "low") => {
    switch (impact) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Churn Risk Prediction</CardTitle>
        <CardDescription>Members who might not renew their membership</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        {sortedMembers.map((member) => (
          <div key={member.id} className="space-y-3 p-3 bg-accent/10 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.name}</p>
                  <div className="flex items-center mt-1">
                    <span className={`text-sm font-medium ${getRiskColor(member.churnRisk)}`}>
                      {member.churnRisk}% Risk
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                {member.contactInfo.phone && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <PhoneCall className="h-4 w-4" />
                    <span className="sr-only">Call</span>
                  </Button>
                )}
                {member.contactInfo.email && (
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                )}
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <MessageSquare className="h-4 w-4" />
                  <span className="sr-only">Message</span>
                </Button>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Churn Risk</span>
                <span>{member.churnRisk}%</span>
              </div>
              <Progress 
                value={member.churnRisk} 
                className="h-2 w-full"
              />
            </div>
            
            <div className="text-sm grid grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Last Visit:</span> {member.lastVisit}
              </div>
              <div>
                <span className="text-muted-foreground">Subscription End:</span> {member.subscriptionEnd}
              </div>
              <div>
                <span className="text-muted-foreground">Missed Classes:</span> {member.missedClasses}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-2">
              {member.factors.map((factor, i) => (
                <span 
                  key={i} 
                  className={`text-xs px-2 py-1 rounded-full ${getImpactBadgeColor(factor.impact)}`}
                >
                  {factor.name}
                </span>
              ))}
            </div>
          </div>
        ))}
        
        {members.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No members at risk of churning
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChurnPredictionWidget;
