(() => {
  const STORAGE_KEY = "tasks_tasks";
  const SETTINGS_KEY = "tasks_settings";

  const taskForm = document.getElementById("taskForm");
  const taskNameInput = document.getElementById("taskName");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearchBtn");
  const taskList = document.getElementById("taskList");
  const emptyState = document.getElementById("emptyState");
  const completedTasksEl = document.getElementById("completedTasks");
  const commentPad = document.getElementById("commentPad");
  const layoutRoot = document.getElementById("layoutRoot");
  const commentPadContainer = commentPad?.closest(".comment-pad");
  const notesFeature =
    window.TasksNotes || {
      applyVisibility: () => {},
      bindPersistence: () => {},
      loadInto: () => {},
    };

  const state = {
    tasks: [],
    filter: "",
    draggingId: null,
  };

  const settings = {
    darkMode: false,
    partyMode: false,
    notesEnabled: true,
    language: "en",
  };

  const fallbackTranslations =
    (window.i18n && window.i18n.translations && window.i18n.translations.en) || {
      "title.tasks": "Tasks",
      "empty.default": "No tasks yet. Add one to get started.",
      "empty.filtered": "No tasks match your search.",
      "stats.completed_zero": "0 completed",
      "stats.completed_one": "{count} completed",
      "stats.completed_other": "{count} completed",
      "task.renameTooltip":
        "Click to rename task. Empty task name to delete task.",
      "task.editTooltip": "Rename task or empty task name to delete task",
      "task.markComplete": "Mark task as completed",
      "task.markIncomplete": "Mark task as incomplete",
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

  const syncLanguage = () => {
    const nextLanguage =
      (window.i18n?.getLanguage && window.i18n.getLanguage()) ||
      settings.language ||
      "en";
    settings.language = nextLanguage;
    if (window.i18n?.applyTranslations) {
      window.i18n.applyTranslations(settings.language);
    }
    document.title = translate("title.tasks");
  };

  const updateFavicon = (darkEnabled) => {
    const href = darkEnabled
      ? "favicons/favicon-dark.png"
      : "favicons/favicon.png";
    let link = document.querySelector('link[rel~="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      document.head.appendChild(link);
    }
    link.href = href;
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

  const triggerConfetti =
    (window.createPartyConfetti && window.createPartyConfetti()) ||
    (() => {});

  const loadTasks = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          state.tasks = parsed.map((task, index) => ({
            id: task.id || makeId(),
            name: task.name || translate("task.untitled"),
            completed: Boolean(task.completed),
            createdAt: task.createdAt || Date.now(),
            completedAt: task.completedAt || null,
            order: typeof task.order === "number" ? task.order : index,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load tasks", err);
      state.tasks = [];
    }
    sortByOrder();
    reorderCompletedToBottomOnLoad();
    saveTasks();
  };

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return;
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        settings.darkMode = Boolean(parsed.darkMode);
        settings.partyMode = Boolean(parsed.partyMode);
        settings.notesEnabled =
          parsed.notesEnabled === undefined ? true : Boolean(parsed.notesEnabled);
        if (
          parsed.language &&
          window.i18n?.translations &&
          window.i18n.translations[parsed.language]
        ) {
          settings.language = parsed.language;
        }
      }
    } catch {
      // Ignore settings load issues; fallback to defaults.
    }
    if (!settings.language && window.i18n?.getLanguage) {
      settings.language = window.i18n.getLanguage();
    }
  };

  const saveTasks = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
  };

  const makeId = () =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `task-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const sortByOrder = () => {
    state.tasks.sort((a, b) => a.order - b.order);
  };

  const addTask = (name) => {
    // Place new tasks at the top by prepending and reindexing all tasks.
    sortByOrder();
    state.tasks.unshift({
      id: makeId(),
      name,
      completed: false,
      createdAt: Date.now(),
      completedAt: null,
      order: 0,
    });
    state.tasks.forEach((task, index) => {
      task.order = index;
    });
    saveTasks();
    render();
  };

  const updateTaskName = (id, name) => {
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
      task.name = name;
      saveTasks();
      render();
    }
  };

  const toggleTask = (id, completed) => {
    const task = state.tasks.find((t) => t.id === id);
    if (task) {
      task.completed = completed;
      task.completedAt = completed ? Date.now() : null;
      if (settings.partyMode && completed) {
        triggerConfetti();
      }
      saveTasks();
      render();
    }
  };

  const deleteTask = (id) => {
    state.tasks = state.tasks.filter((t) => t.id !== id);
    state.tasks.forEach((task, index) => {
      task.order = index;
    });
    saveTasks();
    render();
  };

  const setFilter = (query) => {
    state.filter = query.trim().toLowerCase();
    render();
  };

  const filteredTasks = () =>
    state.filter
      ? state.tasks.filter((task) =>
          task.name.toLowerCase().includes(state.filter)
        )
      : state.tasks;

  const getDisplayTasks = () =>
    filteredTasks()
      .slice()
      .sort((a, b) => a.order - b.order);

  const renderStats = () => {
    const completed = state.tasks.filter((t) => t.completed).length;
    if (completedTasksEl) {
      completedTasksEl.textContent = translateChoice(
        "stats.completed",
        completed
      );
    }
  };

  const render = () => {
    taskList.innerHTML = "";
    const tasksToShow = getDisplayTasks();
    if (tasksToShow.length === 0) {
      emptyState.textContent = state.filter
        ? translate("empty.filtered")
        : translate("empty.default");
      emptyState.style.display = "block";
    } else {
      emptyState.style.display = "none";
    }

    tasksToShow.forEach((task) => {
      const item = buildTaskItem(task);
      taskList.appendChild(item);
    });

    renderStats();
  };

  const buildTaskItem = (task) => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = task.id;
    li.draggable = !task.completed;

    const main = document.createElement("div");
    main.className = "task-main";

    const nameSpan = document.createElement("span");
    nameSpan.className = "task-name";
    nameSpan.textContent = task.name;
    nameSpan.title = translate("task.renameTooltip");
    if (task.completed) {
      nameSpan.classList.add("completed");
    }

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "task-edit-input";
    editInput.value = task.name;
    editInput.maxLength = 200;
    editInput.title = translate("task.editTooltip");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-checkbox";
    checkbox.checked = task.completed;
    checkbox.title = task.completed
      ? translate("task.markIncomplete")
      : translate("task.markComplete");
    checkbox.addEventListener("change", () => {
      toggleTask(task.id, checkbox.checked);
    });

    nameSpan.addEventListener("click", () => {
      startEdit(li, editInput, nameSpan);
    });

    editInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commitEdit(task.id, li, editInput, nameSpan);
      } else if (event.key === "Escape") {
        stopEdit(li, editInput, nameSpan);
      }
    });
    editInput.addEventListener("blur", () => {
      if (li.classList.contains("editing")) {
        commitEdit(task.id, li, editInput, nameSpan);
      }
    });

    if (!task.completed) {
      li.addEventListener("dragstart", () => {
        state.draggingId = task.id;
        li.classList.add("dragging");
      });

      li.addEventListener("dragend", () => {
        li.classList.remove("dragging");
        state.draggingId = null;
        syncOrderFromDom();
      });
    }

    main.appendChild(nameSpan);
    main.appendChild(editInput);
    main.appendChild(checkbox);

    li.appendChild(main);
    return li;
  };

  const startEdit = (li, input, nameSpan) => {
    li.classList.add("editing");
    li.draggable = false;
    input.value = nameSpan.textContent;
    input.style.display = "block";
    input.focus();
    input.select();
  };

  const stopEdit = (li, input, nameSpan) => {
    li.classList.remove("editing");
    li.draggable = !state.tasks.find((t) => t.id === li.dataset.id)?.completed;
    input.style.display = "none";
    input.value = nameSpan.textContent;
  };

  const commitEdit = (id, li, input, nameSpan) => {
    const nextName = input.value.trim();
    if (!nextName) {
      deleteTask(id);
      return;
    }
    if (nextName !== nameSpan.textContent) {
      updateTaskName(id, nextName);
    }
    stopEdit(li, input, nameSpan);
  };

  const syncOrderFromDom = () => {
    const ids = Array.from(taskList.children)
      .map((item) => item.dataset.id)
      .filter((id) => {
        const task = state.tasks.find((t) => t.id === id);
        return task && !task.completed;
      });
    if (!ids.length) return;
    ids.forEach((id, index) => {
      const task = state.tasks.find((t) => t.id === id);
      if (task) {
        task.order = index;
      }
    });
    saveTasks();
  };

  const reorderCompletedToBottomOnLoad = () => {
    const active = state.tasks
      .filter((task) => !task.completed)
      .sort((a, b) => a.order - b.order);
    const completed = state.tasks
      .filter((task) => task.completed)
      .sort((a, b) => {
        const aTime = typeof a.completedAt === "number" ? a.completedAt : 0;
        const bTime = typeof b.completedAt === "number" ? b.completedAt : 0;
        if (bTime !== aTime) return bTime - aTime;
        return a.order - b.order;
      });
    const combined = [...active, ...completed];
    combined.forEach((task, index) => {
      task.order = index;
    });
    state.tasks = combined;
  };

  const handleListDragOver = (event) => {
    event.preventDefault();
    const afterElement = getDragAfterElement(taskList, event.clientY);
    const dragging = document.querySelector(".dragging");
    if (!dragging) return;
    if (afterElement == null) {
      taskList.appendChild(dragging);
    } else {
      taskList.insertBefore(dragging, afterElement);
    }
  };

  const getDragAfterElement = (container, y) => {
    const elements = [...container.querySelectorAll(".task-item:not(.dragging)")];
    return elements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY, element: null }
    ).element;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = taskNameInput.value.trim();
    if (!name) {
      taskNameInput.focus();
      return;
    }
    addTask(name);
    taskNameInput.value = "";
    taskNameInput.focus();
  };

  const bindEvents = () => {
    taskForm.addEventListener("submit", handleSubmit);
    searchInput.addEventListener("input", () => {
      setFilter(searchInput.value);
      if (clearSearchBtn) {
        clearSearchBtn.style.display =
          searchInput.value.trim().length > 0 ? "block" : "none";
      }
    });
    taskList.addEventListener("dragover", handleListDragOver);
    if (clearSearchBtn) {
      clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearSearchBtn.style.display = "none";
        setFilter("");
        searchInput.focus();
      });
      clearSearchBtn.style.display = "none";
    }
  };

  loadSettings();
  syncLanguage();
  applyTheme();
  notesFeature.applyVisibility(
    { layoutRoot, container: commentPadContainer },
    settings.notesEnabled
  );
  loadTasks();
  notesFeature.loadInto(commentPad);
  notesFeature.bindPersistence(commentPad);
  bindEvents();
  render();
})();

