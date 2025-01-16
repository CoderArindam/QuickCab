import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

const LIBRARIES = ["marker"];
const MAP_ID = "YOUR_MAP_ID";
const GOOGLE_MAPS_API_KEY = "AIzaSyAePAVKBr8f9xvowy58CXJkG4xrx1j6SKA";

// Vehicle-specific icons
const vehicleIcons = {
  car: "https://i.ibb.co/gDHxjmg/8d217b1000b642005fea7b6fd6c3d967.png",
  motorcycle:
    "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
  auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
};
const userIconUrl = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

const createImageMarkerContent = (imgUrl) => {
  const markerEl = document.createElement("div");
  markerEl.style.cssText = `
    width: 60px;
    height: 60px;
    background: url(${imgUrl}) no-repeat center center;
    background-size: contain;
  `;
  return markerEl;
};

// Helper: Animate marker movement smoothly
const animateMarker = (marker, oldLoc, newLoc, duration = 5000) => {
  if (!marker || !oldLoc || !newLoc) return;

  const steps = 60; // Frames for animation
  let count = 0;
  const latStep = (newLoc.lat - oldLoc.lat) / steps;
  const lngStep = (newLoc.lng - oldLoc.lng) / steps;

  const interval = setInterval(() => {
    count++;
    const lat = oldLoc.lat + latStep * count;
    const lng = oldLoc.lng + lngStep * count;
    marker.position = new window.google.maps.LatLng(lat, lng);
    if (count === steps) clearInterval(interval);
  }, duration / steps);
};

const LiveTrackingForCaptain = ({ userLocation, captainLocation, captain }) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);
  const [mapCenter, setMapCenter] = useState(
    captainLocation || { lat: 0, lng: 0 }
  );

  const userMarkerRef = useRef(null);
  const captainMarkerRef = useRef(null);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Update the captain marker smoothly
  useEffect(() => {
    if (!googleLoaded || !map || !captainLocation) return;

    const captainEl = createImageMarkerContent(
      vehicleIcons[captain?.vehicle?.vehicleType] || vehicleIcons.car
    );
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
    setMapCenter(captainLocation);

    return () => {
      if (captainMarkerRef.current) {
        captainMarkerRef.current.map = null;
        captainMarkerRef.current = null;
      }
    };
  }, [googleLoaded, map, captainLocation, captain?.vehicle?.vehicleType]);

  // Update the user marker
  useEffect(() => {
    if (!googleLoaded || !map || !userLocation) return;

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

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }
    };
  }, [googleLoaded, map, userLocation]);

  // Fetch directions and render the route
  useEffect(() => {
    if (!googleLoaded || !map || !captainLocation || !userLocation) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
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
  }, [googleLoaded, map, captainLocation, userLocation]);

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

export default LiveTrackingForCaptain;
