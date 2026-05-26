'use client';

import React, { useEffect, useState } from 'react';
import { ContactMessage } from '@/lib/types';
import styles from './page.module.css';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

  useEffect(() => {
    fetch('/api/contact')
      .then(r => r.json())
      .then(d => d.success && setMessages(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/contact/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setMessages(prev => prev.map(m => m.id === id ? { ...m, status: status as ContactMessage['status'] } : m));
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const filtered = filter === 'all' ? messages : messages.filter(m => m.status === filter);

  const statusBadge = {
    new: <span className="badge badge-danger">New</span>,
    read: <span className="badge badge-navy">Read</span>,
    replied: <span className="badge badge-success">Replied</span>,
  };

  const counts = {
    all: messages.length,
    new: messages.filter(m => m.status === 'new').length,
    read: messages.filter(m => m.status === 'read').length,
    replied: messages.filter(m => m.status === 'replied').length,
  };

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <h1 className={styles.pageTitle}>Contact Messages</h1>
          <p className={styles.pageDesc}>{messages.length} total messages</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {(['all', 'new', 'read', 'replied'] as const).map(f => (
          <button
            key={f}
            className={`${styles.tab} ${filter === f ? styles.activeTab : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            <span className={styles.tabCount}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-center" style={{ minHeight: 200 }}>
          <div className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>No messages found.</div>
      ) : (
        <div className={styles.messagesList}>
          {filtered.map(msg => (
            <div key={msg.id} className={`${styles.messageCard} ${msg.status === 'new' ? styles.isNew : ''}`}>
              <div className={styles.msgHeader}>
                <div className={styles.msgMeta}>
                  <span className={styles.msgName}>{msg.name}</span>
                  <span className={styles.msgPhone}>
                    <a href={`tel:${msg.phone}`}>{msg.phone}</a>
                  </span>
                  {msg.email && (
                    <span className={styles.msgEmail}>
                      <a href={`mailto:${msg.email}`}>{msg.email}</a>
                    </span>
                  )}
                </div>
                <div className={styles.msgRight}>
                  {statusBadge[msg.status]}
                  <span className={styles.msgDate}>
                    {new Date(msg.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <p className={styles.msgBody}>{msg.message}</p>
              <div className={styles.msgActions}>
                {msg.status !== 'read' && msg.status !== 'replied' && (
                  <button onClick={() => updateStatus(msg.id, 'read')} className="btn btn-sm btn-secondary">
                    Mark Read
                  </button>
                )}
                {msg.status !== 'replied' && (
                  <button onClick={() => updateStatus(msg.id, 'replied')} className="btn btn-sm btn-navy-light">
                    Mark Replied
                  </button>
                )}
                <a href={`tel:${msg.phone}`} className="btn btn-sm btn-secondary">
                  📞 Call
                </a>
                {msg.email && (
                  <a href={`mailto:${msg.email}`} className="btn btn-sm btn-secondary">
                    ✉️ Email
                  </a>
                )}
                <button onClick={() => deleteMessage(msg.id)} className="btn btn-sm btn-danger" id={`deleteMsg-${msg.id}`}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
