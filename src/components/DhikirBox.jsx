import React from "react";

const DhikirBox = ({ selectedTarget, increment, reset, targets, setTargets, selectedId, darkMode }) => {
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
    <div style={containerStyle}>
      <h2 style={{ marginTop: "0.3rem", marginBottom: "1rem", fontSize: 70 }}>{selectedTarget.text}</h2>

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

      <button onClick={reset} style={{ ...btnStyle, backgroundColor: "#e53935", marginLeft: "2rem", marginTop: "5rem", borderRadius: "800px" }}>
        Sıfırla
      </button>
    </div>
  );
};

export default DhikirBox;