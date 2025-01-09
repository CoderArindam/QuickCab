import axios from "axios";
import { useNavigate } from "react-router-dom";
const UserLogout = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  axios
    .get(`${import.meta.env.VITE_BASE_URL}/api/users/logout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      localStorage.removeItem("token");
      navigate("/login");
    });

  return <div>UserLogout</div>;
};

export default UserLogout;
