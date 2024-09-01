const router = require('express').Router();
const nodeCache = require('node-cache');
const crawler = require('../service/crawler')


const cache = new nodeCache({ stdTTL: 60 * 60 * 24, forceString: true }); // 1 day

router.post('/', async (req, res) => {
    const { url: targetUrl, includeParentPath, depth: level } = req.body;
    if (!targetUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        let isRootPath;
        if (!includeParentPath) {
            isRootPath = crawler.isRootPath(targetUrl);
        }
        console.log(`is root path: ${isRootPath} then include parent path: ${isRootPath || includeParentPath}`);
        // calculate time taken to crawl
        const startTime = process.hrtime();
        let sitemap;
        const cacheKey = JSON.stringify({ targetUrl, level });
        if (cache.has(cacheKey)) {
            console.log(`Cache hit for ${targetUrl}`);
            sitemap = cache.get(cacheKey);
        } else {
            sitemap = await crawler.crawlPage(targetUrl, targetUrl, isRootPath || includeParentPath, level);
            cache.set(cacheKey, sitemap);
        }
        const endTime = process.hrtime(startTime);
        console.log(`Time taken to crawl ${targetUrl}: %ds %dms`, endTime[0], endTime[1] / 1000000);
        console.log(`Crawled ${targetUrl} with sitemap size:`, Object.keys(sitemap).length);
        console.log(`Cache size: `, cache.getStats().keys);
        res.json({ sitemap, timeTaken: `${endTime[0]}s ${(endTime[1] / 1000000).toFixed(2)}ms` });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while crawling', message: error.message });
    }
});

module.exports = router;