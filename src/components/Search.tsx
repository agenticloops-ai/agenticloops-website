import React, { useState, useEffect, useRef } from 'react';
import Fuse from 'fuse.js';
import { getGitHubUrl } from '../config/repos';

interface SearchItem {
    title: string;
    description: string;
    slug: string;
    body: string;
}

export default function Search() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const fuseRef = useRef<Fuse<SearchItem> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const baseUrl = import.meta.env.BASE_URL || '';

    // Load search index
    useEffect(() => {
        fetch(`${baseUrl}api/course-index.json`)
            .then(res => res.json())
            .then(data => {
                fuseRef.current = new Fuse(data, {
                    keys: ['title', 'description', 'body'],
                    threshold: 0.3,
                    includeMatches: true,
                });
            });
    }, []);

    // Keyboard shortcut to open search (Cmd+K or Ctrl+K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Search on query change
    useEffect(() => {
        if (fuseRef.current && query) {
            const searchResults = fuseRef.current.search(query).map(result => result.item);
            setResults(searchResults.slice(0, 8));
            setSelectedIndex(0);
        } else {
            setResults([]);
        }
    }, [query]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(i => Math.min(i + 1, results.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            window.open(getGitHubUrl(results[selectedIndex].slug), '_blank');
        }
    };

    // Close when clicking outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen]);

    return (
        <>
            {/* Search Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="search-button"
                aria-label="Search documentation"
                title="Search (⌘K)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div className="search-overlay">
                    <div ref={modalRef} className="search-modal">
                        {/* Search Input */}
                        <div className="search-input-wrapper">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="search-icon">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search documentation..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="search-input"
                                autoFocus
                            />
                            {query && (
                                <button onClick={() => setQuery('')} className="search-clear">
                                    ✕
                                </button>
                            )}
                        </div>

                        {/* Results */}
                        <div className="search-results">
                            {results.length > 0 ? (
                                <ul>
                                    {results.map((result, index) => (
                                        <li key={result.slug}>
                                            <a
                                                href={getGitHubUrl(result.slug)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`search-result ${index === selectedIndex ? 'selected' : ''}`}
                                            >
                                                <div className="result-icon">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                                        <path d="M14 2v6h6" />
                                                    </svg>
                                                </div>
                                                <div className="result-content">
                                                    <div className="result-title">{result.title || result.slug}</div>
                                                    {result.description && (
                                                        <div className="result-description">{result.description}</div>
                                                    )}
                                                </div>
                                                <div className="result-arrow">→</div>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            ) : query ? (
                                <div className="search-no-results">
                                    <p>No results found for "<strong>{query}</strong>"</p>
                                    <p className="hint">Try different keywords</p>
                                </div>
                            ) : (
                                <div className="search-hints">
                                    <p>Start typing to search...</p>
                                    <div className="keyboard-hints">
                                        <span><kbd>↑</kbd><kbd>↓</kbd> to navigate</span>
                                        <span><kbd>↵</kbd> to select</span>
                                        <span><kbd>esc</kbd> to close</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .search-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    padding: 0;
                    background: transparent;
                    border: 1.5px solid rgba(56, 189, 248, 0.25);
                    border-radius: 2px;
                    color: var(--color-accent-cyan);
                    cursor: pointer;
                    transition: all 0.2s ease;
                    position: relative;
                }

                .search-button svg {
                    color: var(--color-accent-cyan);
                    opacity: 0.8;
                    transition: all 0.2s;
                }

                .search-button:hover {
                    border-color: var(--color-accent-cyan);
                    background: rgba(56, 189, 248, 0.08);
                    box-shadow: 0 0 20px rgba(56, 189, 248, 0.15);
                }

                .search-button:hover svg {
                    opacity: 1;
                }

                .search-button:active {
                    transform: scale(0.95);
                }

                .search-button:focus-visible {
                    outline: 2px solid var(--color-accent-cyan);
                    outline-offset: 2px;
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.98);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .search-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    z-index: 1000;
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    padding-top: 15vh;
                    animation: fadeIn 0.2s ease-out;
                }

                .search-modal {
                    width: 100%;
                    max-width: 600px;
                    background: var(--color-bg-secondary);
                    border: 1.5px solid rgba(56, 189, 248, 0.4);
                    border-radius: 0;
                    box-shadow:
                        0 20px 60px rgba(0, 0, 0, 0.3),
                        0 0 30px rgba(56, 189, 248, 0.1);
                    overflow: hidden;
                    animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .search-modal::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg,
                        transparent,
                        var(--color-accent-cyan),
                        transparent);
                    opacity: 0.3;
                }
                
                .search-input-wrapper {
                    display: flex;
                    align-items: center;
                    gap: 0.875rem;
                    padding: 1.25rem 1.5rem;
                    border-bottom: 1.5px solid rgba(56, 189, 248, 0.15);
                    transition: all 0.2s;
                    background: transparent;
                }

                .search-input-wrapper:focus-within {
                    border-bottom-color: rgba(56, 189, 248, 0.5);
                    background: rgba(56, 189, 248, 0.03);
                }

                .search-icon {
                    color: var(--color-accent-cyan);
                    opacity: 0.7;
                    flex-shrink: 0;
                }

                .search-input {
                    flex: 1;
                    background: transparent;
                    border: none;
                    outline: none;
                    font-size: 1.125rem;
                    font-family: 'Rajdhani', sans-serif;
                    font-weight: 600;
                    color: var(--color-text-primary);
                    letter-spacing: 0.01em;
                }

                .search-input::placeholder {
                    color: var(--color-text-muted);
                    opacity: 0.5;
                }
                
                .search-clear {
                    background: rgba(56, 189, 248, 0.08);
                    border: 1px solid rgba(56, 189, 248, 0.25);
                    color: var(--color-accent-cyan);
                    padding: 0.375rem 0.625rem;
                    border-radius: 0;
                    cursor: pointer;
                    font-size: 0.75rem;
                    font-family: 'Azeret Mono', monospace;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .search-clear:hover {
                    background: rgba(56, 189, 248, 0.15);
                    border-color: var(--color-accent-cyan);
                    box-shadow: 0 0 10px rgba(56, 189, 248, 0.15);
                }
                
                .search-results {
                    max-height: 400px;
                    overflow-y: auto;
                }

                .search-results::-webkit-scrollbar {
                    width: 8px;
                }

                .search-results::-webkit-scrollbar-track {
                    background: transparent;
                }

                .search-results::-webkit-scrollbar-thumb {
                    background: var(--color-border);
                    border-radius: 4px;
                }

                .search-results::-webkit-scrollbar-thumb:hover {
                    background: var(--color-text-muted);
                }
                
                .search-results ul {
                    list-style: none;
                    margin: 0;
                    padding: 0.5rem;
                }
                
                .search-result {
                    display: flex;
                    align-items: center;
                    gap: 0.875rem;
                    padding: 0.875rem 1.25rem;
                    border-radius: 0;
                    text-decoration: none;
                    color: var(--color-text-secondary);
                    transition: all 0.15s ease;
                    border-left: 2px solid transparent;
                    position: relative;
                }

                .search-result::before {
                    content: '>';
                    position: absolute;
                    left: 0.5rem;
                    color: var(--color-accent-cyan);
                    opacity: 0;
                    transition: opacity 0.15s;
                    font-family: 'Azeret Mono', monospace;
                    font-size: 0.875rem;
                }

                .search-result:hover {
                    background: rgba(56, 189, 248, 0.05);
                    border-left-color: var(--color-accent-cyan);
                    padding-left: 1.75rem;
                }

                .search-result:hover::before {
                    opacity: 1;
                }

                .search-result.selected {
                    background: rgba(56, 189, 248, 0.08);
                    border-left-color: var(--color-accent-cyan);
                    padding-left: 1.75rem;
                    box-shadow: 0 0 20px rgba(56, 189, 248, 0.1);
                }

                .search-result.selected::before {
                    opacity: 1;
                }
                
                .result-icon {
                    color: var(--color-accent-cyan);
                    opacity: 0.6;
                    flex-shrink: 0;
                }

                .result-content {
                    flex: 1;
                    min-width: 0;
                }

                .result-title {
                    font-weight: 700;
                    font-family: 'Rajdhani', sans-serif;
                    font-size: 1rem;
                    color: var(--color-text-primary);
                    margin-bottom: 0.25rem;
                    letter-spacing: 0.02em;
                }

                .result-description {
                    font-size: 0.8125rem;
                    font-family: 'Azeret Mono', monospace;
                    color: var(--color-text-muted);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    opacity: 0.7;
                }

                .result-arrow {
                    color: var(--color-accent-cyan);
                    opacity: 0;
                    transition: opacity 0.15s;
                    font-size: 1.25rem;
                }

                .search-result:hover .result-arrow,
                .search-result.selected .result-arrow {
                    opacity: 1;
                }
                
                .search-no-results,
                .search-hints {
                    padding: 2.5rem;
                    text-align: center;
                    color: var(--color-text-muted);
                    font-family: 'Rajdhani', sans-serif;
                }

                .search-no-results .hint {
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    opacity: 0.7;
                }

                .keyboard-hints {
                    display: flex;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-top: 1.5rem;
                    font-size: 0.75rem;
                    font-family: 'Azeret Mono', monospace;
                }

                .keyboard-hints kbd {
                    padding: 0.2rem 0.5rem;
                    background: rgba(56, 189, 248, 0.08);
                    border: 1px solid rgba(56, 189, 248, 0.25);
                    border-radius: 0;
                    margin: 0 0.15rem;
                    color: var(--color-accent-cyan);
                    font-family: 'Azeret Mono', monospace;
                    font-weight: 600;
                    box-shadow: 0 0 8px rgba(56, 189, 248, 0.1);
                }
            `}</style>
        </>
    );
}
