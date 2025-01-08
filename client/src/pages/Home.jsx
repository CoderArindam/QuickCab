import React, { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmedRide from "../components/ConfirmedRide";
import WaitingForDriver from "../components/WaitingForDriver";
import LookingForDriver from "../components/LookingForDriver";

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

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(pickup, destination);
  };

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

  // useGSAP(() => {
  //   if (showLookingForDriver) {
  //     gsap.to(lookingForDriverRef.current, {
  //       transform: "translateY(0)",
  //     });
  //   } else {
  //     gsap.to(lookingForDriverRef.current, {
  //       transform: "translateY(100%)",
  //     });
  //   }
  // }, [showLookingForDriver]);

  useGSAP(() => {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [vehicleFound]);

  useGSAP(() => {
    if (showWaitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [showWaitingForDriver]);

  return (
    <div className="h-screen relative overflow-hidden">
      <img
        className="w-16 absolute left-5 top-5"
        src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png"
        alt=""
      />
      <div className="h-screen w-screen">
        <img
          src="https://i.ibb.co/kQsFscG/Screenshot-2025-01-06-180735.png"
          className="h-full w-full object-cover "
          alt=""
        />
        {/* image for temporary use  */}
      </div>
      <div className=" flex flex-col justify-end h-screen absolute top-0 w-full">
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
            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
            <input
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full"
              type="text"
              placeholder="Add a pick-up location"
              value={pickup}
              onClick={() => setPanelOpen(true)}
              onChange={(e) => setPickup(e.target.value)}
            />
            <input
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3"
              type="text"
              placeholder="Enter your destination"
              value={destination}
              onClick={() => setPanelOpen(true)}
              onChange={(e) => setDestination(e.target.value)}
            />
          </form>
          <button className="bg-black text-white px-4 py-2 rounded-lg mt-3 w-full">
            Find Trip
          </button>
        </div>
        <div className="bg-white h-0" ref={panelRef}>
          <LocationSearchPanel
            setshowVehiclePanel={setshowVehiclePanel}
            setPanelOpen={setPanelOpen}
          />
        </div>
      </div>
      <div
        ref={vehiclePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <VehiclePanel
          setshowVehiclePanel={setshowVehiclePanel}
          setShowConfirmRidePanel={setShowConfirmRidePanel}
        />
      </div>
      <div
        ref={confirmRidePanelRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <ConfirmedRide
          setShowConfirmRidePanel={setShowConfirmRidePanel}
          setShowLookingForDriver={setShowLookingForDriver}
          setVehicleFound={setVehicleFound}
        />
      </div>
      <div
        ref={vehicleFoundRef}
        className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12"
      >
        <LookingForDriver setVehicleFound={setVehicleFound} />
      </div>
      <div
        className="fixed w-full z-10 bottom-0 translate-y-full  bg-white px-3 py-10 pt-8"
        ref={waitingForDriverRef}
      >
        <WaitingForDriver
          setShowWaitingForDriver={setShowWaitingForDriver}
          setVehicleFound={setVehicleFound}
          vehicleFound={vehicleFound}
        />
      </div>
    </div>
  );
};

export default Home;
