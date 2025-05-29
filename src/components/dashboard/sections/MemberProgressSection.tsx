
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Member } from '@/types/members/membership';

interface MemberProgressStats {
  totalActiveMembers: number;
  newMembersThisMonth: number;
  membershipRenewalRate: number;
  averageAttendanceRate: number;
  topPerformingMembers: Member[];
  membershipGoals: {
    target: number;
    achieved: number;
    percentage: number;
  };
}

const MemberProgressSection: React.FC = () => {
  const [stats, setStats] = useState<MemberProgressStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMemberProgressStats();
  }, []);

  const fetchMemberProgressStats = async () => {
    try {
      setIsLoading(true);

      // Fetch total active members
      const { data: activeMembers, error: activeMembersError } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'active');

      if (activeMembersError) throw activeMembersError;

      // Fetch new members this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: newMembers, error: newMembersError } = await supabase
        .from('members')
        .select('*')
        .gte('created_at', startOfMonth.toISOString())
        .eq('status', 'active');

      if (newMembersError) throw newMembersError;

      // Format members with required fields
      const formattedActiveMembers: Member[] = (activeMembers || []).map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        role: 'member',
        membership_status: 'active',
        status: 'active',
        membership_id: member.membership_id,
        membership_start_date: member.membership_start_date,
        membership_end_date: member.membership_end_date,
        created_at: member.created_at,
        branch_id: member.branch_id,
        // Add other required fields with defaults
        phone: member.phone,
        gender: member.gender,
        address: member.address,
        city: member.city,
        state: member.state,
        country: member.country,
        zip_code: member.zip_code,
        date_of_birth: member.date_of_birth,
        avatar: member.avatar,
        goal: member.goal,
        occupation: member.occupation,
        blood_group: member.blood_group,
        id_type: member.id_type,
        id_number: member.id_number,
        trainer_id: member.trainer_id
      }));

      // Mock some stats for demo purposes
      const memberProgressStats: MemberProgressStats = {
        totalActiveMembers: formattedActiveMembers.length,
        newMembersThisMonth: newMembers?.length || 0,
        membershipRenewalRate: 85, // Mock value
        averageAttendanceRate: 72, // Mock value
        topPerformingMembers: formattedActiveMembers.slice(0, 5), // Top 5 members
        membershipGoals: {
          target: 500,
          achieved: formattedActiveMembers.length,
          percentage: Math.round((formattedActiveMembers.length / 500) * 100)
        }
      };

      setStats(memberProgressStats);
    } catch (error) {
      console.error('Error fetching member progress stats:', error);
      // Set default stats on error
      setStats({
        totalActiveMembers: 0,
        newMembersThisMonth: 0,
        membershipRenewalRate: 0,
        averageAttendanceRate: 0,
        topPerformingMembers: [],
        membershipGoals: {
          target: 500,
          achieved: 0,
          percentage: 0
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div>Error loading member progress stats</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Member Progress Overview</h2>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold">{stats.totalActiveMembers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New This Month</p>
                <p className="text-2xl font-bold">{stats.newMembersThisMonth}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Renewal Rate</p>
                <p className="text-2xl font-bold">{stats.membershipRenewalRate}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Attendance</p>
                <p className="text-2xl font-bold">{stats.averageAttendanceRate}%</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Membership Goal Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Membership Goal Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {stats.membershipGoals.achieved} of {stats.membershipGoals.target} members
              </span>
              <Badge variant="outline">
                {stats.membershipGoals.percentage}% Complete
              </Badge>
            </div>
            <Progress value={stats.membershipGoals.percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Members */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Active Members</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topPerformingMembers.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No members found</p>
          ) : (
            <div className="space-y-3">
              {stats.topPerformingMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {member.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {member.membership_status || 'Active'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MemberProgressSection;
