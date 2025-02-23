"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSelection from "../components/ThemeSelection.jsx";
import StoryDescription from "../components/StoryDescription";
import PhotoUpload from "../components/PhotoUpload.jsx";
import AdditionalOptions from "../components/AdditionalOptions.jsx";
//import ChatWidget from "../components/ChatWidget.jsx"; // Import ChatWidget
import "./StoryCreator.css";

const firebaseConfig = {
  apiKey: "AIzaSyDO0kiKaLUuP0rM3GHypnVgh-x1IzgEPGk",
  authDomain: "calender-f74f8.firebaseapp.com",
  projectId: "calender-f74f8",
  storageBucket: "calender-f74f8.firebasestorage.app",
  messagingSenderId: "286010014188",
  appId: "1:286010014188:web:209f1756cac8cd0dab28c9",
  measurementId: "G-QNE04Y8KNK",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

const availableThemes = [
  "Love",
  "Sad",
  "Hero",
  "Family",
  "Friends",
  "Baby",
  "Adventure",
  "Mystery",
  "Fantasy",
  "Sci-Fi",
  "Historical",
  "Comedy",
  "Inspirational",
  "Nature",
];

const popularThemes = ["Love", "Hero", "Adventure", "Fantasy"];

const StoryCreator = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [storyData, setStoryData] = useState({
    themes: [],
    description: "",
    photos: [],
    characterName: "",
    setting: "",
    storyLength: "medium",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [themeInput, setThemeInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User authenticated:", currentUser.uid, currentUser.email);
        setUser(currentUser);
        const newSessionId = `${currentUser.uid}-${Date.now()}`;
        await setDoc(doc(db, "sessions", newSessionId), {
          userId: currentUser.uid,
          storyData,
          step: 1,
          createdAt: new Date().toISOString(),
        });
        setSessionId(newSessionId);
      } else {
        console.log("No user authenticated");
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleNext = () => {
    setStep(step + 1);
    updateSession(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
    updateSession(step - 1);
  };

  const updateSession = async (newStep) => {
    if (sessionId && user) {
      await setDoc(
        doc(db, "sessions", sessionId),
        {
          userId: user.uid,
          storyData,
          step: newStep,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      setError("You must be logged in to create a story.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      console.log("Starting upload process for photos:", storyData.photos);

      const photoUrls =
        storyData.photos.length > 0
          ? await Promise.all(
              storyData.photos
                .filter((photo) => photo instanceof File)
                .map(async (photo) => {
                  const fileName = `story_photos/${Date.now()}_${photo.name}`;
                  const storageRef = ref(storage, fileName);
                  console.log("Uploading photo:", fileName);
                  const snapshot = await uploadBytes(storageRef, photo, {
                    contentType: photo.type,
                  });
                  const url = await getDownloadURL(snapshot.ref);
                  console.log("Uploaded photo URL:", url);
                  return url;
                })
            )
          : [];

      const updatedStoryData = { ...storyData, photoUrls };
      const docRef = await addDoc(collection(db, "stories"), {
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        ...updatedStoryData,
        createdAt: new Date(),
      });

      await setDoc(
        doc(db, "sessions", sessionId),
        {
          userId: user.uid,
          storyData: updatedStoryData,
          step: 4,
          storyId: docRef.id,
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      console.log("Story saved with ID:", docRef.id);
      setSuccess(true);
      setStoryData({
        themes: [],
        description: "",
        photos: [],
        characterName: "",
        setting: "",
        storyLength: "medium",
      });
      setStep(1);
    } catch (error) {
      console.error("Detailed error creating story:", error);
      setError(
        `Failed to create story: ${
          error.code || error.message || "Unknown error"
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeInputChange = (e) => {
    const value = e.target.value;
    setThemeInput(value);
    if (value) {
      const filtered = availableThemes.filter((theme) =>
        theme.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleThemeSubmit = (e) => {
    e.preventDefault();
    if (themeInput && !storyData.themes.includes(themeInput)) {
      setStoryData((prev) => ({
        ...prev,
        themes: [...prev.themes, themeInput],
      }));
      setThemeInput("");
      setSuggestions([]);
    }
  };

  const handleThemeSelect = (theme) => {
    if (!storyData.themes.includes(theme)) {
      setStoryData((prev) => ({
        ...prev,
        themes: [...prev.themes, theme],
      }));
    }
    setThemeInput("");
    setSuggestions([]);
  };

  if (!user) {
    return (
      <motion.div
        className="stc-login-message"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Please log in to create a story.
      </motion.div>
    );
  }

  return (
    <motion.div
      className="stc-story-creator"
      style={{ background: getDynamicBackground(storyData.themes) }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Craft Your Story
      </motion.h1>
      {step === 1 && (
        <>
          <motion.form
            onSubmit={handleThemeSubmit}
            className="stc-theme-input-container"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <input
              type="text"
              value={themeInput}
              onChange={handleThemeInputChange}
              placeholder="Type a theme or choose below"
              className="stc-theme-input"
            />
            <motion.button
              type="submit"
              className="stc-add-theme-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!themeInput}
            >
              Add
            </motion.button>
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.ul
                  className="stc-theme-suggestions"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {suggestions.map((theme) => (
                    <motion.li
                      key={theme}
                      onClick={() => handleThemeSelect(theme)}
                      className="stc-theme-suggestion"
                      whileHover={{ backgroundColor: "#e8f5e9" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {theme}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
            {themeInput === "" && (
              <motion.div
                className="stc-theme-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <p>Popular Themes:</p>
                <div className="stc-theme-grid">
                  {popularThemes.map((theme) => (
                    <motion.button
                      key={theme}
                      className={`stc-theme-button ${
                        storyData.themes.includes(theme) ? "selected" : ""
                      }`}
                      onClick={() => handleThemeSelect(theme)}
                      whileHover={{ scale: 1.05, backgroundColor: "#c8e6c9" }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {theme}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.form>
          <ThemeSelection
            selectedThemes={storyData.themes}
            setStoryData={setStoryData}
            onNext={handleNext}
          />
        </>
      )}
      {step === 2 && (
        <StoryDescription
          description={storyData.description}
          setStoryData={setStoryData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
      {step === 3 && (
        <PhotoUpload
          photos={storyData.photos}
          setStoryData={setStoryData}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
      {step === 4 && (
        <AdditionalOptions
          storyData={storyData}
          setStoryData={setStoryData}
          onSubmit={handleSubmit}
          onPrevious={handlePrevious}
          isLoading={isLoading}
          sessionId={sessionId}
        />
      )}
      <AnimatePresence>
        {success && (
          <motion.div
            className="stc-success-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            Your story has been created successfully!
          </motion.div>
        )}
        {error && (
          <motion.div
            className="stc-error-message"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.div>
        )}
        {isLoading && (
          <motion.div
            className="stc-loading-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Uploading...
          </motion.div>
        )}
      </AnimatePresence>
      <div className="stc-floating-particles">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="stc-particle"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

const getDynamicBackground = (themes) => {
  if (themes.length === 0) {
    return "linear-gradient(135deg, #f0e6d2, #fff8dc)";
  }

  const themeStyles = {
    Love: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M30 20c-5 0-10 5-10 10v10c0 5 5 10 10 10h40c5 0 10-5 10-10V30c0-5-5-10-10-10H30zm20 25l10-10-10-10-10 10 10 10z' fill='%23ff4757' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#ff4757, #ff6b81",
    },
    Sad: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20v20h40V40c0-10-10-20-20-20zm-5 30h10' fill='%231e90ff' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#1e90ff, #4169e1",
    },
    Hero: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20l-10 20H30l20 20-10 20h40l-10-20 20-20h-20L50 20z' fill='%23ffa502' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#ffa502, #ffcd39",
    },
    Family: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 30c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm60 0c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm-30 20c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10z' fill='%23ff7f50' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#ff7f50, #ffb07a",
    },
    Friends: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M30 30c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm40 0c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10z' fill='%232ed573' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#2ed573, #7bed9f",
    },
    Baby: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20 0 5 5 10 10 10h20c5 0 10-5 10-10 0-10-10-20-20-20z' fill='%23ff6b81' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#ff6b81, #ff9cba",
    },
    Adventure: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 70h60L50 20 20 70zm20-10h20' fill='%23eccc68' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#eccc68, #fffa65",
    },
    Mystery: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20v20h40V40c0-10-10-20-20-20zm-5 25l10 10' fill='%238e44ad' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#8e44ad, #c479e1",
    },
    Fantasy: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20v20c0 5 5 10 10 10h20c5 0 10-5 10-10V40c0-10-10-20-20-20z' fill='%237535ea' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#7535ea, #9b59b6",
    },
    "Sci-Fi": {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20L30 50h40L50 20zm0 20l20 30H30L50 40z' fill='%2300b7eb' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#00b7eb, #00d4ff",
    },
    Historical: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 20h60v60H20V20zm10 10h40v40H30V30z' fill='%23d35400' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#d35400, #ff7f50",
    },
    Comedy: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20s20 20 20 20 20-10 20-20-10-20-20-20zm-10 20h20' fill='%23ffdd00' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#ffdd00, #ffeb3b",
    },
    Inspirational: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20l20 40H30l20-40z' fill='%231abc9c' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#1abc9c, #2ee6c5",
    },
    Nature: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 20-20 30h40c0-10-10-30-20-30z' fill='%231abc9c' opacity='0.15'/%3E%3C/svg%3E")`,
      gradient: "#1abc9c, #55efc4",
    },
  };

  const generateCustomGradient = (theme) => {
    const hash = theme
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 60%), hsl(${hue + 30}, 70%, 70%)`;
  };

  if (themes.length === 0) {
    return "linear-gradient(135deg, #f0e6d2, #fff8dc)";
  }

  const svgs = themes
    .slice(0, 2)
    .filter((theme) => themeStyles[theme]?.svg)
    .map((theme) => themeStyles[theme].svg)
    .join(", ");
  const gradients = themes
    .map(
      (theme) => themeStyles[theme]?.gradient || generateCustomGradient(theme)
    )
    .map((g) => g.split(", "))
    .flat()
    .join(", ");
  return `${svgs}${svgs ? ", " : ""}linear-gradient(135deg, ${gradients})`;
};

export default StoryCreator;
