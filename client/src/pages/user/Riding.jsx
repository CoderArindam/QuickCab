import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import RazorpayPayment from "../../components/payment/RazorpayPayment";

const Riding = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize useNavigate
  const { ride } = location.state || {};
  console.log(ride);

  const vehicleImages = {
    car: "https://swyft.pl/wp-content/uploads/2023/05/how-many-people-can-a-uberx-take.jpg",
    moto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_638,w_956/v1649231091/assets/2c/7fa194-c954-49b2-9c6d-a3b8601370f5/original/Uber_Moto_Orange_312x208_pixels_Mobile.png",
    auto: "https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png",
  };

  const vehicleImage = vehicleImages[ride?.vehicleType] || vehicleImages["car"];

  // Function to handle successful payment and redirect to captain-home
  const handlePaymentSuccess = () => {
    // Redirect to captain-home after successful payment
    navigate("/home");
  };

  return (
    <div className="h-screen">
      <Link
        to="/home"
        className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-home-5-line"></i>
      </Link>

      <div className="h-1/3">
        <img
          src="https://cdn.dribbble.com/users/914217/screenshots/4506553/media/66b3d16f627edc27b44c023e4ec40b28.gif"
          alt=""
        />
      </div>

      <div className="h-1/3 p-4 mt-12">
        <div className="flex items-center justify-between">
          <img className="h-24" src={vehicleImage} alt="Captain" />
          <div className="text-right">
            <h2 className="text-lg font-medium capitalize">
              {`${ride?.captain?.fullName?.firstName} ${ride?.captain?.fullName?.lastName}`}
            </h2>
            <h4 className="text-xl font-semibold -mt-1 -mb-1">
              {ride?.captain?.vehicle?.plateNumber}
            </h4>
            <p className="text-sm text-gray-600">{ride?.vehicleType}</p>
          </div>
        </div>

        <div className="flex gap-2 justify-between flex-col items-center">
          <div className="w-full mt-5">
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">{ride?.pickup}</h3>
                <p className="text-sm -mt-1 text-gray-600">Pickup Location</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3 border-b-2">
              <i className="text-lg ri-map-pin-2-fill"></i>
              <div>
                <h3 className="text-lg font-medium">{ride?.destination}</h3>
                <p className="text-sm -mt-1 text-gray-600">Destination</p>
              </div>
            </div>
            <div className="flex items-center gap-5 p-3">
              <i className="ri-currency-line"></i>
              <div>
                <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                <p className="text-sm -mt-1 text-gray-600">
                  Payment Method: Cash
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Display the RazorpayPayment component directly */}
        <RazorpayPayment
          rideId={ride._id}
          amount={ride.fare}
          userContact={"0000"}
          userEmail={ride.user.email}
          userName={ride.user.fullName.firstName}
          key={ride._id}
          onPaymentSuccess={handlePaymentSuccess} // Pass the success handler to RazorpayPayment
        />
      </div>
    </div>
  );
};

export default Riding;
