/**
 * Simple Style Switcher
 *
 * Purpose:
 * A tiny utility to switch between visual themes on a page.
 *
 * How it works (in short):
 * - Keeps a list of available themes (default: 'light' and 'dark').
 * - Applies a CSS class like `theme-light` or `theme-dark` to the target element (defaults to <html>).
 * - Saves the user's choice in localStorage so it persists on reload.
 * - If there is a <select id="theme-select">, it fills it with options and syncs it automatically.
 * - Sets `data-theme-ready="1"` on <html> after applying the initial theme to help avoid FOUC.
 *
 * Quick start:
 * StyleSwitcher.initStyleSwitcher({ themes: ['light', 'dark', 'retro'] });
 *
 * CSS contract:
 * Your CSS should define classes like .theme-light, .theme-dark, etc., typically setting design tokens via CSS variables.
 */

/**
 * @typedef {Object} StyleSwitcherOptions
 * @property {Element}  [target=document.documentElement] - Element to receive the theme-* class (usually <html>).
 * @property {string}   [key='site-theme']                - localStorage key used to remember the theme.
 * @property {string[]} [themes=['light','dark']]         - Allowed theme names.
 * @property {string}   [defaultTheme='light']            - Theme to use when none is saved yet.
 */

/**
 * A function called whenever the theme changes.
 * @callback ThemeChangeCallback
 * @param {string} themeName - The new active theme.
 */

// Global style switcher object for simplicity
const StyleSwitcher = {
    /**
     * Default available themes.
     * @type {string[]}
     */
    themes: ['light', 'dark'],
    /**
     * Currently active theme name.
     * @type {string}
     */
    current: 'light',
    /**
     * Counter for theme changes.
     * @type {number}
     */
    _changeCount: 0,
    /**
     * localStorage key used to persist the theme.
     * @type {string}
     */
    key: 'site-theme',
    /**
     * Element to apply the theme class to.
     * @type {Element}
     */
    target: document.documentElement,
    /**
     * List of theme change callbacks.
     * @type {ThemeChangeCallback[]}
     */
    _callbacks: [],
    /**
     * Registered listeners that run on theme changes.
     * @type {ThemeChangeCallback[]}
     */
    callbacks: [],

    /**
     * Initialize the style switcher with options and apply the initial theme.
     * @param {StyleSwitcherOptions} [options] - Configuration.
     * @returns {typeof StyleSwitcher} This instance for chaining.
     */
    initStyleSwitcher(options = {}) {
        // Apply options with fallbacks
        this.target = options.target || document.documentElement;
        // Guard against invalid target
        if (!(this.target && this.target.classList)) {
            this.target = document.documentElement;
        }
        this.key = options.key || 'site-theme';
        this.themes = (Array.isArray(options.themes) && options.themes.length)
            ? options.themes
            : ['light', 'dark'];
        this.current = options.defaultTheme || 'light';

        // Load stored theme if valid
        try {
            const saved = localStorage.getItem(this.key);
            if (saved && this.themes.includes(saved)) {
                this.current = saved;
            }
        } catch (_) {
            /* ignore storage errors */
        }

        // Apply theme and build dropdown
        this.applyThemeClass(this.current);
        this.populateDropdown();

        // Prevent FOUC (Flash of Unstyled Content) once the theme is applied
        document.documentElement.setAttribute('data-theme-ready', '1');

        return this;
    },

    /**
     * Populate or update the <select id="theme-select"> with available themes.
     * If the element does not exist, nothing happens.
     */
    populateDropdown() {
        const select = document.getElementById('theme-select');
        if (!select) {
            // No dropdown present
            return;
        }

        const capitalize = function (s) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        };

        // Build options
        select.innerHTML = this.themes
            .map((t) => `<option value="${t}">${capitalize(t)}</option>`)
            .join('');

        // Set the current value and hook change event
        select.value = this.current;
        select.onchange = (e) => this.setTheme(e.target.value);
    },

    /**
     * Apply the given theme by setting a class like `theme-<name>` on the target element.
     * It first removes all known theme classes, then adds the selected one.
     * @param {string} theme - The theme to apply.
     */
    applyThemeClass(theme) {
        // Remove all known theme classes
        this.themes.forEach((t) => {
            this.target.classList.remove(`theme-${t}`);
        });
        // Add the new theme class
        this.target.classList.add(`theme-${theme}`);
    },

    /**
     * Change the current theme. Updates classes, persists to localStorage,
     * syncs the dropdown, and notifies listeners.
     * @param {string} themeName - The theme to set. Must be in `themes`.
     * @returns {boolean} True if the theme was applied, false if unknown.
     */
    setTheme(themeName) {
        if (!this.themes.includes(themeName)) {
            console.warn(`Ukendt tema: ${themeName}`);
            return false;
        }

        // Only count actual theme changes, not initial load
        if (this.current !== themeName) {
            if (!this._changeCount) this._changeCount = 0;
            this._changeCount++;

            // Update the alert box if it exists
            const alert = document.getElementById('themeAlert');
            const alertMessage = document.getElementById('themeAlertMessage');
            if (alert && alertMessage) {
                alertMessage.textContent = `Temaet er blevet skiftet ${this._changeCount} gange`;
                alert.style.display = 'block';
                alert.style.opacity = '1';
                // Removed auto-hide functionality
            }
        }

        this.current = themeName;
        this.applyThemeClass(themeName);

        // Persist selection
        try {
            localStorage.setItem(this.key, themeName);
        } catch (_) {
            /* ignore */
        }

        // Update dropdown if it exists
        const select = document.getElementById('theme-select');
        if (select) {
            select.value = themeName;
        }

        // Notify listeners
        this._callbacks.forEach((cb) => cb(themeName));

        return true;
    },

    /**
     * Get the name of the current theme.
     * @returns {string} Current theme name.
     */
    getTheme() {
        return this.current;
    },

    /**
     * Register a callback to be called whenever the theme changes.
     * @param {ThemeChangeCallback} callback - Function invoked with the new theme.
     */
    onChange(callback) {
        if (typeof callback === 'function') {
            this.callbacks.push(callback);
        }
    },
};

// Expose globally (explicit for clarity)
window.StyleSwitcher = StyleSwitcher;
