import { useState } from 'react';
import './App.css';
import SitemapTree from './Sitemap';

function App() {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(1);
  const [includeParentPath, setIncludeParentPath] = useState(false);
  const [timeTaken, setTimeTaken] = useState('');
  const [sitemap, setSitemap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hostUrl = import.meta.env.MODE === 'production' ? window.location.href : 'http://localhost:3000/'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSitemap(null);
    setTimeTaken('');

    try {
      fetch(`${hostUrl}crawl`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, includeParentPath, depth }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.sitemap || Object.keys(data.sitemap).length === 0) {
            setError('No sitemap found for the given URL.');
          } else {
            setSitemap(data.sitemap);
            setTimeTaken(data.timeTaken);
          }
        });
    } catch (err) {
      setError('An error occurred while crawling the website.' + err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="app">
      <div className='title' >
        <h1>Web Crawler</h1>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', maxWidth: '400px', flexDirection: 'column' }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to crawl"
            required
          />
          <label>
            <input type="checkbox" checked={includeParentPath} onChange={(e) => setIncludeParentPath(e.target.checked)} />
            Include parent path
          </label>
          <label>
            <input type='number' value={depth} onChange={(e) => setDepth(Number(e.target.value))} min={1} style={{ width: '50px', height: '25px', textAlign: 'center' }} />
            &nbsp;Max depth
          </label>
          <button type="submit" disabled={loading}>
            Crawl
          </button>
        </form>
        {loading && <p>Crawling... This may take a while.</p>}
        <p style={{ fontSize: '14px', color: '#999' }}>Time taken to crawl: {timeTaken}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
      <div className='sitemap'>
        {sitemap && (
          <div>
            <h2 style={{ marginTop: '20px' }}>Sitemap:</h2>
            {<SitemapTree sitemap={sitemap} />}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;