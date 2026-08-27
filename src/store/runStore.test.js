import { describe, it, expect, beforeEach } from 'vitest';
import { useRunStore, haversine } from './runStore';

describe('runStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    const store = useRunStore.getState();
    useRunStore.setState({
      currentRun: null,
      isRunning: false,
      allRuns: [],
      selectedRunId: null,
      photoBlobs: {},
    });
  });

  describe('startRun', () => {
    it('should create a new run with correct initial state', () => {
      const { startRun } = useRunStore.getState();
      startRun();

      const state = useRunStore.getState();
      expect(state.currentRun).not.toBeNull();
      expect(state.currentRun.id).toBeDefined();
      expect(typeof state.currentRun.id).toBe('string');
      expect(state.currentRun.startTime).toBeDefined();
      expect(typeof state.currentRun.startTime).toBe('number');
      expect(state.currentRun.endTime).toBeNull();
      expect(state.currentRun.distance).toBe(0);
      expect(state.currentRun.duration).toBe(0);
      expect(state.currentRun.pace).toBe(0);
      expect(state.currentRun.calories).toBe(0);
      expect(state.currentRun.gpsTrack).toEqual([]);
      expect(state.currentRun.photos).toEqual([]);
      expect(state.isRunning).toBe(true);
    });

    it('should set isRunning to true', () => {
      const { startRun } = useRunStore.getState();
      expect(useRunStore.getState().isRunning).toBe(false);
      startRun();
      expect(useRunStore.getState().isRunning).toBe(true);
    });
  });

  describe('stopRun', () => {
    it('should save run to allRuns and reset state', () => {
      const { startRun, stopRun } = useRunStore.getState();
      startRun();
      const startedRun = useRunStore.getState().currentRun;

      // Add a GPS point to make distance > 0
      const { addGpsPoint } = useRunStore.getState();
      addGpsPoint(48.8566, 2.3522, Date.now());
      addGpsPoint(48.8575, 2.3535, Date.now() + 1000);

      stopRun();

      const state = useRunStore.getState();
      expect(state.currentRun).toBeNull();
      expect(state.isRunning).toBe(false);
      expect(state.allRuns.length).toBe(1);
      expect(state.allRuns[0].id).toBe(startedRun.id);
      expect(state.allRuns[0].endTime).not.toBeNull();
      expect(typeof state.allRuns[0].endTime).toBe('number');
      expect(state.allRuns[0].duration).toBeGreaterThanOrEqual(0);
      expect(state.allRuns[0].distance).toBeGreaterThan(0);
    });

    it('should calculate duration correctly', () => {
      const { startRun, stopRun } = useRunStore.getState();
      const beforeStart = Date.now();
      startRun();
      const afterStart = Date.now();

      // Wait a bit to ensure duration > 0
      const startTime = useRunStore.getState().currentRun.startTime;

      stopRun();

      const completedRun = useRunStore.getState().allRuns[0];
      const duration = Math.floor((completedRun.endTime - startTime) / 1000);
      expect(completedRun.duration).toBe(duration);
      expect(completedRun.duration).toBeGreaterThanOrEqual(0);
    });

    it('should not stop run if currentRun is null', () => {
      useRunStore.setState({ currentRun: null, isRunning: false });
      const { stopRun } = useRunStore.getState();
      stopRun();

      const state = useRunStore.getState();
      expect(state.allRuns.length).toBe(0);
    });
  });

  describe('addGpsPoint', () => {
    it('should append GPS point to gpsTrack', () => {
      const { startRun, addGpsPoint } = useRunStore.getState();
      startRun();

      addGpsPoint(48.8566, 2.3522);

      const state = useRunStore.getState();
      expect(state.currentRun.gpsTrack.length).toBe(1);
      expect(state.currentRun.gpsTrack[0].lat).toBe(48.8566);
      expect(state.currentRun.gpsTrack[0].lng).toBe(2.3522);
      expect(state.currentRun.gpsTrack[0].timestamp).toBeDefined();
    });

    it('should add multiple GPS points in order', () => {
      const { startRun, addGpsPoint } = useRunStore.getState();
      startRun();

      const points = [
        { lat: 48.8566, lng: 2.3522 },
        { lat: 48.8575, lng: 2.3535 },
        { lat: 48.8590, lng: 2.3550 },
      ];

      points.forEach(p => addGpsPoint(p.lat, p.lng));

      const state = useRunStore.getState();
      expect(state.currentRun.gpsTrack.length).toBe(3);
      expect(state.currentRun.gpsTrack[0].lat).toBe(48.8566);
      expect(state.currentRun.gpsTrack[1].lat).toBe(48.8575);
      expect(state.currentRun.gpsTrack[2].lat).toBe(48.8590);
    });

    it('should update distance when GPS points are added', () => {
      const { startRun, addGpsPoint } = useRunStore.getState();
      startRun();

      const initialDistance = useRunStore.getState().currentRun.distance;
      addGpsPoint(48.8566, 2.3522);
      const afterFirstPoint = useRunStore.getState().currentRun.distance;

      addGpsPoint(48.8575, 2.3535);
      const afterSecondPoint = useRunStore.getState().currentRun.distance;

      expect(initialDistance).toBe(0);
      expect(afterFirstPoint).toBe(0); // Only one point, no distance yet
      expect(afterSecondPoint).toBeGreaterThan(0);
    });

    it('should not add GPS point if not running', () => {
      const { addGpsPoint } = useRunStore.getState();
      addGpsPoint(48.8566, 2.3522);

      const state = useRunStore.getState();
      expect(state.currentRun).toBeNull();
      expect(state.allRuns.length).toBe(0);
    });
  });

  describe('addPhotoToRun', () => {
    it('should add photo to current run when running', () => {
      const { startRun, addPhotoToRun } = useRunStore.getState();
      startRun();

      addPhotoToRun('photo-1', 48.8566, 2.3522);

      const state = useRunStore.getState();
      expect(state.currentRun.photos.length).toBe(1);
      expect(state.currentRun.photos[0]).toBe('photo-1');
    });

    it('should add multiple photos in order', () => {
      const { startRun, addPhotoToRun } = useRunStore.getState();
      startRun();

      addPhotoToRun('photo-1', 48.8566, 2.3522);
      addPhotoToRun('photo-2', 48.8575, 2.3535);
      addPhotoToRun('photo-3', 48.8590, 2.3550);

      const state = useRunStore.getState();
      expect(state.currentRun.photos.length).toBe(3);
      expect(state.currentRun.photos).toEqual(['photo-1', 'photo-2', 'photo-3']);
    });
  });

  describe('deleteRun', () => {
    it('should remove run from allRuns', () => {
      const { startRun, stopRun, deleteRun } = useRunStore.getState();
      startRun();
      const runId = useRunStore.getState().currentRun.id;
      stopRun();

      expect(useRunStore.getState().allRuns.length).toBe(1);
      deleteRun(runId);
      expect(useRunStore.getState().allRuns.length).toBe(0);
    });

    it('should clear selectedRunId if deleted run was selected', () => {
      const { startRun, stopRun, deleteRun, selectRun } = useRunStore.getState();
      startRun();
      const runId = useRunStore.getState().currentRun.id;
      stopRun();

      selectRun(runId);
      expect(useRunStore.getState().selectedRunId).toBe(runId);

      deleteRun(runId);
      expect(useRunStore.getState().selectedRunId).toBeNull();
    });

    it('should preserve selectedRunId if different run is deleted', () => {
      const { startRun, stopRun, deleteRun, selectRun } = useRunStore.getState();

      // Create first run
      startRun();
      const run1Id = useRunStore.getState().currentRun.id;
      stopRun();

      // Create second run
      startRun();
      const run2Id = useRunStore.getState().currentRun.id;
      stopRun();

      selectRun(run2Id);
      deleteRun(run1Id);

      expect(useRunStore.getState().selectedRunId).toBe(run2Id);
      expect(useRunStore.getState().allRuns.length).toBe(1);
    });
  });

  describe('selectRun', () => {
    it('should set selectedRunId', () => {
      const { startRun, stopRun, selectRun } = useRunStore.getState();
      startRun();
      const runId = useRunStore.getState().currentRun.id;
      stopRun();

      selectRun(runId);
      expect(useRunStore.getState().selectedRunId).toBe(runId);
    });

    it('should allow changing selected run', () => {
      const { startRun, stopRun, selectRun } = useRunStore.getState();

      // Create two runs
      startRun();
      const run1Id = useRunStore.getState().currentRun.id;
      stopRun();

      startRun();
      const run2Id = useRunStore.getState().currentRun.id;
      stopRun();

      selectRun(run1Id);
      expect(useRunStore.getState().selectedRunId).toBe(run1Id);

      selectRun(run2Id);
      expect(useRunStore.getState().selectedRunId).toBe(run2Id);
    });
  });

  describe('updateRunStats', () => {
    it('should update stats of a completed run', () => {
      const { startRun, stopRun, addGpsPoint, updateRunStats } = useRunStore.getState();
      startRun();
      const runId = useRunStore.getState().currentRun.id;

      addGpsPoint(48.8566, 2.3522);
      addGpsPoint(48.8575, 2.3535);

      stopRun();

      const run = useRunStore.getState().allRuns.find(r => r.id === runId);
      const oldDistance = run.distance;

      updateRunStats(runId);

      const updatedRun = useRunStore.getState().allRuns.find(r => r.id === runId);
      expect(updatedRun.distance).toBe(oldDistance);
      expect(updatedRun.pace).toBeGreaterThanOrEqual(0);
      expect(updatedRun.calories).toBeGreaterThanOrEqual(0);
    });

    it('should not update stats if run does not exist', () => {
      const { updateRunStats } = useRunStore.getState();
      const initialRuns = useRunStore.getState().allRuns;

      updateRunStats('non-existent-id');

      expect(useRunStore.getState().allRuns).toEqual(initialRuns);
    });
  });

  describe('photoBlobs', () => {
    it('should store and retrieve photo blob', () => {
      const { storePhotoBlob, getPhotoBlob } = useRunStore.getState();
      const blob = new Blob(['test'], { type: 'image/jpeg' });

      storePhotoBlob('photo-1', blob);
      const retrieved = getPhotoBlob('photo-1');

      expect(retrieved).toBe(blob);
    });

    it('should return null for non-existent photo blob', () => {
      const { getPhotoBlob } = useRunStore.getState();
      const result = getPhotoBlob('non-existent');
      expect(result).toBeNull();
    });

    it('should clear photo blob', () => {
      const { storePhotoBlob, getPhotoBlob, clearPhotoBlob } = useRunStore.getState();
      const blob = new Blob(['test'], { type: 'image/jpeg' });

      storePhotoBlob('photo-1', blob);
      expect(getPhotoBlob('photo-1')).toBe(blob);

      clearPhotoBlob('photo-1');
      expect(getPhotoBlob('photo-1')).toBeNull();
    });

    it('should handle multiple photo blobs', () => {
      const { storePhotoBlob, getPhotoBlob } = useRunStore.getState();
      const blob1 = new Blob(['test1'], { type: 'image/jpeg' });
      const blob2 = new Blob(['test2'], { type: 'image/jpeg' });

      storePhotoBlob('photo-1', blob1);
      storePhotoBlob('photo-2', blob2);

      expect(getPhotoBlob('photo-1')).toBe(blob1);
      expect(getPhotoBlob('photo-2')).toBe(blob2);
    });
  });

  describe('haversine', () => {
    it('should calculate distance between two coordinates', () => {
      // Paris Eiffel Tower coordinates
      const lat1 = 48.8584;
      const lng1 = 2.2945;
      // Approximately 1km away
      const lat2 = 48.8656;
      const lng2 = 2.3068;

      const distance = haversine(lat1, lng1, lat2, lng2);
      expect(distance).toBeGreaterThan(0);
      expect(distance).toBeLessThan(2); // Should be less than 2km
    });

    it('should return 0 for same coordinates', () => {
      const distance = haversine(48.8566, 2.3522, 48.8566, 2.3522);
      expect(distance).toBe(0);
    });
  });
});
