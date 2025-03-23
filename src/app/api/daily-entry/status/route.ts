import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters for date range
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');
    const end = searchParams.get('end');

    if (!start || !end) {
      return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if an entry exists for the given date range
    const entry = await prisma.dailyEntry.findFirst({
      where: {
        userId: user.id,
        date: {
          gte: new Date(start),
          lte: new Date(end),
        },
      },
      include: {
        mood: true,
        sleep: true,
        exercise: true,
        diet: true,
      },
    });

    if (!entry) {
      return NextResponse.json({ status: 'none' });
    }

    // Check if all sections are completed
    // This logic can be adjusted based on your requirements for what constitutes a "completed" entry
    const allSectionsCompleted = 
      !!entry.mood && 
      (!!entry.sleep || entry.sleepId === null) && 
      (!!entry.exercise || entry.exerciseId === null) && 
      (!!entry.diet || entry.dietId === null);

    return NextResponse.json({
      status: allSectionsCompleted ? 'completed' : 'started',
      entryId: entry.id
    });
  } catch (error) {
    console.error('Error checking entry status:', error);
    return NextResponse.json(
      { error: 'Failed to check entry status' },
      { status: 500 }
    );
  }
} 