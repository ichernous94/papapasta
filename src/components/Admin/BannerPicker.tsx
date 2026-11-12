'use client';
import ImageFileInput from './ImageFileInput';
import { useEffect, useRef, useState } from 'react';
import Image from '@/components/ui/PhotoImage';
import { FiUploadCloud } from 'react-icons/fi';
import type { EditorMenu } from '@/types/admin';
import styles from './Admin.module.scss';

export default function BannerPicker({ menu, available, pending, onChange }: { menu: Pick<EditorMenu, 'bannerImage'>; available: boolean; pending: boolean; onChange: (file: File | null, remove: boolean) => void }) {
  const [preview, setPreview] = useState('');
  const [filename, setFilename] = useState('');
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState('');
  const url = useRef('');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => () => { if (url.current) URL.revokeObjectURL(url.current); }, []);
  function choose(file?: File) {
    if (!file || pending || !available) return;
    if (file.size > 5 * 1024 * 1024 || !['image/jpeg','image/png','image/webp'].includes(file.type)) { setError('Choose a JPEG, PNG or WebP image up to 5 MB.'); return; }
    if (url.current) URL.revokeObjectURL(url.current);
    url.current = URL.createObjectURL(file); setPreview(url.current); setFilename(file.name); setRemoved(false); setError(''); onChange(file, false);
  }
  return <fieldset disabled={pending}><legend>Banner image</legend><div className={styles.upload} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); choose(e.dataTransfer.files[0]); }}><FiUploadCloud/><ImageFileInput ref={input} accept="image/jpeg,image/png,image/webp" disabled={!available || pending} onChange={e => choose(e.target.files?.[0])} filename={filename} label="Click to upload or drag and drop"/><small>JPG, PNG or WebP (max. 5 MB)</small>{!available && <p>Image uploads are unavailable. You can still edit section details.</p>}</div>{(preview || (!removed && menu.bannerImage)) && <><Image unoptimized={!!preview} src={preview || menu.bannerImage!.src} alt="Banner preview" width={320} height={160} style={{ maxWidth:'100%', height:'auto' }}/><button className={styles.secondary} type="button" onClick={() => { if (!window.confirm('Restore the default banner image?')) return; if (url.current) URL.revokeObjectURL(url.current); url.current=''; if (input.current) input.current.value=''; setPreview(''); setFilename(''); setRemoved(true); onChange(null,true); }}>Restore default image</button></>}{removed && <p>The default section image will be restored when you save.</p>}{!preview && !menu.bannerImage && <p>The default section image is in use.</p>}{error && <p role="alert" className={styles.error}>{error}</p>}</fieldset>;
}
