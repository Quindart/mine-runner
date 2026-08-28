import { useState, useEffect } from 'react';
import { useRunStore } from '../store/runStore';
import { useGeolocation } from './useGeolocation';

/**
 * Hook that manages the active run lifecycle: GPS tracking and elapsed time
 * Integrates with useRunStore for GPS accumulation and useGeolocation for GPS updates
 * @returns {Object} { elapsedSeconds, geoError }
 */
export function useRunTracking() {
  const { isRunning, currentRun, addGpsPoint } = useRunStore();
  const { position, error: geoError, startWatching, stopWatching } = useGeolocation();
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Start/stop GPS watching based on isRunning state
  useEffect(() => {
    if (isRunning) {
      startWatching();
    } else {
      stopWatching();
      setElapsedSeconds(0);
    }
  }, [isRunning]);

  // Add GPS point to run when position updates
  useEffect(() => {
    if (isRunning && position && currentRun) {
      addGpsPoint(position.lat, position.lng, position.timestamp);
    }
  }, [position, isRunning]);

  // Timer: increment elapsedSeconds every 1 second when running
  useEffect(() => {
    if (!isRunning) {
      setElapsedSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  return {
    elapsedSeconds,
    geoError,
  };
}
