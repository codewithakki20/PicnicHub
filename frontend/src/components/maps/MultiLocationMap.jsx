// src/components/maps/MultiLocationMap.jsx
import { useState } from "react";

export default function MultiLocationMap({ locations = [] }) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  if (!locations || locations.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
        <p className="text-gray-600 font-medium text-lg">📍 No locations to display on map</p>
      </div>
    );
  }

  // Calculate center of all locations
  const centerLat =
    locations.reduce((sum, loc) => sum + (loc.coords?.lat || 0), 0) / locations.length || 0;
  const centerLng =
    locations.reduce((sum, loc) => sum + (loc.coords?.lng || 0), 0) / locations.length || 0;

  // Build markers string for Google Maps
  const markers = locations
    .map((loc) => `color:red|label:${locations.indexOf(loc) + 1}|${loc.coords?.lat},${loc.coords?.lng}`)
    .join("&markers=");

  const mapUrl = `https://maps.google.com/maps?q=${centerLat},${centerLng}&z=10&output=embed&markers=${markers}`;

  return (
    <div className="space-y-6">
      {/* Map Display */}
      <div className="w-full h-96 rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
        <iframe
          title="multi-location-map"
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        ></iframe>
      </div>

      {/* Location List Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {locations.map((loc, idx) => (
          <div
            key={loc._id}
            className={`p-4 rounded-xl cursor-pointer transition border-2 ${
              selectedLocation?._id === loc._id
                ? "bg-blue-100 border-blue-500 shadow-md"
                : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-md"
            }`}
            onClick={() => setSelectedLocation(loc)}
          >
            <div className="flex items-start gap-3">
              <span className="font-black text-lg w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center flex-shrink-0">
                {idx + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-900 truncate">{loc.name}</h4>
                <p className="text-xs text-gray-500 truncate mt-1">
                  {loc.coords?.lat.toFixed(2)}, {loc.coords?.lng.toFixed(2)}
                </p>
                {loc.tags && loc.tags.length > 0 && (
                  <p className="text-xs text-gray-600 mt-2 line-clamp-1">{loc.tags.slice(0, 2).join(", ")}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Location Details */}
      {selectedLocation && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 shadow-lg">
          <h3 className="font-black text-xl text-gray-900 mb-3">{selectedLocation.name}</h3>
          <p className="text-gray-700 leading-relaxed mb-4">{selectedLocation.description}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-700">📍 Coordinates:</span>
              <span className="text-gray-600">{selectedLocation.coords?.lat.toFixed(4)}, {selectedLocation.coords?.lng.toFixed(4)}</span>
            </div>
            {selectedLocation.tags && selectedLocation.tags.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-700">🏷️ Tags:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.tags.map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-semibold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedLocation.yearTags && selectedLocation.yearTags.length > 0 && (
              <div className="flex items-start gap-2">
                <span className="font-bold text-gray-700">📅 Years:</span>
                <div className="flex flex-wrap gap-2">
                  {selectedLocation.yearTags.map((year, idx) => (
                    <span key={idx} className="px-2 py-1 bg-purple-200 text-purple-800 rounded-full text-xs font-semibold">
                      {year}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
