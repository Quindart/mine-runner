import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Map Component
 * Renders a Leaflet map with GPS route polyline and photo markers
 *
 * Props:
 * - gpsTrack: [{lat, lng, timestamp}, ...] - Array of GPS coordinates
 * - photos: [{id, lat, lng}, ...] - Optional array of photo locations
 */
export function Map({ gpsTrack = [], photos = [] }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !gpsTrack || gpsTrack.length === 0) {
      return;
    }

    // Initialize map if not already done
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [gpsTrack[0].lat, gpsTrack[0].lng],
        13
      );

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers (except tiles)
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add polyline for GPS route
    if (gpsTrack.length > 1) {
      const latLngs = gpsTrack.map((point) => [point.lat, point.lng]);
      L.polyline(latLngs, {
        color: '#3388ff',
        weight: 3,
        opacity: 0.8,
      }).addTo(map);
    }

    // Add markers for photos
    photos.forEach((photo, index) => {
      const divIcon = L.divIcon({
        className: 'photo-marker',
        html: `<div style="
          background-color: #3388ff;
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">${index + 1}</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      L.marker([photo.lat, photo.lng], { icon: divIcon }).addTo(map);
    });

    // Fit bounds to route and markers
    const allPoints = [
      ...gpsTrack.map((p) => [p.lat, p.lng]),
      ...photos.map((p) => [p.lat, p.lng]),
    ];

    if (allPoints.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [gpsTrack, photos]);

  return (
    <div
      ref={mapContainerRef}
      className="map-container"
      style={{
        height: '400px',
        width: '100%',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}
