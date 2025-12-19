import { useState, useEffect, useRef } from "react";
import locationApi from "../../api/locationApi";
import { Loader2, MapPin, X } from "lucide-react";

export default function LocationSelect({ label, value, onChange, required = false, className = "" }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const wrapperRef = useRef(null);

  // Load selected location if value is provided
  useEffect(() => {
    if (value && !selectedLocation) {
      if (!/^[0-9a-fA-F]{24}$/.test(value)) {
        onChange("");
        return;
      }

      const loadSelected = async () => {
        try {
          const loc = await locationApi.getLocation(value);
          setSelectedLocation(loc);
          setSearchQuery(loc.name);
        } catch (err) {
          if (err.response?.status === 404) onChange("");
        }
      };
      loadSelected();
    } else if (!value && selectedLocation) {
      setSelectedLocation(null);
      setSearchQuery("");
    }
  }, [value, selectedLocation, onChange]);

  // Search locations when query changes
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const searchLocations = async () => {
        setLoading(true);
        try {
          let locs = [];
          try {
            const searchRes = await locationApi.searchLocations(searchQuery);
            locs = Array.isArray(searchRes) ? searchRes : [];
          } catch {
            const res = await locationApi.getLocations({ search: searchQuery, limit: 10 });
            locs = res?.locations || (Array.isArray(res) ? res : []);
          }

          setLocations(locs);
          setShowDropdown(locs.length > 0);
        } catch {
          setLocations([]);
          setShowDropdown(false);
        } finally {
          setLoading(false);
        }
      };

      const timeoutId = setTimeout(searchLocations, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setLocations([]);
      setShowDropdown(false);
    }
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (location) => {
    setSelectedLocation(location);
    setSearchQuery(location.name);
    setShowDropdown(false);
    onChange(location._id);
  };

  const handleClear = () => {
    setSelectedLocation(null);
    setSearchQuery("");
    onChange("");
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      {label && (
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (selectedLocation) setSelectedLocation(null);
            if (e.target.value === "") onChange("");
          }}
          onFocus={() => {
            if (locations.length > 0) setShowDropdown(true);
          }}
          className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-4 pr-10 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-400"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-slate-400">
          {loading ? (
            <Loader2 size={18} className="animate-spin text-emerald-500" />
          ) : selectedLocation ? (
            <button onClick={handleClear} className="hover:text-rose-500 transition">
              <X size={18} />
            </button>
          ) : (
            <MapPin size={18} />
          )}
        </div>

        {/* Dropdown */}
        {showDropdown && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl shadow-xl max-h-60 overflow-y-auto">
            {locations.length === 0 ? (
              <div className="p-4 text-slate-500 dark:text-slate-400 text-center text-sm">
                No locations found
              </div>
            ) : (
              <div className="py-2">
                {locations.map((loc) => (
                  <button
                    key={loc._id}
                    type="button"
                    onClick={() => handleSelect(loc)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700/50 last:border-0"
                  >
                    <div className="font-bold text-slate-900 dark:text-white text-sm">{loc.name}</div>
                    {loc.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {loc.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

