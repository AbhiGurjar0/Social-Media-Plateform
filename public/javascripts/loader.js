const loader = document.getElementById('global-loader');

let loaderTimeout;

function showLoader() {
    loader?.classList.remove('hidden');
}

function hideLoader() {
    loader?.classList.add('hidden');
}

function startDelayedLoader(delay = 2000) {
    loaderTimeout = setTimeout(() => {
        showLoader();
    }, delay);
}

function stopDelayedLoader() {
    clearTimeout(loaderTimeout);
    hideLoader();
}

const originalFetch = window.fetch;
window.fetch = async function (...args) {
    startDelayedLoader(1000);

    try {
        const res = await originalFetch(...args);
        return res;
    } finally {
        stopDelayedLoader();
    }
};

// Fired even on back-forward cache navigation
window.addEventListener('pageshow', (event) => {
    stopDelayedLoader();
});

// Use pagehide instead of beforeunload for better reliability
window.addEventListener('pagehide', () => {
    startDelayedLoader();
});
