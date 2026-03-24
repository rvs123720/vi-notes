import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Editor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    if (id) {
      axios.get(`http://localhost:5000/api/notes/${id}`).then((res) => {
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
      });
    }
  }, [id]);

  const saveNote = async () => {
    if (!title) return alert("Title required");

    if (id) {
      await axios.put(`http://localhost:5000/api/notes/${id}`, {
        title,
        content,
      });
    } else {
      await axios.post("http://localhost:5000/api/notes", {
        title,
        content,
      });
    }

    navigate("/dashboard");
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
        }}
      />

      {}
      <ReactQuill
        value={content}
        onChange={setContent}
        modules={modules}
        style={{ height: "300px", marginBottom: "50px" }}
      />

      <button
        onClick={saveNote}
        style={{
          padding: "10px 20px",
          background: "#4c6ef5",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Save Note
      </button>
    </div>
  );
}