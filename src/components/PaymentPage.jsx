import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust import path
import "./PaymentPage.css";

const PaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { orderDetails } = state || {};
  const [timeLeft, setTimeLeft] = useState(90); // 1min 30sec
  const [showPopup, setShowPopup] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  useEffect(() => {
    const validateSession = async () => {
      if (!orderDetails || !orderDetails.sessionId) {
        console.error("No session ID provided, redirecting to /create");
        navigate("/create");
        return;
      }
      const sessionDoc = await getDoc(
        doc(db, "sessions", orderDetails.sessionId)
      );
      if (!sessionDoc.exists()) {
        console.error("Invalid session ID, redirecting to /create");
        navigate("/create");
      }
    };
    validateSession();
  }, [orderDetails, navigate]);

  useEffect(() => {
    if (orderDetails) {
      console.log("PaymentPage received orderDetails:", orderDetails);
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        if (prev === 45) setShowPopup(true);
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [orderDetails]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handlePaymentConfirmation = async () => {
    if (!referenceId) {
      console.error("Reference ID is required");
      return;
    }
    if (!orderDetails) {
      console.error("orderDetails is undefined in handlePaymentConfirmation");
      return;
    }

    const sanitizedOrderDetails = {
      orderType: orderDetails.orderType || [],
      pdfQuantity: orderDetails.pdfQuantity || 0,
      hardCopyQuantity: orderDetails.hardCopyQuantity || 0,
      totalAmount: orderDetails.totalAmount || 0,
      storyData: orderDetails.storyData || {},
      sessionId: orderDetails.sessionId || "",
    };

    const paymentData = {
      orderDetails: sanitizedOrderDetails,
      paymentMethod: paymentMethod || "unknown",
      referenceId,
      status: "Not Success",
      timestamp: new Date().toISOString(),
    };

    try {
      console.log("Saving payment data:", paymentData);
      const docRef = await addDoc(collection(db, "payments"), paymentData);
      console.log("Payment saved with ID:", docRef.id);
      setShowPopup(false);
      navigate("/payment-status");
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  if (!orderDetails || !orderDetails.sessionId) {
    return null; // Render nothing while redirecting
  }

  const totalAmount = orderDetails.totalAmount || 0;
  const upiLinks = {
    gpay: `upi://pay?pa=satya773791@oksbi&pn=FASHION%204ROCK&am=${totalAmount}.00&cu=INR&tn=storybook%20order`,
    phonepe: `upi://pay?pa=9870487659@axl&pn=Neeraj%20Kumar&am=${totalAmount}.00&cu=INR&tn=storybook%20order`,
  };

  return (
    <div className="pp-payment-page">
      <h2 className="pp-title">Complete Your Payment</h2>
      <div className="pp-timer">Time Left: {formatTime(timeLeft)}</div>
      <div className="pp-methods">
        <button
          className={`pp-method-btn ${paymentMethod === "upi" ? "active" : ""}`}
          onClick={() => setPaymentMethod("upi")}
        >
          UPI
        </button>
        <button
          className={`pp-method-btn ${
            paymentMethod === "bank" ? "active" : ""
          }`}
          onClick={() => setPaymentMethod("bank")}
        >
          Bank Transfer
        </button>
      </div>
      {paymentMethod === "upi" ? (
        <div className="pp-upi-options">
          <div className="pp-upi-option">
            <h3>Pay via GPay</h3>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                upiLinks.gpay
              )}`}
              alt="GPay QR"
            />
            <p>Amount: ₹{totalAmount}</p>
          </div>
          <div className="pp-upi-option">
            <h3>Pay via PhonePe</h3>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
                upiLinks.phonepe
              )}`}
              alt="PhonePe QR"
            />
            <p>Amount: ₹{totalAmount}</p>
          </div>
        </div>
      ) : (
        <div className="pp-bank-details">
          <p>Bank: SBI</p>
          <p>A/C: 1234567890</p>
          <p>IFSC: SBIN0001234</p>
          <p>Amount: ₹{totalAmount}</p>
        </div>
      )}
      {showPopup && (
        <div className="pp-popup">
          <div className="pp-popup-content">
            <h3>Payment Done?</h3>
            <button onClick={() => setShowPopup(false)}>No</button>
            <button
              onClick={() => {
                setShowPopup("reference");
              }}
            >
              Yes
            </button>
          </div>
          {showPopup === "reference" && (
            <div className="pp-reference-input">
              <input
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="Enter Reference ID"
              />
              <button
                onClick={handlePaymentConfirmation}
                disabled={!referenceId}
              >
                Submit
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
