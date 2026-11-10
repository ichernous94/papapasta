'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from '@/components/ui/PhotoImage';
import type { PromotionPopup } from '@/types/content';
import { savePromotionPopupAction } from '@/server/content/site-actions';
import { AdminDialog, Status } from './Controls';
import ContentImagePicker from './ContentImagePicker';
import styles from './Admin.module.scss';

function PopupForm({ popup, available, onClose, onSaved }: { popup: PromotionPopup; available: boolean; onClose: () => void; onSaved: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [remove, setRemove] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  function close() { if (!pending && (!dirty || window.confirm('Discard unsaved changes?'))) onClose(); }
  return <AdminDialog title="Edit promotion popup" subtitle="Centro — poster shown when a visitor opens the site" onClose={close}>
    <form className={styles.form} onChange={() => setDirty(true)} onSubmit={async event => {
      event.preventDefault(); setPending(true); setError('');
      const data = new FormData(event.currentTarget), upload = new FormData();
      if (file) upload.set('image', file);
      try {
        const response = await savePromotionPopupAction({ version: popup.version, title: data.get('title'), imageAlt: data.get('imageAlt'),
          description: data.get('description'), enabled: data.get('enabled') === 'on', removeImage: remove,
        }, upload);
        if (response.error) setError(response.error); else onSaved();
      } catch { setError('Could not save. Your changes remain in the form.'); } finally { setPending(false); }
    }}>
      <fieldset className={styles.form} disabled={pending}>
        <label>Title *<input name="title" required maxLength={200} defaultValue={popup.title}/></label>
        <ContentImagePicker image={popup.image} available={available} pending={pending} removable onChange={(next, removed) => { setFile(next); setRemove(removed); setDirty(true); }}/>
        <label>Image description<input name="imageAlt" maxLength={300} defaultValue={popup.imageAlt}/></label>
        <label>Poster text alternative<textarea name="description" rows={8} maxLength={6000} defaultValue={popup.description}/></label>
        <p className={styles.muted}>Describe the text on the poster for screen readers. An enabled popup requires an image and a text alternative.</p>
        <label className={styles.check}><input type="checkbox" name="enabled" defaultChecked={popup.enabled}/>Show popup</label>
      </fieldset>
      {error && <p role="alert" className={styles.error}>{error}</p>}
      <footer className={styles.footer}><button type="button" className={styles.secondary} disabled={pending} onClick={close}>Cancel</button><button disabled={pending}>{pending ? 'Saving…' : 'Save Popup'}</button></footer>
    </form>
  </AdminDialog>;
}
export default function PromotionPopupEditor({ popup, available }: { popup: PromotionPopup | null; available: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState<PromotionPopup | null>(null);
  const [saved, setSaved] = useState(false);
  return <section className={`${styles.card} ${styles.popupSettings}`} aria-label="Centro promotion popup">
    <div className={styles.pageHeader}><div><h2>Promotion popup</h2><p>Centro — separate from promotion cards and articles</p></div><button type="button" disabled={!popup} onClick={() => { setEditing(popup); setSaved(false); }}>Edit popup</button></div>
    {popup ? <div className={styles.dish}>{popup.image && <Image src={popup.image.src} width={70} height={100} alt={popup.imageAlt} style={{objectFit:'contain'}}/>}<div><strong>{popup.title}</strong><p><Status active={popup.enabled}>{popup.enabled ? 'Enabled' : 'Disabled'}</Status></p></div></div> : <p role="alert">Popup settings are not initialized. Run migrations and db:seed.</p>}
    {saved && <p role="status" className={styles.success}>Popup saved.</p>}
    {editing && <PopupForm popup={editing} available={available} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setSaved(true); router.refresh(); }}/>} 
  </section>;
}
