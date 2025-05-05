
import React, { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@/components/ui/breadcrumb';
import { ChevronRight, DollarSign, Plus, BarChart3, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const dealsData = [
  { 
    id: '1', 
    name: 'Elite Fitness Package', 
    client: 'Rohit Sharma', 
    value: 24000, 
    stage: 'proposal', 
    progress: 60,
    closing_date: '2023-06-30'
  },
  { 
    id: '2', 
    name: 'Corporate Team Plan', 
    client: 'Sundar Tech', 
    value: 150000, 
    stage: 'negotiation', 
    progress: 80,
    closing_date: '2023-06-15'
  },
  { 
    id: '3', 
    name: 'Personal Training Bundle', 
    client: 'Priya Patel', 
    value: 35000, 
    stage: 'discovery', 
    progress: 30,
    closing_date: '2023-07-15'
  },
  { 
    id: '4', 
    name: 'Two-Year Membership', 
    client: 'Vikram Singh', 
    value: 48000, 
    stage: 'closed_won', 
    progress: 100,
    closing_date: '2023-05-20'
  },
  { 
    id: '5', 
    name: 'Yearly Premium Package', 
    client: 'Kavita Desai', 
    value: 60000, 
    stage: 'closed_lost', 
    progress: 100,
    closing_date: '2023-05-10'
  },
];

const DealsPage = () => {
  const [filter, setFilter] = useState('all');

  const getStageColor = (stage: string) => {
    switch(stage) {
      case 'discovery': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-amber-100 text-amber-800';
      case 'negotiation': return 'bg-purple-100 text-purple-800';
      case 'closed_won': return 'bg-green-100 text-green-800';
      case 'closed_lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageText = (stage: string) => {
    switch(stage) {
      case 'discovery': return 'Discovery';
      case 'proposal': return 'Proposal';
      case 'negotiation': return 'Negotiation';
      case 'closed_won': return 'Closed Won';
      case 'closed_lost': return 'Closed Lost';
      default: return stage;
    }
  };

  const filteredDeals = filter === 'all' 
    ? dealsData 
    : dealsData.filter(deal => deal.stage === filter);

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const wonValue = filteredDeals
    .filter(deal => deal.stage === 'closed_won')
    .reduce((sum, deal) => sum + deal.value, 0);

  return (
    <Container>
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

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Deals Pipeline</h1>
          <p className="text-muted-foreground">Manage your sales opportunities and track deals</p>
        </div>
        <Button className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create Deal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Deal Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From {filteredDeals.length} active deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Closed Won Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{wonValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">From {filteredDeals.filter(d => d.stage === 'closed_won').length} won deals</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dealsData.length ? Math.round((dealsData.filter(d => d.stage === 'closed_won').length / dealsData.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Based on total deals</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                <span>Deal Pipeline</span>
              </CardTitle>
              <CardDescription>
                View and manage your deals at different stages
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stages</SelectItem>
                    <SelectItem value="discovery">Discovery</SelectItem>
                    <SelectItem value="proposal">Proposal</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="closed_won">Closed Won</SelectItem>
                    <SelectItem value="closed_lost">Closed Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Deal Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Closing Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDeals.map(deal => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.name}</TableCell>
                  <TableCell>{deal.client}</TableCell>
                  <TableCell className="text-right">₹{deal.value.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStageColor(deal.stage)}>
                      {getStageText(deal.stage)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={deal.progress} className="h-2" />
                      <span className="text-xs">{deal.progress}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(deal.closing_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {filteredDeals.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No deals found matching the selected filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredDeals.length} of {dealsData.length} deals
          </p>
          <Button variant="outline" size="sm" disabled>
            Export
          </Button>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default DealsPage;
