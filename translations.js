(() => {
  const SETTINGS_KEY = "tasks_settings";
  const FALLBACK_LANGUAGE = "en";

  const translations = {
    en: {
      "title.tasks": "Tasks",
      "title.settings": "Settings",
      "link.settings": "Settings",
      "link.settingsTitle": "Open settings",
      "link.tasks": "Tasks",
      "link.tasksTitle": "Back to tasks",
      "label.taskName": "Task name",
      "placeholder.taskName": "New task, press 'Enter' to add +",
      "title.taskNameInput":
        "Enter the name of the task and press 'Enter' to create it",
      "label.search": "Search tasks",
      "placeholder.search": "Search tasks...",
      "title.searchInput": "Search tasks by name and press 'Enter' to filter",
      "aria.clearSearch": "Clear search",
      "title.clearSearch": "Clear search",
      "aria.taskList": "Tasks",
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
      "section.darkMode.title": "Dark mode",
      "section.darkMode.hint": "Use a darker color palette.",
      "section.darkMode.toggle": "Toggle dark mode",
      "section.partyMode.title": "Party mode 🎉",
      "section.partyMode.hint": "Sprinkle confetti whenever you complete a task.",
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
    },
    fr: {
      "title.tasks": "Tâches",
      "title.settings": "Paramètres",
      "link.settings": "Paramètres",
      "link.settingsTitle": "Ouvrir les paramètres",
      "link.tasks": "Tâches",
      "link.tasksTitle": "Retour aux tâches",
      "label.taskName": "Nom de la tâche",
      "placeholder.taskName":
        "Nouvelle tâche, appuyez sur « Entrée » pour ajouter +",
      "title.taskNameInput":
        "Saisissez le nom de la tâche puis appuyez sur « Entrée » pour la créer",
      "label.search": "Rechercher",
      "placeholder.search": "Rechercher...",
      "title.searchInput":
        "Recherchez des tâches par nom puis appuyez sur « Entrée » pour filtrer",
      "aria.clearSearch": "Effacer la recherche",
      "title.clearSearch": "Effacer la recherche",
      "aria.taskList": "Tâches",
      "empty.default":
        "Aucune tâche pour le moment. Ajoutez-en une pour commencer.",
      "empty.filtered": "Aucune tâche ne correspond à votre recherche.",
      "stats.completed_zero": "0 terminées",
      "stats.completed_one": "{count} terminée",
      "stats.completed_other": "{count} terminées",
      "task.renameTooltip":
        "Cliquez pour renommer la tâche. Un nom vide la supprime.",
      "task.editTooltip":
        "Renommez la tâche ou laissez le nom vide pour la supprimer",
      "task.markComplete": "Marquer la tâche comme terminée",
      "task.markIncomplete": "Marquer la tâche comme non terminée",
      "task.untitled": "Sans titre",
      "section.darkMode.title": "Mode sombre",
      "section.darkMode.hint": "Utiliser une palette de couleurs sombre.",
      "section.darkMode.toggle": "Activer/désactiver le mode sombre",
      "section.partyMode.title": "Mode fête 🎉",
      "section.partyMode.hint":
        "Lancer des confettis quand vous terminez une tâche.",
      "section.partyMode.toggle": "Activer/désactiver le mode fête",
      "section.backup.title": "Exporter/Importer",
      "section.backup.hint":
        "Sauvegardez vos tâches ou chargez-les depuis un fichier JSON.",
      "button.import": "Importer",
      "button.export": "Exporter",
      "title.importButton": "Importer des tâches depuis un fichier JSON",
      "title.exportButton": "Exporter toutes les tâches dans un fichier JSON",
      "aria.importInput": "Choisissez un fichier JSON de tâches à importer",
      "section.reset.title": "Réinitialiser",
      "section.reset.hint": "Supprimer définitivement toutes les tâches.",
      "button.reset": "Réinitialiser",
      "title.resetButton": "Supprimer toutes les tâches",
      "section.language.title": "Langue",
      "section.language.hint": "Choisissez la langue de l'interface.",
      "label.languageSelect": "Langue",
      "title.languageSelect": "Sélectionnez la langue de l'application",
      "option.language.en": "Anglais",
      "option.language.fr": "Français",
      "option.language.es": "Espagnol",
      "alert.importAdded_one":
        "{count} tâche importée et ajoutée. Ouverture de vos tâches.",
      "alert.importAdded_other":
        "{count} tâches importées et ajoutées. Ouverture de vos tâches.",
      "alert.importNone":
        "Aucune nouvelle tâche trouvée dans le fichier. Tâches existantes inchangées.",
      "alert.importError":
        "Impossible d'importer les tâches. Veuillez choisir un fichier JSON valide.",
      "alert.resetConfirm":
        "Cela supprimera toutes les tâches définitivement. Continuer ?",
    },
    es: {
      "title.tasks": "Tareas",
      "title.settings": "Configuración",
      "link.settings": "Configuración",
      "link.settingsTitle": "Abrir la configuración",
      "link.tasks": "Tareas",
      "link.tasksTitle": "Volver a las tareas",
      "label.taskName": "Nombre de la tarea",
      "placeholder.taskName":
        "Nueva tarea, pulsa «Enter» para añadir +",
      "title.taskNameInput":
        "Introduce el nombre de la tarea y pulsa «Enter» para crearla",
      "label.search": "Buscar tareas",
      "placeholder.search": "Buscar tareas...",
      "title.searchInput":
        "Busca tareas por nombre y pulsa «Enter» para filtrar",
      "aria.clearSearch": "Borrar búsqueda",
      "title.clearSearch": "Borrar búsqueda",
      "aria.taskList": "Tareas",
      "empty.default": "No hay tareas aún. Añade una para empezar.",
      "empty.filtered": "Ninguna tarea coincide con tu búsqueda.",
      "stats.completed_zero": "0 completadas",
      "stats.completed_one": "{count} completada",
      "stats.completed_other": "{count} completadas",
      "task.renameTooltip":
        "Haz clic para renombrar la tarea. Un nombre vacío la elimina.",
      "task.editTooltip":
        "Renombra la tarea o deja el nombre vacío para eliminarla",
      "task.markComplete": "Marcar tarea como completada",
      "task.markIncomplete": "Marcar tarea como incompleta",
      "task.untitled": "Sin título",
      "section.darkMode.title": "Modo oscuro",
      "section.darkMode.hint": "Usa una paleta de colores más oscura.",
      "section.darkMode.toggle": "Activar/desactivar modo oscuro",
      "section.partyMode.title": "Modo fiesta 🎉",
      "section.partyMode.hint":
        "Lanza confeti cuando completes una tarea.",
      "section.partyMode.toggle": "Activar/desactivar modo fiesta",
      "section.backup.title": "Exportar/Importar",
      "section.backup.hint":
        "Haz una copia de tus tareas o cárgalas desde un archivo JSON.",
      "button.import": "Importar",
      "button.export": "Exportar",
      "title.importButton": "Importar tareas desde un archivo JSON",
      "title.exportButton": "Exportar todas las tareas a un archivo JSON",
      "aria.importInput": "Elige un archivo JSON de tareas para importar",
      "section.reset.title": "Restablecer",
      "section.reset.hint": "Eliminar todas las tareas de forma permanente.",
      "button.reset": "Restablecer",
      "title.resetButton": "Eliminar todas las tareas",
      "section.language.title": "Idioma",
      "section.language.hint": "Elige el idioma de la interfaz.",
      "label.languageSelect": "Idioma",
      "title.languageSelect": "Selecciona el idioma de la aplicación",
      "option.language.en": "Inglés",
      "option.language.fr": "Francés",
      "option.language.es": "Español",
      "alert.importAdded_one":
        "{count} tarea importada y añadida. Abriendo tus tareas.",
      "alert.importAdded_other":
        "{count} tareas importadas y añadidas. Abriendo tus tareas.",
      "alert.importNone":
        "No se encontraron tareas nuevas en el archivo. Las tareas existentes no cambiaron.",
      "alert.importError":
        "No se pudieron importar las tareas. Elige un archivo JSON válido.",
      "alert.resetConfirm":
        "Esto eliminará todas las tareas de forma permanente. ¿Continuar?",
    },
  };

  const format = (template, vars = {}) =>
    template.replace(/\{(\w+)\}/g, (_, key) =>
      Object.prototype.hasOwnProperty.call(vars, key) ? vars[key] : `{${key}}`
    );

  const normalizeLanguage = (lang) =>
    typeof lang === "string" && translations[lang] ? lang : FALLBACK_LANGUAGE;

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (!stored) return {};
      const parsed = JSON.parse(stored);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const persistSettings = (nextSettings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
  };

  const getLanguage = () => {
    const stored = loadSettings().language;
    if (stored && translations[stored]) return stored;
    const browserLang = (navigator.language || navigator.userLanguage || "")
      .toLowerCase()
      .slice(0, 2);
    if (translations[browserLang]) return browserLang;
    return FALLBACK_LANGUAGE;
  };

  const setLanguage = (lang) => {
    const normalized = normalizeLanguage(lang);
    const settings = loadSettings();
    const nextSettings = { ...settings, language: normalized };
    persistSettings(nextSettings);
    return normalized;
  };

  const selectDict = (lang) => translations[normalizeLanguage(lang)];

  const t = (key, vars = {}, lang) => {
    const language = normalizeLanguage(lang || getLanguage());
    const dict = selectDict(language);
    const fallbackDict = selectDict(FALLBACK_LANGUAGE);
    const template = dict[key] ?? fallbackDict[key] ?? key;
    return format(template, vars);
  };

  const tChoice = (baseKey, count, lang) => {
    const language = normalizeLanguage(lang || getLanguage());
    const dict = selectDict(language);
    const fallbackDict = selectDict(FALLBACK_LANGUAGE);
    const suffix = count === 0 ? "zero" : count === 1 ? "one" : "other";
    const key = `${baseKey}_${suffix}`;
    const template =
      dict[key] ??
      fallbackDict[key] ??
      dict[baseKey] ??
      fallbackDict[baseKey] ??
      key;
    return format(template, { count });
  };

  const applyTranslations = (lang) => {
    const language = normalizeLanguage(lang || getLanguage());
    const dict = selectDict(language);
    const fallbackDict = selectDict(FALLBACK_LANGUAGE);
    const getValue = (key) => dict[key] ?? fallbackDict[key] ?? key;

    document.documentElement.lang = language;

    const applyTextContent = (selector, attrGetter = (el) => el.dataset.i18n) =>
      document.querySelectorAll(selector).forEach((el) => {
        const key = attrGetter(el);
        if (!key) return;
        const value = getValue(key);
        el.textContent = value;
      });

    applyTextContent("[data-i18n]");

    const applyAttribute = (selector, attribute, dataAttribute) =>
      document.querySelectorAll(selector).forEach((el) => {
        const key = el.getAttribute(dataAttribute);
        if (!key) return;
        const value = getValue(key);
        el.setAttribute(attribute, value);
      });

    applyAttribute("[data-i18n-placeholder]", "placeholder", "data-i18n-placeholder");
    applyAttribute("[data-i18n-title]", "title", "data-i18n-title");
    applyAttribute("[data-i18n-aria-label]", "aria-label", "data-i18n-aria-label");
    applyAttribute(
      "[data-i18n-aria-description]",
      "aria-description",
      "data-i18n-aria-description"
    );
  };

  window.i18n = {
    translations,
    t,
    tChoice,
    getLanguage,
    setLanguage,
    applyTranslations,
  };
})();

