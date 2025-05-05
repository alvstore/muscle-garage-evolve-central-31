
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from "@/components/ui/badge";

interface Trainer {
  name: string;
  avatar?: string;
  sessionsCompleted: number;
  clientSatisfaction: number;
  status: 'excellent' | 'good' | 'average';
}

const trainers: Trainer[] = [
  {
    name: "Sarah Johnson",
    avatar: "/trainer-1.jpg",
    sessionsCompleted: 48,
    clientSatisfaction: 98,
    status: "excellent"
  },
  {
    name: "Mike Peterson",
    avatar: "/trainer-2.jpg",
    sessionsCompleted: 36,
    clientSatisfaction: 92,
    status: "good"
  },
  {
    name: "Alex Rivera",
    avatar: "/trainer-3.jpg",
    sessionsCompleted: 42,
    clientSatisfaction: 95,
    status: "excellent"
  },
  {
    name: "Taylor Wong",
    avatar: "/trainer-4.jpg",
    sessionsCompleted: 29,
    clientSatisfaction: 88,
    status: "average"
  }
];

const TrainerPerformanceTable: React.FC = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Trainer</TableHead>
          <TableHead className="text-right">Sessions</TableHead>
          <TableHead className="text-right">Satisfaction</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trainers.map((trainer) => (
          <TableRow key={trainer.name}>
            <TableCell className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={trainer.avatar} alt={trainer.name} />
                <AvatarFallback>{trainer.name[0]}</AvatarFallback>
              </Avatar>
              {trainer.name}
            </TableCell>
            <TableCell className="text-right">{trainer.sessionsCompleted}</TableCell>
            <TableCell className="text-right">{trainer.clientSatisfaction}%</TableCell>
            <TableCell className="text-right">
              <Badge 
                variant="outline"
                className={
                  trainer.status === "excellent" ? "bg-green-50 text-green-600 border-green-200" :
                  trainer.status === "good" ? "bg-blue-50 text-blue-600 border-blue-200" :
                  "bg-amber-50 text-amber-600 border-amber-200"
                }
              >
                {trainer.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TrainerPerformanceTable;
