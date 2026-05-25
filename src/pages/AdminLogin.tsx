import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { verifyPin, setAdminLoggedIn } from '@/lib/storage';
import { toast } from 'sonner';

const AdminLogin = () => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!pin) return;
    setLoading(true);
    setTimeout(() => {
      if (verifyPin(pin)) {
        setAdminLoggedIn(true);
        toast.success('Welcome back!');
        navigate('/admin/dashboard');
      } else {
        toast.error('Incorrect PIN. Please try again.');
        setPin('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center pt-16 px-4">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-sm">
        <div className="glass-strong rounded-2xl p-8 border border-border/60 shadow-2xl">
          {/* Icon */}
          <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 glow">
            <Shield className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-1">Admin Access</h1>
          <p className="text-sm text-muted-foreground text-center mb-8">
            Enter your PIN to manage projects
          </p>

          <div className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={e => setPin(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Enter PIN"
                maxLength={10}
                className="pl-10 pr-10 h-12 bg-secondary/60 border-border/70 focus:border-primary/60 text-center text-lg tracking-widest"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              onClick={handleLogin}
              disabled={!pin || loading}
              className="w-full h-12 gradient-bg text-white border-0 hover:opacity-90 font-semibold text-base"
            >
              {loading ? 'Verifying...' : 'Unlock Dashboard'}
            </Button>
          </div>


        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
