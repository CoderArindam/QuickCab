// Outside your component file, or at the top:
const LIBRARIES = ["marker"];

import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import {
  LoadScript,
  GoogleMap,
  DirectionsRenderer,
} from "@react-google-maps/api";

/**
 * A valid Map ID (https://developers.google.com/maps/documentation/javascript/advanced-markers/initialize-map).
 * E.g. "abcdef123456789"
 */
const MAP_ID = "YOUR_MAP_ID";

const userIconUrl = "https://cdn-icons-png.flaticon.com/512/847/847969.png";

// Three vehicle icons
const vehicleImages = {
  car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
  moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
  auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
};

const getAddressCoordinate = async (address) => {
  // Adjust this call to your environment as needed
  const { data } = await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/maps/get-coordinates`,
    { address },
    { withCredentials: true }
  );
  return data; // { lat, lng }
};

// Dummy function to simulate fetching updated captain location
const fetchUpdatedCaptainLocation = async (rideId, captainId) => {
  const { data } = await axios.get(
    `${
      import.meta.env.VITE_BASE_URL
    }/api/rides/${rideId}/captain/${captainId}/location`,
    { withCredentials: true }
  );
  // data should be { location: { lat, lng } }
  return data.location;
};

// Animates marker from oldLoc to newLoc over ~1 second
const animateMarker = (marker, oldLoc, newLoc) => {
  if (!marker) return;
  const steps = 60; // how many animation frames
  let count = 0;
  const latDiff = newLoc.lat - oldLoc.lat;
  const lngDiff = newLoc.lng - oldLoc.lng;

  const interval = setInterval(() => {
    count++;
    const lat = oldLoc.lat + (latDiff * count) / steps;
    const lng = oldLoc.lng + (lngDiff * count) / steps;
    marker.position = new window.google.maps.LatLng(lat, lng);
    if (count === steps) {
      clearInterval(interval);
    }
  }, 1000 / 60);
};

// Creates a 40x40 div with the given image
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

const LiveTracking = ({ captainDetails, rideDetails }) => {
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [map, setMap] = useState(null);

  const [userLocation, setUserLocation] = useState(null);
  const [pickupCoordinates, setPickupCoordinates] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 0,
    lng: 0,
  });

  const [directions, setDirections] = useState(null);
  const [internalCaptainDetails, setInternalCaptainDetails] =
    useState(captainDetails);

  // Refs for advanced markers
  const userMarkerRef = useRef(null);
  const captainMarkerRef = useRef(null);

  // Fake IDs to pass to fetchUpdatedCaptainLocation
  const rideId = rideDetails?._id || "some-ride-id";
  const captainId = captainDetails?._id || "some-captain-id";
  const GOOGLE_MAPS_API_KEY = `${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // 1. Get user's browser location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const loc = { lat: coords.latitude, lng: coords.longitude };
          setUserLocation(loc);
          setMapCenter(loc);
        },
        (err) => console.error(err)
      );
    }
  }, []);

  // 2. If there's a pickup address in rideDetails, geocode it
  useEffect(() => {
    if (rideDetails?.pickup) {
      getAddressCoordinate(rideDetails.pickup)
        .then((coords) => {
          setPickupCoordinates(coords);
          setMapCenter(coords);
        })
        .catch((err) => console.error(err));
    }
  }, [rideDetails]);

  // 3. Build the route from user/pickup -> captain
  useEffect(() => {
    if (!googleLoaded || !map || !internalCaptainDetails?.location) return;
    const origin = pickupCoordinates || userLocation;
    const destination = internalCaptainDetails.location;
    if (!origin || !destination) return;

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin,
        destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [
    googleLoaded,
    map,
    internalCaptainDetails,
    pickupCoordinates,
    userLocation,
  ]);

  // 4. Create the advanced marker
  const createAdvancedMarker = (coords, contentEl) => {
    return new window.google.maps.marker.AdvancedMarkerElement({
      map,
      position: coords,
      content: contentEl,
    });
  };

  // 5. Build / remove user marker (if no custom pickup)
  useEffect(() => {
    if (!googleLoaded || !map) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
      userMarkerRef.current = null;
    }
    // If user didn't specify a different pickup, show the user marker
    if (!pickupCoordinates && userLocation) {
      const userEl = createImageMarkerContent(userIconUrl);
      userMarkerRef.current = createAdvancedMarker(userLocation, userEl);
    }
    return () => {
      if (userMarkerRef.current) userMarkerRef.current.map = null;
    };
  }, [googleLoaded, map, userLocation, pickupCoordinates]);

  // 6. If there's a custom pickup, show that marker
  useEffect(() => {
    if (!googleLoaded || !map || !pickupCoordinates) return;
    if (userMarkerRef.current) {
      userMarkerRef.current.map = null;
      userMarkerRef.current = null;
    }
    const pickupEl = createImageMarkerContent(userIconUrl); // same "cute human" icon
    userMarkerRef.current = createAdvancedMarker(pickupCoordinates, pickupEl);
    return () => {
      if (userMarkerRef.current) userMarkerRef.current.map = null;
    };
  }, [googleLoaded, map, pickupCoordinates]);

  // 7. Show the captain marker (with relevant vehicle icon)
  useEffect(() => {
    if (!googleLoaded || !map || !internalCaptainDetails?.location) return;
    if (captainMarkerRef.current) {
      captainMarkerRef.current.map = null;
      captainMarkerRef.current = null;
    }
    let vehicleIcon = vehicleImages.car;
    const vType = rideDetails?.vehicleType?.toLowerCase() || "";
    if (vType === "moto") {
      vehicleIcon = vehicleImages.moto;
    } else if (vType === "auto") {
      vehicleIcon = vehicleImages.auto;
    }
    const captainEl = createImageMarkerContent(vehicleIcon);
    captainMarkerRef.current = createAdvancedMarker(
      internalCaptainDetails.location,
      captainEl
    );
    return () => {
      if (captainMarkerRef.current) captainMarkerRef.current.map = null;
    };
  }, [googleLoaded, map, internalCaptainDetails]);

  /**
   * 8. Poll for updated captain location every 10s, smoothly animate marker
   */
  useEffect(() => {
    if (!googleLoaded) return;
    const intervalId = setInterval(async () => {
      try {
        const updatedLoc = await fetchUpdatedCaptainLocation(rideId, captainId);
        if (updatedLoc) {
          // Animate if markerRef exists
          if (captainMarkerRef.current) {
            animateMarker(
              captainMarkerRef.current,
              internalCaptainDetails.location,
              updatedLoc
            );
          }
          // Update internal state so route, etc. can refresh if needed
          setInternalCaptainDetails((prev) => ({
            ...prev,
            location: updatedLoc,
          }));
        }
      } catch (err) {
        console.error(err);
      }
    }, 10000);

    return () => clearInterval(intervalId);
  }, [
    googleLoaded,
    rideId,
    captainId,
    internalCaptainDetails?.location,
    internalCaptainDetails?.vehicle,
  ]);

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
      onLoad={() => setGoogleLoaded(true)}
      onError={() => console.error("Google Maps API failed to load")}
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

export default LiveTracking;
