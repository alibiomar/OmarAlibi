import PillNav from './PillNav';
import logo from '../public/logo.jpg';

export function Navbar() {
  return (
    <nav className='flex justify-center'>
      <PillNav
        logo={logo.src}
        logoAlt="Omar Alibi Logo"
        items={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '#about' },
          { label: 'Projects', href: '#projects-section' },
          { label: 'Contact', href: '#contact' }
        ]}
        ease="power2.easeOut"
        baseColor="rgba(255, 255, 255, 0.1)"
        pillColor="rgba(255, 255, 255, 0)"
        autoDetectActive={true}
        sectionOffset={80} // Increased for better detection
        hoveredPillTextColor="#ffffff"
        pillTextColor="rgba(255, 255, 255, 0.9)"
      />
    </nav>
  );
}