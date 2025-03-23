'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Sun, Moon, Sunset, PenBox, Pencil, CheckCircle } from 'lucide-react';
import { WeatherWidget } from './WeatherWidget';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { getTodayEntryStatus, getTodayEntryId } from '@/lib/daily-entry';

type EntryStatus = 'none' | 'started' | 'completed';

export function WelcomeMessage() {
  const { data: session } = useSession();
  const [greeting, setGreeting] = useState('');
  const [icon, setIcon] = useState<React.ReactNode>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [entryStatus, setEntryStatus] = useState<EntryStatus>('none');
  const [loading, setLoading] = useState(true);
  const [entryId, setEntryId] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    const getTimeBasedGreeting = () => {
      const currentHour = new Date().getHours();
      
      if (currentHour >= 5 && currentHour < 12) {
        setIcon(<Sun className="h-7 w-7 text-amber-500" />);
        return 'Good morning';
      } else if (currentHour >= 12 && currentHour < 18) {
        setIcon(<Sun className="h-7 w-7 text-orange-500" />);
        return 'Good afternoon';
      } else {
        setIcon(<Moon className="h-7 w-7 text-indigo-400" />);
        return 'Good evening';
      }
    };
    
    setGreeting(getTimeBasedGreeting());
    
    // Update greeting every hour
    const intervalId = setInterval(() => {
      setGreeting(getTimeBasedGreeting());
      setCurrentTime(new Date());
    }, 60 * 60 * 1000);
    
    // Update time every minute
    const timeIntervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
      clearInterval(timeIntervalId);
    };
  }, []);

  useEffect(() => {
    async function checkEntryStatus() {
      try {
        setLoading(true);
        const status = await getTodayEntryStatus();
        setEntryStatus(status);
        
        // If there's an existing entry, get its ID
        if (status !== 'none') {
          const id = await getTodayEntryId();
          setEntryId(id);
        }
      } catch (error) {
        console.error('Error checking entry status:', error);
      } finally {
        setLoading(false);
      }
    }
    
    checkEntryStatus();
  }, []);
  
  // Get user's first name
  const firstName = session?.user?.name?.split(' ')[0] || '';
  
  // Format current date and time
  const formattedDate = format(currentTime, 'EEEE, MMMM d, yyyy');

  const renderButtonText = () => {
    switch (entryStatus) {
      case 'none':
        return 'How are you feeling today?';
      case 'started':
        return 'Continue your entry for today';
      case 'completed':
        return 'Update your entry for today';
      default:
        return 'How are you feeling today?';
    }
  };
  
  const renderButtonIcon = () => {
    switch (entryStatus) {
      case 'none':
        return <PenBox className="h-5 w-5" />;
      case 'started':
        return <Pencil className="h-5 w-5" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <PenBox className="h-5 w-5" />;
    }
  };
  
  const getButtonColor = () => {
    switch (entryStatus) {
      case 'none':
        return 'bg-primary hover:bg-primary/90';
      case 'started':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'completed':
        return 'bg-green-500 hover:bg-green-600';
      default:
        return 'bg-primary hover:bg-primary/90';
    }
  };
  
  const getHintText = () => {
    switch (entryStatus) {
      case 'none':
        return 'Record your daily mood and reflections';
      case 'started':
        return 'Your entry is in progress - complete it now';
      case 'completed':
        return 'You can update your entry for today';
      default:
        return 'Record your daily mood and reflections';
    }
  };
  
  const handleButtonClick = () => {
    if (entryStatus !== 'none' && entryId) {
      // If there's an existing entry, include the ID in the URL
      router.push(`/dashboard/daily-entry?id=${entryId}`);
    } else {
      // For new entries, just navigate to the form
      router.push('/dashboard/daily-entry');
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 rounded-xl mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-4">
            {icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {greeting}{firstName ? `, ${firstName}` : ''}
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome to your personal mood journal
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <WeatherWidget className="mb-2 md:mb-0 md:mr-4" />
          
          <div className="text-right text-muted-foreground">
            <div className="text-sm">{formattedDate}</div>
            <div className="text-lg font-medium">{format(currentTime, 'h:mm a')}</div>
          </div>
        </div>
      </div>
      
      {/* Prominent CTA for adding a new journal entry */}
      <div className="mt-6 flex items-center justify-center md:justify-start">
        <Button 
          onClick={handleButtonClick}
          size="lg"
          className={`gap-2 shadow-sm ${getButtonColor()}`}
          disabled={loading}
        >
          {loading ? (
            <span>Loading...</span>
          ) : (
            <>
              {renderButtonIcon()}
              <span>{renderButtonText()}</span>
            </>
          )}
        </Button>
        <p className="ml-4 text-sm text-muted-foreground hidden md:block">
          {getHintText()}
        </p>
      </div>
    </div>
  );
} 