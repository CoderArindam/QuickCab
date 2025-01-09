import { useEffect } from "react";

const WaitingForDriver = ({
  setShowWaitingForDriver,
  setVehicleFound,
  vehicleFound,
}) => {
  useEffect(() => {
    setTimeout(() => {
      setVehicleFound(false);
      setShowWaitingForDriver(true);
    }, 5000);
  }, [vehicleFound]);
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
        <img
          className="h-12"
          src="https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg"
          alt=""
        />
        <div className="text-right">
          <h2 className="text-lg font-medium capitalize">Arindam Mukherjee</h2>
          <h4 className="text-xl font-semibold -mt-1 -mb-1">WB40AJ3037</h4>
          <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
          <h1 className="text-lg font-semibold"> 2563 </h1>
        </div>
      </div>

      <div className="flex gap-2 justify-between flex-col items-center">
        <div className="w-full mt-5">
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="ri-map-pin-user-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">Andal North Bazar</p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3 border-b-2">
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className="text-lg font-medium">562/11-A</h3>
              <p className="text-sm -mt-1 text-gray-600">
                Mahiskapur, Durgapur
              </p>
            </div>
          </div>
          <div className="flex items-center gap-5 p-3">
            <i className="ri-currency-line"></i>
            <div>
              <h3 className="text-lg font-medium">₹888 </h3>
              <p className="text-sm -mt-1 text-gray-600">Cash Cash</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingForDriver;
