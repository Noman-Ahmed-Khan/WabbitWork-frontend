const FooterSection = () => {
  const links = [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'GitHub', href: 'https://github.com/Noman-Ahmed-Khan' }
  ]

  return (
    <footer
      id="join"
      className="w-full border-t border-outline-variant/10 bg-background flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 lg:px-12 py-10 sm:py-12 scroll-mt-24"
    >
      <div className="mb-8 md:mb-0">
        <div className="text-xl font-black uppercase text-on-background mb-2">WabbitWorks</div>
        <p className="uppercase tracking-[0.2em] text-[15px] text-on-background/40">
          (C) 2026 ALL RIGHTS RESERVED. SECURE TERMINAL V4.2
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 sm:gap-12">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="uppercase tracking-[0.3em] text-[15px] font-black text-on-background/40 hover:text-primary transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}

export default FooterSection
