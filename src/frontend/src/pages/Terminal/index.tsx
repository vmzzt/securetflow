import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple SVG Icons
const TerminalIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const PlayIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const StopIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

interface TerminalSession {
  id: string;
  name: string;
  type: 'bash' | 'python' | 'powershell' | 'custom';
  status: 'active' | 'inactive' | 'running';
  output: string[];
  currentCommand: string;
  history: string[];
  createdAt: string;
  lastActivity: string;
}

interface Command {
  name: string;
  description: string;
  category: 'scan' | 'system' | 'network' | 'analysis' | 'custom';
  usage: string;
  examples: string[];
}

const Terminal: React.FC = () => {
  const [sessions, setSessions] = useState<TerminalSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showCommands, setShowCommands] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const predefinedCommands: Command[] = [
    {
      name: 'nmap',
      description: 'Network discovery and security auditing',
      category: 'scan',
      usage: 'nmap [options] target',
      examples: ['nmap -sS 192.168.1.1', 'nmap -p 80,443 example.com']
    },
    {
      name: 'nuclei',
      description: 'Fast vulnerability scanner',
      category: 'scan',
      usage: 'nuclei [options] target',
      examples: ['nuclei -u https://example.com', 'nuclei -l targets.txt']
    },
    {
      name: 'sqlmap',
      description: 'SQL injection testing tool',
      category: 'scan',
      usage: 'sqlmap [options] target',
      examples: ['sqlmap -u "http://example.com/page?id=1"', 'sqlmap --batch --random-agent']
    },
    {
      name: 'amass',
      description: 'Subdomain enumeration',
      category: 'network',
      usage: 'amass [options] target',
      examples: ['amass enum -d example.com', 'amass intel -d example.com']
    },
    {
      name: 'dirb',
      description: 'Web content scanner',
      category: 'scan',
      usage: 'dirb [options] target',
      examples: ['dirb http://example.com', 'dirb http://example.com /usr/share/dirb/wordlists/common.txt']
    },
    {
      name: 'nikto',
      description: 'Web server scanner',
      category: 'scan',
      usage: 'nikto [options] target',
      examples: ['nikto -h http://example.com', 'nikto -h example.com -p 443 -ssl']
    },
    {
      name: 'whois',
      description: 'Domain information lookup',
      category: 'network',
      usage: 'whois domain',
      examples: ['whois example.com', 'whois 192.168.1.1']
    },
    {
      name: 'ping',
      description: 'Network connectivity test',
      category: 'network',
      usage: 'ping [options] host',
      examples: ['ping example.com', 'ping -c 4 8.8.8.8']
    },
    {
      name: 'curl',
      description: 'HTTP request tool',
      category: 'network',
      usage: 'curl [options] url',
      examples: ['curl -I https://example.com', 'curl -X POST -d "data" http://example.com']
    },
    {
      name: 'ps',
      description: 'Process status',
      category: 'system',
      usage: 'ps [options]',
      examples: ['ps aux', 'ps -ef | grep securet']
    },
    {
      name: 'top',
      description: 'System resource monitor',
      category: 'system',
      usage: 'top [options]',
      examples: ['top', 'top -p 1234']
    },
    {
      name: 'ls',
      description: 'List directory contents',
      category: 'system',
      usage: 'ls [options] [path]',
      examples: ['ls -la', 'ls -R /var/log']
    },
    {
      name: 'cat',
      description: 'Display file contents',
      category: 'system',
      usage: 'cat [options] file',
      examples: ['cat /var/log/securet.log', 'cat config.json']
    },
    {
      name: 'grep',
      description: 'Search text patterns',
      category: 'system',
      usage: 'grep [options] pattern file',
      examples: ['grep "error" log.txt', 'grep -r "password" /etc']
    },
    {
      name: 'find',
      description: 'Search for files',
      category: 'system',
      usage: 'find [path] [expression]',
      examples: ['find . -name "*.log"', 'find /var -type f -mtime -1']
    }
  ];

  useEffect(() => {
    // Initialize with default session
    const defaultSession: TerminalSession = {
      id: '1',
      name: 'Terminal Principal',
      type: 'bash',
      status: 'active',
      output: [
        'Securet Flow SSC Terminal v1.0.0',
        'Type "help" for available commands',
        'Type "commands" to see predefined security tools',
        '',
        'root@securet-flow:~$ '
      ],
      currentCommand: '',
      history: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    setSessions([defaultSession]);
    setActiveSession('1');
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [sessions]);

  const executeCommand = async (command: string) => {
    if (!command.trim() || !activeSession) return;

    setIsProcessing(true);
    
    // Add command to output
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSession) {
        return {
          ...session,
          output: [...session.output, `root@securet-flow:~$ ${command}`],
          history: [...session.history, command],
          lastActivity: new Date().toISOString()
        };
      }
      return session;
    });
    setSessions(updatedSessions);

    // Simulate command execution
    setTimeout(() => {
      const output = generateCommandOutput(command);
      
      const finalSessions = sessions.map(session => {
        if (session.id === activeSession) {
          return {
            ...session,
            output: [...session.output, ...output, '', 'root@securet-flow:~$ '],
            lastActivity: new Date().toISOString()
          };
        }
        return session;
      });
      
      setSessions(finalSessions);
      setIsProcessing(false);
      setCommandInput('');
      setHistoryIndex(-1);
    }, 500 + Math.random() * 1000); // Random delay for realism
  };

  const generateCommandOutput = (command: string): string[] => {
    const cmd = command.trim().toLowerCase();
    const args = command.split(' ').slice(1);

    if (cmd === 'help' || cmd === '--help') {
      return [
        'Available commands:',
        '  help, --help     Show this help message',
        '  commands         Show predefined security tools',
        '  clear            Clear terminal screen',
        '  history          Show command history',
        '  sessions         List active sessions',
        '  new-session      Create new terminal session',
        '  exit             Exit current session',
        '',
        'Security tools:',
        '  nmap, nuclei, sqlmap, amass, dirb, nikto',
        '  whois, ping, curl, ps, top, ls, cat, grep, find',
        '',
        'Type "commands" for detailed tool information'
      ];
    }

    if (cmd === 'commands') {
      return [
        'Predefined Security Tools:',
        '',
        ...predefinedCommands.map(cmd => 
          `  ${cmd.name.padEnd(12)} - ${cmd.description}`
        ),
        '',
        'Type "help <command>" for detailed usage information'
      ];
    }

    if (cmd === 'clear') {
      const updatedSessions = sessions.map(session => {
        if (session.id === activeSession) {
          return {
            ...session,
            output: ['root@securet-flow:~$ ']
          };
        }
        return session;
      });
      setSessions(updatedSessions);
      return [];
    }

    if (cmd === 'history') {
      const currentSession = sessions.find(s => s.id === activeSession);
      if (currentSession && currentSession.history.length > 0) {
        return currentSession.history.map((cmd, index) => 
          `${index + 1}  ${cmd}`
        );
      }
      return ['No command history available'];
    }

    if (cmd === 'sessions') {
      return [
        'Active Terminal Sessions:',
        '',
        ...sessions.map(session => 
          `${session.id === activeSession ? '*' : ' '} ${session.id.padEnd(3)} ${session.name.padEnd(20)} ${session.status.padEnd(10)} ${session.type}`
        ),
        '',
        'Use "new-session" to create a new session'
      ];
    }

    if (cmd === 'new-session') {
      const newSession: TerminalSession = {
        id: (sessions.length + 1).toString(),
        name: `Terminal ${sessions.length + 1}`,
        type: 'bash',
        status: 'active',
        output: [
          'Securet Flow SSC Terminal v1.0.0',
          'New session created',
          '',
          'root@securet-flow:~$ '
        ],
        currentCommand: '',
        history: [],
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      setSessions([...sessions, newSession]);
      setActiveSession(newSession.id);
      return [];
    }

    if (cmd === 'exit') {
      if (sessions.length > 1) {
        const updatedSessions = sessions.filter(s => s.id !== activeSession);
        setSessions(updatedSessions);
        setActiveSession(updatedSessions[0].id);
        return ['Session closed'];
      }
      return ['Cannot close the last session'];
    }

    // Simulate common command outputs
    if (cmd.startsWith('nmap')) {
      return [
        'Starting Nmap 7.94 ( https://nmap.org )',
        'Nmap scan report for example.com (93.184.216.34)',
        'Host is up (0.089s latency).',
        'Not shown: 998 filtered tcp ports (no-response)',
        'PORT    STATE SERVICE',
        '80/tcp  open  http',
        '443/tcp open  https',
        '',
        'Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds'
      ];
    }

    if (cmd.startsWith('ping')) {
      const target = args[0] || 'example.com';
      return [
        `PING ${target} (93.184.216.34) 56(84) bytes of data.`,
        '64 bytes from 93.184.216.34: icmp_seq=1 time=89.1 ms',
        '64 bytes from 93.184.216.34: icmp_seq=2 time=87.2 ms',
        '64 bytes from 93.184.216.34: icmp_seq=3 time=88.5 ms',
        '64 bytes from 93.184.216.34: icmp_seq=4 time=86.9 ms',
        '',
        `--- ${target} ping statistics ---`,
        '4 packets transmitted, 4 received, 0% packet loss, time 3003ms',
        'rtt min/avg/max/mdev = 86.900/87.925/89.100/0.950 ms'
      ];
    }

    if (cmd.startsWith('ls')) {
      return [
        'total 24',
        'drwxr-xr-x  2 root root 4096 Jan 15 10:30 .',
        'drwxr-xr-x 20 root root 4096 Jan 15 10:30 ..',
        '-rw-r--r--  1 root root  220 Jan 15 10:30 .bash_logout',
        '-rw-r--r--  1 root root 3771 Jan 15 10:30 .bashrc',
        '-rw-r--r--  1 root root  807 Jan 15 10:30 .profile',
        'drwxr-xr-x  2 root root 4096 Jan 15 10:30 logs',
        'drwxr-xr-x  2 root root 4096 Jan 15 10:30 scans',
        'drwxr-xr-x  2 root root 4096 Jan 15 10:30 reports'
      ];
    }

    if (cmd.startsWith('ps')) {
      return [
        '  PID TTY          TIME CMD',
        ' 1234 pts/0    00:00:00 bash',
        ' 1235 pts/0    00:00:00 securet-scanner',
        ' 1236 pts/0    00:00:00 nmap',
        ' 1237 pts/0    00:00:00 nuclei',
        ' 1238 pts/0    00:00:00 ps'
      ];
    }

    if (cmd.startsWith('top')) {
      return [
        'top - 10:45:23 up 2:15,  1 user,  load average: 0.52, 0.58, 0.59',
        'Tasks: 124 total,   1 running, 123 sleeping,   0 stopped,   0 zombie',
        '%Cpu(s):  8.2 us,  2.1 sy,  0.0 ni, 89.4 id,  0.3 wa,  0.0 hi,  0.0 si,  0.0 st',
        'MiB Mem :  16384.0 total,   8192.0 free,   4096.0 used,   4096.0 buff/cache',
        'MiB Swap:   8192.0 total,   8192.0 free,      0.0 used.  12288.0 avail Mem',
        '',
        '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND',
        ' 1235 root      20   0  1234567  123456  12345 S   15.2   0.8   0:15.23 securet-scanner',
        ' 1236 root      20   0   987654   98765   9876 S    8.7   0.6   0:08.45 nmap',
        ' 1237 root      20   0   654321   65432   6543 S    2.1   0.4   0:02.12 nuclei'
      ];
    }

    // Default response for unknown commands
    return [
      `bash: ${command.split(' ')[0]}: command not found`,
      'Type "help" for available commands'
    ];
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (commandInput.trim()) {
        executeCommand(commandInput);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const currentSession = sessions.find(s => s.id === activeSession);
      if (currentSession && currentSession.history.length > 0) {
        const newIndex = Math.min(historyIndex + 1, currentSession.history.length - 1);
        setHistoryIndex(newIndex);
        setCommandInput(currentSession.history[currentSession.history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const currentSession = sessions.find(s => s.id === activeSession);
        if (currentSession) {
          setCommandInput(currentSession.history[currentSession.history.length - 1 - newIndex]);
        }
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-complete logic could be implemented here
    }
  };

  const clearTerminal = () => {
    const updatedSessions = sessions.map(session => {
      if (session.id === activeSession) {
        return {
          ...session,
          output: ['root@securet-flow:~$ ']
        };
      }
      return session;
    });
    setSessions(updatedSessions);
  };

  const downloadLog = () => {
    const currentSession = sessions.find(s => s.id === activeSession);
    if (currentSession) {
      const logContent = currentSession.output.join('\n');
      const blob = new Blob([logContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `terminal-log-${currentSession.id}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const currentSession = sessions.find(s => s.id === activeSession);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Terminal Web</h1>
          <p className="text-gray-600 mt-2">
            Terminal interativo para execução de comandos de segurança
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowCommands(!showCommands)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showCommands ? 'Ocultar' : 'Mostrar'} Comandos
          </button>
          <button
            onClick={clearTerminal}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Limpar
          </button>
          <button
            onClick={downloadLog}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <DownloadIcon className="h-4 w-4" />
            <span>Download Log</span>
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Terminal Sessions */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Sessões</h2>
            <div className="space-y-2">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeSession === session.id
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{session.name}</p>
                      <p className="text-xs text-gray-500">{session.type}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${
                      session.status === 'active' ? 'bg-green-500' :
                      session.status === 'running' ? 'bg-yellow-500' :
                      'bg-gray-400'
                    }`}></div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                const newSession: TerminalSession = {
                  id: (sessions.length + 1).toString(),
                  name: `Terminal ${sessions.length + 1}`,
                  type: 'bash',
                  status: 'active',
                  output: [
                    'Securet Flow SSC Terminal v1.0.0',
                    'New session created',
                    '',
                    'root@securet-flow:~$ '
                  ],
                  currentCommand: '',
                  history: [],
                  createdAt: new Date().toISOString(),
                  lastActivity: new Date().toISOString()
                };
                setSessions([...sessions, newSession]);
                setActiveSession(newSession.id);
              }}
              className="w-full mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nova Sessão
            </button>
          </div>
        </motion.div>

        {/* Main Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Terminal Header */}
            <div className="bg-gray-900 text-white px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TerminalIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {currentSession?.name || 'Terminal'}
                </span>
                <span className="text-xs text-gray-400">
                  {currentSession?.type || 'bash'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  currentSession?.status === 'active' ? 'bg-green-500' :
                  currentSession?.status === 'running' ? 'bg-yellow-500' :
                  'bg-gray-400'
                }`}></div>
                <span className="text-xs text-gray-400">
                  {currentSession?.status || 'inactive'}
                </span>
              </div>
            </div>

            {/* Terminal Output */}
            <div
              ref={terminalRef}
              className="bg-black text-green-400 p-4 h-96 overflow-y-auto font-mono text-sm"
            >
              {currentSession?.output.map((line, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {line}
                </div>
              ))}
              {isProcessing && (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                  <span>Executando comando...</span>
                </div>
              )}
            </div>

            {/* Command Input */}
            <div className="bg-gray-900 p-4">
              <div className="flex items-center space-x-2">
                <span className="text-green-400 font-mono">root@securet-flow:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-green-400 font-mono outline-none"
                  placeholder="Digite um comando..."
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Commands Panel */}
      <AnimatePresence>
        {showCommands && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Comandos Predefinidos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedCommands.map((command) => (
                <div
                  key={command.name}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setCommandInput(command.name);
                    inputRef.current?.focus();
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">{command.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      command.category === 'scan' ? 'bg-red-100 text-red-800' :
                      command.category === 'network' ? 'bg-blue-100 text-blue-800' :
                      command.category === 'system' ? 'bg-green-100 text-green-800' :
                      command.category === 'analysis' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {command.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{command.description}</p>
                  <p className="text-xs text-gray-500 font-mono">{command.usage}</p>
                  {command.examples.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Ex: {command.examples[0]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Terminal; 