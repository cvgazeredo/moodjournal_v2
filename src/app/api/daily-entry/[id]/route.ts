import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';
import { DailyEntryData } from '@/types/daily-entry';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entryId = params.id;
    
    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find the entry by ID and ensure it belongs to the current user
    const entry = await prisma.dailyEntry.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
      include: {
        mood: true,
        sleep: true,
        exercise: true,
        diet: true,
      },
    });

    if (!entry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Format the data to match the expected DailyEntryData structure
    const formattedEntry = {
      mood: entry.mood ? {
        rating: entry.mood.rating,
        notes: entry.mood.notes || "",
      } : null,
      sleep: entry.sleep ? {
        hours: entry.sleep.hours,
        quality: entry.sleep.quality,
      } : null,
      exercise: entry.exercise ? {
        didExercise: entry.exercise.didExercise,
        type: entry.exercise.type || undefined,
        duration: entry.exercise.duration || undefined,
      } : null,
      diet: entry.diet ? {
        rating: entry.diet.rating,
        foodChoices: entry.diet.foodChoices,
        waterIntake: entry.diet.waterIntake,
      } : null,
      date: entry.date,
      id: entry.id,
    };

    return NextResponse.json(formattedEntry);
  } catch (error) {
    console.error('Error fetching daily entry:', error);
    return NextResponse.json(
      { error: 'Failed to fetch daily entry' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entryId = params.id;
    
    if (!entryId) {
      return NextResponse.json({ error: 'Entry ID is required' }, { status: 400 });
    }

    const data = (await req.json()) as DailyEntryData;
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify the entry exists and belongs to the user
    const existingEntry = await prisma.dailyEntry.findFirst({
      where: {
        id: entryId,
        userId: user.id,
      },
      include: {
        mood: true,
        sleep: true,
        exercise: true,
        diet: true,
      },
    });

    if (!existingEntry) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Update the entry in a transaction
    const updatedEntry = await prisma.$transaction(async (tx) => {
      // Update mood (always required)
      await tx.mood.update({
        where: { id: existingEntry.moodId },
        data: {
          rating: data.mood.rating,
          notes: data.mood.notes || null,
        },
      });

      // Handle sleep data
      if (data.sleep) {
        if (existingEntry.sleepId) {
          // Update existing sleep record
          await tx.sleep.update({
            where: { id: existingEntry.sleepId },
            data: {
              hours: data.sleep.hours,
              quality: data.sleep.quality,
            },
          });
        } else {
          // Create new sleep record and connect it
          const sleep = await tx.sleep.create({
            data: {
              hours: data.sleep.hours,
              quality: data.sleep.quality,
            },
          });
          
          await tx.dailyEntry.update({
            where: { id: entryId },
            data: {
              sleep: { connect: { id: sleep.id } },
            },
          });
        }
      } else if (existingEntry.sleepId) {
        // Disconnect sleep if it exists but is now null
        await tx.dailyEntry.update({
          where: { id: entryId },
          data: {
            sleep: { disconnect: true },
          },
        });
      }

      // Handle exercise data
      if (data.exercise) {
        if (existingEntry.exerciseId) {
          // Update existing exercise record
          await tx.exercise.update({
            where: { id: existingEntry.exerciseId },
            data: {
              didExercise: data.exercise.didExercise,
              type: data.exercise.type,
              duration: data.exercise.duration,
            },
          });
        } else {
          // Create new exercise record and connect it
          const exercise = await tx.exercise.create({
            data: {
              didExercise: data.exercise.didExercise,
              type: data.exercise.type,
              duration: data.exercise.duration,
            },
          });
          
          await tx.dailyEntry.update({
            where: { id: entryId },
            data: {
              exercise: { connect: { id: exercise.id } },
            },
          });
        }
      } else if (existingEntry.exerciseId) {
        // Disconnect exercise if it exists but is now null
        await tx.dailyEntry.update({
          where: { id: entryId },
          data: {
            exercise: { disconnect: true },
          },
        });
      }

      // Handle diet data
      if (data.diet) {
        if (existingEntry.dietId) {
          // Update existing diet record
          await tx.diet.update({
            where: { id: existingEntry.dietId },
            data: {
              rating: data.diet.rating,
              foodChoices: data.diet.foodChoices,
              waterIntake: data.diet.waterIntake,
            },
          });
        } else {
          // Create new diet record and connect it
          const diet = await tx.diet.create({
            data: {
              rating: data.diet.rating,
              foodChoices: data.diet.foodChoices,
              waterIntake: data.diet.waterIntake,
            },
          });
          
          await tx.dailyEntry.update({
            where: { id: entryId },
            data: {
              diet: { connect: { id: diet.id } },
            },
          });
        }
      } else if (existingEntry.dietId) {
        // Disconnect diet if it exists but is now null
        await tx.dailyEntry.update({
          where: { id: entryId },
          data: {
            diet: { disconnect: true },
          },
        });
      }

      // Get the updated entry
      return tx.dailyEntry.findUnique({
        where: { id: entryId },
        include: {
          mood: true,
          sleep: true,
          exercise: true,
          diet: true,
        },
      });
    });

    return NextResponse.json(updatedEntry);
  } catch (error) {
    console.error('Error updating daily entry:', error);
    return NextResponse.json(
      { error: 'Failed to update daily entry' },
      { status: 500 }
    );
  }
} 