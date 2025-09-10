import React from 'react';
import { SUPPORTED_LANGUAGES, Language, ProjectUploadSettings } from '../constants';
import { SparklesIcon } from './icons/SparklesIcon';
import { TrashIcon } from './icons/TrashIcon';
import ProjectUploader from './ProjectUploader';
import { ProjectFile } from '../services/aiService';
import { InputMode } from '../App';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  projectFiles: ProjectFile[];
  setProjectFiles: (files: ProjectFile[]) => void;
  language: string;
  setLanguage: (language: string) => void;
  onReview: () => void;
  onClear: () => void;
  isLoading: boolean;
  inputMode: InputMode;
  setInputMode: (mode: InputMode) => void;
  projectUploadSettings: ProjectUploadSettings;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  setCode,
  projectFiles,
  setProjectFiles,
  language,
  setLanguage,
  onReview,
  onClear,
  isLoading,
  inputMode,
  setInputMode,
  projectUploadSettings
}) => {
  const isReviewDisabled = isLoading || (inputMode === 'snippet' ? !code.trim() : projectFiles.length === 0);
  const isClearDisabled = isLoading || (inputMode === 'snippet' ? !code.trim() : projectFiles.length === 0);

  const TabButton: React.FC<{ mode: InputMode; label: string }> = ({ mode, label }) => (
    <button
      onClick={() => setInputMode(mode)}
      className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors duration-200 focus:outline-none ${
        inputMode === mode
          ? 'bg-brand-surface text-brand-foam border-b-2 border-brand-foam'
          : 'bg-transparent text-brand-subtle hover:bg-brand-highlight-low'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-brand-surface rounded-lg shadow-lg flex flex-col h-full">
      <div className="flex justify-between items-end p-3 pt-0 border-b border-brand-highlight-med">
        <div className="flex items-center gap-1">
          <TabButton mode="snippet" label="Snippet" />
          <TabButton mode="project" label="Project" />
        </div>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-brand-overlay border border-brand-highlight-high rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand-foam"
        >
          {SUPPORTED_LANGUAGES.map((lang: Language) => (
            <option key={lang.id} value={lang.id}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-grow p-1">
        {inputMode === 'snippet' ? (
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code snippet here..."
            className="w-full h-full bg-brand-surface text-brand-text p-3 resize-none focus:outline-none font-mono text-sm"
            style={{ minHeight: '400px' }}
          />
        ) : (
          <ProjectUploader
            projectFiles={projectFiles}
            setProjectFiles={setProjectFiles}
            settings={projectUploadSettings}
          />
        )}
      </div>
      <div className="p-3 border-t border-brand-highlight-med flex items-center gap-3">
        <button
          onClick={onReview}
          disabled={isReviewDisabled}
          className="flex-grow flex items-center justify-center gap-2 bg-brand-foam text-brand-bg font-bold py-3 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-brand-love disabled:bg-brand-muted disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <SparklesIcon className="w-5 h-5" />
              Review Code
            </>
          )}
        </button>
        <button
            onClick={onClear}
            disabled={isClearDisabled}
            aria-label="Clear input"
            className="flex-shrink-0 bg-brand-overlay text-brand-subtle font-bold p-3 rounded-md transition-all duration-200 ease-in-out hover:bg-brand-highlight-med hover:text-brand-text disabled:bg-brand-highlight-low disabled:text-brand-muted disabled:cursor-not-allowed"
          >
            <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CodeInput;