import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import CodeInput from './components/CodeInput';
import FeedbackDisplay from './components/FeedbackDisplay';
import SettingsModal from './components/SettingsModal';
import { reviewCode, reviewProject, ProjectFile } from './services/aiService';
import { SUPPORTED_LANGUAGES, AIProviderId, AppConfig, DEFAULT_CONFIG } from './constants';

export type InputMode = 'snippet' | 'project';

const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([]);
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0].id);
  const [feedback, setFeedback] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiProvider, setAiProvider] = useState<AIProviderId>('gemini');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
  const [inputMode, setInputMode] = useState<InputMode>('snippet');

  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('codeReviewAIConfig');
      if (savedConfig) {
        const parsedConfig = JSON.parse(savedConfig);
        // Merge saved config with defaults to ensure all keys are present
        const mergedConfig = {
          ...DEFAULT_CONFIG,
          ...parsedConfig,
          ollama: { ...DEFAULT_CONFIG.ollama, ...parsedConfig.ollama },
          lmstudio: { ...DEFAULT_CONFIG.lmstudio, ...parsedConfig.lmstudio },
          projectUploadSettings: { ...DEFAULT_CONFIG.projectUploadSettings, ...parsedConfig.projectUploadSettings },
        };
        setConfig(mergedConfig);
      }
    } catch (err) {
      console.error('Failed to load config from localStorage:', err);
    }
  }, []);

  const handleReview = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    setFeedback('');

    try {
      let result: string;
      if (inputMode === 'project') {
        if (projectFiles.length === 0) {
          throw new Error('Please upload a project to review.');
        }
        result = await reviewProject(projectFiles, language, aiProvider, config);
      } else {
        if (!code.trim()) {
          throw new Error('Please enter some code to review.');
        }
        result = await reviewCode(code, language, aiProvider, config);
      }
      setFeedback(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [code, projectFiles, language, aiProvider, config, inputMode]);

  const handleClear = useCallback(() => {
    setCode('');
    setProjectFiles([]);
    setFeedback('');
    setError(null);
    setIsLoading(false);
  }, []);

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem('codeReviewAIConfig', JSON.stringify(newConfig));
    } catch (err) {
      console.error('Failed to save config to localStorage:', err);
    }
    setIsSettingsOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        provider={aiProvider} 
        setProvider={setAiProvider} 
        onSettingsClick={() => setIsSettingsOpen(true)}
      />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex flex-col">
          <CodeInput
            code={code}
            setCode={setCode}
            projectFiles={projectFiles}
            setProjectFiles={setProjectFiles}
            language={language}
            setLanguage={setLanguage}
            onReview={handleReview}
            onClear={handleClear}
            isLoading={isLoading}
            inputMode={inputMode}
            setInputMode={setInputMode}
            projectUploadSettings={config.projectUploadSettings}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <FeedbackDisplay
            feedback={feedback}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
       <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSave={handleSaveConfig}
       />
      <footer className="text-center p-4 text-brand-muted text-sm">
        <p>Powered by AI. Built for developers.</p>
      </footer>
    </div>
  );
};

export default App;