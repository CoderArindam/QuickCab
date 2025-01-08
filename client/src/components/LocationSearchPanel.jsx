const LocationSearchPanel = ({ setPanelOpen, setshowVehiclePanel }) => {
  const locations = [
    "Andal North Bazar, near SBI ATM, 713321, West Bengal",
    "Durgapur City Center, near Big Bazaar, 713216, West Bengal",
    "Asansol Bus Stand, near Railway Station, 713301, West Bengal",
  ];
  return (
    <div>
      {locations.map((item, index) => {
        return (
          <div
            className="flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center my-2 justify-start"
            key={index}
            onClick={() => {
              setshowVehiclePanel(true);
              setPanelOpen(false);
            }}
          >
            <h2 className="bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full">
              <i className="ri-map-pin-fill"></i>
            </h2>
            <h4 className="font-medium">{item}</h4>
          </div>
        );
      })}
    </div>
  );
};

export default LocationSearchPanel;
