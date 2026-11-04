'use client';
import { BsShop } from 'react-icons/bs';
import type { ReactNode } from 'react';
import Modal from '@/components/ui/Modal';
import { FiCheck, FiCopy } from 'react-icons/fi';
import { useState } from 'react';
import styles from './Admin.module.scss';
export function AdminDialog({ title, subtitle, children, onClose, wide = false }: { title: string; subtitle?: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
    return <Modal open onClose={onClose} labelledBy="admin-dialog-title" closeLabel="Close dialog" className={`${styles.modal} ${wide ? styles.wideModal : ''}`}><header><h2 id="admin-dialog-title" data-modal-heading tabIndex={-1}>{title}</h2>{subtitle && <p className={styles.muted}>{subtitle}</p>}</header>{children}</Modal>;
}
export function RestaurantSwitch({ value, onChange }: { value: string; onChange: (id: string) => void }) {
    return <div className={styles.segment} role="group" aria-label="Restaurant">{[['papapasta', 'Papa Pasta'], ['centro', 'Centro']].map(([id, name]) => <button key={id} type="button" aria-pressed={value === id} onClick={() => onChange(id)}><BsShop aria-hidden="true"/> {name}</button>)}</div>;
}
export function Status({ active, children }: { active: boolean; children?: ReactNode }) { return <span className={`${styles.badge} ${active ? styles.active : ''}`}>● {children ?? (active ? 'Active' : 'Inactive')}</span>; }
export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
    const [status, setStatus] = useState('');
    return <><button type="button" className={styles.iconButton} aria-label={label} title={label} onClick={async () => { try { await navigator.clipboard.writeText(value); setStatus('Copied'); } catch { setStatus('Copy failed. Select and copy the text manually.'); } }}>{status === 'Copied' ? <FiCheck /> : <FiCopy />}</button><span className={styles.srOnly} role="status">{status}</span></>;
}
