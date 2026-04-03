import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function Evaluate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState<any>(null);
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.log("No token");
          navigate("/");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/notes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const n = res.data;
        setNote(n);

        const plainText = n.content
          ? n.content.replace(/<[^>]*>/g, "")
          : "";

        const chars = plainText.length;
        const keys = n.keystrokes || 0;
        const pastes = n.pastes || 0;

        let finalScore = 0;

        if (chars > 0) {
          const typingRatio = Math.min(keys / chars, 1);
          const pastePenalty = pastes * 0.15;

          finalScore = Math.max(
            Math.round((typingRatio - pastePenalty) * 100),
            0
          );
        }

        setScore(finalScore);
      } catch (err: any) {
        console.error("Evaluate Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading report...</div>;
  }

  if (!note) {
    return (
      <div style={{ padding: "20px" }}>
        <h3>Unable to load note</h3>
        <button onClick={() => navigate("/dashboard")}>Back</button>
      </div>
    );
  }

  const getStatus = () => {
    if ((score ?? 0) > 75) return "Highly Genuine";
    if ((score ?? 0) > 50) return "Moderate (Some Paste Detected)";
    return "Likely Copied / AI Generated";
  };

  return (
    <div style={{ padding: "30px", maxWidth: "800px", margin: "auto" }}>
      <h2>Integrity Report</h2>

      <h3>{note.title || "Untitled"}</h3>

      <div style={{ marginTop: "20px" }}>
        <p>
          <strong>Score:</strong> {score}%
        </p>

        <p>
          <strong>Status:</strong> {getStatus()}
        </p>
      </div>

      <hr />

      <div style={{ marginTop: "15px" }}>
        <p>Keystrokes: {note.keystrokes}</p>
        <p>Pastes: {note.pastes}</p>
        <p>
          Characters:{" "}
          {note.content
            ? note.content.replace(/<[^>]*>/g, "").length
            : 0}
        </p>
      </div>

      {}
      <div style={{ marginTop: "25px" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 20px",
            background: "#25c9f2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}