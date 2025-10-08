// src/components/collaborate/CreateGroupForm.js
import React, { useState } from "react";
import "../../styles/Collaborate.css";
import useGroups from "../../hooks/useGroups";

export default function CreateGroupForm({ onClose }) {
  const { createGroup } = useGroups();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const submit = (e) => {
    e.preventDefault();
    createGroup({ id: "g-" + Date.now(), name, desc, createdAt: new Date().toISOString() });
    onClose?.();
  };

  return (
    <div className="create-group">
      <h2>Create group</h2>
      <p>Set up your group to start collaborating</p>
      <form onSubmit={submit}>
        <label>Group name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required />
        <label>Group description</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        <div className="popup-actions">
          <button type="submit" className="primary">Create group</button>
        </div>
      </form>
    </div>
  );
}