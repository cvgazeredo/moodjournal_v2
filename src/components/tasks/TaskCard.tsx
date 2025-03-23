'use client';

import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { Task, getCategoryColor, getCategoryLabel } from '@/types/task';
import { Edit, Trash2, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface TaskCardProps {
  task: Task;
  onEdit: (id: string, title: string, description?: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set up drag
  const [{ isDragging }, drag] = useDrag({
    type: 'TASK',
    item: { id: task.id, status: task.status, index: task.order },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const categoryColor = getCategoryColor(task.category);
  const categoryLabel = getCategoryLabel(task.category);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Task title is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      await onEdit(task.id, title, description || undefined);
      setIsDialogOpen(false);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsSubmitting(true);
      await onDelete(task.id);
      setIsConfirmingDelete(false);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        ref={drag} 
        className={`mb-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}
        style={{ cursor: 'grab' }}
      >
        <Card className="shadow-sm hover:shadow transition-shadow">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-base line-clamp-2">{task.title}</CardTitle>
          </CardHeader>
          {task.description && (
            <CardContent className="p-3 pt-0 pb-0">
              <CardDescription className="text-sm line-clamp-3">
                {task.description}
              </CardDescription>
            </CardContent>
          )}
          <CardFooter className="p-3 pt-2 flex items-center justify-between">
            <div className={`px-2 py-1 rounded-md text-xs font-medium border ${categoryColor}`}>
              {categoryLabel}
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => setIsDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive hover:text-destructive/90"
                onClick={() => setIsConfirmingDelete(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to this task.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add more details to this task..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsConfirmingDelete(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 