import { Link, useLocation } from 'react-router-dom';
import { Monitor, Settings } from 'lucide-react';
import kennyImg from '@/assets/kenny.jpg';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-full overflow-hidden shadow-lg ring-2 ring-primary/40 group-hover:ring-primary/80 transition-all duration-200">
              <img src={kennyImg} alt="Logo" className="w-full h-full object-cover object-top" />
            </div>
            <span className="font-bold text-lg font-['Space_Grotesk'] gradient-text">
              GOOX PROJECT SHOWCASE
            </span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === '/'
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Monitor className="w-4 h-4" />
              Portfolio
            </Link>
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname.startsWith('/admin')
                  ? 'bg-primary/15 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
