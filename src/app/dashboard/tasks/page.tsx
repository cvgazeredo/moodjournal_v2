'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/ui/container';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import TaskBoard from '@/components/tasks/TaskBoard';

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setShowContent(true);
    }
  }, [status, router]);

  if (!showContent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-10">
      <Container>
        <div className="max-w-7xl mx-auto">
          <TaskBoard />
        </div>
      </Container>
    </div>
  );
} 