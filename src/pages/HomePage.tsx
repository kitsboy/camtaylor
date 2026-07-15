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
import { ScrollProgress } from '../components/ScrollProgress';
import { LoadingScreen } from '../components/LoadingScreen';
import { CustomCursor } from '../components/CustomCursor';
import { MobileQuickNav } from '../components/MobileQuickNav';
import { BackToTop } from '../components/BackToTop';
import { useKonamiCode } from '../hooks/useKonamiCode';
import { useGoldenHour } from '../hooks/useGoldenHour';
import { useThemeContext } from '../context/ThemeContext';
import { useHashScroll } from '../hooks/useHashScroll';
import { usePageMeta } from '../hooks/usePageMeta';
import { SITE } from '../data/site';

const CommandDeck = lazy(() =>
  import('../components/CommandDeck').then((m) => ({ default: m.CommandDeck })),
);

export function HomePage() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const { toggle, isNight } = useThemeContext();

  usePageMeta({
    title: `${SITE.name} | ${SITE.title} — Deal Architecture & Venture Operations`,
    description:
      'Cam Taylor — Sherpa. We get people to the top and back down again. Deal architecture, capital syndication, and venture operations from British Columbia, Canada.',
    path: '/',
  });

  useGoldenHour();
  useHashScroll();

  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const toggleTerminal = useCallback(() => setIsTerminalOpen((v) => !v), []);
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);

  const scrollToSection = useCallback((id: string) => {
    closeTerminal();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, [closeTerminal]);

  useKonamiCode(openTerminal);

  return (
    <>
      <LoadingScreen />
      <ScrollProgress />
      <CustomCursor />

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
          <CommandDeck
            isOpen={isTerminalOpen}
            onClose={closeTerminal}
            onNavigate={scrollToSection}
          />
        </Suspense>
      )}

      <Footer onToggleTerminal={openTerminal} />
      <StickyCta />
      <MobileQuickNav />
      <BackToTop />
    </>
  );
}