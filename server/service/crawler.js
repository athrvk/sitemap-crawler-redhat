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

    while (queue.length > 0) {
        const { url, level: currentLevel, parent } = queue.shift();

        if (visited.has(url)) {
            console.log(`Skipping ${url} because it has already been crawled`);
            continue;
        }

        visited.add(url);

        try {
            const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
            const html = await response.text();
            const $ = cheerio.load(html);

            let links;
            if (linksCache.has(url)) {
                console.log(`Get links from cache for ${url}`);
                links = linksCache.get(url);
            } else {
                links = getLinks($, url, visited, includeParentPath);
                linksCache.set(url, links);
            }

            for (const link of Object.keys(links)) {
                parent[link] = {};
                if (currentLevel > 1) {
                    queue.push({ url: link, level: currentLevel - 1, parent: parent[link] });
                }
            }

            console.log(`Found ${Object.keys(links).length} links on page ${url}`);
        } catch (error) {
            console.error(`Error crawling ${url}:`, error.message);
        }
    }

    return sitemap;
};

module.exports = { crawlPage, isRootPath };
