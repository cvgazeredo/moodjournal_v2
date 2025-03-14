import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { DailyEntryData } from '@/types/daily-entry';
import { Prisma, PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = (await req.json()) as DailyEntryData;
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Create the entry in a transaction
    const dailyEntry = await prisma.$transaction(async (tx: Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => {
      // Create Mood (always required)
      const mood = await tx.mood.create({
        data: {
          rating: data.mood.rating,
          notes: data.mood.notes || null,
        },
      });

      // Create empty records for required relations if they're null
      const sleep = data.sleep ? await tx.sleep.create({
        data: {
          hours: data.sleep.hours,
          quality: data.sleep.quality,
        },
      }) : await tx.sleep.create({
        data: {
          hours: 0,
          quality: 0,
        },
      });

      const exercise = data.exercise ? await tx.exercise.create({
        data: {
          didExercise: data.exercise.didExercise,
          type: data.exercise.type,
          duration: data.exercise.duration,
        },
      }) : await tx.exercise.create({
        data: {
          didExercise: "no",
          type: null,
          duration: null,
        },
      });

      const diet = data.diet ? await tx.diet.create({
        data: {
          rating: data.diet.rating,
          foodChoices: data.diet.foodChoices,
          waterIntake: data.diet.waterIntake,
        },
      }) : await tx.diet.create({
        data: {
          rating: 0,
          foodChoices: [],
          waterIntake: "less-than-1l",
        },
      });

      // Create the daily entry with all required relations
      const entry = await tx.dailyEntry.create({
        data: {
          user: {
            connect: {
              id: user.id
            }
          },
          date: data.date,
          mood: {
            connect: {
              id: mood.id
            }
          },
          sleep: {
            connect: {
              id: sleep.id
            }
          },
          exercise: {
            connect: {
              id: exercise.id
            }
          },
          diet: {
            connect: {
              id: diet.id
            }
          }
        },
        include: {
          mood: true,
          sleep: true,
          exercise: true,
          diet: true,
        },
      });

      return entry;
    });

    return NextResponse.json(dailyEntry);
  } catch (error) {
    console.error('Error creating daily entry:', error);
    return NextResponse.json(
      { error: 'Failed to create daily entry' },
      { status: 500 }
    );
  }
} 