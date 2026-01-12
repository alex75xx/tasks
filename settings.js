(() => {
  const STORAGE_KEY = "tasks_tasks";
  const SETTINGS_KEY = "tasks_settings";

  const defaultSettings = {
    darkMode: false,
    partyMode: false,
    language: "en",
  };

  const fallbackTranslations =
    (window.i18n && window.i18n.translations && window.i18n.translations.en) || {
      "title.settings": "Settings",
      "section.darkMode.toggle": "Toggle dark mode",
      "section.partyMode.toggle": "Toggle party mode",
      "section.backup.title": "Export/Import tasks",
      "section.backup.hint": "Backup your tasks or load them from a JSON file.",
      "button.import": "Import",
      "button.export": "Export",
      "title.importButton": "Import tasks from a JSON file",
      "title.exportButton": "Export all tasks to a JSON file",
      "aria.importInput": "Choose a tasks JSON file to import",
      "section.reset.title": "Reset tasks",
      "section.reset.hint": "Delete all tasks permanently.",
      "button.reset": "Reset",
      "title.resetButton": "Delete all tasks",
      "section.language.title": "Language",
      "section.language.hint": "Choose the interface language.",
      "label.languageSelect": "Language",
      "title.languageSelect": "Select the language for the app",
      "option.language.en": "English",
      "option.language.fr": "French",
      "option.language.es": "Spanish",
      "alert.importAdded_one":
        "{count} task imported and added. Opening your tasks.",
      "alert.importAdded_other":
        "{count} tasks imported and added. Opening your tasks.",
      "alert.importNone":
        "No new tasks found in the file. Existing tasks left unchanged.",
      "alert.importError":
        "Could not import tasks. Please choose a valid JSON file.",
      "alert.resetConfirm": "This will delete all tasks permanently. Continue?",
      "task.untitled": "Untitled",
    };

  const format = (template, vars = {}) =>
    template.replace(/\{(\w+)\}/g, (_, key) =>
      Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `{${key}}`
    );

  const translate = (key, vars = {}) => {
    if (window.i18n?.t) {
      return window.i18n.t(key, vars, settings.language);
    }
    const template = fallbackTranslations[key] ?? key;
    return format(template, vars);
  };

  const translateChoice = (baseKey, count) => {
    if (window.i18n?.tChoice) {
      return window.i18n.tChoice(baseKey, count, settings.language);
    }
    const suffix = count === 0 ? "zero" : count === 1 ? "one" : "other";
    const template =
      fallbackTranslations[`${baseKey}_${suffix}`] ??
      fallbackTranslations[baseKey] ??
      "";
    return template ? format(template, { count }) : `${count}`;
  };

  const makeId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const resetBtn = document.getElementById("resetTasksBtn");
  const darkModeToggle = document.getElementById("darkModeToggle");
  const partyToggle = document.getElementById("partyModeToggle");
  const exportBtn = document.getElementById("exportTasksBtn");
  const importBtn = document.getElementById("importTasksBtn");
  const importInput = document.getElementById("importTasksInput");
  const languageSelect = document.getElementById("languageSelect");

  const loadTasks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const normalizeTasks = (rawTasks) => {
    if (!Array.isArray(rawTasks)) return [];
    const now = Date.now();
    return rawTasks
      .filter((task) => task && typeof task === "object")
      .map((task, index) => {
        const name =
          typeof task.name === "string" && task.name.trim()
            ? task.name.trim()
            : translate("task.untitled");
        const order =
          typeof task.order === "number" && Number.isFinite(task.order)
            ? task.order
            : index;
        const createdAt =
          typeof task.createdAt === "number" ? task.createdAt : now;
        const completed = Boolean(task.completed);
        const completedAt =
          typeof task.completedAt === "number"
            ? task.completedAt
            : completed
              ? now
              : null;

        return {
          id:
            typeof task.id === "string" && task.id.trim()
              ? task.id
              : makeId(),
          name,
          completed,
          createdAt,
          completedAt,
          order,
        };
      })
      .sort((a, b) => a.order - b.order)
      .map((task, index) => ({ ...task, order: index }));
  };

  const mergeTasks = (existing, incoming) => {
    const existingIds = new Set(existing.map((task) => task.id));

    const normalizedExisting = existing
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((task, index) => ({ ...task, order: index }));

    let nextOrder = normalizedExisting.length;
    const merged = [...normalizedExisting];

    incoming.forEach((task) => {
      const taskToAdd = existingIds.has(task.id)
        ? { ...task, id: makeId() }
        : task;
      merged.push({ ...taskToAdd, order: nextOrder });
      existingIds.add(taskToAdd.id);
      nextOrder += 1;
    });

    return merged;
  };

  const saveTasks = (tasks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  };

  const updateFavicon = (darkEnabled) => {
    const desiredHref = darkEnabled
      ? "favicons/favicon-dark.png"
      : "favicons/favicon.png";
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      document.head.appendChild(link);
    }
    link.href = desiredHref;
  };

  const applyTheme = () => {
    const darkEnabled = Boolean(settings.darkMode);
    if (darkEnabled) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    updateFavicon(darkEnabled);
  };

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return { ...defaultSettings };
      const parsed = JSON.parse(stored);
      const merged = {
        ...defaultSettings,
        ...(parsed && typeof parsed === "object" ? parsed : {}),
      };
      const isSupportedLanguage =
        merged.language &&
        window.i18n?.translations &&
        window.i18n.translations[merged.language];
      if (!isSupportedLanguage) {
        merged.language =
          (window.i18n?.getLanguage && window.i18n.getLanguage()) ||
          defaultSettings.language;
      }
      return merged;
    } catch {
      return { ...defaultSettings };
    }
  };

  const saveSettings = (settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  };

  const normalizeLanguage = (lang) => {
    if (lang && window.i18n?.translations && window.i18n.translations[lang]) {
      return lang;
    }
    if (window.i18n?.getLanguage) {
      return window.i18n.getLanguage();
    }
    return defaultSettings.language;
  };

  const settings = loadSettings();

  const applyLanguage = (language, persist = false) => {
    const normalized = normalizeLanguage(language);
    settings.language = normalized || defaultSettings.language;
    if (persist) {
      if (window.i18n?.setLanguage) {
        window.i18n.setLanguage(settings.language);
      }
      saveSettings(settings);
    }
    if (window.i18n?.applyTranslations) {
      window.i18n.applyTranslations(settings.language);
    }
    document.title = translate("title.settings");
    if (languageSelect) {
      languageSelect.value = settings.language;
    }
  };

  const updateExportAvailability = () => {
    if (!exportBtn) return;
    const tasks = loadTasks();
    exportBtn.disabled = tasks.length === 0;
  };

  const exportTasks = () => {
    const tasks = loadTasks();
    if (!tasks.length) {
      updateExportAvailability();
      return;
    }
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: "application/json",
    });
    const date = new Date().toISOString().split("T")[0];
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `tasks-${date}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const existing = loadTasks();
      const normalized = normalizeTasks(parsed);
      const merged = mergeTasks(existing, normalized);
      saveTasks(merged);
      updateExportAvailability();
      const addedCount = merged.length - existing.length;
      window.alert(
        addedCount
          ? translateChoice("alert.importAdded", addedCount)
          : translate("alert.importNone")
      );
      window.location.href = "./index.html";
    } catch (err) {
      console.error("Failed to import tasks", err);
      window.alert(translate("alert.importError"));
    } finally {
      event.target.value = "";
    }
  };

  applyLanguage(settings.language, true);
  applyTheme();

  if (darkModeToggle) {
    darkModeToggle.checked = Boolean(settings.darkMode);
    darkModeToggle.addEventListener("change", () => {
      settings.darkMode = darkModeToggle.checked;
      saveSettings(settings);
      applyTheme();
    });
  }

  if (languageSelect) {
    languageSelect.value = settings.language;
    languageSelect.addEventListener("change", (event) => {
      applyLanguage(event.target.value, true);
    });
  }

  if (partyToggle) {
    partyToggle.checked = Boolean(settings.partyMode);
    partyToggle.addEventListener("change", () => {
      settings.partyMode = partyToggle.checked;
      saveSettings(settings);
    });
  }

  if (exportBtn) {
    updateExportAvailability();
    exportBtn.addEventListener("click", exportTasks);
  }

  if (importBtn && importInput) {
    importBtn.addEventListener("click", () => importInput.click());
    importInput.addEventListener("change", handleImport);
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const confirmed = window.confirm(translate("alert.resetConfirm"));
      if (!confirmed) return;
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = "./index.html";
    });
  }
})();


