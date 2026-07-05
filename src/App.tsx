import { useState } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Manifesto } from './components/Manifesto';
import { Services } from './components/Services';
import { Ventures } from './components/Ventures';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CommandDeck } from './components/CommandDeck';

function App() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Interactive hardware-accelerated grid/particle canvas background */}
      <BackgroundCanvas />

      {/* Floating minimal frosted glass Navbar */}
      <Navbar 
        onToggleTerminal={() => setIsTerminalOpen(!isTerminalOpen)} 
        isTerminalOpen={isTerminalOpen} 
      />

      {/* Main landing segments */}
      <main className="main-content">
        <Hero onOpenTerminal={() => setIsTerminalOpen(true)} />
        <Manifesto />
        <Services />
        <Ventures />
        <Contact />
      </main>

      {/* Secure command terminal overlay */}
      <CommandDeck 
        isOpen={isTerminalOpen} 
        onClose={() => setIsTerminalOpen(false)} 
      />

      {/* Footer operations status */}
      <Footer onToggleTerminal={() => setIsTerminalOpen(true)} />
    </div>
  );
}

export default App;
