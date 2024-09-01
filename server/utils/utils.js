const url = require('url');

const isSameDomain = (baseUrl, currentUrl) => {
    const { hostname: baseHostname } = new URL(baseUrl);
    const { hostname: currentHostname } = new URL(currentUrl);

    return baseHostname === currentHostname;
};

const isRootPath = (targetUrl) => {
    const urlObject = new url.URL(targetUrl);
    return urlObject.pathname === '/';
}

const hasSameParentPath = (baseUrl, currentUrl) => {
    return baseUrl.pathname === currentUrl.pathname || baseUrl.pathname.startsWith(`${currentUrl.pathname}/`);
}

module.exports = { isSameDomain, isRootPath, hasSameParentPath }