// src/hooks/useGroups.js
import { useEffect, useState } from "react";
const KEY = "collab_groups_v1";

export default function useGroups() {
  const [groups, setGroups] = useState([]);
  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    setGroups(raw ? JSON.parse(raw) : []);
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(groups));
  }, [groups]);

  const createGroup = (g) => setGroups((s) => [g, ...s]);
  return { groups, createGroup, setGroups };
}