const form = document.getElementById('shorten-form');
const urlInput = document.getElementById('url-input');
const customToggle = document.getElementById('custom-toggle');
const customSlugGroup = document.getElementById('custom-slug-group');
const customSlugInput = document.getElementById('custom-slug');
const submitBtn = document.getElementById('submit-btn');
const resultDiv = document.getElementById('result');
const shortUrlLink = document.getElementById('short-url');
const copyBtn = document.getElementById('copy-btn');
const errorDiv = document.getElementById('error');

// Toggle custom slug input
customToggle.addEventListener('change', () => {
    customSlugGroup.classList.toggle('visible', customToggle.checked);
    if (!customToggle.checked) {
        customSlugInput.value = '';
    }
});

// Form submission
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset states
    resultDiv.classList.remove('visible');
    errorDiv.classList.remove('visible');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Shortening...';

    const longUrl = urlInput.value.trim();
    const customSlug = customSlugInput.value.trim();

    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                url: longUrl,
                customSlug: customSlug || undefined
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to shorten URL');
        }

        // Show result
        shortUrlLink.href = data.shortUrl;
        shortUrlLink.textContent = data.shortUrl;
        resultDiv.classList.add('visible');

        // Reset form
        urlInput.value = '';
        customSlugInput.value = '';
        customToggle.checked = false;
        customSlugGroup.classList.remove('visible');

    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('visible');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Shorten URL';
    }
});

// Copy to clipboard
copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(shortUrlLink.href);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shortUrlLink.href;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
        }, 2000);
    }
});
