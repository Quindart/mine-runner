import Layout from '@/components/organisms/Layout'
import Map from '@/components/organisms/Map/index'

export default function HomePage() {
  return (
    <Layout>
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-gray-900">Welcome to Hue View</h2>
        <p className="text-gray-600">Example app using Atomic Design and global state.</p>
        <div className="map-container">
          <Map />
        </div>
      </div>
    </Layout>
  )
}

