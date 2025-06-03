import React, { useState, useEffect } from "react";

const todayKey = new Date().toISOString().split("T")[0]; // "2025-06-03"

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
    id: "vird",
    text: "Günlük Vird",
    goal: 1301,
    count: 0,
    subgoals: [
      { id: "tovbe", text: "100x Subhanallahi ve Bihamdihi", amount: 100, count: 0 },
      { id: "salavat", text: "100x Salavat", amount: 100, count: 0 },
      { id: "tevhid", text: "1001x La İlahe İllallah", amount: 1001, count: 0 },
    ],
  },
];

const Zikirmatik = () => {
  // targets state: hedefler ve alt hedefler burada
  
  const [targets, setTargets] = useState(() => {
    const saved = localStorage.getItem(`targets_${todayKey}`);
    if (saved) {
      return JSON.parse(saved);
    }
    return defaultTargets;
  });

  // Seçilen hedef ve alt hedef id
  const [selectedTargetId, setSelectedTargetId] = useState(targets[0].id);
  const [selectedSubgoalId, setSelectedSubgoalId] = useState(null);

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [muted, setMuted] = useState(() => localStorage.getItem("muted") === "true");
  const [panelOpen, setPanelOpen] = useState(false);

  // Veri kaydet
  useEffect(() => {
    localStorage.setItem(`targets_${todayKey}`, JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("muted", muted);
  }, [muted]);

  // Yardımcı: seçili hedef
  const selectedTarget = targets.find(t => t.id === selectedTargetId);

  // Yardımcı: seçili alt hedef (varsa)
  const selectedSubgoal = selectedTarget?.subgoals?.find(sg => sg.id === selectedSubgoalId);

  // Sayaç arttırma fonksiyonu
  const increment = () => {
    if (selectedSubgoal) {
      // Alt hedef sayacı arttır
      const updatedTargets = targets.map(t => {
        if (t.id === selectedTargetId) {
          return {
            ...t,
            subgoals: t.subgoals.map(sg =>
              sg.id === selectedSubgoalId
                ? { ...sg, count: sg.count + 1 }
                : sg
            ),
          };
        }
        return t;
      });
      setTargets(updatedTargets);
      if (!muted) playSound("/sounds/zikir.wav");
      if (selectedSubgoal.count + 1 === selectedSubgoal.amount && !muted) {
        setTimeout(() => {
          playSound("/sounds/hedef-tamam.mp3");
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }, 100);
      }
    } else {
      // Normal hedef sayacı arttır
      const newCount = selectedTarget.count + 1;
      const updatedTargets = targets.map(t =>
        t.id === selectedTargetId ? { ...t, count: newCount } : t
      );
      setTargets(updatedTargets);
      if (!muted) playSound("/sounds/zikir.wav");
      if (newCount === selectedTarget.goal && !muted) {
        setTimeout(() => {
          playSound("/sounds/hedef-tamam.mp3");
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }, 100);
      }
    }
  };

  // Sayaç sıfırlama
  const reset = () => {
    if (selectedSubgoal) {
      const updatedTargets = targets.map(t => {
        if (t.id === selectedTargetId) {
          return {
            ...t,
            subgoals: t.subgoals.map(sg =>
              sg.id === selectedSubgoalId
                ? { ...sg, count: 0 }
                : sg
            ),
          };
        }
        return t;
      });
      setTargets(updatedTargets);
    } else {
      const updatedTargets = targets.map(t =>
        t.id === selectedTargetId ? { ...t, count: 0 } : t
      );
      setTargets(updatedTargets);
    }
  };

  // Hedef metni değişikliği
  const updateTargetText = (id, newText) => {
    const updatedTargets = targets.map(t =>
      t.id === id ? { ...t, text: newText } : t
    );
    setTargets(updatedTargets);
  };

  // Yeni hedef ekle
  const addTarget = () => {
    const newId = "custom-" + Date.now();
    const newTarget = {
      id: newId,
      text: "Yeni Hedef",
      goal: 100,
      count: 0,
    };
    setTargets([...targets, newTarget]);
    setSelectedTargetId(newId);
    setSelectedSubgoalId(null);
  };

  // Hedef sil
  const deleteTarget = (id) => {
    // Günlük vird silinemez (id === "vird")
    if (id === "vird") return alert("Günlük Vird hedefi silinemez.");
    const filtered = targets.filter(t => t.id !== id);
    setTargets(filtered);

    // Eğer silinen hedef seçili ise, başka hedef seç
    if (selectedTargetId === id) {
      if (filtered.length > 0) {
        setSelectedTargetId(filtered[0].id);
        setSelectedSubgoalId(null);
      } else {
        setSelectedTargetId(null);
        setSelectedSubgoalId(null);
      }
    }
  };

  // Sayaç için gösterilecek değer ve hedef
  const displayCount = selectedSubgoal ? selectedSubgoal.count : selectedTarget?.count || 0;
  const displayGoal = selectedSubgoal ? selectedSubgoal.amount : selectedTarget?.goal || 0;

  // Hedefe tıklayınca (alt hedef seçimi varsa ona da tıklanabilir)
  const handleTargetClick = (id) => {
    setSelectedTargetId(id);
    setSelectedSubgoalId(null);
  };

  // Alt hedefe tıklayınca
  const handleSubgoalClick = (id) => {
    setSelectedSubgoalId(id);
  };

  // Stil
  const containerStyle = {
    backgroundColor: darkMode ? "#121212" : "#bef7c8",
    color: darkMode ? "#fff" : "#2e7d32",
    borderRadius: "300px",
    padding: "5rem",
    margin: "1rem 0",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
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
      padding: "1rem",
      position: "relative",
    }}>
      {/* Ayarlar */}
      <div style={{
        position: "fixed",
        top: "20px",
        left: "20px",      // Buton sol üstte
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        zIndex: 9999
      }}>
        <span
          onClick={() => setPanelOpen(!panelOpen)}
          title="Hedefler"
          style={{ cursor: "pointer", fontSize: "1.8rem", color: darkMode ? "#fff" : "#333" }}
        >
          📜
        </span>
        <span onClick={toggleDarkMode} title="Tema Değiştir" style={{ cursor: "pointer", fontSize: "1.8rem", color: darkMode ? "#fff" : "#333" }}>
          {darkMode ? "🌞" : "🌙"}
        </span>
        <span onClick={toggleMuted} title="Sesi Aç/Kapat" style={{ cursor: "pointer", fontSize: "1.8rem", color: darkMode ? "#fff" : "#333" }}>
          {muted ? "🔇" : "🔊"}
        </span>
      </div>

      {/* Sol Panel */}
      {panelOpen && (
        <div style={{
          position: "fixed",
          left: 0,
          top: 0,
          height: "100vh",
          width: "320px",
          backgroundColor: darkMode ? "#222" : "#fff",
          color: darkMode ? "#fff" : "#000",
          boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
          padding: "1rem",
          overflowY: "auto",
          zIndex: 9998,
          display: "flex",
          flexDirection: "column"
        }}>
          <h3>🎯 Günlük Zikir Hedefleri</h3>

          <button
            onClick={addTarget}
            style={{
              backgroundColor: "#4caf50",
              color: "#fff",
              border: "none",
              padding: "0.7rem",
              borderRadius: "8px",
              fontWeight: "bold",
              marginBottom: "1rem",
              cursor: "pointer",
            }}
          >
            + Yeni Hedef Ekle
          </button>

          <ul style={{ listStyle: "none", padding: 0, flexGrow: 1 }}>
            {targets.map(t => (
              <li key={t.id} style={{
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: t.id === selectedTargetId && !selectedSubgoalId ? "#aed581" : "#f5f5f5",
                borderRadius: "8px",
                cursor: "pointer",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="text"
                    value={t.text}
                    onChange={e => updateTargetText(t.id, e.target.value)}
                    onClick={() => handleTargetClick(t.id)}
                    style={{
                      flexGrow: 1,
                      border: "none",
                      backgroundColor: "transparent",
                      fontWeight: "bold",
                      cursor: "pointer",
                      fontSize: "1rem",
                      color: darkMode ? "#fff" : "#000",
                    }}
                  />
                  {t.id !== "vird" && (
                    <button
                      onClick={() => deleteTarget(t.id)}
                      style={{
                        backgroundColor: "#e53935",
                        border: "none",
                        borderRadius: "50%",
                        color: "#fff",
                        width: "25px",
                        height: "25px",
                        cursor: "pointer",
                      }}
                      title="Hedefi Sil"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Alt hedefler */}
                {t.subgoals && (
                  <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem", fontSize: "0.9rem" }}>
                    {t.subgoals.map(sg => (
                      <li
                        key={sg.id}
                        onClick={() => {
                          setSelectedTargetId(t.id);
                          handleSubgoalClick(sg.id);
                        }}
                        style={{
                          cursor: "pointer",
                          backgroundColor:
                            t.id === selectedTargetId && sg.id === selectedSubgoalId
                              ? "#a5d6a7"
                              : "transparent",
                          padding: "2px 4px",
                          borderRadius: "6px",
                          userSelect: "none",
                        }}
                      >
                        ▪ {sg.text} ({sg.amount}) — {sg.count}
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
        <h2 style={{ marginTop: "0.3rem", marginBottom: "1rem", fontSize: 50 }}>
          ⏱️ {selectedSubgoal ? selectedSubgoal.text : selectedTarget?.text}
        </h2>

        {/* Hedef değeri input */}
        <label>
          🎯 Hedef:
          <input
            type="number"
            value={displayGoal}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 0;
              if (selectedSubgoal) {
                // Alt hedeflerin hedefi değiştirilmez
                return;
              } else {
                const updatedTargets = targets.map(t =>
                  t.id === selectedTargetId ? { ...t, goal: val } : t
                );
                setTargets(updatedTargets);
              }
            }}
            style={{
              marginLeft: "0.5rem",
              padding: "0.3rem",
              fontSize: "1.2rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              width: "100px"
            }}
            disabled={!!selectedSubgoal}
          />
        </label>

        <div
          style={{
            fontSize: "9.2rem",
            margin: "1.2rem 0",
            marginTop: "4.7rem",
            marginBottom: "3rem",
            fontWeight: "bold"
          }}
        >
          {displayCount}
        </div>

        <button
          onClick={increment}
          style={{ ...btnStyle, padding: "4.4rem 4.4rem", marginLeft: "2rem", fontSize: 30 }}
        >
          +1
        </button>
        <button
          onClick={reset}
          style={{ ...btnStyle, backgroundColor: "#e53935", marginLeft: "3rem", borderRadius: "800px" }}
        >
          Sıfırla
        </button>
      </div>
    </div>
  );
};

export default Zikirmatik;
