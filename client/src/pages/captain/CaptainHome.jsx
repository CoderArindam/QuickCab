import React, { useContext, useEffect, useRef, useState } from "react";
import CaptainDetails from "../../components/captain/CaptainDetails";
import { Link, useNavigate } from "react-router-dom";
import RidePopup from "../../components/captain/RidePopup";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ConfirmRidePopup from "../../components/captain/ConfirmRidePopup";
import { CaptainDataContext } from "../../context/CaptainContext";
import { SocketContext } from "../../context/SocketContext";
import axios from "axios";
import LiveTracking from "../../components/tracking/LiveTracking";
import LiveTrackingForCaptain from "../../components/tracking/LiveTrackingForCaptain";
const CaptainHome = () => {
  const [showRidePopupPanel, setShowRidePopupPanel] = useState(false);
  const ridePopupPanelRef = useRef(null);
  const { captain } = useContext(CaptainDataContext);
  const { sendMessage, receiveMessage, socket } = useContext(SocketContext);
  const [userDetails, setUserDetails] = useState();
  const [captainLocation, setCaptainLocation] = useState();

  const [rideDetails, setRideDetails] = useState({});
  const [showConfirmRidePopupPanel, setShowConfirmRidePopupPanel] =
    useState(false);
  console.log(rideDetails);
  const confrimRidePopupPanelRef = useRef(null);

  const navigate = useNavigate();

  // Fetch ongoing ride on reload
  useEffect(() => {
    const fetchOngoingRide = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/captains/check-ongoing-ride`,
          { params: { captainId: captain._id }, withCredentials: true }
        );
        const { ride } = response.data;
        setRideDetails(ride);
        setShowConfirmRidePopupPanel(true);
        setUserDetails(ride.user);
        setCaptainLocation(ride.captain.location);
      } catch (error) {
        console.error("Error fetching ongoing ride:", error.message);
      }
    };

    fetchOngoingRide();
  }, [captain._id]);

  useEffect(() => {
    const fetchCaptainLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // console.log("Sending captain location:", {
            //   lat: latitude,
            //   lng: longitude,
            // });
            setCaptainLocation({ location: { lat: latitude, lng: longitude } });

            sendMessage("update-captain-location", {
              userId: captain._id,
              location: { lat: latitude, lng: longitude },
            });
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    const intervalId = setInterval(fetchCaptainLocation, 10000); // Fetch every 10 seconds
    fetchCaptainLocation(); // Initial fetch

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [sendMessage, captain._id]);

  useEffect(() => {
    // Join the socket room
    sendMessage("join", {
      userType: "captain",
      userId: captain._id,
    });

    receiveMessage("new-ride", (data) => {
      setRideDetails(data);
      setShowRidePopupPanel(true);
    });

    // Listen for user location updates
    receiveMessage("update-user-location", (data) => {
      console.log("User location update received:", data); // Debug log
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        location: data.location,
      }));
    });

    receiveMessage("ride-cancelled-by-user", (data) => {
      console.log(data);
      setShowRidePopupPanel(false);
      setShowConfirmRidePopupPanel(false);
      setRideDetails({});
      setUserDetails(null);
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("update-user-location");
    };
  }, [sendMessage, receiveMessage]);

  useGSAP(() => {
    if (showRidePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [showRidePopupPanel]);

  useGSAP(() => {
    if (showConfirmRidePopupPanel) {
      gsap.to(confrimRidePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confrimRidePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [showConfirmRidePopupPanel]);

  const confirmRide = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/rides/confirm`,
        {
          rideDetails,
          captainDetails: captain,
        },
        { withCredentials: true }
      );
      sendMessage("ride-accepted", {
        userSocketId: rideDetails.user.socketId,
      });
      // console.log(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  // const handleCancelRide = async () => {
  //   console.log(rideDetails?.captain);
  //   try {
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BASE_URL}/api/rides/cancel-ride`,
  //       { rideId: rideDetails._id, captainId: captain._id },
  //       {
  //         withCredentials: true,
  //       }
  //     );
  //     console.log(response);
  //     if (response.status === 200) {
  //       setUserDetails(null);
  //       navigate("/captain-home");
  //     } else {
  //       throw new Error("Failed to cancel ride");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handleCancelRide = async () => {
    sendMessage("ride-cancelled", {
      rideId: rideDetails._id,
      captainId: captain._id,
      userSocketId: rideDetails.user.socketId,
    });
    setUserDetails(null);
    navigate("/captain-home");
  };

  return (
    <div className="h-screen">
      <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
        <img
          className="w-16"
          src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
          alt=""
        />
        <Link
          to="/captain-home"
          className=" h-10 w-10 bg-white flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>
      <div className="h-3/5">
        <LiveTrackingForCaptain
          captainLocation={captainLocation?.location}
          userLocation={userDetails?.location}
          captain={captain}
        />
        {/* <LiveTracking captainDetails={captain} rideDetails={rideDetails} /> */}
      </div>
      <div className="h-2/5 p-6">
        <CaptainDetails captain={captain} />
      </div>
      {rideDetails && (
        <div
          className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
          ref={ridePopupPanelRef}
        >
          <RidePopup
            setShowRidePopupPanel={setShowRidePopupPanel}
            setShowConfirmRidePopupPanel={setShowConfirmRidePopupPanel}
            rideDetails={rideDetails}
            setRideDetails={setRideDetails}
            confirmRide={confirmRide}
          />
        </div>
      )}

      <div
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
        ref={confrimRidePopupPanelRef}
      >
        <ConfirmRidePopup
          setShowConfirmRidePopupPanel={setShowConfirmRidePopupPanel}
          setShowRidePopupPanel={setShowRidePopupPanel}
          rideDetails={rideDetails}
          captain={captain}
          handleCancelRide={handleCancelRide}
        />
      </div>

      <div className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"></div>
      <div className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"></div>
    </div>
  );
};

export default CaptainHome;
