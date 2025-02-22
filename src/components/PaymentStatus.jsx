import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config"; // Adjust import path
import "./PaymentStatus.css";

const PaymentStatus = () => {
  const [referenceId, setReferenceId] = useState("");
  const [status, setStatus] = useState(null);

  const checkStatus = async () => {
    const q = query(
      collection(db, "payments"),
      where("referenceId", "==", referenceId)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const payment = querySnapshot.docs[0].data();
      setStatus(payment.status);
    } else {
      setStatus("Not Found");
    }
  };

  return (
    <div className="ps-payment-status">
      <h2 className="ps-title">Check Payment Status</h2>
      <input
        type="text"
        value={referenceId}
        onChange={(e) => setReferenceId(e.target.value)}
        placeholder="Enter Reference ID"
        className="ps-input"
      />
      <button
        className="ps-check-button"
        onClick={checkStatus}
        disabled={!referenceId}
      >
        Check Status
      </button>
      {status && (
        <div className="ps-result">
          Status: {status === "Success" ? "Successful" : status}
        </div>
      )}
    </div>
  );
};

export default PaymentStatus;
