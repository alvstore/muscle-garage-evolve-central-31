
import React, { useEffect, useState } from 'react';
import { supabase } from '@/services/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format, addDays } from 'date-fns';
import { Check, AlertCircle, CalendarClock } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface MembershipPlanDisplayProps {
  currentPlan?: {
    name: string;
    startDate: string;
    endDate: string;
    features: string[];
    price: number;
    status: 'active' | 'expired' | 'pending';
    trainer?: string;
  };
}

const MembershipPlansDisplay: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newPlanName, setNewPlanName] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch plans from Supabase
  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('memberships')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError('Failed to fetch plans');
      setPlans([]);
    } else {
      // Parse features if stored as JSON string
      setPlans(
        (data || []).map(plan => ({
          ...plan,
          features: Array.isArray(plan.features)
            ? plan.features
            : (typeof plan.features === 'string' ? JSON.parse(plan.features) : [])
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // Create a new plan (demo: just name, you can expand fields)
  const handleCreatePlan = async () => {
    if (!newPlanName) return;
    setCreating(true);
    const { error } = await supabase.from('memberships').insert([
      {
        name: newPlanName,
        description: '',
        duration_days: 30,
        price: 0,
        features: JSON.stringify([]),
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        branch_id: null
      }
    ]);
    setCreating(false);
    if (error) {
      setError('Failed to create plan');
    } else {
      setNewPlanName('');
      fetchPlans();
    }
  };

  // Delete a plan
  const handleDeletePlan = async (id: string) => {
    const { error } = await supabase.from('memberships').delete().eq('id', id);
    if (error) {
      setError('Failed to delete plan');
    } else {
      fetchPlans();
    }
  };

  const navigate = useNavigate();
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
      default:
        return null;
    }
  };

  const handleRenewPlan = () => {
    navigate('/membership');
    toast.success("Redirecting to membership plans page");
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  const daysRemaining = currentPlan 
    ? Math.max(0, Math.ceil((new Date(currentPlan.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Membership Plans</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            className="border px-2 py-1 rounded"
            placeholder="New plan name"
            value={newPlanName}
            onChange={e => setNewPlanName(e.target.value)}
            disabled={creating}
          />
          <Button size="sm" onClick={handleCreatePlan} disabled={creating || !newPlanName}>
            Add Plan
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : plans.length === 0 ? (
          <div className="text-center py-8">No membership plans found.</div>
        ) : (
          <div className="space-y-4">
            {plans.map(plan => (
              <div key={plan.id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                  <div className="text-gray-500 text-sm mb-1">{plan.description}</div>
                  <div className="text-sm mb-1">Duration: {plan.duration_days} days</div>
                  <div className="text-lg font-bold mb-1">{formatPrice(plan.price)}</div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {(plan.features || []).map((f, i) => (
                      <Badge key={i} variant="outline">{f}</Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">Created: {format(new Date(plan.created_at), 'MMM d, yyyy')}</div>
                </div>
                <div className="flex flex-col gap-2 mt-3 md:mt-0 md:items-end">
                  <Badge className={plan.is_active ? 'bg-green-500' : 'bg-red-500'}>
                    {plan.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  <Button size="sm" variant="destructive" onClick={() => handleDeletePlan(plan.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MembershipPlansDisplay;
