(() => {
  const COMMENTS_KEY = "tasks_comments";

  const loadNotes = () => {
    try {
      const stored = localStorage.getItem(COMMENTS_KEY);
      return typeof stored === "string" ? stored : "";
    } catch (err) {
      console.warn("Failed to load notes", err);
      return "";
    }
  };

  const saveNotes = (value) => {
    try {
      localStorage.setItem(COMMENTS_KEY, value ?? "");
    } catch (err) {
      console.warn("Failed to save notes", err);
    }
  };

  const clearNotes = () => {
    try {
      localStorage.removeItem(COMMENTS_KEY);
    } catch (err) {
      console.warn("Failed to clear notes", err);
    }
  };

  const applyVisibility = ({ layoutRoot, container }, enabled) => {
    const isEnabled = Boolean(enabled);
    if (layoutRoot) {
      layoutRoot.classList.toggle("no-notes", !isEnabled);
    }
    if (container) {
      container.style.display = isEnabled ? "flex" : "none";
    }
  };

  const loadInto = (textarea) => {
    if (!textarea) return "";
    const value = loadNotes();
    textarea.value = value;
    return value;
  };

  const bindPersistence = (textarea) => {
    if (!textarea) return;
    textarea.addEventListener("input", () => {
      saveNotes(textarea.value);
    });
  };

  window.TasksNotes = {
    COMMENTS_KEY,
    loadNotes,
    saveNotes,
    clearNotes,
    applyVisibility,
    loadInto,
    bindPersistence,
  };
})();

