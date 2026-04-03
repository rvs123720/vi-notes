import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  const [keystrokes, setKeystrokes] = useState(0);
  const [pastes, setPastes] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const navigate = useNavigate();
  const { id } = useParams();
  const token = localStorage.getItem("token"); 

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    if (id) {
      axios.get(`http://localhost:5000/api/notes/${id}`, {
        headers: { 
          Authorization: `Bearer ${token}`
        }
      })
      .then((res) => {
        const note = res.data;

        setTitle(note.title || "");
        setContent(note.content || "");
        setKeystrokes(note.keystrokes || 0);
        setPastes(note.pastes || 0);
      })
      .catch(err => {
        console.error("Error loading note:", err.response?.data || err.message);
      });
    }
  }, [id, token, navigate]);


  useEffect(() => {
    const plainText = content.replace(/<[^>]*>/g, ""); 
    setCharCount(plainText.length);
  }, [content]);

 
  const saveNote = async () => {
    if (!title) return alert("Title required");

    const payload = { title, content, keystrokes, pastes };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };

    try {
      if (id) {
        await axios.put(`http://localhost:5000/api/notes/${id}`, payload, config);
      } else {
        await axios.post("http://localhost:5000/api/notes", payload, config);
      }
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Save Error:", err.response?.data || err.message);
      alert("Error saving note. Please check your connection.");
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px" }}>
      
      <div style={{ 
        display: "flex", 
        gap: "20px", 
        background: "#f1f3f5", 
        padding: "10px", 
        borderRadius: "6px", 
        marginBottom: "15px",
        fontSize: "14px",
        color: "#495057",
        border: "1px solid #ced4da"
      }}>
        <span>Keystrokes: <strong style={{color: "#4c6ef5"}}>{keystrokes}</strong></span>
        <span>Pastes: <strong style={{color: "#fa5252"}}>{pastes}</strong></span>
        <span>Characters: <strong>{charCount}</strong></span>
      </div>

      <h2>{id ? "Edit Note" : "New Note"}</h2>

      <input
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "10px",
          fontSize: "18px",
          borderRadius: "6px",
          border: "1px solid #ced4da",
          boxSizing: "border-box"
        }}
      />

      <div 
        onKeyDown={() => setKeystrokes(prev => prev + 1)} 
        onPaste={() => setPastes(prev => prev + 1)}
      >
        <ReactQuill
          value={content}
          onChange={setContent}
          modules={modules}
          style={{ height: "300px", marginBottom: "50px" }}
        />
      </div>

      <button
        onClick={saveNote}
        style={{
          padding: "10px 20px",
          background: "#1aa6d9",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Save Note
      </button>
    </div>
  );
}