import React, { useState, useEffect } from "react";

const todayKey = new Date().toISOString().split("T")[0];

const defaultTargets = [
  {
    id: "tevhid",
    text: "Tevhid",
    goal: 5000,
    count: 0,
  },
  {
    id: "salavat",
    text: "Salavat",
    goal: 1000,
    count: 0,
  },
  {
    id: "subhanallahi",
    text: "100x Subhanallahi ve Bihamdihi",
    goal: 100,
    count: 0,
  },
  {
    id: "salavat-2",
    text: "100x Salavat",
    goal: 100,
    count: 0,
  },
  {
    id: "tevhid-2",
    text: "1001x La İlahe İllallah",
    goal: 1001,
    count: 0,
  },
];

const Zikirmatik = () => {
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

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("muted", muted);
  }, [muted]);

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
    const updatedTargets = targets.map(t => t.id === selectedId ? { ...t, count: 0, subgoals: t.subgoals?.map(s => ({ ...s, count: 0 })) } : t);
    setTargets(updatedTargets);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleMuted = () => setMuted(!muted);

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

  const containerStyle = {
    backgroundColor: darkMode ? "#121212" : "#bef7c8",
    color: darkMode ? "#fff" : "#2e7d32",
    borderRadius: "300px",
    padding: "5rem",
    margin: "1rem 0",
    boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
    textAlign: "center",
    maxWidth: "520px",
    marginInline: "auto",
    position: "relative"
  };

  const btnStyle = {
    backgroundColor: "#4caf50",
    color: "white",
    padding: "1.5rem 2rem",
    margin: "2rem",
    border: "none",
    borderRadius: "300px",
    fontSize: "1.2rem",
    cursor: "pointer"
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
      {/* Ayarlar */}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        zIndex: 9999
      }}>
        <span onClick={toggleDarkMode} title="Tema Değiştir" style={{ cursor: "pointer", fontSize: "1.8rem", color: darkMode ? "#fff" : "#333" }}>
          {darkMode ? "🌞" : "🌙"}
        </span>
        <span onClick={toggleMuted} title="Sesi Aç/Kapat" style={{ cursor: "pointer", fontSize: "1.8rem", color: darkMode ? "#fff" : "#333" }}>
          {muted ? "🔇" : "🔊"}
        </span>
      </div>

      <div style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 9999
      }}>
        <span onClick={() => setPanelOpen(!panelOpen)} title="Hedefler" style={{ cursor: "pointer", fontSize: "1.8rem" }}>🎯</span>
      </div>

      {/* Hedef Paneli */}
      {panelOpen && (
        <div style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "320px",
          backgroundColor: darkMode ? "#1c1c1c" : "#ffffff",
          color: darkMode ? "#ffffff" : "#000000",
          boxShadow: "2px 0 15px rgba(0, 0, 0, 0.2)",
          padding: "1.5rem",
          overflowY: "auto",
          zIndex: 9998,
          borderTopRightRadius: "16px",
          borderBottomRightRadius: "16px"
        }}>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}> Günlük Zikir Hedefleri</h2>
          <input value={newTargetText} onChange={e => setNewTargetText(e.target.value)} placeholder="Yeni hedef ekle" style={{ padding: 6, width: "100%", marginBottom: "0.5rem" }} />
          <button onClick={addTarget} style={{ width: "100%", padding: "0.5rem", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: 6 }}>Ekle</button>
          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            {targets.map(t => (
              <li key={t.id} style={{ marginBottom: "1rem", padding: "0.75rem", backgroundColor: t.id === selectedId ? "#dcedc8" : "#f9f9f9", borderRadius: "8px", boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
                <input value={t.text} onChange={e => updateTargetText(t.id, e.target.value)} style={{ width: "75%", marginBottom: "0.5rem" }} />
                <button onClick={() => removeTarget(t.id)} style={{ float: "right", background: "none", border: "none", fontSize: "1rem" }}>❌</button>
                <div onClick={() => setSelectedId(t.id)} style={{ cursor: "pointer", fontWeight: "bold" }}>({t.count}/{t.goal})</div>
                {t.subgoals && (
                  <ul>
                    {t.subgoals.map((s, i) => (
                      <li key={i} onClick={() => { setSelectedId(t.id); increment(i); }} style={{ cursor: "pointer", padding: "0.2rem 0" }}>
                        {s.text} ({s.count}/{s.amount})
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Zikirmatik */}
      <div style={containerStyle}>
        <h2 style={{ marginTop: "0.3rem", marginBottom: "1rem", fontSize: 70 }}>⏱️{selectedTarget.text}</h2>

        <label>
           Hedef:
          <input
            type="number"
            value={selectedTarget.goal}
            onChange={(e) => {
              const updatedTargets = targets.map(t => t.id === selectedId ? { ...t, goal: parseInt(e.target.value) } : t);
              setTargets(updatedTargets);
            }}
            style={{
              marginLeft: "0.5rem",
              padding: "0.3rem",
              fontSize: "1.2rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100px"
            }}
          />
        </label>

        <div style={{ fontSize: "9.8rem", margin: "1.2rem 0", marginTop: "4.7rem", marginBottom: "3rem", fontWeight: "bold" }}>
          {selectedTarget.count}
        </div>

        {selectedTarget.subgoals ? (
          <div>
            {selectedTarget.subgoals.map((sub, i) => (
              <button key={i} onClick={() => increment(i)} style={{ ...btnStyle, fontSize: 18, margin: "0.4rem" }}>
                +1: {sub.text} ({sub.count}/{sub.amount})
              </button>
            ))}
          </div>
        ) : (
          <button onClick={() => increment()} style={{ ...btnStyle, padding: "9rem 9rem", marginLeft: "2rem", fontSize: 30 }}>+1</button>
        )}

        <button onClick={reset} style={{ ...btnStyle, backgroundColor: "#e53935", marginLeft: "2rem", marginTop: "5rem",borderRadius: "800px" }}>Sıfırla</button>
      </div>
    </div>
  );
};

export default Zikirmatik;