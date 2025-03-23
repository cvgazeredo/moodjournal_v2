// Task status types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

// Task category types
export type TaskCategory = 'WELLNESS_SELFCARE' | 'SOCIAL_RELATIONSHIPS' | 'PRODUCTIVITY_ORGANIZATION';

// Category options for display in forms
export const CATEGORY_OPTIONS = [
  { value: 'WELLNESS_SELFCARE', label: 'Wellness & Self-care' },
  { value: 'SOCIAL_RELATIONSHIPS', label: 'Social & Relationships' },
  { value: 'PRODUCTIVITY_ORGANIZATION', label: 'Productivity & Organization' },
];

// Task interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  category: TaskCategory;
  taskBoardId: string;
  createdAt: Date;
  updatedAt?: Date;
}

// TaskBoard interface
export interface TaskBoard {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt?: Date;
}

// Task Column type for organizing tasks by status
export interface TaskColumn {
  id: TaskStatus;
  title: string;
  taskIds: string[];
}

// Task form data
export interface TaskFormData {
  title: string;
  description?: string;
  category: TaskCategory;
}

// Task drop result for drag and drop
export interface TaskDropResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  draggableId: string;
}

// Helper functions for task categories
export const getCategoryLabel = (category: TaskCategory): string => {
  switch (category) {
    case 'WELLNESS_SELFCARE':
      return 'Wellness & Self-Care';
    case 'SOCIAL_RELATIONSHIPS':
      return 'Social & Relationships';
    case 'PRODUCTIVITY_ORGANIZATION':
      return 'Productivity & Organization';
    default:
      return '';
  }
};

export const getCategoryColor = (category: TaskCategory): string => {
  switch (category) {
    case 'WELLNESS_SELFCARE':
      return 'bg-green-500 text-white border-none';
    case 'SOCIAL_RELATIONSHIPS':
      return 'bg-blue-500 text-white border-none';
    case 'PRODUCTIVITY_ORGANIZATION':
      return 'bg-purple-500 text-white border-none';
    default:
      return 'bg-gray-500 text-white border-none';
  }
};

export const COLUMN_TITLES: Record<TaskStatus, string> = {
  'TODO': 'To Do',
  'IN_PROGRESS': 'In Progress',
  'DONE': 'Done'
};
