
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ChurnPredictionWidget from '@/components/dashboard/ChurnPredictionWidget';
import { supabase } from '@/integrations/supabase/client';
import { useBranch } from '@/hooks/use-branch';

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

const ChurnPredictionSection = () => {
  const [churnMembers, setChurnMembers] = useState<ChurnMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentBranch } = useBranch();

  useEffect(() => {
    const fetchChurnRiskMembers = async () => {
      if (!currentBranch?.id) return;
      
      setIsLoading(true);
      try {
        // First fetch churn risk data
        const { data: churnData, error: churnError } = await supabase
          .from('member_churn_risk')
          .select('*')
          .eq('branch_id', currentBranch.id)
          .order('churn_risk_score', { ascending: false })
          .limit(5);
        
        if (churnError) throw churnError;
        
        if (!churnData || churnData.length === 0) {
          setChurnMembers([]);
          return;
        }
        
        // Fetch additional member details
        const memberIds = churnData.map(item => item.member_id);
        const { data: membersData, error: membersError } = await supabase
          .from('members')
          .select('id, name, email, phone, avatar')
          .in('id', memberIds);
          
        if (membersError) throw membersError;
        
        // Fetch attendance data to calculate last visit
        const { data: attendanceData, error: attendanceError } = await supabase
          .from('member_attendance')
          .select('member_id, check_in')
          .in('member_id', memberIds)
          .order('check_in', { ascending: false });
          
        if (attendanceError) throw attendanceError;
        
        // Transform the data to ChurnMember format
        const formattedChurnMembers: ChurnMember[] = churnData.map(churn => {
          const member = membersData?.find(m => m.id === churn.member_id) || { name: 'Unknown Member' };
          
          // Find last visit date
          const lastAttendance = attendanceData?.find(a => a.member_id === churn.member_id);
          const lastVisitDate = lastAttendance ? new Date(lastAttendance.check_in) : null;
          const daysSinceLastVisit = lastVisitDate 
            ? Math.floor((new Date().getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)) 
            : null;
          
          const lastVisit = lastVisitDate 
            ? `${daysSinceLastVisit} ${daysSinceLastVisit === 1 ? 'day' : 'days'} ago` 
            : 'Never';
            
          // Determine risk factors
          const factors: { name: string; impact: 'high' | 'medium' | 'low' }[] = [];
          
          if (churn.days_since_last_visit && churn.days_since_last_visit > 14) {
            factors.push({ 
              name: 'Low Attendance', 
              impact: churn.days_since_last_visit > 21 ? 'high' : 'medium' 
            });
          }
          
          if (churn.days_until_expiry && churn.days_until_expiry < 15) {
            factors.push({ 
              name: 'Expiring Soon', 
              impact: churn.days_until_expiry < 7 ? 'high' : 'medium' 
            });
          }
          
          if (churn.visits_last_30_days !== null && churn.visits_last_30_days < 4) {
            factors.push({ 
              name: 'Declining Usage', 
              impact: churn.visits_last_30_days < 2 ? 'high' : 'medium' 
            });
          }
          
          return {
            id: churn.member_id,
            name: member.name,
            avatar: member.avatar,
            churnRisk: churn.churn_risk_score,
            lastVisit,
            subscriptionEnd: churn.days_until_expiry ? 
              new Date(Date.now() + churn.days_until_expiry * 24 * 60 * 60 * 1000).toLocaleDateString() : 
              undefined,
            contactInfo: {
              phone: member.phone,
              email: member.email
            },
            factors: factors.length > 0 ? factors : [{ name: 'Multiple Factors', impact: 'medium' }]
          };
        });
        
        setChurnMembers(formattedChurnMembers);
        
      } catch (error) {
        console.error('Error fetching churn prediction data:', error);
        // Fallback - leave empty (don't use mock data)
        setChurnMembers([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchChurnRiskMembers();
  }, [currentBranch?.id]);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Churn Prediction</CardTitle>
        <CardDescription>
          Members at risk of not renewing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChurnPredictionWidget 
          members={churnMembers} 
          isLoading={isLoading} 
        />
      </CardContent>
    </Card>
  );
};

export default ChurnPredictionSection;
