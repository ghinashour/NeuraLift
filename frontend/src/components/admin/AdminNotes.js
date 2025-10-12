import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/axios";
import "../../styles/AdminNotes.css";

function AdminNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await AdminAPI.get("/notes", {
        params: { keyword, from, to, page, limit },
      });
      setNotes(res.data.notes);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNotes();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      await AdminAPI.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  const totalPages = Math.ceil(total / limit);

  if (loading) return <p>Loading notes...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-notes">
      <h2>📝 Notes Management</h2>
      <p className="subtitle">Search, filter, and manage all user notes</p>

      {/* Filters */}
      <form className="note-filters" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by keyword..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        <button type="submit">Apply Filters</button>
      </form>

      {notes.length === 0 ? (
        <p>No notes found.</p>
      ) : (
        <table className="notes-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Content</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note._id}>
                <td>{note.user?.name || "Unknown"}</td>
                <td>{note.user?.email || "N/A"}</td>
                <td>{note.content}</td>
                <td>{new Date(note.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(note._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminNotes;
