'use client';

import { useState, useMemo } from 'react';
import { Heart } from 'lucide-react';
import { Card, CardContent } from 'ui/components/ui/card';
import { Button } from 'ui/components/ui/button';
import { FeedbackWithUserProps } from '@/lib/types';
import { updateFeedbackStatus } from '@/lib/api/feedback-client';
import { toast } from 'sonner';

export const roadmapStatuses = [
  {
    id: 'pending',
    label: 'Pending',
    icon: '⏳',
    color: 'yellow',
  },
  {
    id: 'under_review',
    label: 'Under Review',
    icon: '👀',
    color: 'orange',
  },
  {
    id: 'planned',
    label: 'Planned',
    icon: '📅',
    color: 'blue',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    icon: '⚙️',
    color: 'purple',
  },
  {
    id: 'completed',
    label: 'Completed',
    icon: '✅',
    color: 'green',
  },
];

interface RoadmapKanbanProps {
  feedback: FeedbackWithUserProps[];
  projectSlug: string;
}

export default function RoadmapKanban({ feedback, projectSlug }: RoadmapKanbanProps) {
  const [feedbackList, setFeedbackList] = useState<FeedbackWithUserProps[]>(feedback);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // Group feedback by status
  const groupedFeedback = useMemo(() => {
    const groups: Record<string, FeedbackWithUserProps[]> = {};
    
    // Initialize all status groups
    roadmapStatuses.forEach((status) => {
      groups[status.id] = [];
    });

    // Group feedback by status
    feedbackList.forEach((item) => {
      const status = item.status?.toLowerCase().trim() || '';
      // Map common status names to our status IDs
      let mappedStatus = 'pending'; // default
      
      if (!status) {
        mappedStatus = 'pending';
      } else if (status === 'pending' || status === 'backlog') {
        mappedStatus = 'pending';
      } else if (status === 'under review' || status === 'under_review' || status === 'reviewing') {
        mappedStatus = 'under_review';
      } else if (status === 'planned') {
        mappedStatus = 'planned';
      } else if (status === 'in progress' || status === 'in_progress' || status === 'inprogress') {
        mappedStatus = 'in_progress';
      } else if (status === 'completed' || status === 'done') {
        mappedStatus = 'completed';
      } else {
        // If status doesn't match, put it in pending
        mappedStatus = 'pending';
      }
      
      groups[mappedStatus].push(item);
    });

    return groups;
  }, [feedbackList]);

  const handleStatusChange = async (feedbackId: string, newStatus: string) => {
    const statusLabel = roadmapStatuses.find((s) => s.id === newStatus)?.label || newStatus;
    
    try {
      const result = await updateFeedbackStatus(projectSlug, feedbackId, statusLabel);
      if (result.error) {
        toast.error(result.error.message || 'Failed to update status');
        return;
      }

      // Update local state
      setFeedbackList((prev) =>
        prev.map((item) => (item.id === feedbackId ? { ...item, status: statusLabel } : item))
      );
      
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDragStart = (e: React.DragEvent, feedbackId: string) => {
    setDraggedItem(feedbackId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: string) => {
    e.preventDefault();
    if (!draggedItem) return;

    await handleStatusChange(draggedItem, targetStatus);
    setDraggedItem(null);
  };

  return (
    <div className='flex h-full w-full gap-4 overflow-x-auto pb-4'>
      {roadmapStatuses.map((status) => {
        const items = groupedFeedback[status.id] || [];
        const count = items.length;

        return (
          <div
            key={status.id}
            className='flex min-w-[280px] flex-col gap-3'
            onDragOver={handleDragOver}
            onDrop={(e) => {
              handleDrop(e, status.id);
            }}>
            {/* Column Header */}
            <div className='flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2'>
              <div className='flex items-center gap-2'>
                <span className='text-lg'>{status.icon}</span>
                <h3 className='font-semibold'>{status.label}</h3>
                <span className='text-muted-foreground text-sm'>({count})</span>
              </div>
            </div>

            {/* Column Content - Scrollable */}
            <div className='flex max-h-[calc(100vh-200px)] flex-col gap-2 overflow-y-auto'>
              {/* Column Items */}
              <div className='flex flex-col gap-2'>
              {items.map((item) => (
                <Card
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    handleDragStart(e, item.id);
                  }}
                  className='cursor-move transition-shadow hover:shadow-md'>
                  <CardContent className='p-4'>
                    <h4 className='mb-2 font-medium'>{item.title}</h4>
                    <p className='text-muted-foreground mb-3 line-clamp-2 text-sm'>
                      {item.description.replace(/<[^>]*>/g, '')}
                    </p>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-1'>
                        <Heart className='h-4 w-4' />
                        <span className='text-sm'>{item.upvotes}</span>
                      </div>
                      {item.tags && item.tags.length > 0 ? (
                        <div className='flex gap-1'>
                          {item.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag.name}
                              className='rounded px-2 py-0.5 text-xs'
                              style={{ backgroundColor: `${tag.color}20`, color: tag.color }}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              ))}

                {/* Add Request Button */}
                <Button
                  variant='ghost'
                  className='text-muted-foreground hover:text-foreground w-full justify-start border-2 border-dashed'
                  onClick={() => {
                    // TODO: Open create feedback modal
                    toast('Create feedback feature coming soon');
                  }}>
                  + Add a request
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

