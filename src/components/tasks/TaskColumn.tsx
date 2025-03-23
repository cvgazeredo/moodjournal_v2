'use client';

import { useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Task, TaskStatus, COLUMN_TITLES } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Loader2 } from 'lucide-react';

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskDrop: (
    taskId: string, 
    sourceStatus: TaskStatus, 
    destinationStatus: TaskStatus, 
    sourceIndex: number, 
    destinationIndex: number
  ) => Promise<void>;
  onTaskEdit: (id: string, title: string, description?: string) => Promise<void>;
  onTaskDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}

export function TaskColumn({ 
  status, 
  tasks, 
  onTaskDrop, 
  onTaskEdit, 
  onTaskDelete,
  isLoading = false 
}: TaskColumnProps) {
  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  const columnRef = useRef<HTMLDivElement>(null);

  // Set up drop
  const [{ isOver }, drop] = useDrop({
    accept: 'TASK',
    drop: () => ({ status }),
    hover: (item: { id: string; status: TaskStatus; index: number }, monitor) => {
      if (!columnRef.current) {
        return;
      }

      const draggedItemStatus = item.status;
      const draggedItemIndex = item.index;

      // Don't replace items with themselves
      if (draggedItemStatus === status && draggedItemIndex === tasks.length) {
        return;
      }

      // Only perform the move when the mouse is close to the bottom half
      // of the target column
      const hoverBoundingRect = columnRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset ? clientOffset.y - hoverBoundingRect.top : 0;

      // If we're dragging to a new column, always place at the end
      if (draggedItemStatus !== status) {
        onTaskDrop(
          item.id,
          draggedItemStatus,
          status,
          draggedItemIndex,
          tasks.length
        );
        item.status = status;
        item.index = tasks.length;
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div 
      ref={(node) => {
        // Connect both refs so we can access columnRef in the hover method
        columnRef.current = node;
        drop(node);
      }}
      className={`bg-gray-100 dark:bg-gray-800 rounded-lg min-h-[400px] max-h-[700px] overflow-y-auto p-3 shadow-inner ${
        isOver ? 'bg-gray-200 dark:bg-gray-700' : ''
      }`}
    >
      <h3 className="text-lg font-medium mb-4 sticky top-0 bg-inherit px-2 py-1 z-10">
        {COLUMN_TITLES[status]}
        <span className="ml-2 inline-block px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-xs rounded-full">
          {tasks.length}
        </span>
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {sortedTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
            />
          ))}
        </>
      )}
    </div>
  );
} 