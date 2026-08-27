import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

/**
 * Haversine formula: calculate distance between two GPS coordinates
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const haversine = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate total distance from GPS track
 * @param {Array} gpsTrack - Array of GPS points [{lat, lng, timestamp}, ...]
 * @returns {number} Total distance in kilometers
 */
const calculateDistance = (gpsTrack) => {
  if (!gpsTrack || gpsTrack.length < 2) return 0;
  let distance = 0;
  for (let i = 1; i < gpsTrack.length; i++) {
    const prev = gpsTrack[i - 1];
    const curr = gpsTrack[i];
    distance += haversine(prev.lat, prev.lng, curr.lat, curr.lng);
  }
  return distance;
};

/**
 * Calculate pace (minutes per km) from duration and distance
 * @param {number} duration - Duration in seconds
 * @param {number} distance - Distance in kilometers
 * @returns {number} Pace in minutes per km, or 0 if distance is 0
 */
const calculatePace = (duration, distance) => {
  if (distance === 0) return 0;
  return (duration / 60) / distance; // Convert seconds to minutes, then divide by km
};

/**
 * Estimate calories burned (simplified formula)
 * @param {number} distance - Distance in kilometers
 * @param {number} duration - Duration in seconds
 * @returns {number} Estimated calories
 */
const estimateCalories = (distance, duration) => {
  // Very simplified: ~50 calories per km * ~60 per hour of running
  // Rough estimate: 50 * distance + (duration/3600) * 50
  const durationHours = duration / 3600;
  return Math.round(50 * distance + durationHours * 300);
};

export const useRunStore = create(
  persist(
    (set, get) => ({
      // State
      currentRun: null,
      isRunning: false,
      allRuns: [],
      selectedRunId: null,
      photoBlobs: {}, // { photoId: blob, ... }

      // Actions
      startRun: () => {
        const newRun = {
          id: uuidv4(),
          startTime: Date.now(),
          endTime: null,
          distance: 0,
          duration: 0,
          pace: 0,
          calories: 0,
          gpsTrack: [],
          photos: [],
        };
        set({
          currentRun: newRun,
          isRunning: true,
        });
      },

      stopRun: () => {
        const state = get();
        if (!state.currentRun) return;

        const endTime = Date.now();
        const duration = Math.floor((endTime - state.currentRun.startTime) / 1000);
        const distance = calculateDistance(state.currentRun.gpsTrack);
        const pace = calculatePace(duration, distance);
        const calories = estimateCalories(distance, duration);

        const completedRun = {
          ...state.currentRun,
          endTime,
          duration,
          distance,
          pace,
          calories,
        };

        set({
          currentRun: null,
          isRunning: false,
          allRuns: [...state.allRuns, completedRun],
        });
      },

      addGpsPoint: (lat, lng, timestamp = Date.now()) => {
        const state = get();
        if (!state.currentRun || !state.isRunning) return;

        const gpsPoint = { lat, lng, timestamp };
        const updatedGpsTrack = [...state.currentRun.gpsTrack, gpsPoint];
        const distance = calculateDistance(updatedGpsTrack);

        set({
          currentRun: {
            ...state.currentRun,
            gpsTrack: updatedGpsTrack,
            distance,
          },
        });
      },

      addPhotoToRun: (photoId, lat, lng, timestamp = Date.now()) => {
        const state = get();
        // Add to current run if running, otherwise add to selected run
        const targetRun = state.isRunning ? state.currentRun : state.selectedRunId && state.allRuns.find(r => r.id === state.selectedRunId);

        if (!targetRun) return;

        const updatedPhotos = [...targetRun.photos, photoId];

        if (state.isRunning) {
          // Update current run
          set({
            currentRun: {
              ...targetRun,
              photos: updatedPhotos,
            },
          });
        } else {
          // Update in allRuns
          const updatedRuns = state.allRuns.map(r =>
            r.id === targetRun.id ? { ...r, photos: updatedPhotos } : r
          );
          set({ allRuns: updatedRuns });
        }
      },

      deleteRun: (runId) => {
        const state = get();
        const updatedRuns = state.allRuns.filter(r => r.id !== runId);
        const newSelectedId = state.selectedRunId === runId ? null : state.selectedRunId;
        set({
          allRuns: updatedRuns,
          selectedRunId: newSelectedId,
        });
      },

      selectRun: (runId) => {
        set({ selectedRunId: runId });
      },

      updateRunStats: (runId) => {
        const state = get();
        const run = state.allRuns.find(r => r.id === runId);
        if (!run) return;

        const distance = calculateDistance(run.gpsTrack);
        const pace = calculatePace(run.duration, distance);
        const calories = estimateCalories(distance, run.duration);

        const updatedRun = {
          ...run,
          distance,
          pace,
          calories,
        };

        const updatedRuns = state.allRuns.map(r =>
          r.id === runId ? updatedRun : r
        );
        set({ allRuns: updatedRuns });
      },

      storePhotoBlob: (photoId, blob) => {
        const state = get();
        set({
          photoBlobs: {
            ...state.photoBlobs,
            [photoId]: blob,
          },
        });
      },

      getPhotoBlob: (photoId) => {
        const state = get();
        return state.photoBlobs[photoId] || null;
      },

      clearPhotoBlob: (photoId) => {
        const state = get();
        const updatedBlobs = { ...state.photoBlobs };
        delete updatedBlobs[photoId];
        set({ photoBlobs: updatedBlobs });
      },
    }),
    {
      name: 'run-store', // Store name in localStorage/IndexedDB
    }
  )
);
