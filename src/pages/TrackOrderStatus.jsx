import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"; // Adjust path
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust import path
import { motion } from "framer-motion";
import "./TrackOrderStatus.css";

const TrackOrderStatus = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const statusColors = {
    "Payment Successful": "#00cc00",
    "Not Successful": "#ff3333",
    Shipped: "#ff9900",
    Delivered: "#00b3b3",
    "Not Delivered": "#cc0000",
    Delayed: "#ff6600",
  };

  const statusMessages = {
    "Payment Successful": "Payment confirmed! Your order is being processed.",
    "Not Successful": "Payment failed. Please try again.",
    Shipped: "Your order is on its way!",
    Delivered: "Order delivered successfully!",
    "Not Delivered": "Delivery failed. Contact support.",
    Delayed: "Shipping delayed. We’re working on it!",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setError("Please log in to view your orders.");
        return;
      }

      try {
        // Query payments based on user ID embedded in sessionId
        const q = query(
          collection(db, "payments"),
          where("orderDetails.sessionId", ">=", user.uid),
          where("orderDetails.sessionId", "<=", user.uid + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);
        const userOrders = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((order) => order.orderDetails.sessionId.startsWith(user.uid));

        console.log("Fetched orders:", userOrders);
        setOrders(userOrders);
        if (userOrders.length === 0) {
          setError("No orders found for this user.");
        } else {
          setError(""); // Clear error when orders are found
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(`Failed to load orders: ${err.message}`);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="tos-track-order-status">
      <motion.h2
        className="tos-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Order Journey
      </motion.h2>
      {error && (
        <motion.p
          className="tos-error"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {error}
        </motion.p>
      )}
      <div className="tos-orders-container">
        {orders.length > 0
          ? orders.map((order, index) => (
              <motion.div
                key={order.id}
                className="tos-order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3>Order #{order.referenceId}</h3>
                <div className="tos-status-bar">
                  <motion.div
                    className="tos-status-indicator"
                    style={{
                      backgroundColor: statusColors[order.status] || "#888",
                    }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                  <p className="tos-status-text">
                    Status: <span>{order.status}</span>
                  </p>
                  <p className="tos-status-message">
                    {statusMessages[order.status] || "Status update pending..."}
                  </p>
                </div>
                <p>Order Type: {order.orderDetails.orderType.join(", ")}</p>
                <p>Total Amount: ₹{order.orderDetails.totalAmount}</p>
                <p>
                  Ordered On: {new Date(order.timestamp).toLocaleDateString()}
                </p>
              </motion.div>
            ))
          : !error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                Loading orders...
              </motion.p>
            )}
      </div>
    </div>
  );
};

export default TrackOrderStatus;
