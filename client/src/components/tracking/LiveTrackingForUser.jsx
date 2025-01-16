import React, { useState, useEffect, useRef, useCallback } from "react";
import { LoadScript, GoogleMap, Polyline } from "@react-google-maps/api";

const LIBRARIES = ["marker"];
const MAP_ID = "YOUR_MAP_ID";
const GOOGLE_MAPS_API_KEY = "AIzaSyAePAVKBr8f9xvowy58CXJkG4xrx1j6SKA";
const userIconUrl = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
const carIconUrl =
  "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg";

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

const LiveTrackingForUser = ({ captainLocation, userLocation }) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [mapCenter, setMapCenter] = useState(
    userLocation || { lat: 0, lng: 0 }
  );

  const userMarkerRef = useRef(null);
  const captainMarkerRef = useRef(null);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Create or update the user's marker
  useEffect(() => {
    if (!googleLoaded || !map || !userLocation) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
      userMarkerRef.current = null;
    }

    const userEl = createImageMarkerContent(userIconUrl);
    userMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement(
      {
        map,
        position: userLocation,
        content: userEl,
      }
    );

    setMapCenter(userLocation);

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }
    };
  }, [googleLoaded, map, userLocation]);

  // Create or update the captain's marker
  useEffect(() => {
    if (!googleLoaded || !map || !captainLocation) return;

    if (captainMarkerRef.current) {
      captainMarkerRef.current.map = null;
      captainMarkerRef.current = null;
    }

    const captainEl = createImageMarkerContent(carIconUrl);
    captainMarkerRef.current =
      new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: captainLocation,
        content: captainEl,
      });

    return () => {
      if (captainMarkerRef.current) {
        captainMarkerRef.current.map = null;
        captainMarkerRef.current = null;
      }
    };
  }, [googleLoaded, map, captainLocation]);

  // Handle map centering and updates
  useEffect(() => {
    if (captainLocation && userLocation) {
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
          {/* Show a line connecting user and captain */}
          {captainLocation && userLocation && (
            <Polyline
              path={[captainLocation, userLocation]}
              options={{
                strokeColor: "#000",
                strokeOpacity: 0.9,
                strokeWeight: 6,
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
