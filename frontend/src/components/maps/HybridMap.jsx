import React, { forwardRef, useEffect, useRef } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

const HybridMap = forwardRef(({ locations, activeLocationId, onMarkerClick, onMarkerHover }, ref) => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const markersRef = useRef({});

    // Load Google Maps
    useEffect(() => {
        const initMap = async () => {
            console.log("Google Maps Key:", process.env.REACT_APP_GOOGLE_MAPS_KEY);
            setOptions({
                key: process.env.REACT_APP_GOOGLE_MAPS_KEY, // Try 'key' as well
                apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
                version: "weekly",
            });

            const [mapsLib, markerLib] = await Promise.all([
                importLibrary("maps"),
                importLibrary("marker"),
            ]);

            const { Map } = mapsLib;
            // Ensure AdvancedMarkerElement is available globally or use it from markerLib if needed
            // The global google.maps.marker.AdvancedMarkerElement should be available after importLibrary resolves

            mapInstance.current = new Map(mapRef.current, {
                center: { lat: 20.59, lng: 78.96 },
                zoom: 5,
                mapId: "DEMO_MAP_ID", // Optional custom map styling
                disableDefaultUI: true,
                gestureHandling: "greedy",
            });

            renderMarkers();
        };

        initMap();
    }, []);

    // Create pulsing Airbnb-style markers
    const createMarkerElement = (active) => {
        const div = document.createElement("div");
        div.className = `
      w-6 h-6 rounded-full border-4 transition-all
      ${active ? "bg-emerald-500 border-emerald-300 scale-125 shadow-lg" : "bg-white border-slate-400"}
    `;
        div.style.transform = active ? "scale(1.3)" : "scale(1)";
        return div;
    };

    // Render markers
    const renderMarkers = () => {
        locations.forEach((loc) => {
            if (!loc.lat || !loc.lng) return;

            const position = { lat: loc.lat, lng: loc.lng };

            const marker = new google.maps.marker.AdvancedMarkerElement({
                position,
                map: mapInstance.current,
                content: createMarkerElement(false),
            });

            markersRef.current[loc._id] = marker;

            marker.addListener("click", () => onMarkerClick?.(loc._id));
            marker.addListener("mouseover", () => onMarkerHover?.(loc._id));
            marker.addListener("mouseout", () => onMarkerHover?.(null));
        });
    };

    // Highlight marker on hover
    useEffect(() => {
        Object.entries(markersRef.current).forEach(([id, marker]) => {
            marker.content = createMarkerElement(id === activeLocationId);
            if (id === activeLocationId) {
                mapInstance.current.panTo(marker.position);
            }
        });
    }, [activeLocationId]);

    return <div ref={mapRef} className="w-full h-full" />;
});

export default HybridMap;
