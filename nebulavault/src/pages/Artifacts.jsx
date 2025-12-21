import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, ChevronLeft, ChevronRight, Loader2, Sparkles, Info } from 'lucide-react';
import { useTabState } from '../hooks/useTabState';

const ITEMS_PER_PAGE = 5;
const BASE_URL = 'https://fir-2-db7a0-default-rtdb.firebaseio.com';

export default function Artifacts({ isFrozen }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const { currentPage, filter, setCurrentPage, setFilter } = useTabState('artifacts');

    // Clear search when component unmounts or tab changes
    useEffect(() => {
        return () => {
            // Optional: Clear search when leaving tab
            // setFilter('');
        };
    }, []);

    async function fetchData() {
        try {
            const res = await axios.get(`${BASE_URL}/artifacts.json`);
            const val = res.data;
            const items = val ? Object.entries(val).map(([id, item]) => ({ id, ...item })) : [];
            items.reverse();

            if (!isFrozen) {
                setData(items);
            }
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [isFrozen]);

    const filteredData = filter.trim()
        ? data.filter(item => {
            const searchTerm = filter.toLowerCase().trim();
            return (
                item.name?.toLowerCase().includes(searchTerm) ||
                item.id?.toLowerCase().includes(searchTerm) ||
                item.creator?.toLowerCase().includes(searchTerm) ||
                item.type?.toLowerCase().includes(searchTerm)
            );
        })
        : data;

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(start, start + ITEMS_PER_PAGE);

    // Reset to page 1 if current page exceeds total pages after filtering
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [filteredData.length, currentPage, totalPages, setCurrentPage]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItemName.trim() || isAdding) return;

        setIsAdding(true);
        try {
            await axios.post(`${BASE_URL}/artifacts.json`, {
                name: newItemName,
                timestamp: Date.now(),
                creator: 'Observer-01',
                type: 'Relic'
            });
            setNewItemName('');
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

    if (error) return <div style={{ color: '#ef4444', padding: '20px' }}>Error loading Artifacts: {error.message}</div>;

    return (
        <div>
            <div style={{ paddingBottom: '16px', borderBottom: '1px solid #d1d5db', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '12px' }}>Artifacts Explorer</h3>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
                    <input
                        type="text"
                        placeholder="Search artifacts by name, ID, creator, or type..."
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                        style={{ 
                            paddingLeft: '40px', 
                            paddingRight: '12px',
                            width: '100%', 
                            padding: '10px', 
                            border: '1px solid #d1d5db', 
                            borderRadius: '6px',
                            fontSize: '14px',
                            transition: 'border-color 0.2s ease',
                            ':focus': {
                                borderColor: '#3b82f6',
                                outline: 'none'
                            }
                        }}
                    />
                    {filter && (
                        <button
                            onClick={() => { setFilter(''); setCurrentPage(1); }}
                            style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                cursor: 'pointer',
                                fontSize: '18px',
                                padding: '0',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Clear search"
                        >
                            ×
                        </button>
                    )}
                </div>

                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Enter new artifact name..."
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        style={{ flex: 1, padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    <button
                        type="submit"
                        disabled={isAdding}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        {isAdding ? <Loader2 size={16} /> : <Plus size={16} />}
                        Add New
                    </button>
                </form>
            </div>

            <div>
                {loading && data.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <Loader2 size={24} style={{ color: '#3b82f6' }} />
                        <p style={{ marginTop: '16px' }}>Fetching data from the multiverse...</p>
                    </div>
                ) : (
                    <div>
                        {paginatedData.map((item) => (
                            <div key={item.id} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '16px',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                marginBottom: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ color: '#3b82f6' }}>
                                        <Sparkles size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600' }}>{item.name}</div>
                                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                                            <strong>ID:</strong> {item.id} | <strong>Observer:</strong> {item.creator}
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 'bold' }}>
                                        {item.type}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#6b7280' }}>
                                        {new Date(item.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {paginatedData.length === 0 && (
                            <div style={{ padding: '60px', textAlign: 'center', color: '#6b7280' }}>
                                <Info size={24} style={{ marginBottom: '12px' }} />
                                <p>No items found in this section of the vault.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #d1d5db' }}>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span style={{ fontSize: '13px', fontWeight: '500' }}>
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 16px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            backgroundColor: 'white',
                            cursor: 'pointer'
                        }}
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
