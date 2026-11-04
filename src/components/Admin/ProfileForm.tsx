'use client';
import { useState } from 'react';
import { updateProfileAction } from '@/server/auth/user-actions';
import styles from './Admin.module.scss';
export default function ProfileForm({ name, email }: { name:string; email:string }) {
    const [pending,setPending] = useState(false); const [message,setMessage] = useState('');
    return <form className={styles.form} onSubmit={async e => { e.preventDefault(); setPending(true); const form = new FormData(e.currentTarget); try { const result = await updateProfileAction({ name:form.get('name') }); setMessage(result.error || 'Profile updated.'); } catch { setMessage('Could not update profile.'); } finally { setPending(false); } }}><label>Email<input type="email" value={email} readOnly/></label><label>Full Name<input name="name" defaultValue={name} required maxLength={120}/></label><button disabled={pending}>Save Changes</button>{message && <p role="status">{message}</p>}</form>;
}
