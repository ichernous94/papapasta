'use client';
import ImageFileInput from './ImageFileInput';
import { useEffect, useRef, useState } from 'react';
import Image from '@/components/ui/PhotoImage';
import type { DishImage } from '@/types/menu';
import styles from './Admin.module.scss';
export default function ContentImagePicker({ image, available, pending, removable = false, onChange }: { image?: DishImage; available: boolean; pending: boolean; removable?: boolean; onChange: (file: File | null, remove: boolean) => void }) {
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
  return <fieldset disabled={pending}><legend>Image</legend><div className={styles.upload} onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); choose(e.dataTransfer.files[0]); }}><ImageFileInput ref={input} accept="image/jpeg,image/png,image/webp" disabled={!available} onChange={e => choose(e.target.files?.[0])} filename={filename} label="Upload or replace image"/><small>JPEG, PNG or WebP, up to 5 MB</small>{!available && <p>Uploads are unavailable. Existing images and text editing remain available.</p>}</div>{(preview || (!removed && image)) && <><Image unoptimized={!!preview} src={preview || image!.src} width={320} height={200} alt="Image preview" style={{ maxWidth:'100%', height:'auto' }}/>{removable && <button type="button" className={styles.secondary} onClick={() => { if (url.current) URL.revokeObjectURL(url.current); url.current=''; setPreview(''); setFilename(''); setRemoved(true); if(input.current) input.current.value=''; onChange(null,true); }}>Remove image</button>}</>}{error && <p role="alert" className={styles.error}>{error}</p>}</fieldset>;
}
