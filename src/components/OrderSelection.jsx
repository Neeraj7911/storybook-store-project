import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust import path
import "./OrderSelection.css";

const OrderSelection = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { storyData, sessionId } = state || {};

  const [orderType, setOrderType] = useState([]);
  const [pdfQuantity, setPdfQuantity] = useState(1);
  const [hardCopyQuantity, setHardCopyQuantity] = useState(1);

  useEffect(() => {
    const validateSession = async () => {
      if (!sessionId) {
        console.error("No session ID provided, redirecting to /create");
        navigate("/create");
        return;
      }
      const sessionDoc = await getDoc(doc(db, "sessions", sessionId));
      if (!sessionDoc.exists()) {
        console.error("Invalid session ID, redirecting to /create");
        navigate("/create");
      }
    };
    validateSession();
  }, [sessionId, navigate]);

  useEffect(() => {
    console.log("OrderSelection State:", {
      orderType,
      pdfQuantity,
      hardCopyQuantity,
      storyData,
      sessionId,
    });
  }, [orderType, pdfQuantity, hardCopyQuantity, storyData, sessionId]);

  const handleOrderTypeChange = (type) => {
    if (orderType.includes(type)) {
      setOrderType(orderType.filter((t) => t !== type));
    } else {
      setOrderType([...orderType, type]);
    }
  };

  const calculateTotal = () => {
    let total = 0;
    if (orderType.includes("pdf")) total += 199 * pdfQuantity;
    if (orderType.includes("hardcopy")) total += (499 + 50) * hardCopyQuantity;
    return total;
  };

  const handleProceed = () => {
    const total = calculateTotal();
    const orderDetails = {
      orderType,
      pdfQuantity: orderType.includes("pdf") ? pdfQuantity : 0,
      hardCopyQuantity: orderType.includes("hardcopy") ? hardCopyQuantity : 0,
      totalAmount: total,
      storyData: storyData || {},
      sessionId,
    };
    console.log("Proceeding with orderDetails:", orderDetails);
    navigate("/payment", { state: { orderDetails } });
  };

  if (!sessionId) {
    return null; // Render nothing while redirecting
  }

  return (
    <div className="os-order-selection">
      <h2 className="os-title">Select Your Order</h2>
      <div className="os-options">
        <div className="os-option">
          <label>
            <input
              type="checkbox"
              checked={orderType.includes("pdf")}
              onChange={() => handleOrderTypeChange("pdf")}
            />
            PDF (₹199)
          </label>
          {orderType.includes("pdf") && (
            <input
              type="number"
              min="1"
              value={pdfQuantity}
              onChange={(e) =>
                setPdfQuantity(Math.max(1, Number(e.target.value)))
              }
              className="os-quantity"
            />
          )}
        </div>
        <div className="os-option">
          <label>
            <input
              type="checkbox"
              checked={orderType.includes("hardcopy")}
              onChange={() => handleOrderTypeChange("hardcopy")}
            />
            Hard Copy (₹499 + ₹50 Shipping)
          </label>
          {orderType.includes("hardcopy") && (
            <input
              type="number"
              min="1"
              value={hardCopyQuantity}
              onChange={(e) =>
                setHardCopyQuantity(Math.max(1, Number(e.target.value)))
              }
              className="os-quantity"
            />
          )}
        </div>
      </div>
      <div className="os-total">Total: ₹{calculateTotal()}</div>
      <button
        className="os-proceed-button"
        onClick={handleProceed}
        disabled={orderType.length === 0}
      >
        Proceed to Payment
      </button>
    </div>
  );
};

export default OrderSelection;
