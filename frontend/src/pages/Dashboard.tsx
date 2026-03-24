import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");

    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const res = await axios.get("http://localhost:5000/api/notes", {
      headers: { Authorization: localStorage.getItem("token") },
    });
    setNotes(res.data);
  };

  const deleteNote = async (id: string) => {
    if (!confirm("Delete this note?")) return;

    await axios.delete(`http://localhost:5000/api/notes/${id}`, {
      headers: { Authorization: localStorage.getItem("token") },
    });

    fetchNotes();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const filteredNotes = notes.filter(
    (n) =>
      n.title?.toLowerCase().includes(search.toLowerCase()) ||
      n.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={dark ? "container dark" : "container"}>
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>VI-NOTES</h2>

        <button onClick={() => navigate("/editor")}>+ New Note</button>
        <button onClick={logout}>Logout</button>

        <button onClick={() => setDark(!dark)}>
          {dark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* MAIN */}
      <div className="main">
        <h2>Your Notes</h2>

        {/* 🔍 SEARCH */}
        <input
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "100%",
            marginBottom: "15px",
            borderRadius: "6px",
          }}
        />

        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <div key={note._id} className="note-card">
              <h4>{note.title || "Untitled"}</h4>

              <div
                dangerouslySetInnerHTML={{
                  __html: note.content?.slice(0, 120),
                }}
              />

              {/* BUTTONS */}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={() => navigate(`/editor/${note._id}`)}
                  style={{ marginRight: "5px" }}
                >
                  Edit
                </button>

                <button onClick={() => deleteNote(note._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}