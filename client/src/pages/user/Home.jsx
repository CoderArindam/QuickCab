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
  const { sendMessage, receiveMessage } = useContext(SocketContext);
  const [captainDetails, setCaptainDetails] = useState();
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
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/api/maps/current-location`,
                {
                  params: { lat: latitude, lng: longitude },
                  withCredentials: true,
                }
              );
              setPickup(response.data.location); // Set the pickup location to the address
            } catch (error) {
              console.error("Error fetching user's location:", error);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
          }
        );
      } else {
        alert("Geolocation is not supported by your browser.");
      }
    };

    fetchUserLocation();
  }, []);

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
      setRideDetails(data);
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
      console.log("Captain Location Updated:", data);
      setCaptainDetails((prevDetails) => ({
        ...prevDetails,
        location: data.location, // Update the location field
      }));
    });
    console.log("updated driver location", captainDetails);
    // Cleanup on unmount
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
      setshowVehiclePanel(true);
      setPanelOpen(false);
    } else {
      alert("Please enter both pickup and destination locations.");
    }
  };

  const handleConfirmRide = async (boolean) => {
    if (boolean) {
      try {
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
        setFoundTrip(true);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  console.log(confirmedRideDetails);
  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />

      {/* <img
          src="https://i.ibb.co/kQsFscG/Screenshot-2025-01-06-180735.png"
          className="h-full w-full object-cover "
          alt=""
        /> */}
      <LiveTracking captainDetails={captainDetails} rideDetails={rideDetails} />
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
              className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full"
              type="submit"
            >
              Find Trip
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
        />
      </div>
      <div
        ref={vehicleFoundRef}
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
        />
      </div>
    </div>
  );
};

export default Home;
