
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useChurnRiskMembers } from "@/hooks/use-stats";
import { format } from 'date-fns';

const ChurnRiskList: React.FC = () => {
  const { members, isLoading, error } = useChurnRiskMembers();

  const getRiskColor = (score: number) => {
    if (score >= 70) return "bg-red-500";
    if (score >= 50) return "bg-amber-500";
    if (score >= 30) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getRiskLabel = (score: number) => {
    if (score >= 70) return "High";
    if (score >= 50) return "Medium";
    if (score >= 30) return "Low";
    return "Very Low";
  };

  const getRiskFactorLabel = (factor: string | null) => {
    if (!factor) return "Multiple Factors";
    
    switch (factor) {
      case 'low_engagement':
        return "Low Engagement";
      case 'absence':
        return "Extended Absence";
      case 'expiring_soon':
        return "Expiring Soon";
      default:
        return factor;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-1">
        <CardTitle className="text-lg font-medium">Members at Risk of Churn</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-2 p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-5 w-[180px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-destructive p-6">Error loading churn risk data</p>
        ) : members.length === 0 ? (
          <p className="text-muted-foreground p-6">No members at risk currently</p>
        ) : (
          <div className="divide-y">
            {members.map((member) => (
              <div key={member.member_id} className="p-4 hover:bg-muted/50">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-medium">{member.member_name}</h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-2 mt-1">
                      <span>Last visit: {member.days_since_last_visit ? `${member.days_since_last_visit} days ago` : 'Never'}</span>
                      {member.days_until_expiry && (
                        <span>• Expires in: {member.days_until_expiry} days</span>
                      )}
                    </div>
                  </div>
                  <Badge variant={member.churn_risk_score >= 70 ? "destructive" : member.churn_risk_score >= 50 ? "outline" : "secondary"}>
                    {getRiskLabel(member.churn_risk_score)} Risk
                  </Badge>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Risk Score</span>
                    <span>{member.churn_risk_score}%</span>
                  </div>
                  <Progress value={member.churn_risk_score} className="h-1.5" indicatorClassName={getRiskColor(member.churn_risk_score)} />
                </div>
                <div className="mt-2 flex justify-between">
                  <div className="text-xs">
                    <span className="text-muted-foreground">Primary risk factor: </span>
                    <span className="font-medium">{getRiskFactorLabel(member.primary_risk_factor)}</span>
                  </div>
                  <div className="text-xs">
                    <span className="text-muted-foreground">Visits in 30 days: </span>
                    <span className="font-medium">{member.visits_last_30_days}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChurnRiskList;
