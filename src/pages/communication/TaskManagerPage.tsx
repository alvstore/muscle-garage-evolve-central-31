
import React from 'react';
import { Container } from '@/components/ui/container';
import TaskManagement from '@/components/communication/TaskManagement';

export default function TaskManagerPage() {
  return (
    <Container>
      <div className="py-6">
        <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
        <TaskManagement />
      </div>
    </Container>
  );
}
