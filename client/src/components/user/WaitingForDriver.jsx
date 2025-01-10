import { useEffect } from "react";

const WaitingForDriver = ({
  setShowWaitingForDriver,
  setVehicleFound,
  vehicleFound,
  confirmedRideDetails,
}) => {
  const { pickup, destination, otp, fare, vehicleType } =
    confirmedRideDetails || {};

  useEffect(() => {
    if (
      confirmedRideDetails &&
      pickup &&
      destination &&
      otp &&
      fare !== undefined &&
      vehicleType
    ) {
      const timer = setTimeout(() => {
        setVehicleFound(false);
        setShowWaitingForDriver(true);
      }, 6000);

      // Cleanup the timer if component unmounts or dependencies change
      return () => clearTimeout(timer);
    }
  }, [
    confirmedRideDetails,
    pickup,
    destination,
    otp,
    fare,
    vehicleType,
    setVehicleFound,
    setShowWaitingForDriver,
  ]);

  const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => {
          setShowWaitingForDriver(false);
        }}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <div className="title border-b-2 flex justify-between items-center mb-4 pb-4">
        <h3 className="text-xl p-3 font-medium text">
          Meet at the pickup point
        </h3>
        <div className="time-left bg-black text-slate-50 py-6 px-4">
          <span>2 min</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <img className="h-[100px]" src={vehicleImages[vehicleType]} alt="" />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">Arindam Mukherjee</h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">WB40AJ3037</h4>
          <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          <span>OTP</span>
          <h1 className="text-lg font-semibold"> {otp}</h1>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <p className="text-sm -mt-1 text-gray-600">{pickup}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <p className="text-sm -mt-1 text-gray-600">{destination}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹{fare} </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
