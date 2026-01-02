/**
 * LinkBio Editor - Canva-Style Drag & Drop
 */

// Social platform icons
const SOCIAL_ICONS = {
    instagram: '📷', twitter: '𝕏', tiktok: '🎵', youtube: '▶️',
    linkedin: '💼', github: '🐙', discord: '💬', spotify: '🎧',
    twitch: '🎮', facebook: '📘', pinterest: '📌', email: '✉️'
};

// Template definitions
const TEMPLATES = {
    classic: {
        bg: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f18 100%)',
        elements: [
            { id: 'e1', type: 'image', x: 50, y: 8, w: 25, h: 15, props: { src: '', shape: 'circle' } },
            { id: 'e2', type: 'text', x: 50, y: 26, w: 80, h: 6, props: { content: 'Your Name', fontSize: 24, bold: true, align: 'center', color: '#ffffff' } },
            { id: 'e3', type: 'text', x: 50, y: 33, w: 70, h: 5, props: { content: 'Your bio goes here', fontSize: 14, bold: false, align: 'center', color: 'rgba(255,255,255,0.7)' } },
            { id: 'e4', type: 'button', x: 50, y: 45, w: 80, h: 7, props: { label: 'My Website', url: '', color: '#8b5cf6', radius: 8 } },
            { id: 'e5', type: 'button', x: 50, y: 54, w: 80, h: 7, props: { label: 'Portfolio', url: '', color: '#8b5cf6', radius: 8 } },
            { id: 'e6', type: 'button', x: 50, y: 63, w: 80, h: 7, props: { label: 'Contact Me', url: '', color: '#8b5cf6', radius: 8 } }
        ]
    },
    minimal: {
        bg: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
        elements: [
            { id: 'e1', type: 'image', x: 15, y: 10, w: 18, h: 12, props: { src: '', shape: 'circle' } },
            { id: 'e2', type: 'text', x: 10, y: 26, w: 80, h: 5, props: { content: 'Your Name', fontSize: 22, bold: true, align: 'left', color: '#1a1a1a' } },
            { id: 'e3', type: 'text', x: 10, y: 32, w: 80, h: 4, props: { content: 'Designer & Creator', fontSize: 13, bold: false, align: 'left', color: 'rgba(0,0,0,0.5)' } },
            { id: 'e4', type: 'divider', x: 50, y: 40, w: 80, h: 0.5, props: { color: 'rgba(0,0,0,0.1)' } },
            { id: 'e5', type: 'button', x: 50, y: 48, w: 80, h: 6, props: { label: 'Portfolio', url: '', color: '#1a1a1a', radius: 4 } },
            { id: 'e6', type: 'button', x: 50, y: 57, w: 80, h: 6, props: { label: 'Contact', url: '', color: '#1a1a1a', radius: 4 } }
        ]
    },
    bold: {
        bg: 'linear-gradient(180deg, #f72585 0%, #7209b7 100%)',
        elements: [
            { id: 'e1', type: 'image', x: 50, y: 6, w: 30, h: 18, props: { src: '', shape: 'circle' } },
            { id: 'e2', type: 'text', x: 50, y: 27, w: 90, h: 7, props: { content: 'YOUR NAME', fontSize: 28, bold: true, align: 'center', color: '#ffffff' } },
            { id: 'e3', type: 'button', x: 50, y: 40, w: 85, h: 9, props: { label: '🔥 Check This Out', url: '', color: '#ffffff', textColor: '#7209b7', radius: 50 } },
            { id: 'e4', type: 'button', x: 50, y: 52, w: 85, h: 9, props: { label: '✨ My Work', url: '', color: 'rgba(255,255,255,0.2)', radius: 50 } },
            { id: 'e5', type: 'button', x: 50, y: 64, w: 85, h: 9, props: { label: '💫 Follow Me', url: '', color: 'rgba(255,255,255,0.2)', radius: 50 } }
        ]
    },
    social: {
        bg: 'linear-gradient(180deg, #0077b6 0%, #00b4d8 100%)',
        elements: [
            { id: 'e1', type: 'image', x: 50, y: 10, w: 22, h: 14, props: { src: '', shape: 'circle' } },
            { id: 'e2', type: 'text', x: 50, y: 27, w: 80, h: 5, props: { content: 'Your Name', fontSize: 20, bold: true, align: 'center', color: '#ffffff' } },
            { id: 'e3', type: 'social', x: 25, y: 40, w: 12, h: 8, props: { platform: 'instagram', url: '' } },
            { id: 'e4', type: 'social', x: 42, y: 40, w: 12, h: 8, props: { platform: 'twitter', url: '' } },
            { id: 'e5', type: 'social', x: 58, y: 40, w: 12, h: 8, props: { platform: 'tiktok', url: '' } },
            { id: 'e6', type: 'social', x: 75, y: 40, w: 12, h: 8, props: { platform: 'youtube', url: '' } },
            { id: 'e7', type: 'button', x: 50, y: 55, w: 75, h: 7, props: { label: 'My Website', url: '', color: 'rgba(255,255,255,0.2)', radius: 8 } }
        ]
    }
};

// State
let state = {
    elements: [],
    selectedId: null,
    bg: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f18 100%)',
    editToken: null,
    username: null,
    history: [],
    historyIndex: -1
};

let elementIdCounter = 0;
let isDragging = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
let resizeHandle = null;
let startPos = { x: 0, y: 0 };
let startSize = { w: 0, h: 0 };
let clipboard = null; // For copy/paste

// DOM Elements
const canvas = document.getElementById('canvas');
const propertiesPanel = document.getElementById('propertiesPanel');
const propertiesContent = document.getElementById('propertiesContent');
const publishModal = document.getElementById('publishModal');

/**
 * Initialize editor
 */
function init() {
    // Check for edit mode
    const params = new URLSearchParams(window.location.search);
    const editToken = params.get('edit');
    if (editToken) {
        loadExistingPage(editToken);
    } else {
        loadTemplate('classic');
    }

    // Template buttons
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => loadTemplate(card.dataset.template));
    });

    // Add element buttons
    document.querySelectorAll('.element-btn').forEach(btn => {
        btn.addEventListener('click', () => addElement(btn.dataset.type));
    });

    // Background controls
    document.getElementById('bgColor').addEventListener('input', (e) => {
        state.bg = e.target.value;
        canvas.style.background = state.bg;
        saveState();
    });

    document.getElementById('bgImage').addEventListener('input', (e) => {
        if (e.target.value) {
            state.bg = `url(${e.target.value}) center/cover no-repeat`;
        }
        canvas.style.background = state.bg;
        saveState();
    });

    // Toolbar
    document.getElementById('deleteBtn').addEventListener('click', deleteSelected);
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('redoBtn').addEventListener('click', redo);
    document.getElementById('publishBtn').addEventListener('click', openPublishModal);
    document.getElementById('closePublishModal').addEventListener('click', closePublishModal);
    document.getElementById('submitPublish').addEventListener('click', publish);

    // Copy buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => copyToClipboard(btn.dataset.copy, btn));
    });

    // Mobile toggle
    document.getElementById('mobileToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });

    document.getElementById('closePanelBtn').addEventListener('click', () => {
        propertiesPanel.classList.remove('open');
    });

    // Canvas click to deselect
    canvas.addEventListener('click', (e) => {
        if (e.target === canvas) selectElement(null);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        const isInput = document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA';

        if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedId && !isInput) {
            e.preventDefault();
            deleteSelected();
        }
        if ((e.ctrlKey || e.metaKey) && !isInput) {
            if (e.key === 'z') { e.preventDefault(); undo(); }
            if (e.key === 'y') { e.preventDefault(); redo(); }
            if (e.key === 'c') { e.preventDefault(); copyElement(); }
            if (e.key === 'v') { e.preventDefault(); pasteElement(); }
            if (e.key === 'd') { e.preventDefault(); duplicateElement(); }
        }
    });
}

/**
 * Load a template
 */
function loadTemplate(name) {
    const template = TEMPLATES[name];
    if (!template) return;

    state.bg = template.bg;
    state.elements = JSON.parse(JSON.stringify(template.elements));
    elementIdCounter = state.elements.length + 1;

    canvas.style.background = state.bg;
    renderElements();
    selectElement(null);
    saveState();
}

/**
 * Load existing page for editing
 */
async function loadExistingPage(token) {
    try {
        const res = await fetch(`/api/bio?token=${token}`);
        if (!res.ok) throw new Error('Page not found');
        const data = await res.json();

        state.elements = data.elements || [];
        state.bg = data.bg || TEMPLATES.classic.bg;
        state.editToken = token;
        state.username = data.username;

        elementIdCounter = state.elements.length + 1;
        canvas.style.background = state.bg;
        renderElements();
        saveState();
    } catch (err) {
        console.error('Failed to load page:', err);
        loadTemplate('classic');
    }
}

/**
 * Add a new element
 */
function addElement(type) {
    const id = `e${++elementIdCounter}`;
    const defaults = {
        image: { x: 50, y: 20, w: 25, h: 15, props: { src: '', shape: 'circle' } },
        text: { x: 50, y: 50, w: 60, h: 6, props: { content: 'New Text', fontSize: 16, bold: false, align: 'center', color: '#ffffff' } },
        button: { x: 50, y: 50, w: 70, h: 7, props: { label: 'New Button', url: '', color: '#8b5cf6', radius: 8 } },
        social: { x: 50, y: 50, w: 12, h: 8, props: { platform: 'instagram', url: '' } },
        divider: { x: 50, y: 50, w: 80, h: 0.5, props: { color: 'rgba(255,255,255,0.2)' } }
    };

    const el = { id, type, ...defaults[type] };
    state.elements.push(el);
    renderElements();
    selectElement(id);
    saveState();
}

/**
 * Render all elements
 */
function renderElements() {
    canvas.innerHTML = '';
    state.elements.forEach(el => {
        const dom = createElementDOM(el);
        canvas.appendChild(dom);
    });
}

/**
 * Create DOM for an element
 */
function createElementDOM(el) {
    const div = document.createElement('div');
    div.className = `canvas-element element-${el.type}`;
    div.dataset.id = el.id;

    // Position (centered by x,y being center point)
    div.style.left = `calc(${el.x}% - ${el.w / 2}%)`;
    div.style.top = `${el.y}%`;
    div.style.width = `${el.w}%`;
    div.style.height = el.type === 'divider' ? `${el.h}%` : 'auto';

    // Type-specific content
    switch (el.type) {
        case 'image':
            if (el.props.src) {
                div.innerHTML = `<img src="${escapeHtml(el.props.src)}" alt="Profile">`;
            } else {
                div.innerHTML = '<span class="placeholder">📷</span>';
            }
            div.style.width = `${el.w}%`;
            div.style.aspectRatio = '1';
            if (el.props.shape === 'circle') div.style.borderRadius = '50%';
            break;

        case 'text':
            div.innerHTML = escapeHtml(el.props.content);
            div.style.fontSize = `${el.props.fontSize}px`;
            div.style.fontWeight = el.props.bold ? '700' : '400';
            div.style.textAlign = el.props.align;
            div.style.color = el.props.color;
            break;

        case 'button':
            div.innerHTML = escapeHtml(el.props.label);
            div.style.background = el.props.color;
            div.style.borderRadius = `${el.props.radius}px`;
            if (el.props.textColor) div.style.color = el.props.textColor;
            break;

        case 'social':
            div.innerHTML = SOCIAL_ICONS[el.props.platform] || '🔗';
            break;

        case 'divider':
            div.style.background = el.props.color;
            div.style.height = '2px';
            break;
    }

    // Resize handles
    ['nw', 'ne', 'sw', 'se'].forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${pos}`;
        handle.dataset.handle = pos;
        div.appendChild(handle);
    });

    // Event listeners
    div.addEventListener('pointerdown', onPointerDown);
    div.addEventListener('click', (e) => {
        e.stopPropagation();
        selectElement(el.id);
    });

    if (el.id === state.selectedId) div.classList.add('selected');

    return div;
}

/**
 * Pointer down handler
 */
function onPointerDown(e) {
    e.preventDefault();
    const target = e.target;
    const element = target.closest('.canvas-element');
    if (!element) return;

    const id = element.dataset.id;
    const el = state.elements.find(x => x.id === id);
    if (!el) return;

    selectElement(id);

    const rect = canvas.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();

    // Check if resize handle
    if (target.classList.contains('resize-handle')) {
        isResizing = true;
        resizeHandle = target.dataset.handle;
        startPos = { x: e.clientX, y: e.clientY };
        startSize = { w: el.w, h: el.h, x: el.x, y: el.y };
    } else {
        isDragging = true;
        dragOffset = {
            x: e.clientX - elRect.left - elRect.width / 2,
            y: e.clientY - elRect.top
        };
    }

    element.classList.add('dragging');
    element.setPointerCapture(e.pointerId);

    element.addEventListener('pointermove', onPointerMove);
    element.addEventListener('pointerup', onPointerUp);
}

/**
 * Pointer move handler
 */
function onPointerMove(e) {
    const element = e.target.closest('.canvas-element');
    if (!element) return;

    const id = element.dataset.id;
    const el = state.elements.find(x => x.id === id);
    if (!el) return;

    const rect = canvas.getBoundingClientRect();

    if (isDragging) {
        const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
        const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

        el.x = Math.max(5, Math.min(95, x));
        el.y = Math.max(0, Math.min(95, y));

        element.style.left = `calc(${el.x}% - ${el.w / 2}%)`;
        element.style.top = `${el.y}%`;
    }

    if (isResizing) {
        const dx = ((e.clientX - startPos.x) / rect.width) * 100;
        const dy = ((e.clientY - startPos.y) / rect.height) * 100;

        if (resizeHandle.includes('e')) el.w = Math.max(10, startSize.w + dx * 2);
        if (resizeHandle.includes('w')) el.w = Math.max(10, startSize.w - dx * 2);
        if (resizeHandle.includes('s')) el.h = Math.max(5, startSize.h + dy);
        if (resizeHandle.includes('n')) {
            el.h = Math.max(5, startSize.h - dy);
            el.y = startSize.y + dy;
        }

        element.style.width = `${el.w}%`;
        element.style.left = `calc(${el.x}% - ${el.w / 2}%)`;
    }
}

/**
 * Pointer up handler  
 */
function onPointerUp(e) {
    const element = e.target.closest('.canvas-element');
    if (element) {
        element.classList.remove('dragging');
        element.releasePointerCapture(e.pointerId);
        element.removeEventListener('pointermove', onPointerMove);
        element.removeEventListener('pointerup', onPointerUp);
    }

    if (isDragging || isResizing) {
        saveState();
    }

    isDragging = false;
    isResizing = false;
    resizeHandle = null;
}

/**
 * Select an element
 */
function selectElement(id) {
    state.selectedId = id;

    document.querySelectorAll('.canvas-element').forEach(el => {
        el.classList.toggle('selected', el.dataset.id === id);
    });

    document.getElementById('deleteBtn').disabled = !id;

    if (id) {
        propertiesPanel.classList.add('open');
        renderProperties();
    } else {
        propertiesContent.innerHTML = '<p class="no-selection">Select an element to edit</p>';
    }
}

/**
 * Render properties panel
 */
function renderProperties() {
    const el = state.elements.find(x => x.id === state.selectedId);
    if (!el) return;

    let html = '';

    switch (el.type) {
        case 'image':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Image URL</label>
                    <input type="url" class="prop-input" data-prop="src" value="${escapeHtml(el.props.src || '')}" placeholder="https://...">
                </div>
                <div class="prop-group">
                    <label class="prop-label">Shape</label>
                    <select class="prop-input" data-prop="shape">
                        <option value="circle" ${el.props.shape === 'circle' ? 'selected' : ''}>Circle</option>
                        <option value="square" ${el.props.shape === 'square' ? 'selected' : ''}>Square</option>
                    </select>
                </div>
            `;
            break;

        case 'text':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Text</label>
                    <input type="text" class="prop-input" data-prop="content" value="${escapeHtml(el.props.content)}">
                </div>
                <div class="prop-group">
                    <label class="prop-label">Font Size</label>
                    <input type="number" class="prop-input" data-prop="fontSize" value="${el.props.fontSize}" min="10" max="48">
                </div>
                <div class="prop-group">
                    <label class="prop-label">Align</label>
                    <select class="prop-input" data-prop="align">
                        <option value="left" ${el.props.align === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${el.props.align === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${el.props.align === 'right' ? 'selected' : ''}>Right</option>
                    </select>
                </div>
                <div class="prop-group">
                    <div class="prop-row">
                        <div>
                            <label class="prop-label">Color</label>
                            <input type="color" class="prop-color" data-prop="color" value="${el.props.color.startsWith('#') ? el.props.color : '#ffffff'}">
                        </div>
                        <div>
                            <label class="prop-label">Bold</label>
                            <input type="checkbox" data-prop="bold" ${el.props.bold ? 'checked' : ''}>
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'button':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Label</label>
                    <input type="text" class="prop-input" data-prop="label" value="${escapeHtml(el.props.label)}">
                </div>
                <div class="prop-group">
                    <label class="prop-label">URL</label>
                    <input type="url" class="prop-input" data-prop="url" value="${escapeHtml(el.props.url || '')}" placeholder="https://...">
                </div>
                <div class="prop-group">
                    <div class="prop-row">
                        <div>
                            <label class="prop-label">Color</label>
                            <input type="color" class="prop-color" data-prop="color" value="${el.props.color.startsWith('#') ? el.props.color : '#8b5cf6'}">
                        </div>
                        <div>
                            <label class="prop-label">Radius</label>
                            <input type="number" class="prop-input" data-prop="radius" value="${el.props.radius}" min="0" max="50" style="width:60px">
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'social':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Platform</label>
                    <div class="social-grid">
                        ${Object.entries(SOCIAL_ICONS).map(([key, icon]) => `
                            <button class="social-option ${el.props.platform === key ? 'selected' : ''}" data-platform="${key}">${icon}</button>
                        `).join('')}
                    </div>
                </div>
                <div class="prop-group">
                    <label class="prop-label">URL</label>
                    <input type="url" class="prop-input" data-prop="url" value="${escapeHtml(el.props.url || '')}" placeholder="https://...">
                </div>
            `;
            break;

        case 'divider':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Color</label>
                    <input type="color" class="prop-color" data-prop="color" value="${el.props.color.startsWith('#') ? el.props.color : '#ffffff'}">
                </div>
            `;
            break;
    }

    propertiesContent.innerHTML = html;

    // Bind property inputs
    propertiesContent.querySelectorAll('[data-prop]').forEach(input => {
        input.addEventListener('input', () => updateProperty(input));
        input.addEventListener('change', () => updateProperty(input));
    });

    // Social platform picker
    propertiesContent.querySelectorAll('.social-option').forEach(btn => {
        btn.addEventListener('click', () => {
            el.props.platform = btn.dataset.platform;
            renderElements();
            renderProperties();
            saveState();
        });
    });
}

/**
 * Update element property
 */
function updateProperty(input) {
    const el = state.elements.find(x => x.id === state.selectedId);
    if (!el) return;

    const prop = input.dataset.prop;
    let value = input.type === 'checkbox' ? input.checked : input.value;
    if (input.type === 'number') value = parseInt(value) || 0;

    el.props[prop] = value;
    renderElements();
    saveState();
}

/**
 * Delete selected element
 */
function deleteSelected() {
    if (!state.selectedId) return;
    state.elements = state.elements.filter(x => x.id !== state.selectedId);
    selectElement(null);
    renderElements();
    saveState();
}

/**
 * Copy selected element to clipboard
 */
function copyElement() {
    if (!state.selectedId) return;
    const el = state.elements.find(x => x.id === state.selectedId);
    if (el) {
        clipboard = JSON.parse(JSON.stringify(el));
    }
}

/**
 * Paste element from clipboard
 */
function pasteElement() {
    if (!clipboard) return;
    const newEl = JSON.parse(JSON.stringify(clipboard));
    newEl.id = `e${++elementIdCounter}`;
    newEl.x = Math.min(90, newEl.x + 5);
    newEl.y = Math.min(90, newEl.y + 5);
    state.elements.push(newEl);
    renderElements();
    selectElement(newEl.id);
    saveState();
}

/**
 * Duplicate selected element
 */
function duplicateElement() {
    copyElement();
    pasteElement();
}

/**
 * Save state for undo/redo
 */
function saveState() {
    const snapshot = JSON.stringify({ elements: state.elements, bg: state.bg });

    // Remove future states if we're in middle of history
    if (state.historyIndex < state.history.length - 1) {
        state.history = state.history.slice(0, state.historyIndex + 1);
    }

    state.history.push(snapshot);
    state.historyIndex = state.history.length - 1;

    // Limit history (reduced for resource optimization)
    if (state.history.length > 20) {
        state.history.shift();
        state.historyIndex--;
    }

    updateUndoRedoButtons();
}

/**
 * Undo
 */
function undo() {
    if (state.historyIndex > 0) {
        state.historyIndex--;
        loadState();
    }
}

/**
 * Redo
 */
function redo() {
    if (state.historyIndex < state.history.length - 1) {
        state.historyIndex++;
        loadState();
    }
}

/**
 * Load state from history
 */
function loadState() {
    const snapshot = JSON.parse(state.history[state.historyIndex]);
    state.elements = snapshot.elements;
    state.bg = snapshot.bg;
    canvas.style.background = state.bg;
    renderElements();
    updateUndoRedoButtons();
}

/**
 * Update undo/redo buttons
 */
function updateUndoRedoButtons() {
    document.getElementById('undoBtn').disabled = state.historyIndex <= 0;
    document.getElementById('redoBtn').disabled = state.historyIndex >= state.history.length - 1;
}

/**
 * Open publish modal (with edit mode handling)
 */
function openPublishModal() {
    const modal = document.getElementById('publishModal');
    const usernameInput = document.getElementById('username');
    const modalBody = document.querySelector('.modal-body');
    const successDiv = document.getElementById('publishSuccess');
    const submitBtn = document.getElementById('submitPublish');

    // Reset modal state
    modalBody.style.display = 'block';
    successDiv.style.display = 'none';

    // Pre-fill username if in edit mode
    if (state.username) {
        usernameInput.value = state.username;
        usernameInput.disabled = true; // Can't change username when editing
        submitBtn.querySelector('.btn-text').textContent = 'Update Page';
    } else {
        usernameInput.value = '';
        usernameInput.disabled = false;
        submitBtn.querySelector('.btn-text').textContent = 'Publish Page';
    }

    modal.classList.add('open');
}

/**
 * Close publish modal
 */
function closePublishModal() {
    document.getElementById('publishModal').classList.remove('open');
}

/**
 * Publish page
 */
async function publish() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim().toLowerCase();

    if (!username || !/^[a-zA-Z0-9_-]+$/.test(username)) {
        alert('Please enter a valid username');
        return;
    }

    // Check 3-site limit (only for new pages, not edits)
    if (!state.editToken) {
        const mySites = JSON.parse(localStorage.getItem('linkbio_sites') || '[]');
        if (mySites.length >= 3) {
            alert('You have reached the maximum of 3 bio pages. Edit an existing page or delete one first.');
            return;
        }
    }

    const submitBtn = document.getElementById('submitPublish');
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loader').style.display = 'inline';
    submitBtn.disabled = true;

    try {
        const body = {
            username,
            elements: state.elements,
            bg: state.bg
        };

        if (state.editToken) {
            body.editToken = state.editToken;
        }

        const res = await fetch('/api/bio', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Failed to publish');

        // Show success
        const origin = window.location.origin;
        document.getElementById('pageUrl').value = `${origin}/@${username}`;
        document.getElementById('editUrl').value = `${origin}/bio.html?edit=${data.editToken}`;
        document.getElementById('visitPageBtn').href = `/@${username}`;

        document.querySelector('.modal-body').style.display = 'none';
        document.getElementById('publishSuccess').style.display = 'block';

        // Save to localStorage for 3-site limit (only new pages)
        if (!state.editToken) {
            const mySites = JSON.parse(localStorage.getItem('linkbio_sites') || '[]');
            if (!mySites.includes(data.editToken)) {
                mySites.push(data.editToken);
                localStorage.setItem('linkbio_sites', JSON.stringify(mySites));
            }
        }

        state.editToken = data.editToken;
        state.username = username;

    } catch (err) {
        alert(err.message);
    } finally {
        submitBtn.querySelector('.btn-text').style.display = 'inline';
        submitBtn.querySelector('.btn-loader').style.display = 'none';
        submitBtn.disabled = false;
    }
}

/**
 * Copy to clipboard
 */
async function copyToClipboard(inputId, btn) {
    const input = document.getElementById(inputId);
    try {
        await navigator.clipboard.writeText(input.value);
        btn.classList.add('copied');
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.textContent = 'Copy';
        }, 2000);
    } catch (err) {
        input.select();
        document.execCommand('copy');
    }
}

/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize
document.addEventListener('DOMContentLoaded', init);
