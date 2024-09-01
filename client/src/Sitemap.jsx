/* eslint-disable react/prop-types */
/* eslint-disable react/no-children-prop */
import { useState } from 'react';

const styles = `
  .sitemap-tree {
    font-family: Arial, sans-serif;
    padding: 16px;
    // background-color: white;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
  .sitemap-tree h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
  }
  .tree-node {
    margin-left: 20px;
  }
  .node-content {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  }
  .expand-button {
    margin-right: 8px;
    width: 16px;
    height: 16px;
    color: #6b7280;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  .expand-button:focus {
    outline: none;
  }
  .url-link {
    color: white;
    text-decoration: none;
  }
  .url-link:hover {
    text-decoration: underline;
  }
  .children-container {
    margin-left: 24px;
  }
`;

const TreeNode = ({ url, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasChildren = Object.keys(children).length > 0;

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="tree-node">
            <div className="node-content">
                {hasChildren && (
                    <button onClick={toggleExpand} className="expand-button">
                        {isExpanded ? '▼' : '►'}
                    </button>
                )}
                <a href={url} target="_blank" rel="noopener noreferrer" className="url-link">
                    {url}
                </a>
            </div>
            {isExpanded && hasChildren && (
                <div className="children-container">
                    {Object.entries(children).map(([childUrl, grandchildren]) => (
                        <TreeNode key={childUrl} url={childUrl} children={grandchildren} />
                    ))}
                </div>
            )}
        </div>
    );
};

const SitemapTree = ({ sitemap }) => {
    return (
        <>
            <style>{styles}</style>
            <div className="sitemap-tree">
                {Object.entries(sitemap).map(([url, children]) => (
                    <TreeNode key={url} url={url} children={children} />
                ))}
            </div>
        </>
    );
};

export default SitemapTree;