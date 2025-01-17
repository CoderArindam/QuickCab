import RazorpayPayment from "../components/payment/RazorpayPayment";

const Test = () => {
  return (
    <div>
      <h1>Test</h1>
      <RazorpayPayment
        rideId="678a64a35bbc2982cb1aa2cd"
        amount={50}
        userName="John Doe"
        userEmail="john.doe@example.com"
        userContact="1234567890"
      />
    </div>
  );
};

export default Test;
