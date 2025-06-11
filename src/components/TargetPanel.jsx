import React from "react";

const TargetPanel = ({
  panelOpen,
  setPanelOpen,
  targets,
  selectedId,
  setSelectedId,
  removeTarget,
  updateTargetText,
  setNewTargetText,
  newTargetText,
  addTarget,
  increment,
  darkMode
}) => {
  if (!panelOpen) return (
    <div style={{
      position: "fixed",
      top: "20px",
      left: "20px",
      zIndex: 9999
    }}>
      <span onClick={() => setPanelOpen(true)} title="Hedefler" style={{ cursor: "pointer", fontSize: "3rem" }}>🎯</span>
    </div>
  );

  return (
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
  );
};

export default TargetPanel;