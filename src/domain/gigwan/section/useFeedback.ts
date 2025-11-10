'use client';

import { useCallback, useReducer } from 'react';

import type { FeedbackState } from './types';

type FeedbackAction =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | { type: 'clear' };

const feedbackReducer = (_state: FeedbackState, action: FeedbackAction): FeedbackState => {
  switch (action.type) {
    case 'success':
      return { type: 'success', message: action.message };
    case 'error':
      return { type: 'error', message: action.message };
    case 'clear':
    default:
      return null;
  }
};

export const useFeedback = () => {
  const [feedback, dispatch] = useReducer(feedbackReducer, null);

  const showSuccess = useCallback((message: string) => {
    dispatch({ type: 'success', message });
  }, []);

  const showError = useCallback((message: string) => {
    dispatch({ type: 'error', message });
  }, []);

  const clearFeedback = useCallback(() => {
    dispatch({ type: 'clear' });
  }, []);

  return { feedback, showSuccess, showError, clearFeedback } as const;
};
