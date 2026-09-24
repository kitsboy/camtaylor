import { useState, lazy, Suspense, useCallback } from 'react';
import { BackgroundCanvas } from '../components/BackgroundCanvas';
import { HeroBackdrop } from '../components/HeroBackdrop';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Family } from '../components/Family';
import { Agents } from '../components/Agents';
import { Proof } from '../components/Proof';
import { ExpeditionLog } from '../components/ExpeditionLog';
import { Manifesto } from '../components/Manifesto';
import { Services } from '../components/Services';
import { Testimonials } from '../components/Testimonials';
import { Ventures } from '../components/Ventures';
import { Affiliates } from '../components/Affiliates';
import { LiveSignal } from '../components/LiveSignal';
import { RouteTicker } from '../components/RouteTicker';
import { RouteRail } from '../components/RouteRail';
import { WaypointBand } from '../components/WaypointBand';
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
import { useCardSpotlight } from '../hooks/useCardSpotlight';
import { useCommandShortcut } from '../hooks/useCommandShortcut';
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
  useCardSpotlight();

  const openTerminal = useCallback(() => setIsTerminalOpen(true), []);
  const toggleTerminal = useCallback(() => setIsTerminalOpen((v) => !v), []);
  const closeTerminal = useCallback(() => setIsTerminalOpen(false), []);

  useCommandShortcut(toggleTerminal);

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
      <RouteRail />

      <Navbar
        onToggleTerminal={toggleTerminal}
        isTerminalOpen={isTerminalOpen}
        onToggleTheme={toggle}
        isNight={isNight}
      />

      {/* One route, twelve waypoints: the band before each section is the
          trail signage that makes the page read as a single ascent. */}
      <main className="main-content">
        <Hero onOpenTerminal={openTerminal} />
        <RouteTicker />
        <WaypointBand id="about" />
        <About />
        <WaypointBand id="agents" />
        <Agents />
        <WaypointBand id="family" />
        <Family />
        <WaypointBand id="proof" />
        <Proof />
        <WaypointBand id="signal" />
        <LiveSignal />
        <WaypointBand id="expeditions" />
        <ExpeditionLog />
        <WaypointBand id="manifesto" />
        <Manifesto />
        <WaypointBand id="services" />
        <Services />
        <WaypointBand id="testimonials" />
        <Testimonials />
        <WaypointBand id="ventures" />
        <Ventures />
        <WaypointBand id="kit" />
        <Affiliates />
        <WaypointBand id="contact" />
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