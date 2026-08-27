import { useRef, useEffect, useState } from 'react'
import mapboxgl from 'mapbox-gl'
// mapbox-gl provides the stylesheet at runtime, but does not expose TypeScript declarations for it.
// @ts-expect-error TS cannot resolve this side-effect CSS import.
import 'mapbox-gl/dist/mapbox-gl.css';
import MapError from '@/components/atoms/MapError';

const ENV_MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || null
const FALLBACK_TOKEN = 'pk.eyJ1IjoicXVpbmRhcnQiLCJhIjoiY210YjdsZjZzMDJkYTJ3cjZhdnF0NDM0ZiJ9.C2sdoaNvLggtRWpB0du88w'
const ACCESS_TOKEN = ENV_MAPBOX_TOKEN || FALLBACK_TOKEN
const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12'

mapboxgl.accessToken = ACCESS_TOKEN


interface LocationState {
  longitude: number
  latitude: number
  zoom: number
}

export default function Map() {
  const ref = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<LocationState>({
    longitude: 107.5909,
    latitude: 16.4637,
    zoom: 13,
  })
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setLocation({
            latitude,
            longitude,
            zoom: 15,
          })
          setLoading(false)
        },
        (_err) => {
          setLoading(false)
        }
      )
    } else {
      console.warn('⚠️ Geolocation not supported')
      setLoading(false)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (loading || !ref.current) return
    if (!ACCESS_TOKEN) {
      setError('Mapbox token missing')
      return
    }
    try {
      const map = new mapboxgl.Map({
        container: ref.current,
        style: MAP_STYLE,
        center: [location.longitude, location.latitude],
        zoom: location.zoom,
        pitch: 0,
        bearing: 0,
      })

      mapRef.current = map
      map.on('load', () => {
        console.log('✅ Map loaded successfully')
        map.resize()

        // Set bounds for Huế area
        const bounds: [[number, number], [number, number]] = [[107.4, 16.3], [107.7, 16.6]]
        map.fitBounds(bounds, { padding: 40, animate: false })
        map.setMaxBounds(bounds)

        // Add current location marker
        const el = document.createElement('div')
        el.className = 'marker'
        el.style.backgroundImage = 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjRkYwMDAwIiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCA4Yy0xLjEgMC0yLS45LTItMnMyIC45LTIgMiAuOSAyIDIgMnoyIDZ2LTRoLTR2NGg0eiIvPjwvc3ZnPg==)'
        el.style.backgroundSize = '100%'
        el.style.width = '32px'
        el.style.height = '32px'
        el.style.borderRadius = '50%'
        el.style.cursor = 'pointer'

        new mapboxgl.Marker(el)
          .setLngLat([location.longitude, location.latitude])
          .setPopup(new mapboxgl.Popup().setHTML('<p>📍 Huế, Việt Nam</p>'))
          .addTo(map)

        console.log('📍 Marker added at Huế:', location)
      })

      map.on('styledata', () => {
        console.log('✅ Style data loaded')
      })

      map.on('error', (e) => {
        console.error('❌ Mapbox error:', e)
        const errorMessage = (e as any).error?.message || 'Unknown error'
        setError(`Map error: ${errorMessage}`)
      })

      // Add controls
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), 'top-right')
      map.addControl(new mapboxgl.ScaleControl({ maxWidth: 80, unit: 'metric' }), 'bottom-left')

      // Add geolocate control
      map.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        'bottom-right'
      )

      console.log('🎉 Map initialization complete')

      return () => {
        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
        }
      }
    } catch (err) {
      console.error('❌ Map initialization error:', err)
      setError((err as Error).message)
    }
  }, [loading, location])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-lg text-gray-600">📍 Detecting your location...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
       <MapError error={error} />
      )}
      <div
        ref={ref}
        className="w-full h-96 rounded-lg overflow-hidden bg-slate-900 relative shadow-lg border border-slate-200"
      />
    </div>
  )
}
