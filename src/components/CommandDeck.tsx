import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, CornerDownLeft } from 'lucide-react';

interface CommandDeckProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LogEntry {
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
}

export const CommandDeck: React.FC<CommandDeckProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState<LogEntry[]>([
    { type: 'system', text: 'CAMERON TAYLOR // VALUE AGENT COMMAND DECK v1.0.4' },
    { type: 'system', text: 'Initializing secure node connection to camtaylor.ca...' },
    { type: 'system', text: 'Connection established. Type "/help" to view available agent protocols.' },
  ]);
  const [input, setInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history]);

  if (!isOpen) return null;

  const handleCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    
    if (cleanCmd === '') return;

    const newHistory = [...history, { type: 'input' as const, text: `camtaylor.ca $> ${cmd}` }];

    if (cleanCmd.startsWith('/')) {
      const command = cleanCmd.slice(1);
      switch (command) {
        case 'help':
          newHistory.push({
            type: 'output',
            text: 'Available Commands:\n  /about     - Learn about Cameron Taylor\n  /ventures  - Display portfolio and active operations\n  /manifesto - Print the Value Axioms\n  /contact   - Direct access portal info\n  /clear     - Flush terminal buffer\n  /exit      - Shutdown command deck'
          });
          break;
        case 'about':
          newHistory.push({
            type: 'output',
            text: 'PROFILE SUMMARY:\nName: Cameron Taylor\nTitle: Value Agent\nSpecialization: Transaction structures, capital syndication, venture optimization.\nMission: Maximizing systemic leverage and generating long-term capital compounding.'
          });
          break;
        case 'ventures':
          newHistory.push({
            type: 'output',
            text: 'ACTIVE ENTITIES:\n- Satohash   [Bitcoin Yield layers]\n- Katoa      [Core Tech Systems]\n- GiveABit   [Philanthropic Infrastructure]\n- OpenStrata [PropTech Governance]\n- Motopass   [Automotive Registers]\n- Sherpacarta[Geo & Topographic Tech]\n- Tadbuy     [Arbitrage Procurement]'
          });
          break;
        case 'manifesto':
          newHistory.push({
            type: 'output',
            text: 'VALUE AXIOMS:\n01. Value is asymmetric. Seek high-leverage inflection points.\n02. Structure beats effort. Architecture creates the alpha.\n03. Align long term. Infinite horizons lead to compounding trust.'
          });
          break;
        case 'contact':
          newHistory.push({
            type: 'output',
            text: 'COMMUNICATION PORTAL:\nSecure Portal: Fill out the form at the bottom of the page.\nPrimary Node: cam@camtaylor.ca\nStatus: Accepting deal flows & advisory inquiries.'
          });
          break;
        case 'clear':
          setHistory([]);
          setInput('');
          return;
        case 'exit':
          onClose();
          break;
        default:
          newHistory.push({
            type: 'error',
            text: `Command not found: "${cmd}". Type "/help" for options.`
          });
      }
    } else {
      newHistory.push({
        type: 'error',
        text: 'Invalid syntax. Commands must start with a slash (e.g. "/help").'
      });
    }

    setHistory(newHistory);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  const executePill = (cmd: string) => {
    handleCommand(cmd);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="terminal-overlay">
      <div className="terminal-window">
        {/* Terminal Header */}
        <div className="terminal-header">
          <div className="terminal-header-title">
            <Terminal size={14} className="terminal-header-icon" />
            <span>VALUE_AGENT_DECK@CAMTAYLOR</span>
          </div>
          <button className="terminal-close-btn" onClick={onClose} aria-label="Close Terminal">
            <X size={14} />
          </button>
        </div>

        {/* Terminal Body */}
        <div className="terminal-body" onClick={() => inputRef.current?.focus()}>
          <div className="terminal-logs">
            {history.map((entry, index) => (
              <div key={index} className={`terminal-log-entry log-${entry.type}`}>
                {entry.text}
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>

          {/* Quick pills */}
          <div className="terminal-pills">
            <button onClick={() => executePill('/about')} className="terminal-pill">/about</button>
            <button onClick={() => executePill('/ventures')} className="terminal-pill">/ventures</button>
            <button onClick={() => executePill('/manifesto')} className="terminal-pill">/manifesto</button>
            <button onClick={() => executePill('/contact')} className="terminal-pill">/contact</button>
            <button onClick={() => executePill('/help')} className="terminal-pill">/help</button>
          </div>

          {/* Input line */}
          <div className="terminal-input-line">
            <span className="terminal-prompt">{"camtaylor.ca $>"}</span>
            <input
              ref={inputRef}
              type="text"
              className="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command starting with /..."
              autoFocus
            />
            <CornerDownLeft size={12} className="terminal-enter-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};
