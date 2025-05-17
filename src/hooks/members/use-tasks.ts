
import { useState, useEffect } from 'react';
import { useBranch } from './use-branches';
import { taskService, Task } from '@/services/taskService';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentBranch } = useBranch();

  const fetchTasks = async () => {
    if (!currentBranch?.id) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await taskService.getTasks(currentBranch.id);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!currentBranch?.id) {
      throw new Error('No branch selected');
    }
    
    const taskWithBranch = {
      ...task,
      branch_id: currentBranch.id
    };
    
    const newTask = await taskService.createTask(taskWithBranch);
    if (newTask) {
      setTasks(prev => [newTask, ...prev]);
    }
    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const updatedTask = await taskService.updateTask(id, updates);
    if (updatedTask) {
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
    }
    return updatedTask;
  };

  const deleteTask = async (id: string) => {
    const success = await taskService.deleteTask(id);
    if (success) {
      setTasks(prev => prev.filter(task => task.id !== id));
    }
    return success;
  };

  useEffect(() => {
    fetchTasks();
  }, [currentBranch?.id]);

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask
  };
};
