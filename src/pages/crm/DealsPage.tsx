
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
import { Deal, dealService } from '@/services/dealService';
import { useParams } from 'react-router-dom';
import { formatCurrency } from '@/utils/stringUtils';

const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { branchId } = useParams<{ branchId?: string }>();

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        setIsLoading(true);
        const data = await dealService.getDeals(branchId);
        setDeals(data);
      } catch (error) {
        console.error('Error fetching deals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load deals.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeals();
  }, [toast, branchId]);
  
  const filteredDeals = deals.filter(deal => 
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.contact.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate pipeline metrics
  const totalPipelineValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const closedWonValue = filteredDeals
    .filter(deal => deal.stage === 'closed_won')
    .reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = filteredDeals.filter(deal => 
    deal.stage !== 'closed_won' && deal.stage !== 'closed_lost'
  ).length;
  
  // Calculate average win rate
  const wonDeals = filteredDeals.filter(deal => deal.stage === 'closed_won').length;
  const completedDeals = filteredDeals.filter(deal => 
    deal.stage === 'closed_won' || deal.stage === 'closed_lost'
  ).length;
  const winRate = completedDeals > 0 ? Math.round((wonDeals / completedDeals) * 100) : 0;
  
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
              <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
              <p className="text-xs text-muted-foreground">Total Pipeline Value</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{formatCurrency(closedWonValue)}</div>
              <p className="text-xs text-muted-foreground">Closed Won (30 days)</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{activeDeals}</div>
              <p className="text-xs text-muted-foreground">Active Deals</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{winRate}%</div>
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading deals...
                    </TableCell>
                  </TableRow>
                ) : filteredDeals.length > 0 ? (
                  filteredDeals.map((deal) => (
                    <TableRow key={deal.id}>
                      <TableCell className="font-medium">{deal.title}</TableCell>
                      <TableCell>{formatCurrency(deal.value)}</TableCell>
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
                  ))
                ) : (
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
