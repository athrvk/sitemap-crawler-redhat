const cheerio = require('cheerio');
const url = require('url');
const { isRootPath, isSameDomain, hasSameParentPath } = require('../utils/utils');


const getLinks = ($, currentUrl, visited, includeParentPath) => {
    const links = {};

    $('a').each((i, element) => {
        const href = $(element).attr('href');
        // console.log(`\tFound link ${href}`);
        if (href) {
            const fullUrl = new url.URL(href, currentUrl);
            // console.log(`\t\tFull URL: ${fullUrl}`);
            if (!visited.has(fullUrl) && isSameDomain(currentUrl, fullUrl) && fullUrl.href !== currentUrl) {
                if (includeParentPath || hasSameParentPath(fullUrl, currentUrl)) {
                    links[fullUrl] = {};
                }
            }
        }
    });

    return links;
};


async function crawlPage(baseUrl, currentUrl, includeParentPath, level = 0) {
    console.log(`Crawling ${currentUrl} with base URL ${baseUrl} at level ${level}`);

    const sitemap = { [currentUrl]: {} };
    const queue = [{ url: currentUrl, level, parent: sitemap[currentUrl] }];
    const visited = new Set();
    const linksCache = new Map(); // Map to store links for each page
    let linksCacheHits = 0;
    const contentCache = new Map(); // Map to store html content for each page
    let contentCacheHits = 0;

    while (queue.length > 0) {
        const { url, level: currentLevel, parent } = queue.shift();

        visited.add(url);

        try {
            let htmlContent;

            if (contentCache.has(url)) {
                contentCacheHits++;
                console.log(`Getting html from cache for ${url}`);
                htmlContent = contentCache.get(url);
            } else {
                const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
                htmlContent = await response.text();
                contentCache.set(url, htmlContent);
            }

            const $ = cheerio.load(htmlContent);

            let links;
            if (linksCache.has(url)) {
                linksCacheHits++;
                console.log(`Getting links from cache for ${url}`);
                links = linksCache.get(url);
            } else {
                links = getLinks($, url, visited, includeParentPath);
                linksCache.set(url, links);
            }

            for (const link of Object.keys(links)) {
                parent[link] = {};
                if (currentLevel > 1 && !visited.has(link)) {
                    queue.push({ url: link, level: currentLevel - 1, parent: parent[link] });
                }
            }

            console.log(`Found ${Object.keys(links).length} links on page ${url}`);
        } catch (error) {
            console.error(`Error crawling ${url}:`, error.message);
        }
    }

    console.log(`Content Cache hits:`, contentCacheHits, ` and links cache hits:`, linksCacheHits);
    console.log(`Visited ${visited.size} pages`);
    return sitemap;
};

module.exports = { crawlPage, isRootPath };
