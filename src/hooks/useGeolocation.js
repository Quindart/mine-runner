import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook that wraps the browser's Geolocation API with watchPosition
 * @returns {Object} { position, error, watching, startWatching, stopWatching }
 */
export function useGeolocation() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [watching, setWatching] = useState(false);
  const watchIdRef = useRef(null);

  const startWatching = useCallback(() => {
    // Check if Geolocation API is available
    if (!navigator.geolocation) {
      setError('Geolocation API not available');
      setWatching(false);
      return;
    }

    // Request permission and start watching position
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        // Success callback: update position state
        const { latitude, longitude } = pos.coords;
        setPosition({
          lat: latitude,
          lng: longitude,
          timestamp: Date.now(),
        });
        setError(null);
        setWatching(true);
      },
      (err) => {
        // Error callback: set error message
        let errorMsg = 'Unknown error';
        if (err.code === 1) {
          errorMsg = 'Permission denied';
        } else if (err.code === 2) {
          errorMsg = 'Position unavailable';
        } else if (err.code === 3) {
          errorMsg = 'Request timeout';
        }
        setError(errorMsg);
        setWatching(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    watchIdRef.current = id;
  }, []);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      setWatching(false);
      watchIdRef.current = null;
    }
  }, []);

  // Cleanup on unmount: clear watch
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    position,
    error,
    watching,
    startWatching,
    stopWatching,
  };
}
