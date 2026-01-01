/**
 * Link in Bio - Editor Application with Customization
 */

// Theme definitions
const THEMES = {
    midnight: {
        background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 100%)',
        textColor: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.7)'
    },
    ocean: {
        background: 'linear-gradient(180deg, #0077b6 0%, #00b4d8 100%)',
        textColor: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.85)'
    },
    sunset: {
        background: 'linear-gradient(180deg, #f72585 0%, #ffd166 100%)',
        textColor: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.9)'
    },
    forest: {
        background: 'linear-gradient(180deg, #2d6a4f 0%, #95d5b2 100%)',
        textColor: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.85)'
    },
    lavender: {
        background: 'linear-gradient(180deg, #7b2cbf 0%, #c77dff 100%)',
        textColor: '#ffffff',
        textSecondary: 'rgba(255, 255, 255, 0.85)'
    },
    minimal: {
        background: 'linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%)',
        textColor: '#1a1a1a',
        textSecondary: 'rgba(0, 0, 0, 0.6)'
    }
};

// State
let state = {
    theme: 'midnight',
    bgType: 'theme',
    bgColor: '#1a1a2e',
    bgImage: '',
    profileImage: '',
    textAlign: 'center',
    buttonStyle: 'rounded',
    buttonColor: '#8b5cf6',
    links: []
};

let linkCount = 0;

// DOM Elements
const form = document.getElementById('bioForm');
const linksContainer = document.getElementById('linksContainer');
const addLinkBtn = document.getElementById('addLinkBtn');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');
const successUrl = document.getElementById('successUrl');
const copyBtn = document.getElementById('copyBtn');
const visitBtn = document.getElementById('visitBtn');
const createAnotherBtn = document.getElementById('createAnotherBtn');

// Preview Elements
const previewContent = document.getElementById('previewContent');
const previewAvatar = document.getElementById('previewAvatar');
const previewName = document.getElementById('previewName');
const previewBio = document.getElementById('previewBio');
const previewLinks = document.getElementById('previewLinks');

/**
 * Initialize the application
 */
function init() {
    // Add initial link fields
    addLinkField();
    addLinkField();

    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Theme presets
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => selectTheme(btn.dataset.theme));
    });

    // Background type
    document.querySelectorAll('input[name="bgType"]').forEach(radio => {
        radio.addEventListener('change', () => {
            state.bgType = radio.value;
            updatePreview();
        });
    });

    // Background color
    document.getElementById('bgColor').addEventListener('input', (e) => {
        state.bgColor = e.target.value;
        if (state.bgType === 'solid') updatePreview();
    });

    // Background image
    document.getElementById('bgImage').addEventListener('input', (e) => {
        state.bgImage = e.target.value;
        if (state.bgType === 'image') updatePreview();
    });

    // Profile image
    document.getElementById('profileImage').addEventListener('input', (e) => {
        state.profileImage = e.target.value;
        updatePreview();
    });

    // Text alignment
    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.addEventListener('click', () => selectAlignment(btn.dataset.align));
    });

    // Button style
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.addEventListener('click', () => selectButtonStyle(btn.dataset.style));
    });

    // Button color
    const buttonColorInput = document.getElementById('buttonColor');
    const buttonColorValue = document.getElementById('buttonColorValue');
    buttonColorInput.addEventListener('input', (e) => {
        state.buttonColor = e.target.value;
        buttonColorValue.textContent = e.target.value;
        updatePreview();
    });

    // Event listeners
    addLinkBtn.addEventListener('click', addLinkField);
    form.addEventListener('submit', handleSubmit);
    copyBtn.addEventListener('click', handleCopy);
    createAnotherBtn.addEventListener('click', resetForm);

    // Live preview updates
    document.getElementById('displayName').addEventListener('input', updatePreview);
    document.getElementById('bio').addEventListener('input', updatePreview);
    document.getElementById('username').addEventListener('input', updatePreview);

    // Delegate link input events
    linksContainer.addEventListener('input', updatePreview);

    // Initial preview update
    updatePreview();
}

/**
 * Switch between tabs
 */
function switchTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
}

/**
 * Select a theme preset
 */
function selectTheme(themeName) {
    state.theme = themeName;
    state.bgType = 'theme';

    // Update radio
    document.querySelector('input[name="bgType"][value="theme"]').checked = true;

    // Update UI
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeName);
    });

    updatePreview();
}

/**
 * Select text alignment
 */
function selectAlignment(align) {
    state.textAlign = align;

    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.align === align);
    });

    updatePreview();
}

/**
 * Select button style
 */
function selectButtonStyle(style) {
    state.buttonStyle = style;

    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.style === style);
    });

    updatePreview();
}

/**
 * Add a new link input field
 */
function addLinkField() {
    linkCount++;
    const linkItem = document.createElement('div');
    linkItem.className = 'link-item';
    linkItem.dataset.id = linkCount;

    linkItem.innerHTML = `
        <input 
            type="text" 
            name="linkTitle${linkCount}" 
            placeholder="Link Title"
            class="link-title"
        >
        <input 
            type="url" 
            name="linkUrl${linkCount}" 
            placeholder="https://example.com"
            class="link-url"
        >
        <button type="button" class="remove-link-btn" aria-label="Remove link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    // Add remove button handler
    const removeBtn = linkItem.querySelector('.remove-link-btn');
    removeBtn.addEventListener('click', () => {
        linkItem.style.animation = 'slideOut 0.2s ease forwards';
        setTimeout(() => {
            linkItem.remove();
            updatePreview();
        }, 200);
    });

    linksContainer.appendChild(linkItem);
    updatePreview();

    // Focus on the new title input
    linkItem.querySelector('.link-title').focus();
}

/**
 * Get background style based on current state
 */
function getBackgroundStyle() {
    switch (state.bgType) {
        case 'solid':
            return state.bgColor;
        case 'image':
            return state.bgImage ? `url(${state.bgImage}) center/cover no-repeat` : THEMES[state.theme].background;
        case 'theme':
        default:
            return THEMES[state.theme].background;
    }
}

/**
 * Update the live preview
 */
function updatePreview() {
    const displayName = document.getElementById('displayName').value || 'Your Name';
    const bio = document.getElementById('bio').value || 'Your bio will appear here';
    const profileImage = document.getElementById('profileImage').value;

    // Update background
    const bgStyle = getBackgroundStyle();
    previewContent.style.background = bgStyle;

    // Update text colors based on theme
    const theme = THEMES[state.theme];
    if (state.bgType === 'theme' || (state.bgType === 'solid' && isColorDark(state.bgColor))) {
        previewName.style.color = '#ffffff';
        previewBio.style.color = 'rgba(255, 255, 255, 0.7)';
    } else if (state.bgType === 'solid') {
        previewName.style.color = '#1a1a1a';
        previewBio.style.color = 'rgba(0, 0, 0, 0.6)';
    }

    // Update avatar
    if (profileImage) {
        previewAvatar.innerHTML = `<img src="${escapeHtml(profileImage)}" alt="Profile" onerror="this.parentElement.innerHTML='${displayName.charAt(0) || '?'}'">`;
        previewAvatar.classList.add('has-image');
    } else {
        previewAvatar.textContent = displayName.charAt(0) || '?';
        previewAvatar.classList.remove('has-image');
    }

    // Update name and bio
    previewName.textContent = displayName;
    previewBio.textContent = bio;

    // Update alignment
    previewContent.classList.remove('align-left', 'align-center', 'align-right');
    if (state.textAlign !== 'center') {
        previewContent.classList.add(`align-${state.textAlign}`);
    }

    // Update links
    const linkItems = linksContainer.querySelectorAll('.link-item');
    const links = [];

    linkItems.forEach(item => {
        const title = item.querySelector('.link-title').value;
        const url = item.querySelector('.link-url').value;
        if (title || url) {
            links.push({ title: title || 'Untitled', url });
        }
    });

    if (links.length > 0) {
        previewLinks.innerHTML = links.map(link => {
            let styleClass = state.buttonStyle !== 'rounded' ? state.buttonStyle : '';
            let bgStyle = state.buttonStyle === 'outline'
                ? `border-color: ${state.buttonColor}; color: ${state.buttonColor}`
                : `background: ${state.buttonColor}`;
            return `<div class="preview-link ${styleClass}" style="${bgStyle}">${escapeHtml(link.title)}</div>`;
        }).join('');
    } else {
        previewLinks.innerHTML = '<div class="preview-link placeholder">Your links will appear here</div>';
    }
}

/**
 * Check if a color is dark
 */
function isColorDark(hexColor) {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
}

/**
 * Handle form submission
 */
async function handleSubmit(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim().toLowerCase();
    const displayName = document.getElementById('displayName').value.trim();
    const bio = document.getElementById('bio').value.trim();
    const profileImage = document.getElementById('profileImage').value.trim();

    // Collect links
    const linkItems = linksContainer.querySelectorAll('.link-item');
    const links = [];

    linkItems.forEach(item => {
        const title = item.querySelector('.link-title').value.trim();
        const url = item.querySelector('.link-url').value.trim();
        if (title && url) {
            links.push({ title, url });
        }
    });

    // Validation
    if (!username) {
        showError('Please enter a username');
        return;
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        showError('Username can only contain letters, numbers, underscores, and hyphens');
        return;
    }

    if (!displayName) {
        showError('Please enter a display name');
        return;
    }

    if (links.length === 0) {
        showError('Please add at least one link');
        return;
    }

    // Build style object
    const style = {
        theme: state.theme,
        bgType: state.bgType,
        bgColor: state.bgColor,
        bgImage: state.bgImage,
        textAlign: state.textAlign,
        buttonStyle: state.buttonStyle,
        buttonColor: state.buttonColor
    };

    // Show loading state
    setLoading(true);

    try {
        const response = await fetch('/api/bio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                displayName,
                bio,
                profileImage,
                style,
                links
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to create bio page');
        }

        // Show success
        showSuccess(data.url);

    } catch (error) {
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

/**
 * Show success message
 */
function showSuccess(url) {
    const fullUrl = window.location.origin + url;
    successUrl.value = fullUrl;
    visitBtn.href = url;

    form.style.display = 'none';
    successMessage.style.display = 'block';
}

/**
 * Handle copy to clipboard
 */
async function handleCopy() {
    try {
        await navigator.clipboard.writeText(successUrl.value);
        copyBtn.classList.add('copied');
        copyBtn.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
        `;

        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
            `;
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        successUrl.select();
        document.execCommand('copy');
    }
}

/**
 * Reset form for new entry
 */
function resetForm() {
    form.reset();
    linksContainer.innerHTML = '';
    linkCount = 0;

    // Reset state
    state = {
        theme: 'midnight',
        bgType: 'theme',
        bgColor: '#1a1a2e',
        bgImage: '',
        profileImage: '',
        textAlign: 'center',
        buttonStyle: 'rounded',
        buttonColor: '#8b5cf6',
        links: []
    };

    // Reset UI
    document.querySelectorAll('.theme-btn').forEach((btn, i) => {
        btn.classList.toggle('active', i === 0);
    });
    document.querySelectorAll('.align-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.align === 'center');
    });
    document.querySelectorAll('.style-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.style === 'rounded');
    });
    document.getElementById('buttonColor').value = '#8b5cf6';
    document.getElementById('buttonColorValue').textContent = '#8b5cf6';

    addLinkField();
    addLinkField();

    form.style.display = 'block';
    successMessage.style.display = 'none';
    switchTab('profile');

    updatePreview();
}

/**
 * Show error message
 */
function showError(message) {
    // Remove existing error
    const existingError = document.querySelector('.error-toast');
    if (existingError) existingError.remove();

    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(239, 68, 68, 0.9);
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 500;
        z-index: 1000;
        animation: slideUp 0.3s ease;
    `;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/**
 * Set loading state
 */
function setLoading(loading) {
    submitBtn.disabled = loading;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    if (loading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
    } else {
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
`;
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', init);
