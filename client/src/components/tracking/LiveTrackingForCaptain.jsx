// LiveTrackingForCaptain.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

const LIBRARIES = ["marker"];
const MAP_ID = "YOUR_MAP_ID";
const GOOGLE_MAPS_API_KEY = "AIzaSyAePAVKBr8f9xvowy58CXJkG4xrx1j6SKA";
const captainIconUrl =
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

const LiveTrackingForCaptain = ({ userLocation, captainLocation }) => {
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

  useEffect(() => {
    if (!googleLoaded || !map) return;

    if (captainLocation) {
      const captainEl = createImageMarkerContent(captainIconUrl);
      captainMarkerRef.current =
        new window.google.maps.marker.AdvancedMarkerElement({
          map,
          position: captainLocation,
          content: captainEl,
        });
      setMapCenter(captainLocation);
    }

    return () => {
      if (captainMarkerRef.current) {
        captainMarkerRef.current.map = null;
        captainMarkerRef.current = null;
      }
    };
  }, [googleLoaded, map, captainLocation]);

  useEffect(() => {
    if (!googleLoaded || !map || !userLocation) return;

    const userEl = createImageMarkerContent(
      "https://cdn-icons-png.flaticon.com/512/847/847969.png"
    );
    userMarkerRef.current = new window.google.maps.marker.AdvancedMarkerElement(
      {
        map,
        position: userLocation,
        content: userEl,
      }
    );

    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.map = null;
        userMarkerRef.current = null;
      }
    };
  }, [googleLoaded, map, userLocation]);

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
