import React, { useEffect, useState } from 'react';
import { leaderboardAPI } from '../services/api';
import { playSound } from '../services/sound';

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subnet, setSubnet] = useState('GLOBAL');

  const fetchStandings = async (targetSubnet) => {
    setLoading(true);
    try {
      const res = await leaderboardAPI.getLeaderboard(targetSubnet);
      setLeaders(res.data);
    } catch (err) {
      console.error('Failed to retrieve leaderboard logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStandings(subnet);
  }, [subnet]);

  const handleSubnetChange = (newSubnet) => {
    playSound('click');
    setSubnet(newSubnet);
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">GLOBAL LEADERBOARD</h2>
        <div className="section-subtitle">Cognitive ranking of verified network operators</div>
      </div>

      <div className="glass-card" style={{ padding: '30px' }}>
        {/* Subnet Tabs */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', paddingBottom: '15px' }}>
          <button 
            className={`diff-btn ${subnet === 'GLOBAL' ? 'active' : ''}`}
            onClick={() => handleSubnetChange('GLOBAL')}
            style={{ maxWidth: '150px' }}
          >
            GLOBAL NEXUS
          </button>
          <button 
            className={`diff-btn ${subnet === 'SUBNET_S4' ? 'active' : ''}`}
            onClick={() => handleSubnetChange('SUBNET_S4')}
            style={{ maxWidth: '150px' }}
          >
            SUBNET CHANNELS
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            SYNCHRONIZING SYSTEM RANKINGS STANDINGS...
          </div>
        ) : leaders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-header)', letterSpacing: '1px' }}>
            NO REGISTERED OPERATOR SCORE-FEED FOUND.
          </div>
        ) : (
          <div className="lobby-table-wrapper">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>RANK</th>
                  <th>OPERATOR CODENAME</th>
                  <th>SYNAPTIC LEVEL</th>
                  <th>UNLOCKED BADGES</th>
                  <th>CUMULATIVE SCORE</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader, index) => {
                  const rank = index + 1;
                  let rankStyle = {};
                  let rankGlow = '';

                  // Special styling for podium placements
                  if (rank === 1) {
                    rankStyle = { color: 'var(--neon-blue)', fontWeight: 900, textShadow: '0 0 10px rgba(0, 240, 255, 0.6)' };
                    rankGlow = '🥇 ';
                  } else if (rank === 2) {
                    rankStyle = { color: 'var(--neon-pink)', fontWeight: 800, textShadow: '0 0 10px rgba(255, 0, 123, 0.6)' };
                    rankGlow = '🥈 ';
                  } else if (rank === 3) {
                    rankStyle = { color: 'var(--neon-violet)', fontWeight: 800, textShadow: '0 0 10px rgba(112, 0, 255, 0.6)' };
                    rankGlow = '🥉 ';
                  }

                  return (
                    <tr key={leader._id}>
                      <td style={{ ...rankStyle, fontFamily: 'var(--font-header)', fontSize: '14px' }}>
                        {rankGlow}{rank}
                      </td>
                      <td style={{ fontWeight: '600', color: rank <= 3 ? '#fff' : 'var(--text-secondary)' }}>
                        {leader.username.toUpperCase()}
                      </td>
                      <td style={{ fontFamily: 'var(--font-header)', fontSize: '12px' }}>
                        LEVEL {leader.level}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {leader.unlockedBadges && leader.unlockedBadges.length > 0 ? (
                            leader.unlockedBadges.map((badge, bIdx) => (
                              <span key={bIdx} style={{
                                fontSize: '8px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(0, 240, 255, 0.2)',
                                borderRadius: '3px',
                                padding: '2px 6px',
                                color: 'var(--neon-blue)'
                              }}>
                                {badge.toUpperCase()}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>—</span>
                          )}
                        </div>
                      </td>
                      <td style={{ fontFamily: 'var(--font-header)', fontSize: '14px', fontWeight: 'bold', color: '#fff' }}>
                        {leader.score.toLocaleString()} PTS
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
