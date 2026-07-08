import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Terminal, X, CornerDownLeft, Copy, Check } from 'lucide-react';
import {
  completeCommand,
  formatAbout,
  formatBook,
  formatContact,
  formatHelp,
  formatManifesto,
  formatNostr,
  formatRoute,
  formatServices,
  formatStatus,
  formatVentures,
  SHERPA_ASCII,
} from '../data/commandDeck';
import { useFocusTrap } from '../hooks/useFocusTrap';

interface CommandDeckProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  type: 'input' | 'output' | 'error' | 'system' | 'summit';
  text: string;
}

const BOOT_LOGS: LogEntry[] = [
  { type: 'system', text: 'CAM TAYLOR // SHERPA COMMAND DECK v2.0.0' },
  { type: 'system', text: 'Initializing secure node connection to camtaylor.ca...' },
  { type: 'system', text: 'Connection established. Type "/help" to view available protocols.' },
  { type: 'system', text: 'Tip: ↑↓↓←→←→BA opens deck from anywhere.' },
];

export const CommandDeck: React.FC<CommandDeckProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<LogEntry[]>(BOOT_LOGS);
  const [input, setInput] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [summitMode, setSummitMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const windowRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef(0);

  useFocusTrap(windowRef, isOpen);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const copySession = useCallback(async () => {
    const text = history.map((e) => e.text).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* noop */ }
  }, [history]);

  const runCommand = useCallback(
    (cmd: string) => {
      const cleanCmd = cmd.trim().toLowerCase();
      if (cleanCmd === '') return;

      const newHistory = [...history, { type: 'input' as const, text: `camtaylor.ca $> ${cmd}` }];

      if (cleanCmd.startsWith('/')) {
        const parts = cleanCmd.slice(1).split(/\s+/);
        const command = parts[0];
        const arg = parts.slice(1).join(' ');

        switch (command) {
          case 'help':
            newHistory.push({ type: 'output', text: formatHelp() });
            break;
          case 'about':
            newHistory.push({ type: 'output', text: formatAbout() });
            break;
          case 'status':
            newHistory.push({ type: 'output', text: formatStatus() });
            break;
          case 'services':
            newHistory.push({ type: 'output', text: 'AREAS OF EXPERTISE:\n' + formatServices() });
            break;
          case 'ventures':
            newHistory.push({ type: 'output', text: 'ACTIVE ENTITIES:\n' + formatVentures() });
            break;
          case 'route': {
            if (!arg) {
              newHistory.push({ type: 'error', text: 'Usage: /route <venture>  e.g. /route giveabit' });
            } else {
              const detail = formatRoute(arg);
              newHistory.push({
                type: detail ? 'output' : 'error',
                text: detail ?? `Venture not found: "${arg}". Try /ventures`,
              });
            }
            break;
          }
          case 'manifesto':
            newHistory.push({ type: 'output', text: 'SHERPA PHILOSOPHY:\n' + formatManifesto() });
            break;
          case 'contact':
            newHistory.push({ type: 'output', text: formatContact() });
            break;
          case 'book':
            newHistory.push({ type: 'output', text: formatBook() });
            break;
          case 'nostr':
            newHistory.push({ type: 'output', text: formatNostr() });
            break;
          case 'ascii':
            newHistory.push({ type: 'output', text: SHERPA_ASCII });
            break;
          case 'summit':
            setSummitMode(true);
            newHistory.push({
              type: 'summit',
              text: '🏔 SUMMIT REACHED — You found the easter egg. The view is worth the climb.',
            });
            setTimeout(() => setSummitMode(false), 4000);
            break;
          case 'copy':
            copySession();
            newHistory.push({ type: 'system', text: 'Session copied to clipboard.' });
            break;
          case 'clear':
            setHistory([]);
            setInput('');
            setHistoryIndex(-1);
            return;
          case 'exit':
            onClose();
            break;
          default:
            newHistory.push({
              type: 'error',
              text: `Command not found: "${cmd}". Type "/help" for options.`,
            });
        }
      } else {
        newHistory.push({
          type: 'error',
          text: 'Invalid syntax. Commands must start with a slash (e.g. "/help").',
        });
      }

      setHistory(newHistory);
      setCmdHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
      setInput('');
    },
    [history, onClose, copySession],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      runCommand(input);
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      const completed = completeCommand(input);
      if (completed) setInput(completed);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(cmdHistory[nextIndex]);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIndex);
        setInput(cmdHistory[nextIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`terminal-overlay ${summitMode ? 'terminal-overlay--summit' : ''}`}
      onClick={onClose}
      onTouchStart={(e) => { touchStartY.current = e.touches[0].clientY; }}
      onTouchEnd={(e) => {
        if (e.changedTouches[0].clientY - touchStartY.current > 80) onClose();
      }}
    >
      {summitMode && <div className="summit-confetti" aria-hidden="true" />}

      <div
        ref={windowRef}
        className="terminal-window"
        role="dialog"
        aria-modal="true"
        aria-label="Sherpa Command Deck"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="terminal-header">
          <div className="terminal-header-title">
            <Terminal size={14} className="terminal-header-icon" />
            <span>SHERPA_DECK@CAMTAYLOR</span>
          </div>
          <div className="terminal-header-actions">
            <button
              type="button"
              className="terminal-copy-btn"
              onClick={copySession}
              aria-label="Copy session"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
            <button className="terminal-close-btn" onClick={onClose} aria-label="Close terminal">
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
          <div className="terminal-logs" aria-live="polite" aria-relevant="additions">
            {history.map((entry, index) => (
              <div key={index} className={`terminal-log-entry log-${entry.type}`}>
                {entry.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          <div className="terminal-pills">
            {['/status', '/route', '/nostr', '/book', '/about', '/help'].map((cmd) => (
              <button key={cmd} onClick={() => runCommand(cmd)} className="terminal-pill">
                {cmd}
              </button>
            ))}
          </div>

          <div className="terminal-input-line">
            <span className="terminal-prompt">{'camtaylor.ca $>'}</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (Tab to complete)..."
              autoFocus
              aria-label="Terminal command input"
            />
            <CornerDownLeft size={12} className="terminal-enter-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};