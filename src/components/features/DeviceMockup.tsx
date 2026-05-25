import { Project } from '@/types/project';

interface DeviceMockupProps {
  project: Project;
  className?: string;
}

const DeviceMockup = ({ project, className = '' }: DeviceMockupProps) => {
  if (project.deviceType === 'mobile') {
    return (
      <>
        {/* === MOBILE SCREEN: show real full-screen iframe on small screens === */}
        <div className="md:hidden w-full h-full relative">
          <iframe
            src={project.url}
            title={project.title}
            className="w-full h-full border-0 block"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-pointer-lock"
            loading="lazy"
          />
        </div>

        {/* === DESKTOP/TABLET SCREEN: show phone emulator === */}
        <div className={`hidden md:flex relative items-center justify-center w-full h-full ${className}`}
          style={{ minHeight: 0 }}
        >
          {/* Outer glow ambient light */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-[580px] bg-primary/10 rounded-full blur-3xl" />
          </div>

          {/* Phone chassis — scale down to fit viewport height */}
          {/* Wrapper shrinks the phone to fit available height, scaling from center */}
          <div
            className="relative select-none"
            style={{
              width: '375px',
              height: '780px',
              transform: 'scale(var(--phone-scale, 1))',
              transformOrigin: 'center center',
              flexShrink: 0,
            } as React.CSSProperties}
          >
            <style>{`
              :root {
                --phone-scale: min(1, min(
                  calc((100vw - 80px) / 375),
                  calc((100vh - 180px) / 780)
                ));
              }
            `}</style>
          {/* === LEFT BUTTONS === */}
          {/* Silent switch */}
          <div
            className="absolute rounded-l-sm"
            style={{
              left: '-4px',
              top: '118px',
              width: '4px',
              height: '32px',
              background: 'linear-gradient(to right, #1a1a2e, #2a2a45)',
              boxShadow: '-2px 0 4px rgba(0,0,0,0.6), inset 1px 0 0 rgba(255,255,255,0.06)',
            }}
          />
          {/* Volume Up */}
          <div
            className="absolute rounded-l-sm"
            style={{
              left: '-4px',
              top: '170px',
              width: '4px',
              height: '64px',
              background: 'linear-gradient(to right, #1a1a2e, #2a2a45)',
              boxShadow: '-2px 0 4px rgba(0,0,0,0.6), inset 1px 0 0 rgba(255,255,255,0.06)',
            }}
          />
          {/* Volume Down */}
          <div
            className="absolute rounded-l-sm"
            style={{
              left: '-4px',
              top: '248px',
              width: '4px',
              height: '64px',
              background: 'linear-gradient(to right, #1a1a2e, #2a2a45)',
              boxShadow: '-2px 0 4px rgba(0,0,0,0.6), inset 1px 0 0 rgba(255,255,255,0.06)',
            }}
          />

          {/* === RIGHT BUTTON (Power/Lock) === */}
          <div
            className="absolute rounded-r-sm"
            style={{
              right: '-4px',
              top: '196px',
              width: '4px',
              height: '80px',
              background: 'linear-gradient(to left, #1a1a2e, #2a2a45)',
              boxShadow: '2px 0 4px rgba(0,0,0,0.6), inset -1px 0 0 rgba(255,255,255,0.06)',
            }}
          />

          {/* === MAIN PHONE BODY === */}
          <div
            className="absolute inset-0 rounded-[48px] overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #1c1c2e 0%, #0d0d1a 50%, #12121f 100%)',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.10),
                0 0 0 2px rgba(0,0,0,0.9),
                0 40px 100px rgba(0,0,0,0.85),
                0 10px 30px rgba(0,0,0,0.6),
                inset 0 1px 0 rgba(255,255,255,0.12),
                inset 0 -1px 0 rgba(255,255,255,0.04)
              `,
            }}
          >
            {/* Metallic rim highlight */}
            <div
              className="absolute inset-0 rounded-[48px] pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.03) 100%)',
                zIndex: 20,
              }}
            />

            {/* Screen area */}
            <div className="absolute inset-[3px] rounded-[46px] overflow-hidden bg-black flex flex-col">

              {/* === STATUS BAR === */}
              <div
                className="relative flex items-center justify-between px-7 flex-shrink-0"
                style={{ height: '52px', zIndex: 15 }}
              >
                {/* Time */}
                <span className="text-white font-semibold" style={{ fontSize: '15px', letterSpacing: '-0.3px' }}>
                  9:41
                </span>

                {/* Dynamic Island */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-3 flex items-center justify-center gap-2 px-4"
                  style={{
                    width: '120px',
                    height: '34px',
                    background: '#000',
                    borderRadius: '20px',
                    zIndex: 20,
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Camera dot */}
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#1a1a1a',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: 'inset 0 0 4px rgba(0,0,0,0.8)',
                    }}
                  />
                  {/* FaceID sensor */}
                  <div
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: '#2a2a3a',
                      boxShadow: '0 0 3px rgba(100,150,255,0.3)',
                    }}
                  />
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-1.5">
                  {/* Signal bars */}
                  <svg width="18" height="12" viewBox="0 0 18 12" fill="white">
                    <rect x="0" y="8" width="3" height="4" rx="0.5" opacity="1"/>
                    <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" opacity="1"/>
                    <rect x="9" y="3" width="3" height="9" rx="0.5" opacity="1"/>
                    <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.35"/>
                  </svg>
                  {/* WiFi */}
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                    <path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="white"/>
                    <path d="M3.5 6.5A6.5 6.5 0 0112.5 6.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
                    <path d="M1 4A9.5 9.5 0 0115 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                  </svg>
                  {/* Battery */}
                  <div className="flex items-center gap-0.5">
                    <div
                      style={{
                        width: '25px',
                        height: '12px',
                        border: '1.5px solid rgba(255,255,255,0.65)',
                        borderRadius: '3px',
                        padding: '1.5px',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <div style={{ width: '70%', height: '100%', background: 'white', borderRadius: '1.5px' }} />
                    </div>
                    <div style={{ width: '2px', height: '5px', background: 'rgba(255,255,255,0.5)', borderRadius: '0 1px 1px 0' }} />
                  </div>
                </div>
              </div>

              {/* === IFRAME SCREEN CONTENT === */}
              <div className="flex-1 relative overflow-hidden">
                <iframe
                  src={project.url}
                  title={project.title}
                  className="w-full h-full border-0 block"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-pointer-lock"
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    display: 'block',
                  }}
                />
              </div>

              {/* === HOME INDICATOR === */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ height: '34px', background: 'rgba(0,0,0,0.85)' }}
              >
                <div
                  style={{
                    width: '134px',
                    height: '5px',
                    background: 'rgba(255,255,255,0.35)',
                    borderRadius: '3px',
                  }}
                />
              </div>

            </div>{/* end screen area */}
          </div>{/* end phone body */}
        </div>{/* end chassis */}
        </div>{/* end desktop wrapper */}
      </>
    );
  }

  if (project.deviceType === 'tablet') {
    return (
      <div className={`relative flex items-center justify-center w-full h-full ${className}`}
        style={{ minHeight: 0 }}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[700px] bg-primary/8 rounded-full blur-3xl" />
        </div>

        <div className="relative" style={{
          width: '600px',
          height: '800px',
          transform: 'scale(var(--tablet-scale, 1))',
          transformOrigin: 'center center',
          flexShrink: 0,
          '--tablet-scale': 'min(1, min(calc((100vw - 80px) / 600), calc((100vh - 180px) / 800)))',
        } as React.CSSProperties}>
          {/* Power button */}
          <div
            className="absolute rounded-r-sm"
            style={{
              right: '-4px',
              top: '140px',
              width: '4px',
              height: '60px',
              background: 'linear-gradient(to left, #1a1a2e, #2a2a45)',
              boxShadow: '2px 0 4px rgba(0,0,0,0.6)',
            }}
          />
          {/* Volume */}
          <div
            className="absolute rounded-r-sm"
            style={{
              right: '-4px',
              top: '230px',
              width: '4px',
              height: '50px',
              background: 'linear-gradient(to left, #1a1a2e, #2a2a45)',
              boxShadow: '2px 0 4px rgba(0,0,0,0.6)',
            }}
          />

          <div
            className="absolute inset-0 rounded-[36px] overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #1c1c2e 0%, #0d0d1a 100%)',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.10),
                0 0 0 2px rgba(0,0,0,0.8),
                0 40px 100px rgba(0,0,0,0.8),
                inset 0 1px 0 rgba(255,255,255,0.1)
              `,
            }}
          >
            <div className="absolute inset-0 rounded-[36px] pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)', zIndex: 20 }} />

            <div className="absolute inset-[3px] rounded-[34px] overflow-hidden bg-black flex flex-col">
              {/* Status bar */}
              <div className="flex items-center justify-between px-8 flex-shrink-0" style={{ height: '40px' }}>
                <span className="text-white font-semibold text-sm">9:41</span>
                <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gray-700" />
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="10" viewBox="0 0 16 10" fill="white" opacity="0.8">
                    <rect x="0" y="6" width="3" height="4" rx="0.5"/>
                    <rect x="4.5" y="4" width="3" height="6" rx="0.5"/>
                    <rect x="9" y="2" width="3" height="8" rx="0.5"/>
                    <rect x="13.5" y="0" width="3" height="10" rx="0.5" opacity="0.4"/>
                  </svg>
                  <div style={{ width: '24px', height: '11px', border: '1.5px solid rgba(255,255,255,0.6)', borderRadius: '3px', padding: '1.5px' }}>
                    <div style={{ width: '65%', height: '100%', background: 'white', borderRadius: '1px' }} />
                  </div>
                </div>
              </div>

              {/* iframe */}
              <div className="flex-1 relative overflow-hidden">
                <iframe
                  src={project.url}
                  title={project.title}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-pointer-lock"
                  loading="lazy"
                />
              </div>

              {/* Home bar */}
              <div className="flex items-center justify-center flex-shrink-0" style={{ height: '28px', background: 'rgba(0,0,0,0.8)' }}>
                <div style={{ width: '100px', height: '4px', background: 'rgba(255,255,255,0.3)', borderRadius: '2px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop / Browser frame
  return (
    <div className={`relative flex items-center justify-center w-full h-full ${className}`}>
      <div className="relative desktop-frame rounded-xl overflow-hidden w-full"
        style={{ maxWidth: '960px', height: '100%', maxHeight: 'calc(100vh - 200px)', aspectRatio: '16/10' }}>
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-black/50 border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
            <div className="w-3 h-3 rounded-full bg-green-400/80" />
          </div>
          <div className="flex-1 mx-3 bg-white/8 border border-white/10 rounded-md px-3 py-1 flex items-center gap-2">
            <div className="w-3 h-3 text-green-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-xs text-muted-foreground font-medium tracking-wide">
              Secure Preview — {project.title}
            </span>
          </div>
          <div className="flex gap-2 opacity-50">
            <div className="w-4 h-4 text-muted-foreground">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="screen-glow relative w-full" style={{ height: 'calc(100% - 44px)' }}>
          <iframe
            src={project.url}
            title={project.title}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-pointer-lock"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceMockup;
