import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import "./ProfilePage.css";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <motion.div
        className="profile-content"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>User Profile</h2>
        <div className="profile-info">
          <img
            src={user.photoURL || "/placeholder.svg"}
            alt="User Profile"
            className="profile-image"
          />
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.displayName || "Not provided"}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
