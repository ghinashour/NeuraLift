import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../api/axios";
import "../../styles/AdminSuccessStories.css";

const AdminSuccessStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStories = async () => {
    try {
      const res = await AdminAPI.get("/stories");
      setStories(res.data.data.stories);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch stories");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;
    try {
      await AdminAPI.delete(`/stories/${id}`);
      setStories(stories.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete story");
    }
  };

  const handleToggleFeature = async (id) => {
    try {
      const res = await AdminAPI.put(`/stories/feature/${id}`);
      setStories(stories.map((s) => (s._id === id ? res.data.data : s)));
    } catch (err) {
      console.error(err);
      alert("Failed to toggle feature");
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-stories-root">
      <div className="admin-stories-card">
        <div className="admin-stories-header">
          <h2>Admin Success Stories</h2>
          <div className="admin-controls">
            {/* Add optional filters/search buttons here later */}
          </div>
        </div>

        <div className="table-wrap">
          {stories.length === 0 ? (
            <div className="empty">No success stories found.</div>
          ) : (
            <table className="admin-stories-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s._id}>
                    <td className="story-title">
                      {s.title}
                      <span className="meta">{s._id}</span>
                    </td>
                    <td>{s.author || "—"}</td>
                    <td>{s.category || "—"}</td>
                    <td>
                      <span className={`badge ${s.isFeatured ? "yes" : "no"}`}>
                        {s.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td>
                      <div className="actions">
                        <button
                          className="btn btn-feature"
                          onClick={() => handleToggleFeature(s._id)}
                        >
                          {s.isFeatured ? "Unfeature" : "Feature"}
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(s._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSuccessStories;
