import { useNavigate } from 'react-router-dom'
import useUIStore from '../stores/uiStore'
import LandingNav from '../components/landing/LandingNav'
import HeroSection from '../components/landing/HeroSection'
import FeaturesSection from '../components/landing/FeaturesSection'
import VisionSection from '../components/landing/VisionSection'
import CTASection from '../components/landing/CTASection'
import FooterSection from '../components/landing/FooterSection'

/**
 * LandingView - Noir Editorial Design
 * Redesigned for maximum clarity and high-fidelity visuals.
 */
export default function LandingView() {
  const navigate = useNavigate()
  const { theme } = useUIStore()
  const isDark = theme === 'dark'
  const handleGetStarted = () => navigate('/auth?mode=register')
  const handleLogin = () => navigate('/auth?mode=login')

  return (
    <div className="bg-background text-on-background font-headline selection:bg-primary selection:text-on-primary overflow-x-hidden">

      {/* Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.06] mix-blend-overlay bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuBTHChCK3EfhW25n_zu3FKGflHE3T3tbrbbyQ1mffzaCw3BSRH2T2mYxiYT0FEdMpFbg4a3SmbIvMWsOYoocMAw2G-MZL5uyUSvAbupf552uwEzkqFC-p-MWCXsg4X4uYMsTSt0OUqpgVKRV8YTWIteBShwCIbPE2D76EF6TGWPtzbu5N7n__VbES-AW1yqo442mnY2DVSXiAui1qzEVV1B1_o10Y4gXIX8JORYlTkdxbtjPY1fk6kQHdFAUvfr8XK6J0LPMt0PRus')]"></div>

      {/* Navigation */}
      <LandingNav handleLogin={handleLogin} />

      <main>
        <HeroSection isDark={isDark} handleGetStarted={handleGetStarted} handleLogin={handleLogin} />
        <FeaturesSection isDark={isDark} />
        <VisionSection isDark={isDark} />
        <CTASection handleGetStarted={handleGetStarted} />
      </main>

      {/* Footer */}
      <FooterSection />

    </div>
  )
}
