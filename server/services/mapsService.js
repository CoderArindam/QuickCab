import axios from "axios";

const getAddressCoordinate = async (address) => {
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          address: address,
          key: process.env.GOOGLE_MAPS_API_KEY,
        },
      }
    );

    if (response.data.status === "OK") {
      const location = response.data.results[0].geometry.location;
      return {
        lat: location.lat,
        lng: location.lng,
      };
    } else {
      throw new Error("Unable to fetch coordinates");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDistanceTimeService = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error("origin and destination both are required");
  }

  const api_key = process.env.GOOGLE_MAPS_API_KEY;

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/distancematrix/json",
      {
        params: {
          origins: origin, // e.g., "New York, NY"
          destinations: destination, // e.g., "Los Angeles, CA"
          key: api_key,
        },
      }
    );

    if (response.data.status === "OK") {
      const result = response.data.rows[0].elements[0];
      if (result.status === "OK") {
        return response.data.rows[0].elements[0];
      } else {
        throw new Error("Unable to calculate distance and time");
      }
    } else {
      throw new Error("Error in Distance Matrix API response");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAutoCompleteSuggestionsService = async (input) => {
  if (!input) {
    throw new Error("query is required");
  }
  const api_key = process.env.GOOGLE_MAPS_API_KEY;
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      {
        params: {
          input: input, // The text input to get location suggestions for
          key: api_key,
        },
      }
    );

    if (response.data.status === "OK") {
      return response.data.predictions;
    } else {
      throw new Error("Unable to fetch autocomplete suggestions");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getCurrentLocationService = async (lat, lng) => {
  if (!lat || !lng) {
    throw new Error("Latitude and longitude are required");
  }
  const api_key = process.env.GOOGLE_MAPS_API_KEY;
  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/geocode/json",
      {
        params: {
          latlng: `${lat},${lng}`,
          key: api_key,
        },
      }
    );

    if (response.data.status === "OK") {
      const address = response.data.results[0]?.formatted_address;
      return address || "Location not found";
    } else {
      throw new Error("Unable to fetch location");
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

// const getCaptainsInTheRadius = async();

export {
  getAddressCoordinate,
  getDistanceTimeService,
  getAutoCompleteSuggestionsService,
  getCurrentLocationService,
};
