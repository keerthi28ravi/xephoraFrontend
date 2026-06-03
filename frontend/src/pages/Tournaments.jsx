import React, { useEffect, useState } from 'react';
import { tournamentsAPI } from '../services/api';
import { playSound } from '../services/sound';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState('BRACKETS SUBNETS ACTIVE');

  const fetchTournaments = async () => {
    try {
      const res = await tournamentsAPI.getTournaments();
      setTournaments(res.data);
    } catch (err) {
      console.error('Failed to load tournaments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const handleRegister = async (tournamentId, title) => {
    playSound('click');
    setStatusText(`LINKING OPERATOR ADAPTER TO ${title.toUpperCase()}...`);
    try {
      await tournamentsAPI.register(tournamentId);
      setStatusText(`REGISTRATION SYNCHRONIZED FOR ${title.toUpperCase()}`);
      fetchTournaments();
      playSound('win');
    } catch (err) {
      console.error('Tournament registration failed:', err);
      setStatusText(err.response?.data?.msg || 'REGISTRATION LINK EXPIRED.');
    }
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">SUBNET TOURNAMENTS</h2>
        <div className="section-subtitle">Competitive subnet brackets & prize allocations standings</div>
      </div>

      <div className="glass-card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '15px' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1.5px' }}>
            GLOBAL NETWORK BRACKETS
          </h3>
          <span style={{ 
            fontFamily: 'var(--font-header)', 
            fontSize: '9px', 
            color: 'var(--neon-blue)', 
            background: 'rgba(0, 240, 255, 0.08)',
            padding: '4px 10px',
            borderRadius: '3px',
            letterSpacing: '1px'
          }}>
            TELEMETRY // {statusText.toUpperCase()}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            SYNCHRONIZING SYSTEM STANDINGS AND REGISTERED NODES...
          </div>
        ) : tournaments.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-header)', letterSpacing: '1px' }}>
            NO TOURNAMENTS DEPLOYED AT THIS SUBNET BANDWIDTH.
          </div>
        ) : (
          <div className="lobby-table-wrapper">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>TOURNAMENT</th>
                  <th>ARENA MODULE</th>
                  <th>PRIZE POOL</th>
                  <th>OPERATORS INSTALLED</th>
                  <th>TIMELINE INDEX</th>
                  <th>SYSTEM REGISTER</th>
                </tr>
              </thead>
              <tbody>
                {tournaments.map((t) => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: '600', color: '#fff' }}>{t.title}</td>
                    <td style={{ color: 'var(--neon-blue)', fontFamily: 'var(--font-header)' }}>
                      {t.title.includes('Memory') ? 'Memory Nexus' : t.title.includes('Logic') ? 'Logic Arena' : 'Number Rush'}
                    </td>
                    <td style={{ fontFamily: 'var(--font-header)', color: 'var(--neon-violet)' }}>{t.prizePool}</td>
                    <td>{t.registrants ? t.registrants.length : 0} Registered</td>
                    <td style={{ fontSize: '11px' }}>
                      {t.status === 'FINISHED' ? 'Completed' : `Target: ${new Date(t.countdownDate).toLocaleDateString()}`}
                    </td>
                    <td>
                      <button 
                        className={`cyber-btn mini-btn ${t.status === 'ACTIVE' ? 'primary' : t.status === 'UPCOMING' ? 'secondary' : 'disabled'}`}
                        disabled={t.status === 'FINISHED'}
                        onClick={() => handleRegister(t._id, t.title)}
                      >
                        {t.status === 'ACTIVE' ? 'SPECTATE' : t.status === 'UPCOMING' ? 'REGISTER' : 'FINISHED'}
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
  );
}
