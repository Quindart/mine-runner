# Task 9: Photo Storage & Data Integration

**Context:** Add persistent photo storage to IndexedDB and integrate it with active run and past runs components. This task modifies earlier tasks (2, 6, 7). Dependencies: Tasks 1-8 complete.

## Files to Create/Modify

### New File
- `src/utils/photoStorage.js` — IndexedDB photo persistence

### Modify Existing Files
- `src/store/runStore.js` — Add photoBlobs state and actions
- `src/components/ActiveRunTab.jsx` — Save photo blobs when captured
- `src/components/PastRunsTab.jsx` — Load and display photos from blobs
- `src/components/RunDetail.jsx` — Display photos in detail view

## photoStorage.js Specification

**Functions:**
```javascript
savePhoto(photoId, photoBlob) => Promise<void>
loadPhoto(photoId) => Promise<Blob | null>
deletePhoto(photoId) => Promise<void>
```

**Implementation:**
- Use IndexedDB (browser's native storage)
- Database name: 'running-app-db'
- Object store name: 'photos'
- Store structure: `{ id: photoId, blob: photoBlob }`
- Create object store on DB upgrade (onupgradeneeded)
- All functions return Promises

## Zustand Store Modifications (runStore.js)

**Add to state:**
```javascript
photoBlobs: {},  // { [photoId]: Blob }
```

**Add actions:**
```javascript
storePhotoBlob: (photoId, blob) => void,
  // Adds blob to photoBlobs state

getPhotoBlob: (photoId) => Blob | null,
  // Retrieves blob from photoBlobs state

clearPhotoBlob: (photoId) => void,
  // Removes blob from photoBlobs state
```

## ActiveRunTab.jsx Modifications

**In handlePhotoCapture function:**
1. After calling `addPhotoToRun(photoId, ...)`, also call:
   ```javascript
   await storePhotoBlob(photoId, compressedBlob)
   ```
2. Wrap in try-catch to handle storage errors
3. Update error message if storage fails

**Result:**
- Photos are compressed → stored in Zustand state → automatically persisted to IndexedDB (via persist middleware)

## PastRunsTab.jsx Modifications

**New effect:** Load all photos from state when component mounts
```javascript
useEffect(() => {
  const photoMap = {}
  allRuns.forEach(run => {
    run.photos.forEach(photoId => {
      const blob = useRunStore.getState().getPhotoBlob(photoId)
      if (blob) {
        photoMap[photoId] = blob
      }
    })
  })
  setPhotos(photoMap)
}, [allRuns])
```

**Pass photos to RunDetail:**
```javascript
{detailOpen && selectedRunId && (
  <RunDetail
    runId={selectedRunId}
    onClose={() => setDetailOpen(false)}
    photos={photos}
  />
)}
```

## RunDetail.jsx Modifications

**Update PhotoGallery:**
```javascript
const photoObjects = run.photos.map(photoId => ({
  id: photoId,
  blob: photos[photoId],
}))

return (
  ...
  <PhotoGallery photos={photoObjects.filter(p => p.blob)} />
)
```

**Result:**
- Photos display with actual Blob data (images show, not placeholders)

## Steps

1. Create `src/utils/photoStorage.js` with 3 functions (savePhoto, loadPhoto, deletePhoto)
2. Modify `src/store/runStore.js`:
   - Add `photoBlobs: {}` to state
   - Add 3 actions (storePhotoBlob, getPhotoBlob, clearPhotoBlob)
3. Modify `src/components/ActiveRunTab.jsx`:
   - In handlePhotoCapture, call `storePhotoBlob(photoId, compressedBlob)`
4. Modify `src/components/PastRunsTab.jsx`:
   - Add useEffect to load all photos
   - Pass photos prop to RunDetail
5. Modify `src/components/RunDetail.jsx`:
   - Map run.photos to blob objects
   - Pass to PhotoGallery with actual blobs
6. Test manually: capture photos during run, view them in past runs
7. Commit with message: "feat: add photo storage to IndexedDB and integrate with components"

## Testing

Manual testing:
1. Start a run, capture a photo
2. Stop the run
3. Switch to Past Runs tab
4. Click the run
5. Verify photo appears in PhotoGallery (not placeholder)
6. Click photo → fullscreen image displays
7. Refresh page (F5)
8. Go back to Past Runs, click same run
9. Verify photo still displays (persisted to IndexedDB)
10. Click Delete Run
11. Verify photos are removed from display

**Storage Verification:**
- Open DevTools → Application → IndexedDB
- Database: running-app-db
- Store: photos
- Verify photo objects stored with IDs

## Notes

- Task 9 is a post-implementation integration task
- It links all previous components together
- Photo persistence is automatic (Zustand persist handles it)
- If photos don't display, check browser's IndexedDB quota (typically 50MB)
