'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Image from '@/components/ui/PhotoImage';
import type { Promotion, ArticleBlock } from '@/types/content';
import { promotionPath } from '@/types/content';
import { savePromotionAction, deletePromotionAction } from '@/server/content/site-actions';
import { AdminDialog, Status } from './Controls';
import ContentImagePicker from './ContentImagePicker';
import styles from './Admin.module.scss';
function PromotionForm({ item, available, onClose, onSaved }: { item?: Promotion; available: boolean; onClose: () => void; onSaved: () => void }) {
  const [blocks, setBlocks] = useState(() => (item?.body ?? []).map((block, index) => ({ ...block, key: String(index) })));
  const [file, setFile] = useState<File | null>(null);
  const [remove, setRemove] = useState(false);
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  function close() { if (!pending && (!dirty || window.confirm('Discard unsaved changes?'))) onClose(); }
  function move(index: number, direction: number) { setDirty(true); setBlocks(old => { const next = [...old]; [next[index],next[index + direction]] = [next[index + direction],next[index]]; return next; }); }
  return <AdminDialog title={item ? 'Edit Promotion' : 'Add Promotion'} subtitle="Centro — card and article" onClose={close} wide><form className={styles.form} onChange={() => setDirty(true)} onSubmit={async e => {
    e.preventDefault(); setPending(true); setError(''); const data = new FormData(e.currentTarget); const upload = new FormData(); if (file) upload.set('image',file);
    try {
      const response = await savePromotionAction({ id:item?.id, version:item?.version, title:data.get('title'), date:data.get('date'), imageAlt:data.get('imageAlt'), body:blocks.map(({type,text}) => ({type,text})), published:data.get('published') === 'on', removeImage:remove }, upload);
      if (response.error) setError(response.error); else onSaved();
    } catch { setError('Could not save. Your changes remain in the form.'); } finally { setPending(false); }
  }}><fieldset disabled={pending} className={styles.form}><label>Title *<input name="title" required maxLength={200} defaultValue={item?.title}/></label><label>Date *<input type="date" name="date" required defaultValue={item?.date ?? new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Warsaw',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}/></label><ContentImagePicker image={item?.image} available={available} pending={pending} removable onChange={(next, removed) => { setFile(next); setRemove(removed); setDirty(true); }}/><label>Image description<input name="imageAlt" maxLength={300} defaultValue={item?.imageAlt}/></label><fieldset><legend>Article blocks</legend><p className={styles.muted}>List: one entry per line. Text is displayed as text; HTML is not executed.</p>{blocks.map((block,index) => <fieldset key={block.key} className={styles.contentBlock}><div className={styles.actions}><label>Block {index+1}<select value={block.type} onChange={e => setBlocks(old => old.map((b,i) => i === index ? {...b,type:e.target.value as ArticleBlock['type']} : b))}><option value="paragraph">Paragraph</option><option value="heading">Subheading</option><option value="list">List</option></select></label><button type="button" className={styles.iconButton} aria-label={`Move block ${index+1} up`} disabled={index===0} onClick={() => move(index,-1)}><FiArrowUp/></button><button type="button" className={styles.iconButton} aria-label={`Move block ${index+1} down`} disabled={index===blocks.length-1} onClick={() => move(index,1)}><FiArrowDown/></button><button type="button" className={styles.iconButton} aria-label={`Delete block ${index+1}`} onClick={() => { setBlocks(old => old.filter((_,i) => i!==index)); setDirty(true); }}><FiTrash2/></button></div><label>Text<textarea value={block.text} maxLength={6000} onChange={e => setBlocks(old => old.map((b,i) => i === index ? {...b,text:e.target.value} : b))}/></label></fieldset>)}<button type="button" className={styles.secondary} disabled={blocks.length >= 100} onClick={() => { setBlocks(old => [...old,{ key:crypto.randomUUID(),type:'paragraph',text:'' }]); setDirty(true); }}><FiPlus/>Add block</button></fieldset><label className={styles.check}><input type="checkbox" name="published" defaultChecked={item?.published ?? false}/>Published</label><p className={styles.muted}>Publishing requires a title, an image and article text. Drafts are hidden from the public site.</p></fieldset>{error && <p role="alert" className={styles.error}>{error}</p>}<footer className={styles.footer}><button type="button" className={styles.secondary} disabled={pending} onClick={close}>Cancel</button><button disabled={pending}>{pending ? 'Saving…' : 'Save Promotion'}</button></footer></form></AdminDialog>;
}
export default function Promotions({ items, storageAvailable }: { items: Promotion[]; storageAvailable: boolean }) {
  const router = useRouter();
  const [editing,setEditing] = useState<Promotion | 'new' | null>(null);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const [message,setMessage] = useState('');
  return <><header className={styles.pageHeader}><div><h1>Promotion</h1><p>Centro — promotions and articles</p></div><button type="button" disabled={pending} onClick={() => setEditing('new')}><FiPlus/>Add Promotion</button></header>{error && <p role="alert" className={styles.error}>{error}</p>}{message && <p role="status" className={styles.success}>{message}</p>}<div className={styles.tableWrap} aria-busy={pending}><table className={styles.table}><thead><tr><th>Promotion</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{items.map(item => <tr key={item.id}><td><div className={styles.dish}>{item.image && <Image src={item.image.src} width={68} height={52} alt={item.image.alt}/>}<div><strong>{item.title}</strong><p>{promotionPath(item)}</p></div></div></td><td>{item.date}</td><td><Status active={item.published}>{item.published ? 'Published' : 'Draft'}</Status></td><td><div className={styles.actions}><button type="button" className={styles.iconButton} aria-label={`Edit ${item.title}`} disabled={pending} onClick={() => setEditing(item)}><FiEdit2/></button><button type="button" className={`${styles.iconButton} ${styles.danger}`} aria-label={`Delete ${item.title}`} disabled={pending} onClick={async () => {
    if (!window.confirm(`Delete ${item.title}? This cannot be undone.`)) return;
    setPending(true); setError(''); setMessage('');
    try { const response = await deletePromotionAction({id:item.id,version:item.version}); if(response.error) setError(response.error); else { setMessage('Promotion deleted.'); router.refresh(); } } catch { setError('Could not delete promotion.'); } finally { setPending(false); }
  }}><FiTrash2/></button></div></td></tr>)}</tbody></table>{!items.length && <p className={styles.empty}>No promotions. Add the first card.</p>}</div>{editing && <PromotionForm item={editing === 'new' ? undefined : editing} available={storageAvailable} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); setMessage('Promotion saved.'); setError(''); router.refresh(); }}/>}</>;
}
