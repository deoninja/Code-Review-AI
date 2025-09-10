
import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import Loader from './Loader';

interface FeedbackDisplayProps {
  feedback: string;
  isLoading: boolean;
  error: string | null;
}

const WelcomeMessage: React.FC = () => (
    <div className="text-center p-8">
        <h3 className="text-xl font-semibold text-brand-text mb-2">Welcome to Code Review AI</h3>
        <p className="text-brand-subtle">
            Paste your code on the left, select the programming language, and click "Review Code" to get instant, AI-powered feedback.
        </p>
    </div>
);

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback, isLoading, error }) => {
  return (
    <div className="bg-brand-surface rounded-lg shadow-lg flex flex-col h-full">
      <div className="p-3 border-b border-brand-highlight-med">
        <h2 className="text-lg font-semibold text-brand-text">AI Feedback</h2>
      </div>
      <div className="flex-grow p-4 overflow-y-auto" style={{ minHeight: '400px' }}>
        {isLoading && <Loader />}
        {error && <div className="text-brand-rose p-4 bg-brand-rose/10 rounded-md">{error}</div>}
        {!isLoading && !error && feedback && <MarkdownRenderer content={feedback} />}
        {!isLoading && !error && !feedback && <WelcomeMessage />}
      </div>
    </div>
  );
};

export default FeedbackDisplay;
