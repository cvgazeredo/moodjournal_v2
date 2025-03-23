import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, PlusCircle, Loader2 } from 'lucide-react';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format } from 'date-fns';
import { TaskCategory, TaskStatus } from '@/types/task';
import { TaskColumn } from './TaskColumn';
import { NewTaskForm } from './NewTaskForm';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORY_OPTIONS } from '@/types/task';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  category: TaskCategory;
  order: number;
  taskBoardId: string;
  createdAt: Date;
  updatedAt: Date;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [taskBoardId, setTaskBoardId] = useState<string>('');
  const [weekDate, setWeekDate] = useState<Date>(new Date());
  const [formattedDateRange, setFormattedDateRange] = useState<string>('');
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter tasks by status
  const todoTasks = tasks.filter((task) => task.status === 'TODO');
  const inProgressTasks = tasks.filter((task) => task.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((task) => task.status === 'DONE');

  // Fetch task board and tasks
  const fetchTaskBoard = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/taskboard?weekDate=${weekDate.toISOString()}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch task board');
      }

      const data = await response.json();
      setTaskBoardId(data.id);
      setTasks(data.tasks || []);
      setFormattedDateRange(data.formattedDateRange || '');
    } catch (error) {
      console.error('Error fetching task board:', error);
      toast.error('Failed to load tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle week navigation
  const goToPreviousWeek = () => {
    setWeekDate(subWeeks(weekDate, 1));
  };

  const goToNextWeek = () => {
    setWeekDate(addWeeks(weekDate, 1));
  };

  const goToCurrentWeek = () => {
    setWeekDate(new Date());
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('');
  };

  // Handle task creation
  const handleTaskCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }

    if (!category) {
      toast.error('Task category is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskBoardId,
          title,
          description,
          category,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, newTask]);
      
      setIsTaskFormOpen(false);
      resetForm();
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle task edit
  const handleTaskEdit = async (id: string, title: string, description?: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      const updatedTask = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === id ? updatedTask : task))
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  // Handle task delete
  const handleTaskDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  // Handle task drop
  const handleTaskDrop = async (
    taskId: string,
    sourceStatus: TaskStatus,
    destinationStatus: TaskStatus,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    // Optimistic update
    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex((t) => t.id === taskId);
    
    if (taskIndex === -1) return;
    
    const taskToMove = { ...updatedTasks[taskIndex] };
    
    // Remove task from its current position
    updatedTasks.splice(taskIndex, 1);
    
    // Update status and order
    taskToMove.status = destinationStatus;
    
    // Insert at new position
    updatedTasks.splice(
      updatedTasks.findIndex((t) => t.status === destinationStatus && t.order >= destinationIndex) !== -1
        ? updatedTasks.findIndex((t) => t.status === destinationStatus && t.order >= destinationIndex)
        : updatedTasks.length,
      0,
      taskToMove
    );
    
    // Update local state
    setTasks(updatedTasks);
    
    try {
      // Send update to server
      const response = await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId,
          sourceStatus,
          destinationStatus,
          sourceIndex,
          destinationIndex,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reorder task');
      }
      
      // Update with server response to ensure consistency
      const result = await response.json();
      if (result.tasks) {
        setTasks(result.tasks);
      }
    } catch (error) {
      console.error('Error reordering task:', error);
      toast.error('Failed to update task position');
      // Revert optimistic update on error
      fetchTaskBoard();
    }
  };

  // Load task board data when week date changes
  useEffect(() => {
    fetchTaskBoard();
  }, [weekDate]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <h1 className="text-2xl font-bold">Weekly Task Board</h1>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPreviousWeek}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" onClick={goToCurrentWeek}>
              Current Week
            </Button>
            
            <div className="px-3 py-1 border rounded-md min-w-40 text-center">
              {isLoading ? 'Loading...' : formattedDateRange}
            </div>
            
            <Button variant="outline" size="sm" onClick={goToNextWeek}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex">
          <Dialog open={isTaskFormOpen} onOpenChange={setIsTaskFormOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Task</DialogTitle>
                <DialogDescription>
                  Add a new task to your weekly to-do list.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTaskCreate}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Task Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a clear and concise title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                      id="description"
                      placeholder="Add more details to your task..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={category}
                      onValueChange={(value) => setCategory(value as TaskCategory)}
                      required
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsTaskFormOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating...' : 'Create Task'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        </div>
        
        {/* Add New Task Button */}
        
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <span className="ml-2 text-lg text-muted-foreground">Loading tasks...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskColumn
              status="TODO"
              tasks={todoTasks}
              onTaskDrop={handleTaskDrop}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
            <TaskColumn
              status="IN_PROGRESS"
              tasks={inProgressTasks}
              onTaskDrop={handleTaskDrop}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
            <TaskColumn
              status="DONE"
              tasks={doneTasks}
              onTaskDrop={handleTaskDrop}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDelete}
            />
          </div>
        )}
      </div>
    </DndProvider>
  );
};

export default TaskBoard;