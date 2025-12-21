import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Artifacts from "./pages/Artifacts";
import Creatures from "./pages/Creatures";
import Logs from "./pages/Logs";
import { Snowflake, Flame, Info, Atom } from 'lucide-react';

export default function App() {
    const [isFrozen, setIsFrozen] = useState(false);

    return (
        <BrowserRouter>
            <div style={{ padding: '20px' }}>
                <header style={{ marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '2rem', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Atom size={32} /> NebulaVault
                    </h1>
                    <p style={{ color: '#6b7280' }}>Real-time multiverse dashboard. Your focus, preserved.</p>
                </header>

                <div style={{ background: '#f1f5f9', border: '1px dashed #d1d5db', padding: '16px', marginBottom: '20px', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong>Temporal Freeze:</strong>
                            <span style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                backgroundColor: isFrozen ? '#fee2e2' : '#dcfce7',
                                color: isFrozen ? '#991b1b' : '#166534'
                            }}>
                                {isFrozen ? 'PAUSED' : 'LIVE'}
                            </span>
                        </div>
                        <button
                            onClick={() => setIsFrozen(!isFrozen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                border: 'none',
                                borderRadius: '6px',
                                backgroundColor: isFrozen ? '#3b82f6' : '#ef4444',
                                color: 'white',
                                cursor: 'pointer'
                            }}
                        >
                            {isFrozen ? <Snowflake size={16} /> : <Flame size={16} />}
                            {isFrozen ? ' Unfreeze Time' : ' Freeze Time'}
                        </button>
                    </div>
                    <p style={{ fontSize: '12px', marginTop: '8px', color: '#6b7280' }}>
                        <Info size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                        When Frozen, new items hidden until you unfreeze.
                    </p>
                </div>

                <Navbar />

                <main style={{ minHeight: '400px', border: '1px solid #d1d5db', borderRadius: '8px', padding: '20px' }}>
                    <Routes>
                        <Route path="/" element={<Navigate to="/artifacts" />} />
                        <Route path="/artifacts" element={<Artifacts isFrozen={isFrozen} />} />
                        <Route path="/creatures" element={<Creatures isFrozen={isFrozen} />} />
                        <Route path="/logs" element={<Logs isFrozen={isFrozen} />} />
                    </Routes>
                </main>

                <footer style={{ marginTop: '20px', textAlign: 'center', color: '#6b7280', fontSize: '12px' }}>
                    NebulaVault &copy; 2025
                </footer>
            </div>
        </BrowserRouter>
    );
}
