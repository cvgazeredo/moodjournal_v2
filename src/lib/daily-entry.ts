import { startOfDay, endOfDay } from 'date-fns';
import { DailyEntryData } from '@/types/daily-entry';

/**
 * Checks if the user has already created a daily entry for today
 * @returns Promise with {exists: boolean, entryId?: string}
 */
export async function checkTodayEntry(): Promise<{ exists: boolean; entryId?: string }> {
  try {
    const today = new Date();
    const start = startOfDay(today).toISOString();
    const end = endOfDay(today).toISOString();
    
    // Call the API to check if an entry exists for today
    const response = await fetch(`/api/daily-entry/check?start=${start}&end=${end}`);
    
    if (!response.ok) {
      throw new Error('Failed to check today\'s entry');
    }
    
    const data = await response.json();
    
    return {
      exists: data.exists,
      entryId: data.entryId
    };
  } catch (error) {
    console.error('Error checking today\'s entry:', error);
    return { exists: false };
  }
}

/**
 * Gets the status of today's entry
 * @returns String indicating the status: 'none', 'started', or 'completed'
 */
export async function getTodayEntryStatus(): Promise<'none' | 'started' | 'completed'> {
  try {
    const today = new Date();
    const start = startOfDay(today).toISOString();
    const end = endOfDay(today).toISOString();
    
    // Call the API to check entry status
    const response = await fetch(`/api/daily-entry/status?start=${start}&end=${end}`);
    
    if (!response.ok) {
      throw new Error('Failed to check entry status');
    }
    
    const data = await response.json();
    
    return data.status;
  } catch (error) {
    console.error('Error checking entry status:', error);
    return 'none';
  }
}

/**
 * Gets the details of a daily entry by ID
 * @param entryId The ID of the entry to retrieve
 * @returns Promise with the entry data
 */
export async function getDailyEntryById(entryId: string): Promise<DailyEntryData | null> {
  try {
    // Call the API to get the entry
    const response = await fetch(`/api/daily-entry/${entryId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch entry');
    }
    
    const data = await response.json();
    
    return data;
  } catch (error) {
    console.error('Error fetching entry:', error);
    return null;
  }
}

/**
 * Gets the ID of today's entry if it exists
 * @returns Promise with the entry ID or null
 */
export async function getTodayEntryId(): Promise<string | null> {
  try {
    const today = new Date();
    const start = startOfDay(today).toISOString();
    const end = endOfDay(today).toISOString();
    
    // Call the API to check entry status
    const response = await fetch(`/api/daily-entry/status?start=${start}&end=${end}`);
    
    if (!response.ok) {
      throw new Error('Failed to check entry status');
    }
    
    const data = await response.json();
    
    return data.entryId || null;
  } catch (error) {
    console.error('Error getting entry ID:', error);
    return null;
  }
} 