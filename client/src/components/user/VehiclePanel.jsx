const VehicleOption = ({
  vehicleType,
  imageSrc,
  vehicleName,
  capacity,
  // timeAway,
  description,
  fare,
  setShowConfirmRidePanel,
  setshowVehiclePanel,
  setSelectedVehicle,
}) => {
  return (
    <div
      className="flex border-2 active:border-black mb-2 rounded-xl w-full p-3 items-center justify-between"
      onClick={() => {
        setShowConfirmRidePanel(true);
        setshowVehiclePanel(false);
        setSelectedVehicle(vehicleType);
      }}
    >
      <img className="h-10" src={imageSrc} alt={`${vehicleName} image`} />
      <div className="ml-2 w-1/2">
        <h4 className="font-medium text-base">
          {vehicleName}{" "}
          <span>
            <i className="ri-user-3-fill"></i>
            {capacity}
          </span>
        </h4>
        <h5 className="font-medium text-sm">5 mins away</h5>
        <p className="font-normal text-xs text-gray-600">{description}</p>
      </div>
      <h2 className="text-lg font-semibold">₹{fare}</h2>
    </div>
  );
};

const VehiclePanel = ({
  setshowVehiclePanel,
  setShowConfirmRidePanel,
  setSelectedVehicle,
  fare,
}) => {
  const vehicles = [
    {
      type: "car",
      imageSrc:
        "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
      name: "UberGo",
      capacity: 4,
      timeAway: 2,
      description: "Affordable, compact rides",
      fare: fare?.car,
    },
    {
      type: "moto",
      imageSrc:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
      name: "Moto",
      capacity: 1,
      timeAway: 3,
      description: "Affordable motorcycle rides",
      fare: fare?.moto,
    },
    {
      type: "auto",
      imageSrc:
        "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
      name: "UberAuto",
      capacity: 3,
      timeAway: 3,
      description: "Affordable Auto rides",
      fare: fare?.auto,
    },
  ];

  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => setshowVehiclePanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>
      <h3 className="text-2xl font-semibold mb-5">Choose a Vehicle</h3>
      {vehicles.map((vehicle) => (
        <VehicleOption
          key={vehicle.type}
          vehicleType={vehicle.type}
          imageSrc={vehicle.imageSrc}
          vehicleName={vehicle.name}
          capacity={vehicle.capacity}
          // timeAway={vehicle.timeAway}
          description={vehicle.description}
          fare={vehicle.fare}
          setShowConfirmRidePanel={setShowConfirmRidePanel}
          setshowVehiclePanel={setshowVehiclePanel}
          setSelectedVehicle={setSelectedVehicle}
        />
      ))}
    </div>
  );
};

export default VehiclePanel;
