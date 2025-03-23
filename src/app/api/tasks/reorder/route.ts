import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { TaskStatus } from '@/types/task';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { taskId, sourceStatus, destinationStatus, sourceIndex, destinationIndex } = data;
    
    // Validate required fields
    if (!taskId || sourceStatus === undefined || destinationStatus === undefined || 
        sourceIndex === undefined || destinationIndex === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get the task and verify it belongs to the user
    const taskToMove = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        taskBoard: true,
      },
    });

    if (!taskToMove) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (taskToMove.taskBoard.userId !== user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Begin transaction for reordering
    await prisma.$transaction(async (tx) => {
      // Moving within the same column
      if (sourceStatus === destinationStatus) {
        if (sourceIndex < destinationIndex) {
          // Moving down
          // Decrement tasks between source+1 and destination
          await tx.task.updateMany({
            where: {
              taskBoardId: taskToMove.taskBoardId,
              status: sourceStatus as TaskStatus,
              order: {
                gt: sourceIndex,
                lte: destinationIndex,
              },
            },
            data: {
              order: {
                decrement: 1,
              },
            },
          });
        } else if (sourceIndex > destinationIndex) {
          // Moving up
          // Increment tasks between destination and source-1
          await tx.task.updateMany({
            where: {
              taskBoardId: taskToMove.taskBoardId,
              status: sourceStatus as TaskStatus,
              order: {
                gte: destinationIndex,
                lt: sourceIndex,
              },
            },
            data: {
              order: {
                increment: 1,
              },
            },
          });
        }
      } else {
        // Moving between columns
        // Decrement tasks in source column after sourceIndex
        await tx.task.updateMany({
          where: {
            taskBoardId: taskToMove.taskBoardId,
            status: sourceStatus as TaskStatus,
            order: {
              gt: sourceIndex,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        });

        // Increment tasks in destination column at and after destinationIndex
        await tx.task.updateMany({
          where: {
            taskBoardId: taskToMove.taskBoardId,
            status: destinationStatus as TaskStatus,
            order: {
              gte: destinationIndex,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });
      }

      // Update the moved task's status and order
      await tx.task.update({
        where: { id: taskId },
        data: {
          status: destinationStatus as TaskStatus,
          order: destinationIndex,
        },
      });
    });

    // Get all tasks from the board after reordering
    const updatedTasks = await prisma.task.findMany({
      where: {
        taskBoardId: taskToMove.taskBoardId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json({ success: true, tasks: updatedTasks });
  } catch (error) {
    console.error('Error reordering tasks:', error);
    return NextResponse.json(
      { error: 'Failed to reorder tasks' },
      { status: 500 }
    );
  }
} 