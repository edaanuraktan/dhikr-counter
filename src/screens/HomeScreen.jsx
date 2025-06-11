import React, { useState, useEffect } from "react";
import SettingsPanel from "../components/SettingsPanel";
import TargetPanel from "../components/TargetPanel";
import ZikirmatikBox from "../components/DhikirBox";

const todayKey = new Date().toISOString().split("T")[0];

const defaultTargets = [
  { id: "tevhid", text: "Tevhid", goal: 5000, count: 0 },
  { id: "salavat", text: "Salavat", goal: 1000, count: 0 },
  { id: "subhanallahi", text: "100x Subhanallahi ve Bihamdihi", goal: 100, count: 0 },
  { id: "salavat-2", text: "100x Salavat", goal: 100, count: 0 },
  { id: "tevhid-2", text: "1001x La İlahe İllallah", goal: 1001, count: 0 },
];

const HomeScreen = () => {
  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem(`targets_${todayKey}`);
    return saved ? JSON.parse(saved) : defaultTargets;
  });

  const [selectedId, setSelectedId] = useState(targets[0].id);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [muted, setMuted] = useState(() => localStorage.getItem("muted") === "true");
  const [panelOpen, setPanelOpen] = useState(false);
  const [newTargetText, setNewTargetText] = useState("");

  useEffect(() => {
    localStorage.setItem(`targets_${todayKey}`, JSON.stringify(targets));
  }, [targets]);

  useEffect(() => localStorage.setItem("darkMode", darkMode), [darkMode]);
  useEffect(() => localStorage.setItem("muted", muted), [muted]);

  const selectedTarget = targets.find(t => t.id === selectedId);

  const playSound = (src) => {
    const audio = new Audio(src);
    audio.play();
  };

  const increment = (subIndex = null) => {
    const updatedTargets = targets.map(t => {
      if (t.id !== selectedId) return t;
      if (t.subgoals && subIndex !== null) {
        const updatedSubgoals = t.subgoals.map((s, i) => i === subIndex ? { ...s, count: s.count + 1 } : s);
        const newCount = updatedSubgoals.reduce((sum, s) => sum + s.count, 0);
        if (!muted) playSound("/sounds/zikir.wav");
        if (newCount === t.goal && !muted) {
          setTimeout(() => {
            playSound("/sounds/hedef-tamam.mp3");
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          }, 100);
        }
        return { ...t, subgoals: updatedSubgoals, count: newCount };
      }
      const newCount = t.count + 1;
      if (!muted) playSound("/sounds/zikir.wav");
      if (newCount === t.goal && !muted) {
        setTimeout(() => {
          playSound("/sounds/hedef-tamam.mp3");
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }, 100);
      }
      return { ...t, count: newCount };
    });
    setTargets(updatedTargets);
  };

  const reset = () => {
    const updatedTargets = targets.map(t =>
      t.id === selectedId
        ? { ...t, count: 0, subgoals: t.subgoals?.map(s => ({ ...s, count: 0 })) }
        : t
    );
    setTargets(updatedTargets);
  };

  const addTarget = () => {
    if (!newTargetText.trim()) return;
    const newTarget = {
      id: newTargetText.toLowerCase().replace(/\s+/g, "_"),
      text: newTargetText,
      goal: 100,
      count: 0
    };
    setTargets([...targets, newTarget]);
    setNewTargetText("");
  };

  const removeTarget = (id) => {
    if (id === selectedId) setSelectedId(targets[0]?.id || "");
    setTargets(targets.filter(t => t.id !== id));
  };

  const updateTargetText = (id, newText) => {
    const updatedTargets = targets.map(t => t.id === id ? { ...t, text: newText } : t);
    setTargets(updatedTargets);
  };

  return (
    <div style={{
      backgroundColor: darkMode ? "#1a1a1a" : "#f0f4f8",
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      padding: "1rem"
    }}>
      <SettingsPanel
        darkMode={darkMode}
        toggleDarkMode={() => setDarkMode(!darkMode)}
        muted={muted}
        toggleMuted={() => setMuted(!muted)}
      />
      <TargetPanel
        panelOpen={panelOpen}
        setPanelOpen={setPanelOpen}
        targets={targets}
        selectedId={selectedId}
        setSelectedId={setSelectedId}
        removeTarget={removeTarget}
        updateTargetText={updateTargetText}
        setNewTargetText={setNewTargetText}
        newTargetText={newTargetText}
        addTarget={addTarget}
        increment={increment}
        darkMode={darkMode}
      />
      <ZikirmatikBox
        selectedTarget={selectedTarget}
        increment={increment}
        reset={reset}
        targets={targets}
        setTargets={setTargets}
        selectedId={selectedId}
        darkMode={darkMode}
      />
    </div>
  );
};

export default HomeScreen;
