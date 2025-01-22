import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

const LIBRARIES = ["marker"];
const MAP_ID = "YOUR_MAP_ID";
const GOOGLE_MAPS_API_KEY = `${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

// Vehicle-specific icons
const vehicleIcons = {
  car: "https://i.ibb.co/gDHxjmg/8d217b1000b642005fea7b6fd6c3d967.png",
  motorcycle:
    "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
  auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
};
const userIconUrl =
  "https://static.vecteezy.com/system/resources/previews/024/514/523/non_2x/people-3d-icon-free-png.png";

const createImageMarkerContent = (imgUrl) => {
  const markerEl = document.createElement("div");
  markerEl.style.cssText = `width: 60px; height: 60px; background: url(${imgUrl}) no-repeat center center; background-size: contain;`;
  return markerEl;
};

// Smooth Marker Animation
const animateMarker = (marker, oldLoc, newLoc, duration = 5000) => {
  if (!marker || !oldLoc || !newLoc) return;

  const steps = 60;
  let count = 0;
  const latStep = (newLoc.lat - oldLoc.lat) / steps;
  const lngStep = (newLoc.lng - oldLoc.lng) / steps;

  const interval = setInterval(() => {
    count++;
    const lat = oldLoc.lat + latStep * count;
    const lng = oldLoc.lng + lngStep * count;
    if (window !== undefined) {
      marker.position = new window.google.maps.LatLng(lat, lng);
    }

    if (count === steps) clearInterval(interval);
  }, duration / steps);
};

const LiveTrackingForUser = ({
  captainLocation,
  userLocation,
  captainDetails,
}) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapCenter, setMapCenter] = useState(
    userLocation || { lat: 0, lng: 0 }
  );

  const userMarkerRef = useRef(null);
  const captainMarkerRef = useRef(null);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Fetch directions
  useEffect(() => {
    if (!captainLocation || !userLocation || !googleLoaded || !window.google) {
      setDirections(null);
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService?.route(
      {
        origin: captainLocation,
        destination: userLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Failed to fetch directions:", status);
        }
      }
    );
  }, [captainLocation, userLocation, googleLoaded]);

  // Update captain's marker
  useEffect(() => {
    if (!googleLoaded || !map || !captainLocation || !window.google) return;

    const vehicleType = captainDetails?.vehicle?.vehicleType || "car";
    const captainEl = createImageMarkerContent(vehicleIcons[vehicleType]);

    if (!captainMarkerRef.current) {
      captainMarkerRef.current =
        new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: captainLocation,
          content: captainEl,
        });
    } else {
      const currentPosition = captainMarkerRef.current.position?.toJSON();
      animateMarker(captainMarkerRef.current, currentPosition, captainLocation);
    }
  }, [googleLoaded, map, captainLocation, captainDetails]);

  // Update user's marker
  useEffect(() => {
    if (!googleLoaded || !map || !userLocation || !window.google) return;

    const userEl = createImageMarkerContent(userIconUrl);

    if (!userMarkerRef.current) {
      userMarkerRef.current =
        new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: userLocation,
          content: userEl,
        });
    } else {
      userMarkerRef.current.position = new window.google.maps.LatLng(
        userLocation.lat,
        userLocation.lng
      );
    }

    setMapCenter(userLocation);
  }, [googleLoaded, map, userLocation]);

  // Adjust map bounds dynamically
  useEffect(() => {
    if (map && captainLocation && userLocation && window.google) {
      const bounds = new window.google.maps.LatLngBounds();
      bounds.extend(captainLocation);
      bounds.extend(userLocation);
      map.fitBounds(bounds);
    }
  }, [map, captainLocation, userLocation]);

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
      onLoad={() => setGoogleLoaded(true)}
    >
      {googleLoaded ? (
        <GoogleMap
          onLoad={onMapLoad}
          center={mapCenter}
          zoom={14}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            mapId: MAP_ID,
          }}
        >
          {/* Render Directions */}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  strokeColor: "#000",
                  strokeOpacity: 0.9,
                  strokeWeight: 6,
                },
                suppressMarkers: true,
              }}
            />
          )}
        </GoogleMap>
      ) : (
        <div>Loading map...</div>
      )}
    </LoadScript>
  );
};

export default LiveTrackingForUser;
