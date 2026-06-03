import React, { useEffect, useState } from 'react';
import { multiplayerAPI } from '../services/api';
import { playSound } from '../services/sound';

export default function MultiplayerArena() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameMode, setGameMode] = useState('Memory Nexus');
  const [creating, setCreating] = useState(false);
  const [statusText, setStatusText] = useState('SUBNET NODES CONNECTED');

  const fetchRooms = async () => {
    try {
      const res = await multiplayerAPI.getRooms();
      setRooms(res.data);
    } catch (err) {
      console.error('Failed to download active lobby arrays:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 8000); // refresh every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    playSound('click');
    setCreating(true);
    setStatusText('ALLOCATING NEW SUBNET ADAPTER...');

    try {
      await multiplayerAPI.createRoom(gameMode);
      setStatusText('LOBBY DEPLOYED SUCCESSFULLY.');
      fetchRooms();
    } catch (err) {
      console.error('Failed to allocate room:', err);
      setStatusText('ALLOCATION FAILURE. MATRIX RETRANSMITTING.');
    } finally {
      setCreating(false);
    }
  };

  const handleJoinRoom = async (roomId) => {
    playSound('click');
    setStatusText(`SYNCHRONIZING WITH LOBBY ${roomId.slice(-6).toUpperCase()}...`);
    try {
      await multiplayerAPI.joinRoom(roomId);
      setStatusText('LINK ESTABLISHED. PREPARING DATA STREAM...');
      fetchRooms();
      alert('Handshake linked. Connecting to the multiplayer matches! (Mocked room join verified)');
    } catch (err) {
      console.error('Failed to link room:', err);
      setStatusText('LINK SECURE FAIL. ACCESS EXPIRED.');
    }
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">MULTIPLAYER SUBNET ARENA</h2>
        <div className="section-subtitle">Tactical matchmaking lobby routing grids</div>
      </div>

      <div className="multiplayer-dashboard-layout">
        {/* Left Side: Stats and Lobby Creation */}
        <div className="glass-card lobby-control-panel">
          <div className="game-badge">SUBNET MATRIX</div>
          <h3>LOBBY CREATOR</h3>
          
          <div className="lobby-stats" style={{ marginBottom: '25px' }}>
            <div className="lstat-box">
              <div className="lstat-val text-neon-blue">{rooms.length}</div>
              <div className="lstat-lbl">ACTIVE MATRIX LOBBIES</div>
            </div>
            <div className="lstat-box">
              <div className="lstat-val text-neon-violet">42</div>
              <div className="lstat-lbl">OPERATORS INSTALLED</div>
            </div>
          </div>

          <form onSubmit={handleCreateRoom} className="multiplayer-forms">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '9px', fontFamily: 'var(--font-header)', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                ARENA COMPETITIVE MODE
              </label>
              <select
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(0, 240, 255, 0.2)',
                  borderRadius: '4px',
                  padding: '10px 14px',
                  color: '#fff',
                  fontSize: '12px',
                  outline: 'none'
                }}
              >
                <option value="Memory Nexus" style={{ background: '#110822', color: '#fff' }}>Memory Nexus</option>
                <option value="Logic Arena" style={{ background: '#110822', color: '#fff' }}>Logic Arena</option>
                <option value="Number Rush" style={{ background: '#110822', color: '#fff' }}>Number Rush</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="cyber-btn primary full-width"
              disabled={creating}
              style={{ marginTop: '10px' }}
            >
              {creating ? 'ALLOCATING...' : 'DEPLOY SUBNET LOBBY'} <span className="btn-glow" />
            </button>
          </form>

          <div className="game-instruction-alert" style={{ marginTop: '30px' }}>
            TELEMETRY DIAGNOSTIC // {statusText.toUpperCase()}
          </div>
        </div>

        {/* Right Side: Available Subnets Table */}
        <div className="glass-card lobby-list-panel">
          <h4>AVAILABLE SYSTEM SUBNET CHANNELS</h4>
          
          {loading ? (
            <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
              DOWNLOADING SUBNET SPECTRUMS...
            </div>
          ) : rooms.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-header)', letterSpacing: '1px' }}>
              NO ACTIVE COGNITIVE SUBNETS DETECTED. CHOOSE CREATE ROOM TO INSTANTIATE NODES.
            </div>
          ) : (
            <div className="lobby-table-wrapper">
              <table className="cyber-table">
                <thead>
                  <tr>
                    <th>LOBBY HASH</th>
                    <th>ARENA MODE</th>
                    <th>HOST</th>
                    <th>MEMBERS</th>
                    <th>STATUS</th>
                    <th>SYSTEM ACCESS</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id}>
                      <td style={{ fontFamily: 'var(--font-header)', fontSize: '11px', color: 'var(--neon-blue)' }}>
                        #{room._id.slice(-6).toUpperCase()}
                      </td>
                      <td>{room.gameMode}</td>
                      <td>{room.hostUsername || 'OPERATOR'}</td>
                      <td>{room.players ? room.players.length : 1} / 2</td>
                      <td style={{ color: room.status === 'WAITING' ? 'var(--neon-green)' : 'var(--neon-pink)', fontFamily: 'var(--font-header)', fontSize: '10px' }}>
                        {room.status}
                      </td>
                      <td>
                        <button
                          className="cyber-btn primary mini-btn"
                          disabled={room.status !== 'WAITING'}
                          onClick={() => handleJoinRoom(room._id)}
                        >
                          JOIN MATRIX
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
