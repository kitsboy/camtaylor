import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({ name: '', org: '', email: '', details: '', dealSize: '$100K - $1M' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.details) return;

    setLoading(true);

    // Simulate premium transmission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const dealSizes = ['<$100K', '$100K - $1M', '$1M - $5M', '$5M+'];

  return (
    <section className="contact-section" id="contact">
      <div className="section-header">
        <h2 className="section-title text-gradient">SECURE PORTAL</h2>
        <p className="section-subtitle">Establish a secure pipeline for capital allocation, deal advisories, and strategic partnerships.</p>
      </div>

      <div className="contact-container">
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.form 
              key="contact-form"
              onSubmit={handleSubmit} 
              className="contact-form glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="form-input"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="org" className="form-label">Organization / Entity</label>
                  <input
                    id="org"
                    type="text"
                    className="form-input"
                    value={form.org}
                    onChange={(e) => setForm({ ...form, org: e.target.value })}
                    placeholder="Entity name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Secure Email Endpoint</label>
                <input
                  id="email"
                  type="email"
                  required
                  className="form-input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@domain.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scale of Leverage / Deal Size</label>
                <div className="deal-size-selector">
                  {dealSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`deal-size-btn ${form.dealSize === size ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, dealSize: size })}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="details" className="form-label">Brief Deal / Venture Details</label>
                <textarea
                  id="details"
                  required
                  rows={4}
                  className="form-textarea"
                  value={form.details}
                  onChange={(e) => setForm({ ...form, details: e.target.value })}
                  placeholder="Outline the structure, core assets, and objective..."
                />
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner">Encrypting...</span>
                ) : (
                  <>
                    <span>Transmit Secure Signal</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              className="contact-success glass"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <CheckCircle2 className="success-icon" size={48} />
              <h3 className="success-title">TRANSMISSION SECURED</h3>
              <p className="success-message">
                Your connection request has been encrypted and routed. The agent will assess the transaction terms and establish contact if alignment exists.
              </p>
              <div className="success-details">
                <div className="details-row">
                  <span>Routing Code:</span>
                  <code>CTVA-{Math.floor(Math.random() * 90000) + 10000}</code>
                </div>
                <div className="details-row">
                  <span>Target Node:</span>
                  <span>camtaylor.ca</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: '', org: '', email: '', details: '', dealSize: '$100K - $1M' });
                }} 
                className="btn-reset"
              >
                Open New Pipeline
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="contact-sidebar">
          <div className="sidebar-card glass">
            <ShieldAlert className="sidebar-icon" size={24} />
            <h4 className="sidebar-title">Pipeline Protocols</h4>
            <ul className="sidebar-list">
              <li>All inbound proposals are held under strict confidentiality.</li>
              <li>Priority routing is given to ventures with active technical or structural leverage.</li>
              <li>Direct endpoint for verified partners: <a href="mailto:cam@camtaylor.ca" className="secure-mail-link">cam@camtaylor.ca</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
