import { useTheme } from '@/theme';

interface ToolIconProps {
  tool: string;
  size?: number;
  className?: string;
}

const ICON_URLS: Record<string, string> = {
  Slack: 'https://www.vectorlogo.zone/logos/slack/slack-icon.svg',
  Jira: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jira/jira-original.svg',
  'Google Calendar': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
  'Google Drive': 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg',
  Gmail: 'https://www.vectorlogo.zone/logos/gmail/gmail-icon.svg',
};

function GithubMark({ size, className = '' }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function matchTool(tool: string): string | null {
  for (const key of Object.keys(ICON_URLS)) {
    if (tool.includes(key)) return ICON_URLS[key];
  }
  return null;
}

export function ToolIcon({ tool, size = 16, className = '' }: ToolIconProps) {
  const { theme } = useTheme();

  if (tool.includes('GitHub')) {
    const githubColor = theme === 'dark' ? 'text-slate-300' : 'text-slate-800';
    return (
      <GithubMark
        size={size}
        className={`${githubColor} shrink-0 ${className}`}
      />
    );
  }

  const url = matchTool(tool);
  if (!url) return null;
  return (
    <img
      src={url}
      alt={tool}
      width={size}
      height={size}
      className={`object-contain shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function hasToolIcon(tool: string): boolean {
  return tool.includes('GitHub') || matchTool(tool) !== null;
}
