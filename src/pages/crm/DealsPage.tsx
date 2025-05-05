
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Plus, Search, Filter, ChevronDown } from 'lucide-react';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

interface Deal {
  id: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  contact: string;
  closing_date?: string;
  created_at: string;
}

const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Mock data loading
    const mockDeals: Deal[] = [
      {
        id: '1',
        title: 'Corporate Membership Package',
        value: 50000,
        stage: 'proposal',
        probability: 60,
        contact: 'TechX Corp',
        closing_date: '2023-06-30',
        created_at: '2023-05-15',
      },
      {
        id: '2',
        title: 'Premium Family Package',
        value: 12000,
        stage: 'negotiation',
        probability: 85,
        contact: 'Sharma Family',
        closing_date: '2023-06-15',
        created_at: '2023-05-10',
      },
      {
        id: '3',
        title: 'Group Training Sessions',
        value: 25000,
        stage: 'discovery',
        probability: 30,
        contact: 'AcmeFit Inc',
        closing_date: '2023-07-15',
        created_at: '2023-05-20',
      },
      {
        id: '4',
        title: 'Annual VIP Subscription',
        value: 40000,
        stage: 'closed_won',
        probability: 100,
        contact: 'Elite Sports Club',
        closing_date: '2023-05-05',
        created_at: '2023-04-15',
      }
    ];
    
    setDeals(mockDeals);
    
    toast({
      title: 'Coming Soon',
      description: 'Deal management will be connected to real data in an upcoming update.',
    });
  }, [toast]);
  
  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'discovery':
        return <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">Discovery</Badge>;
      case 'proposal':
        return <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">Proposal</Badge>;
      case 'negotiation':
        return <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700">Negotiation</Badge>;
      case 'closed_won':
        return <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">Closed Won</Badge>;
      case 'closed_lost':
        return <Badge variant="outline" className="bg-red-50 border-red-200 text-red-700">Closed Lost</Badge>;
      default:
        return <Badge variant="outline">{stage}</Badge>;
    }
  };
  
  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return "bg-green-600";
    if (probability >= 40) return "bg-amber-500";
    return "bg-red-500";
  };
  
  return (
    <Container>
      <div className="py-6">
        <Breadcrumb className="mb-4">
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/crm">CRM</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="/crm/deals" isCurrentPage>Deals</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Deals</h1>
            <p className="text-muted-foreground">
              Track and manage your sales opportunities
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Deal
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">₹127,000</div>
              <p className="text-xs text-muted-foreground">Total Pipeline Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">₹40,000</div>
              <p className="text-xs text-muted-foreground">Closed Won (30 days)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">Active Deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">45%</div>
              <p className="text-xs text-muted-foreground">Avg. Win Rate</p>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div>
                <CardTitle>Deal Pipeline</CardTitle>
                <CardDescription>View and manage your sales pipeline</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search deals..."
                    className="pl-8 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deal Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Closing Date</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.map((deal) => (
                  <TableRow key={deal.id}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>₹{deal.value.toLocaleString()}</TableCell>
                    <TableCell>{getStageBadge(deal.stage)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={deal.probability} 
                          className={`h-2 ${getProbabilityColor(deal.probability)}`} 
                        />
                        <span className="text-xs">{deal.probability}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{deal.contact}</TableCell>
                    <TableCell>{deal.closing_date && new Date(deal.closing_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <span className="sr-only">Open menu</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Edit Deal</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Mark as Won</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Lost</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDeals.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      {searchQuery ? 'No deals match your search.' : 'No deals found.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};

export default DealsPage;
