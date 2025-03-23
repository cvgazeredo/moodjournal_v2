import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { TaskCategory, TaskStatus } from '@/types/task';

// GET endpoint to fetch all tasks for a specific task board
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the task board ID from query parameters
    const { searchParams } = new URL(req.url);
    const taskBoardId = searchParams.get('taskBoardId');
    
    if (!taskBoardId) {
      return NextResponse.json({ error: 'Task board ID is required' }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify that the task board belongs to the user
    const taskBoard = await prisma.taskBoard.findFirst({
      where: {
        id: taskBoardId,
        userId: user.id,
      },
    });

    if (!taskBoard) {
      return NextResponse.json({ error: 'Task board not found or access denied' }, { status: 404 });
    }

    // Fetch all tasks for the task board
    const tasks = await prisma.task.findMany({
      where: {
        taskBoardId,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new task
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { taskBoardId, title, description, category } = data;
    
    // Validate required fields
    if (!taskBoardId) {
      return NextResponse.json({ error: 'Task board ID is required' }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: 'Task title is required' }, { status: 400 });
    }

    if (!category) {
      return NextResponse.json({ error: 'Task category is required' }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify that the task board belongs to the user
    const taskBoard = await prisma.taskBoard.findFirst({
      where: {
        id: taskBoardId,
        userId: user.id,
      },
    });

    if (!taskBoard) {
      return NextResponse.json({ error: 'Task board not found or access denied' }, { status: 404 });
    }

    // Count existing tasks with the same status to determine the new task's order
    const existingTasksCount = await prisma.task.count({
      where: {
        taskBoardId,
        status: 'TODO',
      },
    });

    // Create the new task
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        category: category as TaskCategory,
        status: 'TODO' as TaskStatus,
        order: existingTasksCount,
        taskBoardId,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    );
  }
} 