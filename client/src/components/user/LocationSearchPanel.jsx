const LocationSearchPanel = ({
  suggestions,
  setPickup,
  setDestination,
  activeField,
  loading,
}) => {
  return (
    <div>
      {loading && <p>Loading suggestions...</p>}
      {suggestions.length === 0 && !loading && (
        <p>No suggestions found. Try typing more specific keywords.</p>
      )}
      {suggestions.map((item, index) => (
        <div
          className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
          key={index}
          onClick={() => {
            if (activeField === "pickup") {
              setPickup(item.description); // Set pickup if activeField is 'pickup'
            } else if (activeField === "destination") {
              setDestination(item.description); // Set destination if activeField is 'destination'
            }
          }}
        >
          <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
            <i className="ri-map-pin-fill"></i>
          </h2>
          <h4 className="font-medium">{item.description}</h4>
        </div>
      ))}
    </div>
  );
};
export default LocationSearchPanel;
