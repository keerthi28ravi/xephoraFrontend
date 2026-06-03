import React, { useEffect, useState } from 'react';
import { adminAPI } from '../services/api';
import { playSound } from '../services/sound';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('ADMINISTRATIVE MATRIX STABLE.');

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to download operator database:', err);
      setStatusMsg('FAIL // ACCESS REFUSED OR SERVER ERROR.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    playSound('click');
    setStatusMsg(`UPDATING OPERATOR ROLE TO ${newRole}...`);

    try {
      await adminAPI.updateRole(userId, newRole);
      setStatusMsg(`ROLE UPDATED SUCCESSFULLY.`);
      fetchUsers();
      playSound('win');
    } catch (err) {
      console.error('Failed to adjust role:', err);
      setStatusMsg('FAILURE // RE-HANDSHAKE REQUIRED.');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    playSound('click');
    const confirmDelete = window.confirm(`WARNING // ARE YOU SURE YOU WANT TO PERMANENTLY REMOVE OPERATOR [${username.toUpperCase()}]? THIS CANNOT BE UNDONE.`);
    
    if (!confirmDelete) return;

    setStatusMsg(`DELETING OPERATOR ${username.toUpperCase()}...`);
    try {
      await adminAPI.deleteUser(userId);
      setStatusMsg(`OPERATOR ${username.toUpperCase()} EXPELLED FROM DATABASE.`);
      fetchUsers();
      playSound('fail');
    } catch (err) {
      console.error('Failed to expunge user:', err);
      setStatusMsg('FAILURE // RETRANSMITTING DELETION DECREE.');
    }
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">ADMINISTRATIVE MATRIX</h2>
        <div className="section-subtitle">Manage registered operator accounts and access credentials</div>
      </div>

      <div className="glass-card" style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '15px' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1.5px' }}>
            OPERATOR MANAGEMENT REGISTRY ({users.length} Installed)
          </h3>
          <span style={{ 
            fontFamily: 'var(--font-header)', 
            fontSize: '9px', 
            color: 'var(--neon-pink)', 
            background: 'rgba(255, 0, 123, 0.08)',
            padding: '4px 10px',
            borderRadius: '3px',
            letterSpacing: '1px'
          }}>
            SYSTEM: {statusMsg.toUpperCase()}
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            DOWNLOADING MAINFRAME DIRECTORIES...
          </div>
        ) : users.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-header)', letterSpacing: '1px' }}>
            NO REGISTERED OPERATORS FOUND.
          </div>
        ) : (
          <div className="lobby-table-wrapper">
            <table className="cyber-table">
              <thead>
                <tr>
                  <th>CODENAME</th>
                  <th>EMAIL ADDRESS</th>
                  <th>SYNAPTIC LEVEL</th>
                  <th>TOTAL SCORE</th>
                  <th>ROLE PERMISSION</th>
                  <th>MAINFRAME EXPULSION</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userObj) => (
                  <tr key={userObj._id}>
                    <td style={{ fontWeight: '600', color: '#fff' }}>
                      {userObj.username.toUpperCase()}
                    </td>
                    <td>{userObj.email}</td>
                    <td style={{ fontFamily: 'var(--font-header)', fontSize: '12px' }}>
                      LEVEL {userObj.level}
                    </td>
                    <td style={{ fontFamily: 'var(--font-header)', fontSize: '13px', color: 'var(--neon-blue)' }}>
                      {userObj.score?.toLocaleString() || 0} PTS
                    </td>
                    <td>
                      <select
                        value={userObj.role}
                        onChange={(e) => handleRoleChange(userObj._id, e.target.value)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(0, 240, 255, 0.2)',
                          borderRadius: '4px',
                          padding: '6px 10px',
                          color: '#fff',
                          fontSize: '12px',
                          outline: 'none'
                        }}
                      >
                        <option value="USER" style={{ background: '#110822' }}>USER</option>
                        <option value="ADMIN" style={{ background: '#110822' }}>ADMIN</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="cyber-btn primary mini-btn"
                        style={{ background: 'rgba(255, 0, 123, 0.1)', border: '1px solid var(--neon-pink)', color: 'var(--neon-pink)' }}
                        onClick={() => handleDeleteUser(userObj._id, userObj.username)}
                      >
                        EXPUNGE
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
