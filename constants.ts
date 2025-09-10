export interface Language {
  id: string;
  name: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'csharp', name: 'C#' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'ruby', name: 'Ruby' },
  { id: 'php', name: 'PHP' },
  { id: 'html', name: 'HTML' },
  { id: 'css', name: 'CSS' },
  { id: 'sql', name: 'SQL' },
  { id: 'json', name: 'JSON' },
  { id: 'markdown', name: 'Markdown' },
];

export type AIProviderId = 'gemini' | 'ollama' | 'lmstudio';

export interface AIProvider {
  id: AIProviderId;
  name:string;
}

export const AI_PROVIDERS: AIProvider[] = [
    { id: 'gemini', name: 'Gemini (Cloud)' },
    { id: 'ollama', name: 'Ollama (Local)' },
    { id: 'lmstudio', name: 'LM Studio (Local)' },
];

export interface AIProviderConfig {
  url: string;
  model: string;
}

export interface ProjectUploadSettings {
  allowedExtensions: string[];
  ignoredDirs: string[];
  ignoredFiles: string[];
}

export interface AppConfig {
  geminiApiKey?: string;
  ollama: AIProviderConfig;
  lmstudio: AIProviderConfig;
  projectUploadSettings: ProjectUploadSettings;
}

// Default constants for project uploads
export const DEFAULT_ALLOWED_FILE_EXTENSIONS = [
    '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cs', '.go', '.rs', '.rb', '.php',
    '.html', '.css', '.scss', '.sql', '.json', '.md', '.yml', '.yaml', '.toml', '.ini',
    'Dockerfile', '.sh', '.ps1', '.xml', '.env.example'
];
export const DEFAULT_IGNORED_DIRECTORIES = ['node_modules', '.git', '.vscode', 'dist', 'build', 'out', 'coverage', '.next', '.idea'];
export const DEFAULT_IGNORED_FILES = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];


export const DEFAULT_CONFIG: AppConfig = {
  geminiApiKey: '',
  ollama: {
    url: 'http://localhost:11434/v1/chat/completions',
    model: 'llama3',
  },
  lmstudio: {
    url: 'http://localhost:1234/v1/chat/completions',
    model: 'local-model', // LM Studio often serves a generic model name
  },
  projectUploadSettings: {
    allowedExtensions: DEFAULT_ALLOWED_FILE_EXTENSIONS,
    ignoredDirs: DEFAULT_IGNORED_DIRECTORIES,
    ignoredFiles: DEFAULT_IGNORED_FILES,
  }
};