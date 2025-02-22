import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import CustomCursor from "./components/CustomCursor";
//import Background3D from "./components/Background3D";
//import BookAnimation from "./components/BookAnimation";
import "./App.css";
import Explore from "./pages/ExplorePage";
import AboutUs from "./pages/AboutUs";
import Create from "./pages/StoryCreator";
import OrderSelection from "./components/OrderSelection";
import PaymentPage from "./components/PaymentPage";
import PaymentStatus from "./components/PaymentStatus";
import TrackOrder from "./pages/TrackOrderStatus";
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <CustomCursor />

          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/create" element={<Create />} />
            <Route path="/order-selection" element={<OrderSelection />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-status" element={<PaymentStatus />} />

            <Route path="/track-order-status" element={<TrackOrder />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
