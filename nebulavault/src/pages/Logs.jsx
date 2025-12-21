import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, ChevronLeft, ChevronRight, Loader2, FileText, Info } from 'lucide-react';
import { useTabState } from '../hooks/useTabState';

const ITEMS_PER_PAGE = 5;
const BASE_URL = 'https://fir-2-db7a0-default-rtdb.firebaseio.com';

export default function Logs({ isFrozen }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItemName, setNewItemName] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const { currentPage, filter, setCurrentPage, setFilter } = useTabState();

    async function fetchData() {
        try {
            const res = await axios.get(`${BASE_URL}/logs.json`);
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

    const filteredData = filter
        ? data.filter(item =>
            item.name?.toLowerCase().includes(filter.toLowerCase()) ||
            item.id?.toLowerCase().includes(filter.toLowerCase())
        )
        : data;

    const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(start, start + ITEMS_PER_PAGE);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newItemName.trim() || isAdding) return;

        setIsAdding(true);
        try {
            await axios.post(`${BASE_URL}/logs.json`, {
                name: newItemName,
                timestamp: Date.now(),
                creator: 'Observer-01',
                type: 'Event'
            });
            setNewItemName('');
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

    if (error) return <div style={{ color: '#ef4444', padding: '20px' }}>Error loading Logs: {error.message}</div>;

    return (
        <div>
            <div style={{ paddingBottom: '16px', borderBottom: '1px solid #d1d5db', marginBottom: '20px' }}>
                <h3 style={{ marginBottom: '12px' }}>Universe Logs</h3>
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#6b7280' }} />
                    <input
                        type="text"
                        placeholder="Search through the history..."
                        value={filter}
                        onChange={(e) => { setFilter(e.target.value); setCurrentPage(1); }}
                        style={{ paddingLeft: '36px', width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                </div>

                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Log new discovery..."
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
                        Log Entry
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
                                        <FileText size={20} />
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
                                <p>No log records in this timeline.</p>
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
