import React, { useState, useEffect } from 'react';
import { AppConfig, ProjectUploadSettings, DEFAULT_CONFIG } from '../constants';
import { RotateCcwIcon } from './icons/RotateCcwIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSave: (config: AppConfig) => void;
}

const stringToArray = (str: string): string[] => {
    return str.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
};

const SettingsTextarea: React.FC<{
    id: string;
    label: string;
    value: string[];
    onChange: (value: string) => void;
}> = ({ id, label, value, onChange }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-brand-subtle mb-1">{label}</label>
        <textarea
            id={id}
            rows={4}
            value={value.join('\n')}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-brand-highlight-low border border-brand-highlight-high rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-foam font-mono"
            placeholder="Enter one item per line or separate by commas"
        />
    </div>
);


const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
  const [currentConfig, setCurrentConfig] = useState<AppConfig>(config);

  useEffect(() => {
    setCurrentConfig(config);
  }, [config, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(currentConfig);
  };
  
  const handleLocalInputChange = (provider: 'ollama' | 'lmstudio', field: 'url' | 'model', value: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      [provider]: {
        ...prev[provider],
        [field]: value,
      },
    }));
  };

  const handleProjectSettingsChange = (field: keyof ProjectUploadSettings, value: string) => {
    setCurrentConfig(prev => ({
      ...prev,
      projectUploadSettings: {
        ...prev.projectUploadSettings,
        [field]: stringToArray(value),
      },
    }));
  };

  const resetProjectSettings = () => {
    setCurrentConfig(prev => ({
      ...prev,
      projectUploadSettings: DEFAULT_CONFIG.projectUploadSettings,
    }));
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="bg-brand-surface rounded-lg shadow-2xl p-6 border border-brand-highlight-med w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-brand-surface py-2 -mt-6 -mx-6 px-6 z-10">
          <h2 id="settings-title" className="text-2xl font-bold text-brand-text">Settings</h2>
          <button onClick={onClose} className="text-brand-muted hover:text-brand-text text-2xl leading-none">&times;</button>
        </div>

        <div className="space-y-8">
          {/* Gemini Settings */}
          <details open className="group">
            <summary className="text-lg font-semibold text-brand-love mb-3 cursor-pointer list-none flex justify-between items-center">
              Gemini (Cloud)
              <span className="text-xs group-open:rotate-90 transform transition-transform duration-200">&#9656;</span>
            </summary>
             <p className="text-sm text-brand-subtle mb-3">
              Get your API key from Google AI Studio. The key is saved only in your browser.
            </p>
            <div>
              <label htmlFor="gemini-api-key" className="block text-sm font-medium text-brand-subtle mb-1">API Key</label>
              <input
                id="gemini-api-key"
                type="password"
                placeholder="Enter your Gemini API key"
                value={currentConfig.geminiApiKey || ''}
                onChange={(e) => setCurrentConfig(prev => ({...prev, geminiApiKey: e.target.value}))}
                className="w-full bg-brand-highlight-low border border-brand-highlight-high rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-foam"
              />
            </div>
          </details>

          {/* Local LLM Settings */}
          <details className="group">
             <summary className="text-lg font-semibold text-brand-foam mb-3 cursor-pointer list-none flex justify-between items-center">
                Local AI Providers
                <span className="text-xs group-open:rotate-90 transform transition-transform duration-200">&#9656;</span>
             </summary>
              <div className="space-y-6 pl-2 border-l-2 border-brand-highlight-low">
                {/* Ollama Settings */}
                <div>
                  <h4 className="text-md font-semibold text-brand-foam/80 mb-3">Ollama</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="ollama-url" className="block text-sm font-medium text-brand-subtle mb-1">API URL</label>
                      <input id="ollama-url" type="text" value={currentConfig.ollama.url} onChange={(e) => handleLocalInputChange('ollama', 'url', e.target.value)} className="w-full bg-brand-highlight-low border border-brand-highlight-high rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-foam" />
                    </div>
                    <div>
                      <label htmlFor="ollama-model" className="block text-sm font-medium text-brand-subtle mb-1">Model Name</label>
                      <input id="ollama-model" type="text" value={currentConfig.ollama.model} onChange={(e) => handleLocalInputChange('ollama', 'model', e.target.value)} className="w-full bg-brand-highlight-low border border-brand-highlight-high rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-foam" />
                    </div>
                  </div>
                </div>

                {/* LM Studio Settings */}
                <div>
                  <h4 className="text-md font-semibold text-brand-iris/80 mb-3">LM Studio</h4>
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="lmstudio-url" className="block text-sm font-medium text-brand-subtle mb-1">API URL</label>
                      <input id="lmstudio-url" type="text" value={currentConfig.lmstudio.url} onChange={(e) => handleLocalInputChange('lmstudio', 'url', e.target.value)} className="w-full bg-brand-highlight-low border border-brand-highlight-high rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-foam" />
                    </div>
                    <div>
                      <label htmlFor="lmstudio-model" className="block text-sm font-medium text-brand-subtle mb-1">Model Name</label>
                      <input id="lmstudio-model" type="text" value={currentConfig.lmstudio.model} onChange={(e) => handleLocalInputChange('lmstudio', 'model', e.target.value)} className="w-full bg-brand-highlight-low border border-brand-highlight-high rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-foam" />
                    </div>
                  </div>
                </div>
              </div>
          </details>

           {/* Project Upload Settings */}
           <details className="group">
                <summary className="text-lg font-semibold text-brand-gold mb-3 cursor-pointer list-none flex justify-between items-center">
                    Project Upload Settings
                    <span className="text-xs group-open:rotate-90 transform transition-transform duration-200">&#9656;</span>
                </summary>
                <div className="space-y-4 pl-2 border-l-2 border-brand-highlight-low">
                    <SettingsTextarea 
                        id="allowed-extensions"
                        label="Allowed File Extensions"
                        value={currentConfig.projectUploadSettings.allowedExtensions}
                        onChange={(value) => handleProjectSettingsChange('allowedExtensions', value)}
                    />
                    <SettingsTextarea 
                        id="ignored-dirs"
                        label="Ignored Directories"
                        value={currentConfig.projectUploadSettings.ignoredDirs}
                        onChange={(value) => handleProjectSettingsChange('ignoredDirs', value)}
                    />
                    <SettingsTextarea 
                        id="ignored-files"
                        label="Ignored Files"
                        value={currentConfig.projectUploadSettings.ignoredFiles}
                        onChange={(value) => handleProjectSettingsChange('ignoredFiles', value)}
                    />
                    <div className="flex justify-end">
                      <button onClick={resetProjectSettings} className="flex items-center gap-2 text-sm text-brand-subtle hover:text-brand-text transition-colors duration-200">
                        <RotateCcwIcon className="w-4 h-4" />
                        Reset to Defaults
                      </button>
                    </div>
                </div>
            </details>
        </div>

        <div className="mt-8 flex justify-end gap-3 sticky bottom-0 bg-brand-surface py-4 -mb-6 -mx-6 px-6 z-10">
          <button
            onClick={onClose}
            className="bg-brand-overlay text-brand-subtle font-bold py-2 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-brand-highlight-med hover:text-brand-text"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-brand-foam text-brand-bg font-bold py-2 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-brand-love"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;