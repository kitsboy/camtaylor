import { useState, lazy, Suspense, useCallback } from 'react';
import { BackgroundCanvas } from '../components/BackgroundCanvas';
import { HeroBackdrop } from '../components/HeroBackdrop';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { ExpeditionLog } from '../components/ExpeditionLog';
import { Manifesto } from '../components/Manifesto';
import { Services } from '../components/Services';
import { Testimonials } from '../components/Testimonials';
import { Ventures } from '../components/Ventures';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { StickyCta } from '../components/StickyCta';
import { Analytics } from '../components/Analytics';
import { ScrollProgress } from '../components/ScrollProgress';
import { LoadingScreen } from '../components/LoadingScreen';
import { CustomCursor } from '../components/CustomCursor';
import { MobileQuickNav } from '../components/MobileQuickNav';
import { BackToTop } from '../components/BackToTop';
import { useKonamiCode } from '../hooks/useKonamiCode';
import { useGoldenHour } from '../hooks/useGoldenHour';
import { useTheme } from '../hooks/useTheme';

const CommandDeck = lazy(() =>
  import('../components/CommandDeck').then((m) => ({ default: m.CommandDeck })),
);

export function HomePage() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { toggle, isNight } = useTheme();

  useGoldenHour();

  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const toggleTerminal = useCallback(() => setIsTerminalOpen((v) => !v), []);

  useKonamiCode(openTerminal);

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <CustomCursor />
      <Analytics />

      <a href="#hero" className="skip-link">
        Skip to content
      </a>

      <HeroBackdrop />
      <BackgroundCanvas />

      <Navbar
        onToggleTerminal={toggleTerminal}
        isTerminalOpen={isTerminalOpen}
        onToggleTheme={toggle}
        isNight={isNight}
      />

      <main className="main-content">
        <Hero onOpenTerminal={openTerminal} />
        <About />
        <ExpeditionLog />
        <Manifesto />
        <Services />
        <Testimonials />
        <Ventures />
        <Contact />
      </main>

      {isTerminalOpen && (
        <Suspense fallback={null}>
          <CommandDeck isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
        </Suspense>
      )}

      <Footer onToggleTerminal={openTerminal} />
      <StickyCta />
      <MobileQuickNav />
      <BackToTop />
    </>
  );
}