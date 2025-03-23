import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

interface MoodSleepEntry {
  date: Date;
  mood: {
    rating: number;
  };
  sleep: {
    hours: number;
    quality: number;
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

    // Fetch daily entries with mood and sleep data
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
        sleep: {
          select: {
            hours: true,
            quality: true,
          },
        },
      },
    });

    // Transform the data for the chart
    const moodSleepData = entries.map((entry: MoodSleepEntry) => ({
      date: format(new Date(entry.date), 'MMM dd'),
      mood: entry.mood.rating,
      sleepHours: entry.sleep.hours,
      sleepQuality: entry.sleep.quality,
    }));

    return NextResponse.json(moodSleepData);
  } catch (error) {
    console.error('Error fetching mood-sleep statistics:', error);
    
    // Provide sample data if there's an error or no data
    if (process.env.NODE_ENV === 'development') {
      const now = new Date();
      const sampleData = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        
        // Generate correlated data
        const sleepQuality = 1 + Math.floor(Math.random() * 5);
        const baseMood = sleepQuality + Math.floor(Math.random() * 3) - 1;
        const mood = Math.max(1, Math.min(10, baseMood * 1.5));
        
        return {
          date: format(date, 'MMM dd'),
          mood,
          sleepHours: 5 + Math.floor(Math.random() * 4),
          sleepQuality,
        };
      });
      
      return NextResponse.json(sampleData);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch mood-sleep statistics' },
      { status: 500 }
    );
  }
}

function format(date: Date, formatString: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate().toString().padStart(2, '0');
  const month = months[date.getMonth()];
  
  return formatString.replace('MMM', month).replace('dd', day);
} 