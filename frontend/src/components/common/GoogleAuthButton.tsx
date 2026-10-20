import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onDemoFallback?: () => void;
  buttonText?: string;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  onSuccess,
  onError,
  onDemoFallback,
  buttonText = 'Continue with Google',
}) => {
  const { loginWithGoogle } = useAuth();
  const toast = useToast();
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

  const handleCredentialResponse = async (response: { credential: string }) => {
    if (!response.credential) {
      toast.error('No credential received from Google');
      return;
    }

    setIsVerifying(true);
    try {
      await loginWithGoogle(response.credential);
      toast.success('Signed in with Google successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      const message = err.message || 'Google sign-in failed. Please try again.';
      toast.error(message);
      if (onError) onError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!clientId) return;

    let checkInterval: any = null;
    let attempts = 0;

    const setupGsi = () => {
      if (window.google?.accounts?.id && buttonContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          buttonContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(buttonContainerRef.current, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        } catch (e) {
          console.error('Failed to initialize Google Sign-In:', e);
        }
        return true;
      }
      return false;
    };

    if (!setupGsi()) {
      checkInterval = setInterval(() => {
        attempts++;
        if (setupGsi() || attempts > 20) {
          clearInterval(checkInterval);
        }
      }, 300);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [clientId]);

  const handleMissingClientIdClick = () => {
    toast.info('To enable live Google OAuth: Add VITE_GOOGLE_CLIENT_ID in frontend/.env and GOOGLE_CLIENT_ID in backend/.env');
    if (onDemoFallback) {
      onDemoFallback();
    }
  };

  if (isVerifying) {
    return (
      <div
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          backgroundColor: '#F8FAFC',
          border: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.86rem',
          color: 'var(--ink)',
          fontWeight: 600,
        }}
      >
        <div className="spinner-border spinner-border-sm" role="status" style={{ width: '16px', height: '16px', border: '2px solid #CBD5E1', borderTopColor: '#2563EB', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span>Verifying Google account...</span>
      </div>
    );
  }

  // If Client ID is provided, render the official GSI button container
  if (clientId) {
    return (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div ref={buttonContainerRef} style={{ width: '100%', minHeight: '44px' }} />
      </div>
    );
  }

  // Fallback button when Google Client ID is not yet provided in .env
  return (
    <button
      type="button"
      onClick={handleMissingClientIdClick}
      className="btn btn-secondary"
      style={{
        width: '100%',
        padding: '9px 12px',
        borderRadius: '8px',
        fontSize: '0.84rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
      title="Configure VITE_GOOGLE_CLIENT_ID in frontend/.env to activate live Google login"
    >
      <svg width="16" height="16" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
      </svg>
      {buttonText}
    </button>
  );
};
