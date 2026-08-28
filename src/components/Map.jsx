import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

/**
 * Map Component
 * Renders a Mapbox GL map with GPS route polyline and photo markers
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
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [gpsTrack[0].lng, gpsTrack[0].lat],
        zoom: 13,
      });
    }

    const map = mapRef.current;

    const updateLayers = () => {
      // Remove existing route and photo layers/sources if they exist
      if (map.getLayer('route-line')) {
        map.removeLayer('route-line');
      }
      if (map.getSource('route-source')) {
        map.removeSource('route-source');
      }
      if (map.getLayer('photo-points')) {
        map.removeLayer('photo-points');
      }
      if (map.getLayer('photo-labels')) {
        map.removeLayer('photo-labels');
      }
      if (map.getSource('photo-source')) {
        map.removeSource('photo-source');
      }

      // Add route polyline
      if (gpsTrack.length > 1) {
        const coordinates = gpsTrack.map((point) => [point.lng, point.lat]);
        map.addSource('route-source', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates,
            },
          },
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-source',
          paint: {
            'line-color': '#3388ff',
            'line-width': 3,
            'line-opacity': 0.8,
          },
        });
      }

      // Add photo markers
      if (photos.length > 0) {
        const features = photos.map((photo, index) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [photo.lng, photo.lat],
          },
          properties: {
            index: index + 1,
          },
        }));

        map.addSource('photo-source', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features,
          },
        });

        map.addLayer({
          id: 'photo-points',
          type: 'circle',
          source: 'photo-source',
          paint: {
            'circle-radius': 15,
            'circle-color': '#3388ff',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#fff',
            'circle-opacity': 0.9,
          },
        });

        // Add labels for photo numbers
        map.addLayer({
          id: 'photo-labels',
          type: 'symbol',
          source: 'photo-source',
          layout: {
            'text-field': ['get', 'index'],
            'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
            'text-size': 12,
          },
          paint: {
            'text-color': '#fff',
          },
        });
      }

      // Fit bounds to show all points
      const allCoordinates = [
        ...gpsTrack.map((p) => [p.lng, p.lat]),
        ...photos.map((p) => [p.lng, p.lat]),
      ];

      if (allCoordinates.length > 0) {
        const bounds = allCoordinates.reduce(
          (bounds, coord) => bounds.extend(coord),
          new mapboxgl.LngLatBounds(allCoordinates[0], allCoordinates[0])
        );
        map.fitBounds(bounds, { padding: 50 });
      }
    };

    if (map.isStyleLoaded()) {
      updateLayers();
    } else {
      map.on('load', updateLayers);
    }
  }, [gpsTrack, photos]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

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
