'use client';

import { ErrorProps } from '@/lib/types';

interface UpdateStatusResponse {
  data: { id: string; status: string } | null;
  error: ErrorProps | null;
}

export async function updateFeedbackStatus(
  projectSlug: string,
  feedbackId: string,
  status: string
): Promise<UpdateStatusResponse> {
  try {
    const response = await fetch(`/api/v1/projects/${projectSlug}/feedback/${feedbackId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        status,
        title: '',
        description: '',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: {
          message: data.error || 'Failed to update status',
          status: response.status,
        },
      };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'Failed to update status',
        status: 500,
      },
    };
  }
}

