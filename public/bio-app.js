/**
 * LinkBio Editor - Canva-Style Drag & Drop
 */

// Real SVG icon paths for social platforms
const SOCIAL_ICONS = {
    instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>',
    twitter: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    discord: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>',
    spotify: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>',
    twitch: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
    pinterest: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>',
    website: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>',
    snapchat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.166 3c.796 0 3.495.223 4.77 3.073.426.959.324 2.59.24 3.898l-.002.048c-.01.145-.018.278-.024.41.06.036.163.072.322.072.241-.013.53-.096.83-.242.133-.071.277-.084.374-.084.108 0 .217.015.313.044.265.08.506.298.506.722 0 .252-.074.481-.18.682-.157.297-.35.47-.543.597-.204.135-.385.205-.463.253l-.002.002-.001.002a.236.236 0 00-.031.033l-.015.019c-.035.05-.061.078-.078.095-.035.198-.132.442-.262.65-.123.192-.278.385-.464.556l-.035.041c-.117.171-.22.332-.217.4.002.087.14.332.734.612.336.158.914.318 1.533.543.209.076.383.212.451.44.06.198.045.45-.015.732l-.006.019c-.032.121-.071.215-.106.313-.115.371-.38.614-.771.723-.277.077-.647.117-1.154.117-.158 0-.318-.005-.477-.013-.237-.012-.507-.035-.768-.035-.326 0-.558.038-.776.114-.145.051-.246.136-.327.218a1.93 1.93 0 00-.284.386l-.209.355c-.106.18-.24.407-.405.62-.518.667-1.208 1.05-1.912 1.296-.524.183-1.07.284-1.582.318a7.212 7.212 0 01-.483.016c-.12 0-.24-.003-.359-.01a5.73 5.73 0 01-1.583-.318c-.703-.247-1.393-.629-1.91-1.296a4.384 4.384 0 01-.406-.62l-.209-.355a1.93 1.93 0 00-.284-.386 1.075 1.075 0 00-.327-.218c-.218-.076-.45-.114-.776-.114-.261 0-.531.023-.768.035a9.756 9.756 0 01-.477.013c-.507 0-.877-.04-1.154-.117-.39-.109-.656-.352-.77-.723a3.154 3.154 0 01-.107-.313l-.006-.02c-.06-.28-.075-.533-.015-.73.068-.229.242-.365.45-.44.62-.226 1.198-.386 1.534-.544.594-.28.732-.525.734-.612.003-.068-.1-.229-.217-.4l-.035-.041a2.648 2.648 0 01-.464-.556 2.028 2.028 0 01-.262-.65c-.017-.017-.043-.045-.078-.095l-.015-.02a.236.236 0 00-.031-.032l-.001-.002-.002-.002c-.078-.048-.259-.118-.463-.253a1.478 1.478 0 01-.543-.597 1.163 1.163 0 01-.18-.682c0-.424.241-.642.506-.722a.924.924 0 01.313-.044c.097 0 .241.013.374.084.3.146.589.23.83.242.16 0 .262-.036.322-.072a9.32 9.32 0 00-.024-.41l-.003-.048c-.083-1.308-.185-2.94.241-3.898C8.671 3.223 11.37 3 12.166 3z"/></svg>'
};

// Template effects for buttons and elements
const EFFECTS = {
    none: { name: 'None', css: '' },
    rainbow: {
        name: 'Rainbow',
        css: 'background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000) !important; background-size: 400% 100%; animation: rainbow 3s linear infinite;'
    },
    glow: {
        name: 'Glow Pulse',
        css: 'animation: glowPulse 2s ease-in-out infinite;'
    },
    shake: {
        name: 'Shake',
        css: 'animation: shake 0.5s ease-in-out infinite;'
    },
    bounce: {
        name: 'Bounce',
        css: 'animation: bounce 1s ease-in-out infinite;'
    },
    gradient: {
        name: 'Gradient Flow',
        css: 'background: linear-gradient(45deg, #667eea, #764ba2, #f093fb, #667eea) !important; background-size: 300% 300%; animation: gradientFlow 4s ease infinite;'
    },
    neon: {
        name: 'Neon Border',
        css: 'animation: neonBorder 1.5s ease-in-out infinite alternate; box-shadow: 0 0 10px currentColor;'
    },
    slideUp: {
        name: 'Slide Up',
        css: 'animation: slideUp 0.6s ease-out;'
    },
    scalePop: {
        name: 'Scale Pop',
        css: 'animation: scalePop 0.3s ease-out;'
    },
    shimmer: {
        name: 'Shimmer',
        class: 'effect-shimmer'
    },
    glass: {
        name: 'Glassmorphism',
        css: 'background: rgba(255,255,255,0.1) !important; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2) !important;'
    },
    ripple: {
        name: 'Ripple',
        class: 'effect-ripple'
    },
    colorFade: {
        name: 'Color Fade',
        css: 'animation: colorFade 3s ease-in-out infinite;'
    }
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
        button: { x: 50, y: 50, w: 70, h: 7, props: { label: 'New Button', url: '', color: '#8b5cf6', radius: 8, effect: 'none' } },
        social: { x: 50, y: 50, w: 12, h: 8, props: { platform: 'instagram', url: '' } },
        divider: { x: 50, y: 50, w: 80, h: 0.5, props: { color: 'rgba(255,255,255,0.2)' } },
        heading: { x: 50, y: 30, w: 80, h: 8, props: { content: 'Heading', fontSize: 32, bold: true, align: 'center', color: '#ffffff' } },
        spacer: { x: 50, y: 50, w: 80, h: 3, props: { height: 20 } },
        container: { x: 50, y: 50, w: 85, h: 20, props: { bgColor: 'rgba(255,255,255,0.05)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.1)', padding: 16 } },
        embed: { x: 50, y: 50, w: 80, h: 25, props: { embedType: 'youtube', embedId: '', autoplay: false } },
        iconButton: { x: 50, y: 50, w: 14, h: 9, props: { platform: 'github', url: '', style: 'filled', color: 'rgba(255,255,255,0.1)' } }
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
            // Apply effect
            if (el.props.effect && EFFECTS[el.props.effect]) {
                const effect = EFFECTS[el.props.effect];
                if (effect.css) {
                    div.style.cssText += effect.css;
                }
                if (effect.class) {
                    div.classList.add(effect.class);
                }
            }
            break;

        case 'social':
            div.innerHTML = SOCIAL_ICONS[el.props.platform] || '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
            break;

        case 'divider':
            div.style.background = el.props.color;
            div.style.height = '2px';
            break;

        case 'heading':
            div.innerHTML = escapeHtml(el.props.content);
            div.style.fontSize = `${el.props.fontSize}px`;
            div.style.fontWeight = el.props.bold ? '700' : '400';
            div.style.textAlign = el.props.align;
            div.style.color = el.props.color;
            break;

        case 'spacer':
            div.style.height = `${el.props.height}px`;
            div.style.minHeight = `${el.props.height}px`;
            div.innerHTML = '<span class="spacer-indicator">↕</span>';
            break;

        case 'container':
            div.style.background = el.props.bgColor;
            div.style.borderRadius = `${el.props.borderRadius}px`;
            div.style.border = `1px solid ${el.props.borderColor}`;
            div.style.padding = `${el.props.padding}px`;
            div.style.minHeight = '60px';
            div.innerHTML = '<span class="container-placeholder">Container</span>';
            break;

        case 'embed':
            if (el.props.embedId) {
                if (el.props.embedType === 'youtube') {
                    div.innerHTML = `<iframe src="https://www.youtube.com/embed/${escapeHtml(el.props.embedId)}${el.props.autoplay ? '?autoplay=1' : ''}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:16/9;border-radius:8px;"></iframe>`;
                } else if (el.props.embedType === 'spotify') {
                    div.innerHTML = `<iframe src="https://open.spotify.com/embed/track/${escapeHtml(el.props.embedId)}" frameborder="0" allowtransparency="true" allow="encrypted-media" style="width:100%;height:80px;border-radius:8px;"></iframe>`;
                }
            } else {
                div.innerHTML = '<span class="embed-placeholder">▶ Add embed ID</span>';
            }
            break;

        case 'iconButton':
            const iconHtml = SOCIAL_ICONS[el.props.platform] || SOCIAL_ICONS.website;
            div.innerHTML = iconHtml;
            div.style.background = el.props.color || 'rgba(255,255,255,0.1)';
            if (el.props.style === 'outline') {
                div.style.background = 'transparent';
                div.style.border = '2px solid currentColor';
            } else if (el.props.style === 'ghost') {
                div.style.background = 'transparent';
            }
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
                <div class="prop-group">
                    <label class="prop-label">Effect</label>
                    <select class="prop-input" data-prop="effect">
                        ${Object.entries(EFFECTS).map(([key, effect]) => `
                            <option value="${key}" ${(el.props.effect || 'none') === key ? 'selected' : ''}>${effect.name}</option>
                        `).join('')}
                    </select>
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

        case 'heading':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Text</label>
                    <input type="text" class="prop-input" data-prop="content" value="${escapeHtml(el.props.content)}">
                </div>
                <div class="prop-group">
                    <label class="prop-label">Font Size</label>
                    <input type="number" class="prop-input" data-prop="fontSize" value="${el.props.fontSize}" min="16" max="64">
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

        case 'spacer':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Height (px)</label>
                    <input type="number" class="prop-input" data-prop="height" value="${el.props.height}" min="10" max="100">
                </div>
            `;
            break;

        case 'container':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Background Color</label>
                    <input type="text" class="prop-input" data-prop="bgColor" value="${escapeHtml(el.props.bgColor)}" placeholder="rgba(255,255,255,0.1)">
                </div>
                <div class="prop-group">
                    <label class="prop-label">Border Color</label>
                    <input type="text" class="prop-input" data-prop="borderColor" value="${escapeHtml(el.props.borderColor)}" placeholder="rgba(255,255,255,0.1)">
                </div>
                <div class="prop-group">
                    <div class="prop-row">
                        <div>
                            <label class="prop-label">Radius</label>
                            <input type="number" class="prop-input" data-prop="borderRadius" value="${el.props.borderRadius}" min="0" max="50" style="width:60px">
                        </div>
                        <div>
                            <label class="prop-label">Padding</label>
                            <input type="number" class="prop-input" data-prop="padding" value="${el.props.padding}" min="0" max="50" style="width:60px">
                        </div>
                    </div>
                </div>
            `;
            break;

        case 'embed':
            html = `
                <div class="prop-group">
                    <label class="prop-label">Embed Type</label>
                    <select class="prop-input" data-prop="embedType">
                        <option value="youtube" ${el.props.embedType === 'youtube' ? 'selected' : ''}>YouTube</option>
                        <option value="spotify" ${el.props.embedType === 'spotify' ? 'selected' : ''}>Spotify</option>
                    </select>
                </div>
                <div class="prop-group">
                    <label class="prop-label">Embed ID</label>
                    <input type="text" class="prop-input" data-prop="embedId" value="${escapeHtml(el.props.embedId || '')}" placeholder="Video/Track ID">
                </div>
                <div class="prop-group">
                    <label class="prop-label">Autoplay</label>
                    <input type="checkbox" data-prop="autoplay" ${el.props.autoplay ? 'checked' : ''}>
                </div>
            `;
            break;

        case 'iconButton':
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
                <div class="prop-group">
                    <label class="prop-label">Style</label>
                    <select class="prop-input" data-prop="style">
                        <option value="filled" ${el.props.style === 'filled' ? 'selected' : ''}>Filled</option>
                        <option value="outline" ${el.props.style === 'outline' ? 'selected' : ''}>Outline</option>
                        <option value="ghost" ${el.props.style === 'ghost' ? 'selected' : ''}>Ghost</option>
                    </select>
                </div>
                <div class="prop-group">
                    <label class="prop-label">Background Color</label>
                    <input type="text" class="prop-input" data-prop="color" value="${escapeHtml(el.props.color || 'rgba(255,255,255,0.1)')}" placeholder="rgba(255,255,255,0.1)">
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
