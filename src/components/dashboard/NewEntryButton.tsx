'use client';

import { useEffect, useState } from 'react';
import { PlusCircle, PenBox, Pencil, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { getTodayEntryStatus, getTodayEntryId } from '@/lib/daily-entry';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type EntryStatus = 'none' | 'started' | 'completed';

export function NewEntryButton() {
  const router = useRouter();
  const [entryStatus, setEntryStatus] = useState<EntryStatus>('none');
  const [loading, setLoading] = useState(true);
  const [entryId, setEntryId] = useState<string | null>(null);
  
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
  
  const handleButtonClick = () => {
    if (entryStatus !== 'none' && entryId) {
      // If there's an existing entry, include the ID in the URL
      router.push(`/dashboard/daily-entry?id=${entryId}`);
    } else {
      // For new entries, just navigate to the form
      router.push('/dashboard/daily-entry');
    }
  };
  
  const renderButtonText = () => {
    switch (entryStatus) {
      case 'none':
        return 'Create New Journal Entry';
      case 'started':
        return 'Continue Today\'s Entry';
      case 'completed':
        return 'Edit Today\'s Entry';
      default:
        return 'Create New Journal Entry';
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
  
  // Show the correct mobile icon
  const renderMobileIcon = () => {
    switch (entryStatus) {
      case 'none':
        return <PlusCircle className="h-8 w-8" />;
      case 'started':
        return <Pencil className="h-8 w-8" />;
      case 'completed':
        return <CheckCircle className="h-8 w-8" />;
      default:
        return <PlusCircle className="h-8 w-8" />;
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
  
  if (loading) {
    return (
      <div className="fixed bottom-8 right-8 z-10 md:static md:z-0 md:bottom-auto md:right-auto md:w-full md:flex md:justify-end">
        <Button 
          disabled
          size="icon" 
          className="h-14 w-14 rounded-full shadow-lg md:hidden"
        >
          <PlusCircle className="h-8 w-8 opacity-50" />
          <span className="sr-only">Loading...</span>
        </Button>
        
        <Button 
          disabled
          size="lg" 
          className="hidden md:flex items-center gap-2 px-4 py-6 opacity-70"
        >
          <PenBox className="h-5 w-5" />
          <span>Loading...</span>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-8 right-8 z-10 md:static md:z-0 md:bottom-auto md:right-auto md:w-full md:flex md:justify-end">
      {/* Mobile floating button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={handleButtonClick}
              size="icon" 
              className={`h-14 w-14 rounded-full shadow-lg md:hidden ${getButtonColor()}`}
            >
              {renderMobileIcon()}
              <span className="sr-only">{renderButtonText()}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{renderButtonText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {/* Desktop button */}
      <Button 
        onClick={handleButtonClick}
        size="lg" 
        className={`hidden md:flex items-center gap-2 px-4 py-6 ${getButtonColor()}`}
      >
        {renderButtonIcon()}
        <span>{renderButtonText()}</span>
      </Button>
    </div>
  );
} 