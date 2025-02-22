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
import ThemeSelection from "../components/ThemeSelection.jsx";
import StoryDescription from "../components/StoryDescription";
import PhotoUpload from "../components/PhotoUpload.jsx";
import AdditionalOptions from "../components/AdditionalOptions.jsx";
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User authenticated:", currentUser.uid, currentUser.email);
        setUser(currentUser);
        // Create a new session for this user
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

  if (!user) {
    return (
      <div className="sc-login-message">Please log in to create a story.</div>
    );
  }

  return (
    <div
      className="sc-story-creator"
      style={{
        background: getDynamicBackground(storyData.themes),
      }}
    >
      <h1>Create Your Story</h1>
      {step === 1 && (
        <ThemeSelection
          selectedThemes={storyData.themes}
          setStoryData={setStoryData}
          onNext={handleNext}
        />
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
      {success && (
        <div className="sc-success-message">
          Your story has been created successfully!
        </div>
      )}
      {error && <div className="sc-error-message">{error}</div>}
      {isLoading && <div className="sc-loading-message">Uploading...</div>}
    </div>
  );
};

// Theme-based dynamic background function
const getDynamicBackground = (themes) => {
  if (themes.length === 0) {
    return "linear-gradient(135deg, #f0e6d2, #fff8dc)"; // Default gradient
  }

  const themeStyles = {
    Love: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M30 20c-5 0-10 5-10 10v10c0 5 5 10 10 10h40c5 0 10-5 10-10V30c0-5-5-10-10-10H30zm20 25l10-10-10-10-10 10 10 10z' fill='%23ff4757' opacity='0.15'/%3E%3C/svg%3E")`, // Couple holding hands
      gradient: "#ff4757, #ff6b81",
    },
    Sad: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20v20h40V40c0-10-10-20-20-20zm-5 30h10' fill='%231e90ff' opacity='0.15'/%3E%3C/svg%3E")`, // Person with head down
      gradient: "#1e90ff, #4169e1",
    },
    Hero: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20l-10 20H30l20 20-10 20h40l-10-20 20-20h-20L50 20z' fill='%23ffa502' opacity='0.15'/%3E%3C/svg%3E")`, // Hero in cape
      gradient: "#ffa502, #ffcd39",
    },
    Family: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 30c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm60 0c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm-30 20c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10z' fill='%23ff7f50' opacity='0.15'/%3E%3C/svg%3E")`, // Three people
      gradient: "#ff7f50, #ffb07a",
    },
    Friends: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M30 30c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10zm40 0c-5 0-10 5-10 10s5 10 10 10 10-5 10-10-5-10-10-10z' fill='%232ed573' opacity='0.15'/%3E%3C/svg%3E")`, // Two friends
      gradient: "#2ed573, #7bed9f",
    },
    Baby: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20 0 5 5 10 10 10h20c5 0 10-5 10-10 0-10-10-20-20-20z' fill='%23ff6b81' opacity='0.15'/%3E%3C/svg%3E")`, // Baby face
      gradient: "#ff6b81, #ff9cba",
    },
    Adventure: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 70h60L50 20 20 70zm20-10h20' fill='%23eccc68' opacity='0.15'/%3E%3C/svg%3E")`, // Tent
      gradient: "#eccc68, #fffa65",
    },
    Mystery: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20v20h40V40c0-10-10-20-20-20zm-5 25l10 10' fill='%238e44ad' opacity='0.15'/%3E%3C/svg%3E")`, // Detective silhouette
      gradient: "#8e44ad, #c479e1",
    },
    Fantasy: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20v20c0 5 5 10 10 10h20c5 0 10-5 10-10V40c0-10-10-20-20-20z' fill='%237535ea' opacity='0.15'/%3E%3C/svg%3E")`, // Wizard
      gradient: "#7535ea, #9b59b6",
    },
    "Sci-Fi": {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20L30 50h40L50 20zm0 20l20 30H30L50 40z' fill='%2300b7eb' opacity='0.15'/%3E%3C/svg%3E")`, // Spaceship
      gradient: "#00b7eb, #00d4ff",
    },
    Historical: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M20 20h60v60H20V20zm10 10h40v40H30V30z' fill='%23d35400' opacity='0.15'/%3E%3C/svg%3E")`, // Castle
      gradient: "#d35400, #ff7f50",
    },
    Comedy: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 10-20 20s20 20 20 20 20-10 20-20-10-20-20-20zm-10 20h20' fill='%23ffdd00' opacity='0.15'/%3E%3C/svg%3E")`, // Smiling face
      gradient: "#ffdd00, #ffeb3b",
    },
    Inspirational: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20l20 40H30l20-40z' fill='%231abc9c' opacity='0.15'/%3E%3C/svg%3E")`, // Mountain peak
      gradient: "#1abc9c, #2ee6c5",
    },
    Nature: {
      svg: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 20c-10 0-20 20-20 30h40c0-10-10-30-20-30z' fill='%231abc9c' opacity='0.15'/%3E%3C/svg%3E")`, // Tree
      gradient: "#1abc9c, #55efc4",
    },
  };

  if (themes.length === 1) {
    const { svg, gradient } = themeStyles[themes[0]] || {};
    return `${svg || ""}${svg ? ", " : ""}linear-gradient(135deg, ${
      gradient || "#f0e6d2, #fff8dc"
    })`;
  }

  const svgs = themes
    .slice(0, 2)
    .filter((theme) => themeStyles[theme]?.svg)
    .map((theme) => themeStyles[theme].svg)
    .join(", ");
  const gradients = themes
    .map((theme) => themeStyles[theme]?.gradient || "#f0e6d2, #fff8dc")
    .map((g) => g.split(", "))
    .flat()
    .join(", ");
  return `${svgs}${svgs ? ", " : ""}linear-gradient(135deg, ${gradients})`;
};

export default StoryCreator;
