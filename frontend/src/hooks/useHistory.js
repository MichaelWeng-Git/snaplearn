import { useState } from 'react';

const MAX_ENTRIES = 50;
const STORAGE_KEY = 'analysisHistory';

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveHistory(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export default function useHistory() {
  const [history, setHistory] = useState(loadHistory);

  function addEntry(result) {
    setHistory((prev) => {
      const entry = { id: Date.now(), timestamp: new Date().toISOString(), ...result };
      const next = [entry, ...prev].slice(0, MAX_ENTRIES);
      saveHistory(next);
      return next;
    });
  }

  function deleteEntry(id) {
    setHistory((prev) => {
      const next = prev.filter((e) => e.id !== id);
      saveHistory(next);
      return next;
    });
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return { history, addEntry, deleteEntry, clearHistory };
}
