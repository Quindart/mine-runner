
function MapError({ error }: { error: string }) {
  return (
    <div className="p-md bg-error-container border border-error rounded-lg text-error text-body-md">
      ❌ Error: {error}
    </div>
  )
}

export default MapError