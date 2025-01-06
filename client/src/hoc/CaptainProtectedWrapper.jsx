import { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/captainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectedWrapper = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { captain, setCaptain } = useContext(CaptainDataContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchCaptainProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/captains/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          const data = response.data;
          setCaptain(data.captain);
        }
      } catch (err) {
        console.error("Error fetching captain profile:", err);
        localStorage.removeItem("token");
        navigate("/captain-login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaptainProfile();
  }, [navigate, token, setCaptain]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <h1>Loading...</h1>
      </div>
    );
  }

  return <>{children}</>;
};

export default CaptainProtectedWrapper;
