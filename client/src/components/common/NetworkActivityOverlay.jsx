import { useEffect, useState } from 'react';
import { subscribeToNetworkActivity } from '../../services/api.js';

const hostingProvider = (import.meta.env.VITE_HOSTING_PROVIDER || '').trim().toLowerCase();
const isRenderDeployment = hostingProvider === 'render';

const NetworkActivityOverlay = () => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showWakeMessage, setShowWakeMessage] = useState(false);

  useEffect(() => subscribeToNetworkActivity(({ activeRequests: nextCount }) => setActiveRequests(nextCount)), []);

  useEffect(() => {
    if (activeRequests === 0) {
      setShowOverlay(false);
      setShowWakeMessage(false);
      return undefined;
    }

    const overlayTimer = window.setTimeout(() => setShowOverlay(true), 600);
    const wakeTimer = window.setTimeout(() => setShowWakeMessage(true), 6000);

    return () => {
      window.clearTimeout(overlayTimer);
      window.clearTimeout(wakeTimer);
    };
  }, [activeRequests]);

  if (!showOverlay) {
    return null;
  }

  return (
    <div className="network-overlay" role="status" aria-live="polite">
      <div className="network-overlay__card">
        <div className="loading-spinner" aria-hidden="true" />
        <strong>{showWakeMessage ? 'The server is taking longer than usual...' : 'Loading your workspace...'}</strong>
        <p>
          {showWakeMessage
            ? isRenderDeployment
              ? 'Render cold starts can take up to 50 seconds. Your request is still in progress.'
              : 'Your request is still in progress. If you are running locally, check that both frontend and backend servers are up.'
            : 'Please wait while we connect to the backend.'}
        </p>
      </div>
    </div>
  );
};

export default NetworkActivityOverlay;
