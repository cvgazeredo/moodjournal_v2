import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface MoodEntry {
  date: Date;
  mood: {
    rating: number;
  };
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the start date from query params
    const { searchParams } = new URL(req.url);
    const start = searchParams.get('start');

    if (!start) {
      return NextResponse.json({ error: 'Start date is required' }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch mood entries
    const entries = await prisma.dailyEntry.findMany({
      where: {
        userId: user.id,
        date: {
          gte: new Date(start),
        },
      },
      orderBy: {
        date: 'asc',
      },
      select: {
        date: true,
        mood: {
          select: {
            rating: true,
          },
        },
      },
    });

    // Transform the data for the chart
    const moodData = entries.map((entry: MoodEntry) => ({
      date: entry.date,
      rating: entry.mood.rating,
    }));

    return NextResponse.json(moodData);
  } catch (error) {
    console.error('Error fetching mood statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mood statistics' },
      { status: 500 }
    );
  }
} 