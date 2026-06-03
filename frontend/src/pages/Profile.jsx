import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { gameAPI } from '../services/api';

export default function Profile() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await gameAPI.getHistory();
        setHistory(res.data);
      } catch (err) {
        console.error('Failed to retrieve operator history logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">OPERATOR SYNAPTIC PROFILE</h2>
        <div className="section-subtitle">Cognitive Telemetry Logs & Credentials Records</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' }}>
        {/* User Card */}
        <div className="glass-card" style={{ padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div className="user-brief-avatar" style={{ width: '90px', height: '90px', marginBottom: '20px', border: '2px solid var(--neon-blue)' }}>
            <div className="avatar-glow" style={{ boxShadow: '0 0 15px var(--neon-blue)' }} />
            <span style={{ fontFamily: 'var(--font-header)', fontSize: '26px', fontWeight: 800, color: '#fff' }}>
              {user?.username?.slice(0, 2).toUpperCase() || 'OP'}
            </span>
          </div>

          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', color: '#fff', marginBottom: '4px', letterSpacing: '1px' }}>
            {user?.username || 'OPERATOR'}
          </h3>
          <p style={{ fontSize: '11px', color: 'var(--neon-blue)', fontFamily: 'var(--font-header)', letterSpacing: '2px', marginBottom: '25px' }}>
            CLASSIFICATION: LEVEL {user?.level || 1}
          </p>

          <div style={{ width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }}>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-header)', display: 'block', letterSpacing: '1px' }}>
                OPERATOR CODE-FEED (EMAIL)
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{user?.email || 'N/A'}</span>
            </div>
            <div>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-header)', display: 'block', letterSpacing: '1px' }}>
                ACCESS ROLE LEVEL
              </span>
              <span style={{ fontSize: '12px', color: 'var(--neon-violet)', fontFamily: 'var(--font-header)', fontWeight: 600 }}>
                {user?.role || 'OPERATOR'}
              </span>
            </div>
          </div>
        </div>

        {/* User Stats and Game History */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Unlocked Badges */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '14px', color: '#fff', letterSpacing: '1.5px', marginBottom: '15px' }}>
              UNLOCKED SECURED BADGES
            </h4>
            {user?.unlockedBadges && user.unlockedBadges.length > 0 ? (
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {user.unlockedBadges.map((badge, idx) => (
                  <div key={idx} style={{
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, rgba(112, 0, 255, 0.15), rgba(0, 240, 255, 0.05))',
                    border: '1px solid var(--neon-blue)',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-header)',
                    fontSize: '11px',
                    color: '#fff',
                    boxShadow: '0 0 6px rgba(0, 240, 255, 0.2)'
                  }}>
                    🎖️ {badge.toUpperCase()}
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>No synaptic badges unlocked. Perform gameplay calibration tests.</p>
            )}
          </div>

          {/* Decryption Telemetry Logs */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-header)', fontSize: '14px', color: '#fff', letterSpacing: '1.5px', marginBottom: '15px' }}>
              RECENT SYSTEM DECISION LOGS
            </h4>

            {loading ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                DOWNLOADING TELEMETRY LOGS...
              </div>
            ) : history.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                NO EXPERIMENT COMPLETED RECENTLY.
              </div>
            ) : (
              <div className="lobby-table-wrapper">
                <table className="cyber-table">
                  <thead>
                    <tr>
                      <th>ARENA MODE</th>
                      <th>SYNAPTIC SCORE</th>
                      <th>DECISION STEPS/MOVES</th>
                      <th>DURATION SEC</th>
                      <th>ILLUMINATION TIMESTAMP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((log) => (
                      <tr key={log._id}>
                        <td style={{ color: 'var(--neon-blue)', fontFamily: 'var(--font-header)' }}>
                          {log.gameMode}
                        </td>
                        <td style={{ fontWeight: 'bold' }}>{log.score} pts</td>
                        <td>{log.moves || log.levelReached}</td>
                        <td>{log.duration ? `${log.duration}s` : 'N/A'}</td>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
