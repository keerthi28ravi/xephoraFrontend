import React, { useState } from 'react';
import { supportAPI } from '../services/api';
import { playSound } from '../services/sound';

export default function HelpSupport() {
  // 1. AI Chatbot States
  const [chatLog, setChatLog] = useState([
    { id: 1, sender: 'AI_STRATEGIST', text: 'Cognitive Strategy Unit online. Transmit diagnostic queries on Simon, Decryption, or Slider arenas to calibrate operational parameters.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // 2. Support Ticket States
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('GAMEPLAY');
  const [message, setMessage] = useState('');
  const [ticketStatus, setTicketStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    playSound('click');
    const userMsg = { id: Date.now(), sender: 'OPERATOR', text: chatInput };
    setChatLog(prev => [...prev, userMsg]);
    setChatInput('');
    setChatLoading(true);

    // AI responses based on keywords
    setTimeout(() => {
      const textLower = chatInput.toLowerCase();
      let reply = 'Operational diagnostic warning: Strategic vector offsets unrecognized. Re-index cognitive query.';
      
      if (textLower.includes('simon') || textLower.includes('memory')) {
        reply = 'STRATEGY INDEX // MEMORY NEXUS: Establish static spatial node alignments. We recommend training on the 2x2 grid to cultivate spatial-auditory retention loops. Replicate illumination vectors progressively.';
      } else if (textLower.includes('decryption') || textLower.includes('logic') || textLower.includes('arena')) {
        reply = 'STRATEGY INDEX // LOGIC ARENA: Deduce pass code offsets using exclusion models. Ensure guesses have no duplicate digits (1-9). Utilize Cognitive Advisor hints to locate static evens counts or specific node inclusions.';
      } else if (textLower.includes('slider') || textLower.includes('puzzle') || textLower.includes('number')) {
        reply = 'STRATEGY INDEX // NUMBER RUSH: Scramble matrix displace vectors legally. Keep moves under 30 translations to lock the Speedrun Badge. Always organize columns sequentially starting from grid row 1.';
      } else if (textLower.includes('xp') || textLower.includes('level') || textLower.includes('badge')) {
        reply = 'METRICS INDEX // LEVEL ENGINE: Complete gaming arenas to harvest raw XP. 10,000 synaptic XP points trigger system LEVEL UP thresholds, securing premium badge unlocks on Mongoose collections.';
      }

      setChatLog(prev => [...prev, { id: Date.now() + 1, sender: 'AI_STRATEGIST', text: reply }]);
      setChatLoading(false);
      playSound('win');
    }, 1000);
  };

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    playSound('click');
    setSubmitting(true);
    setTicketStatus('');

    try {
      await supportAPI.submitTicket({
        category,
        subject,
        message
      });
      setTicketStatus('SUCCESS // TICKET ROUTED TO NET ADMIN CORES.');
      setSubject('');
      setMessage('');
      playSound('win');
    } catch (err) {
      console.error('Failed to transmit support ticket:', err);
      setTicketStatus('FAILURE // TIMEOUT RECORDED. SYSTEM RETRY REQUIRED.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="nexus-screen">
      <div className="section-header-block">
        <h2 className="neon-title">HELP & SUPPORT MATRIX</h2>
        <div className="section-subtitle">Cognitive Strategic AI Chatbot & Technical support registry</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Left Side: AI Advisor Chatbot */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '480px' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1px', marginBottom: '15px' }}>
            🧠 COGNITIVE STRATEGIST CHATBOT
          </h3>

          <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0, 0, 0, 0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '15px' }}>
            {chatLog.map(msg => (
              <div 
                key={msg.id} 
                style={{
                  alignSelf: msg.sender === 'AI_STRATEGIST' ? 'flex-start' : 'flex-end',
                  background: msg.sender === 'AI_STRATEGIST' ? 'rgba(112, 0, 255, 0.05)' : 'rgba(0, 240, 255, 0.05)',
                  border: msg.sender === 'AI_STRATEGIST' ? '1px solid rgba(112, 0, 255, 0.25)' : '1px solid rgba(0, 240, 255, 0.25)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  maxWidth: '85%'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', gap: '20px' }}>
                  <strong style={{ fontSize: '10px', color: msg.sender === 'AI_STRATEGIST' ? 'var(--neon-violet)' : 'var(--neon-blue)', fontFamily: 'var(--font-header)' }}>
                    {msg.sender}
                  </strong>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>{msg.text}</p>
              </div>
            ))}
            {chatLoading && (
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-header)', paddingLeft: '10px' }}>
                AI STRATEGIST INTERPRETING VECTOR TELEMETRY...
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Ask about Simon says, Logic code decrypting, or sliding block puzzles..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              disabled={chatLoading}
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(0, 240, 255, 0.2)',
                borderRadius: '4px',
                padding: '10px 14px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
            <button type="submit" className="cyber-btn primary mini-btn" disabled={chatLoading}>
              ASK AI
            </button>
          </form>
        </div>

        {/* Right Side: Technical Support Form */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '15px', color: '#fff', letterSpacing: '1px', marginBottom: '15px' }}>
            📩 TECHNICAL SUPPORT REGISTRY
          </h3>

          <form onSubmit={handleTicketSubmit} className="auth-form" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyGap: 'space-between' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '9px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)' }}>SUBJECT TITLE</label>
                  <input
                    type="text"
                    placeholder="e.g. System crash on slide scramble"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      borderRadius: '4px',
                      padding: '10px 14px',
                      color: '#fff',
                      fontSize: '13px'
                    }}
                  />
                </div>
                <div style={{ width: '130px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontSize: '9px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)' }}>CATEGORY</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(0, 240, 255, 0.2)',
                      borderRadius: '4px',
                      padding: '9px 12px',
                      color: '#fff',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  >
                    <option value="GAMEPLAY" style={{ background: '#110822' }}>GAMEPLAY</option>
                    <option value="BILLING" style={{ background: '#110822' }}>BILLING</option>
                    <option value="ACCESS" style={{ background: '#110822' }}>ACCESS</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontSize: '9px', fontFamily: 'var(--font-header)', color: 'var(--neon-blue)' }}>DETAILED TELEMETRY DISCREPANCY DESCRIPTION</label>
                <textarea
                  placeholder="Provide precise steps to replicate the system anomaly..."
                  rows="6"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(0, 240, 255, 0.2)',
                    borderRadius: '4px',
                    padding: '10px 14px',
                    color: '#fff',
                    fontSize: '13px',
                    resize: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button type="submit" className="cyber-btn primary full-width" disabled={submitting}>
                {submitting ? 'TRANSMITTING FILE TICKET...' : 'TRANSMIT TICKET'}
              </button>
            </div>
          </form>

          {ticketStatus && (
            <div className="game-instruction-alert" style={{ marginTop: '20px', borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)' }}>
              {ticketStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
