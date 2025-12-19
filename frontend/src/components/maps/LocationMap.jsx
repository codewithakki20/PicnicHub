// src/components/maps/LocationMap.jsx
export default function LocationMap({ lat, lng }) {
  if (!lat || !lng) {
    return (
      <div className="w-full h-64 rounded-xl border-2 border-gray-200 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 font-medium">No location data available</p>
      </div>
    );
  }

  return (
    <iframe
      title="map"
      className="w-full h-80 rounded-2xl border-2 border-gray-200 shadow-lg"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
    ></iframe>
  );
}
