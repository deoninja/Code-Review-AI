
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderLine = (line: string) => {
    // Inline code
    line = line.replace(/`([^`]+)`/g, '<code class="bg-brand-highlight-low text-brand-gold px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Bold
    line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    
    return { __html: line };
  };

  const elements = [];
  const lines = content.split('\n');
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let codeBlockLang = '';
  let inList = false;

  const closeList = () => {
    if (inList) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-2 mb-4 pl-4">
          {elements.pop()}
        </ul>
      );
      inList = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      closeList();
      if (inCodeBlock) {
        elements.push(
          <div key={`code-${elements.length}`} className="my-4 bg-brand-highlight-low rounded-lg overflow-hidden">
            <div className="text-xs text-brand-subtle px-4 py-1 bg-brand-highlight-med">{codeBlockLang || 'code'}</div>
            <pre className="p-4 text-sm overflow-x-auto">
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          </div>
        );
        inCodeBlock = false;
        codeBlockContent = [];
        codeBlockLang = '';
      } else {
        inCodeBlock = true;
        codeBlockLang = line.substring(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
      closeList();
      elements.push(<h3 key={i} className="text-xl font-semibold text-brand-foam mt-6 mb-3" dangerouslySetInnerHTML={renderLine(line.substring(4))}></h3>);
    } else if (line.startsWith('## ')) {
      closeList();
      elements.push(<h2 key={i} className="text-2xl font-bold text-brand-iris mt-8 mb-4 border-b border-brand-highlight-med pb-2" dangerouslySetInnerHTML={renderLine(line.substring(3))}></h2>);
    } else if (line.startsWith('# ')) {
      closeList();
      elements.push(<h1 key={i} className="text-3xl font-bold text-brand-love mt-8 mb-4 border-b-2 border-brand-highlight-high pb-2" dangerouslySetInnerHTML={renderLine(line.substring(2))}></h1>);
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      if (!inList) {
        inList = true;
        elements.push([]);
      }
      (elements[elements.length - 1] as JSX.Element[]).push(<li key={i} dangerouslySetInnerHTML={renderLine(line.substring(2))}></li>);
    } else if (line.trim() === '') {
      closeList();
      elements.push(<div key={i} className="h-2"></div>); // Represents a paragraph break
    } else {
      closeList();
      elements.push(<p key={i} className="my-2 leading-relaxed" dangerouslySetInnerHTML={renderLine(line)}></p>);
    }
  }

  closeList();

  return <div className="prose prose-invert text-brand-text">{elements}</div>;
};

export default MarkdownRenderer;
