import axios from "axios";
import { useNavigate } from "react-router-dom";

export const CaptainLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  axios
    .get(`${import.meta.env.VITE_BASE_URL}/api/captains/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      localStorage.removeItem("token");
      navigate("/captain-login");
    });
  return <div>Logging out...</div>;
};

export default CaptainLogout;
