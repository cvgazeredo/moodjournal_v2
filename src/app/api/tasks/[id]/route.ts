import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { TaskCategory, TaskStatus } from '@/types/task';

// Helper to verify user's permission for a task
async function verifyUserPermission(taskId: string, userEmail: string) {
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user) {
    return { error: 'User not found', status: 404, user: null };
  }

  // Find the task and verify it belongs to the user
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      taskBoard: true,
    },
  });

  if (!task) {
    return { error: 'Task not found', status: 404, user, task: null };
  }

  if (task.taskBoard.userId !== user.id) {
    return { error: 'Access denied', status: 403, user, task: null };
  }

  return { error: null, status: 200, user, task };
}

// GET endpoint to fetch a specific task
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = params.id;
    
    const { error, status, task } = await verifyUserPermission(taskId, session.user.email);
    
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}

// PUT endpoint to update a task
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = params.id;
    const data = await req.json();
    const { title, description, status, category, order } = data;
    
    const { error, status: errorStatus } = await verifyUserPermission(taskId, session.user.email);
    
    if (error) {
      return NextResponse.json({ error }, { status: errorStatus });
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status: status as TaskStatus }),
        ...(category && { category: category as TaskCategory }),
        ...(order !== undefined && { order }),
      },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a task
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const taskId = params.id;
    
    const { error, status: errorStatus, task } = await verifyUserPermission(taskId, session.user.email);
    
    if (error) {
      return NextResponse.json({ error }, { status: errorStatus });
    }

    // Delete the task
    await prisma.task.delete({
      where: { id: taskId },
    });

    // Reorder remaining tasks in the same column
    if (task) {
      const tasksInSameColumn = await prisma.task.findMany({
        where: {
          taskBoardId: task.taskBoardId,
          status: task.status,
          order: {
            gt: task.order,
          },
        },
        orderBy: {
          order: 'asc',
        },
      });

      // Update the order of remaining tasks
      for (const taskToUpdate of tasksInSameColumn) {
        await prisma.task.update({
          where: { id: taskToUpdate.id },
          data: {
            order: taskToUpdate.order - 1,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 