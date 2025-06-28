const loader = document.getElementById('global-loader');

// loader.js

let loaderTimeout;

function showLoader() {
    document.getElementById('global-loader')?.classList.remove('hidden');
}

function hideLoader() {
    document.getElementById('global-loader')?.classList.add('hidden');
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

window.addEventListener('beforeunload', () => {
  startDelayedLoader(); // Starts 2s delayed loader
});


window.addEventListener('load', () => {
  stopDelayedLoader();
});