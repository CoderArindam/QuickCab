import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../../components/user/LocationSearchPanel";
import VehiclePanel from "../../components/user/VehiclePanel";
import ConfirmedRide from "../../components/user/ConfirmedRide";
import WaitingForDriver from "../../components/user/WaitingForDriver";
import LookingForDriver from "../../components/user/LookingForDriver";
import debounce from "lodash.debounce";
import axios from "axios";
import { SocketContext } from "../../context/SocketContext";
import { UserDataContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../../components/tracking/LiveTracking";
import LiveTrackingForUser from "../../components/tracking/LiveTrackingForUser";

const Home = () => {
  const [pickup, setPickup] = useState();
  const [destination, setDestination] = useState();
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const vehicleFoundRef = useRef(null);
  const panelCloseRef = useRef(null);
  const vehiclePanelRef = useRef(null);
  const [showVehiclePanel, setshowVehiclePanel] = useState(false);
  const [showConfirmRidePanel, setShowConfirmRidePanel] = useState(false);
  const confirmRidePanelRef = useRef(null);
  const [showLookingForDriver, setShowLookingForDriver] = useState(false);
  const lookingForDriverRef = useRef(null);
  const [vehicleFound, setVehicleFound] = useState(false);
  const waitingForDriverRef = useRef(null);
  const [showWaitingForDriver, setShowWaitingForDriver] = useState(false);
  const [showRidingPanel, setShowRidingPanel] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'pickup' or 'destination'
  const [suggestions, setSuggestions] = useState([]);
  const [fare, setFare] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [confirmedRideDetails, setConfirmRideDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const { sendMessage, receiveMessage, socket } = useContext(SocketContext);
  const [captainDetails, setCaptainDetails] = useState();
  const [userLocation, setUserLocation] = useState();
  const { user } = useContext(UserDataContext);
  const [rideDetails, setRideDetails] = useState();
  const [foundTrip, setFoundTrip] = useState();
  const navigate = useNavigate();

  // Fetch user's current location
  useEffect(() => {
    const fetchUserLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Sending user location:", {
              lat: latitude,
              lng: longitude,
            });

            setUserLocation({ location: { lat: latitude, lng: longitude } });
            sendMessage("update-user-location", {
              userId: user._id,
              location: { lat: latitude, lng: longitude },
            });

            try {
              const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/maps/current-location`,
                {
                  params: { lat: latitude, lng: longitude },
                  withCredentials: true,
                }
              );
              setPickup(response.data.location);
            } catch (error) {
              console.error("Error fetching user's location:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const intervalId = setInterval(fetchUserLocation, 10000); // Fetch every 10 seconds
    fetchUserLocation(); // Initial fetch

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [sendMessage, user._id, receiveMessage]);

  // Fetch ongoing ride on reload
  useEffect(() => {
    const fetchOngoingRide = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/users/check-ongoing-ride`,
          { params: { userId: user._id }, withCredentials: true }
        );
        const data = response.data;
        console.log(data);
        if (data) {
          setFoundTrip(true);
          setConfirmRideDetails(data);
          setShowWaitingForDriver(true);
        } else {
          setFoundTrip(false);
          setConfirmRideDetails(null);
          setShowWaitingForDriver(false);
        }
      } catch (error) {
        setFoundTrip(false);
        setRideDetails(null);
        setShowWaitingForDriver(false);
        console.error("Error fetching ongoing ride:", error.message);
      }
    };

    fetchOngoingRide();
  }, []);

  useEffect(() => {
    // Listen for ride cancellation
    receiveMessage("ride-cancelled", () => {
      setRideDetails(null);
      setCaptainDetails(null);
      setShowWaitingForDriver(false);
      setVehicleFound(false);
      setShowLookingForDriver(false);
      setShowConfirmRidePanel(false);
      setshowVehiclePanel(false);
      setFoundTrip(false);
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("ride-cancelled");
    };
  }, [receiveMessage, socket]);

  useEffect(() => {
    // Join the user to the socket room
    sendMessage("join", {
      userType: "user",
      userId: user._id,
    });

    // Listen for ride confirmation
    receiveMessage("ride-confirmed", (data) => {
      console.log("Ride Confirmed:", data);
      setShowLookingForDriver(false);
      setShowWaitingForDriver(true);
      setCaptainDetails(data.captain);
      setConfirmRideDetails(data);
    });

    // Listen for ride start
    receiveMessage("ride-started", (data) => {
      console.log("Ride Started:", data);
      setShowWaitingForDriver(false);
      navigate("/riding", {
        state: {
          ride: data,
        },
      });
    });

    // Listen for captain location updates
    receiveMessage("update-captain-location", (data) => {
      setCaptainDetails((prevDetails) => ({
        ...prevDetails,
        location: data.location,
      }));
    });
    // Cleanup listeners on unmount
    console.log("Captain location update received:", captainDetails); // Debug log

    return () => {
      socket.off("update-captain-location");
    };
  }, [sendMessage, receiveMessage]);

  useGSAP(() => {
    if (panelOpen) {
      gsap.to(panelRef.current, {
        height: "70%",
        padding: 24,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 1,
      });
    } else {
      gsap.to(panelRef.current, {
        height: "0%",
        padding: 0,
      });
      gsap.to(panelCloseRef.current, {
        opacity: 0,
      });
    }
  }, [panelOpen]);

  useGSAP(() => {
    if (showVehiclePanel) {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(vehiclePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [showVehiclePanel]);

  useGSAP(() => {
    if (showConfirmRidePanel) {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(confirmRidePanelRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [showConfirmRidePanel]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (showWaitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [showWaitingForDriver]);

  useGSAP(() => {
    if (showLookingForDriver) {
      gsap.to(lookingForDriverRef.current, {
        transform: "translateY(0)",
        duration: 0.5,
      });
    } else {
      gsap.to(lookingForDriverRef.current, {
        transform: "translateY(100%)",
        duration: 0.5,
      });
    }
  }, [showLookingForDriver]);

  // Debounced function to fetch location suggestions
  const fetchSuggestions = async (input) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/maps/get-suggestions`,
        {
          params: { input },
          withCredentials: true,
        }
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchSuggestions = useCallback(
    debounce((input) => {
      if (input.length > 3) {
        // Increased minimum input length to 3
        fetchSuggestions(input);
      } else {
        setSuggestions([]);
      }
    }, 500), // Increased debounce delay to 500ms
    []
  );

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "pickup") {
      setPickup(value);
    } else {
      setDestination(value);
    }

    setActiveField(field);
    setPanelOpen(true);
    debouncedFetchSuggestions(value);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (pickup && destination) {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/users/get-fare`,
        {
          params: {
            pickup,
            destination,
          },
          withCredentials: true,
        }
      );
      const data = response.data;

      setFare(data);
      setLoading(false);
      setshowVehiclePanel(true);
      setPanelOpen(false);
    } else {
      alert("Please enter both pickup and destination locations.");
    }
  };

  const handleConfirmRide = async (boolean) => {
    if (boolean) {
      try {
        setLoading(true);
        const response = await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/rides/create`,
          {
            pickup,
            destination,
            vehicleType: selectedVehicle,
          },
          {
            withCredentials: true,
          }
        );
        const data = response.data;

        setConfirmRideDetails(data);
        setVehicleFound(true);
        setShowConfirmRidePanel(false);
        setFoundTrip(true);
        setShowLookingForDriver(true);
        setLoading(false);
      } catch (error) {
        setShowLookingForDriver(false);
        setFoundTrip(true);
        setFoundTrip(true);
        console.log(error.message);
      }
    }
  };

  const handleCancelRide = async (e) => {
    e.preventDefault();
    sendMessage("ride-cancelled-by-user", {
      rideId: confirmedRideDetails?._id,
      captainSocketId: confirmedRideDetails?.captain?.socketId,
    });

    setShowWaitingForDriver(false);
    setShowLookingForDriver(false);
    setConfirmRideDetails();
    setCaptainDetails();
    setFoundTrip(false);
  };

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      <LiveTrackingForUser
        captainLocation={captainDetails?.location}
        userLocation={userLocation?.location}
        captainDetails={captainDetails}
      />
      {/* image for temporary use  */}

      <div
        className={`flex-col justify-end h-screen absolute top-0 w-full z-20 ${
          foundTrip ? "hidden" : "flex"
        }`}
      >
        <div className="h-[30%] p-6 bg-white relative">
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className="absolute opacity-0  right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-wide-line"></i>
          </h5>
          <h4 className="text-2xl font-semibold">Find a trip</h4>
          <form
            className="relative py-3"
            onSubmit={(e) => {
              submitHandler(e);
            }}
          >
            <div className="line absolute h-16 w-1 top-[37%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
              value={pickup}
              onClick={() => {
                setPanelOpen(true);
                setActiveField("pickup");
              }}
              onChange={(e) => handleInputChange(e, "pickup")}
            />

            <input
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onClick={() => {
                setPanelOpen(true);
                setActiveField("destination");
              }}
              onChange={(e) => handleInputChange(e, "destination")}
            />
            <button
              className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full flex items-center justify-center"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <i className="ri-loader-4-line animate-spin text-xl"></i>
              ) : (
                "Find Trip"
              )}
            </button>
          </form>
        </div>
        <div className="bg-white h-0" ref={panelRef}>
          <LocationSearchPanel
            suggestions={suggestions}
            setPanelOpen={setPanelOpen}
            loading={loading}
            pickup={pickup}
            setPickup={setPickup}
            setDestination={setDestination}
            destination={destination}
            activeField={activeField} // Pass activeField here
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          setshowVehiclePanel={setshowVehiclePanel}
          setShowConfirmRidePanel={setShowConfirmRidePanel}
          fare={fare}
          setSelectedVehicle={setSelectedVehicle}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmedRide
          setShowConfirmRidePanel={setShowConfirmRidePanel}
          setShowLookingForDriver={setShowLookingForDriver}
          setVehicleFound={setVehicleFound}
          pickup={pickup}
          destination={destination}
          fare={fare?.[selectedVehicle]}
          selectedVehicle={selectedVehicle}
          handleConfirmRide={handleConfirmRide}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
      <div
        ref={lookingForDriverRef}
        className="fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <LookingForDriver
          setVehicleFound={setVehicleFound}
          confirmedRideDetails={confirmedRideDetails}
          setShowWaitingForDriver={setShowWaitingForDriver}
        />
      </div>
      <div
        className="fixed w-full z-20 bottom-0 translate-y-full  bg-white px-3 py-10 pt-12"
        ref={waitingForDriverRef}
      >
        <WaitingForDriver
          setShowWaitingForDriver={setShowWaitingForDriver}
          setVehicleFound={setVehicleFound}
          vehicleFound={vehicleFound}
          confirmedRideDetails={confirmedRideDetails}
          captainDetails={captainDetails}
          handleCancelRide={handleCancelRide}
        />
      </div>
    </div>
  );
};

export default Home;
