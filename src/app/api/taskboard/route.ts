import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { startOfWeek, endOfWeek, parseISO, format } from 'date-fns';

// GET endpoint to fetch the current weekly task board
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const weekDateParam = searchParams.get('weekDate');
    
    // Calculate the week start and end dates
    const date = weekDateParam ? parseISO(weekDateParam) : new Date();
    const weekStartDate = startOfWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
    const weekEndDate = endOfWeek(date, { weekStartsOn: 1 }); // Week ends on Sunday

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find or create a task board for the current week
    let taskBoard = await prisma.taskBoard.findFirst({
      where: {
        userId: user.id,
        weekStartDate: {
          gte: weekStartDate,
          lte: weekStartDate, // Exactly the same day
        },
        weekEndDate: {
          gte: weekEndDate,
          lte: weekEndDate, // Exactly the same day
        },
      },
      include: {
        tasks: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    // If there's no task board for this week, create a new one
    if (!taskBoard) {
      taskBoard = await prisma.taskBoard.create({
        data: {
          userId: user.id,
          weekStartDate,
          weekEndDate,
        },
        include: {
          tasks: true,
        },
      });
    }

    // Format the week dates for display
    const formattedWeekStartDate = format(taskBoard.weekStartDate, 'MMM d, yyyy');
    const formattedWeekEndDate = format(taskBoard.weekEndDate, 'MMM d, yyyy');
    
    return NextResponse.json({
      ...taskBoard,
      formattedDateRange: `${formattedWeekStartDate} - ${formattedWeekEndDate}`,
    });
  } catch (error) {
    console.error('Error fetching task board:', error);
    return NextResponse.json(
      { error: 'Failed to fetch task board' },
      { status: 500 }
    );
  }
} 