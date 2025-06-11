import React, { useState } from "react";

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
  const [editingId, setEditingId] = useState(null);
  const [editedText, setEditedText] = useState("");

  const handleEdit = (id, currentText) => {
    setEditingId(id);
    setEditedText(currentText);
  };

  const handleEditSubmit = (id) => {
    if (editedText.trim() !== "") {
      updateTargetText(id, editedText.trim());
    }
    setEditingId(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editingId !== null) {
        handleEditSubmit(editingId);
      } else {
        addTarget();
      }
    }
  };

  const themeBoxStyle = (id) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem",
    backgroundColor: id === selectedId ? (darkMode ? "#33691E" : "#dcedc8") : (darkMode ? "#333" : "#f0f0f0"),
    color: darkMode ? "#fff" : "#000",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)"
  });

  return (
    <>
      {/* 🎯 ikon her zaman görünür */}
      <div style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: 9999,
      }}>
        <span onClick={() => setPanelOpen(!panelOpen)} title="Hedefler" style={{ cursor: "pointer", fontSize: "3rem" }}>🎯</span>
      </div>

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
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", marginLeft: "2rem", borderBottom: "1px solid #ccc", paddingBottom: "0.5rem" }}>
                Günlük Zikir Hedefleri
          </h2>

          <input
            value={newTargetText}
            onChange={e => setNewTargetText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Yeni hedef ekle"
            style={{ padding: 6, width: "100%", marginBottom: "0.5rem" }}
          />
          <button
            onClick={addTarget}
            style={{
              width: "100%",
              padding: "0.5rem",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: 6
            }}>
            Ekle
          </button>

          <ul style={{ listStyle: "none", padding: 0, marginTop: "1rem" }}>
            {targets.map(t => (
              <li key={t.id} style={themeBoxStyle(t.id)}>
                <div style={{ width: "100%" }}>
                  {editingId === t.id ? (
                    <input
                      value={editedText}
                      autoFocus
                      onChange={(e) => setEditedText(e.target.value)}
                      onBlur={() => handleEditSubmit(t.id)}
                      onKeyDown={(e) => e.key === "Enter" && handleEditSubmit(t.id)}
                      style={{ width: "100%", padding: 4 }}
                    />
                  ) : (
                    <div onClick={() => setSelectedId(t.id)} style={{ cursor: "pointer", fontWeight: "bold" }}>
                      {t.text} ({t.count}/{t.goal})
                    </div>
                  )}

                  {t.subgoals && (
                    <ul style={{ marginTop: "0.5rem", paddingLeft: "1rem" }}>
                      {t.subgoals.map((s, i) => (
                        <li key={i} onClick={() => { setSelectedId(t.id); increment(i); }} style={{ cursor: "pointer", padding: "0.2rem 0" }}>
                          {s.text} ({s.count}/{s.amount})
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginLeft: "0.5rem" }}>
                  {editingId === t.id ? (
                    <button
                      onClick={() => handleEditSubmit(t.id)}
                      title="Kaydet"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "lightgreen", fontSize: "1.2rem" }}
                    >
                      ✅
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEdit(t.id, t.text)}
                      title="Düzenle"
                      style={{ background: "none", border: "none", cursor: "pointer" }}
                    >
                      ✏️
                    </button>
                  )}
                  <button
                    onClick={() => removeTarget(t.id)}
                    title="Sil"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default TargetPanel;
