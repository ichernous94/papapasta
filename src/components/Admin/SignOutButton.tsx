'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
export default function SignOutButton() { const router=useRouter(); const [error,setError]=useState(''); return <><button type="button" onClick={async () => { try { const r=await authClient.signOut(); if(r.error) throw new Error(); router.replace('/login'); router.refresh(); } catch { setError('Could not sign out. Try again.'); } }}>Sign Out</button>{error && <p role="alert">{error}</p>}</>; }
