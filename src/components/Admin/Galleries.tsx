'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Image from '@/components/ui/PhotoImage';
import type { RestaurantGallery, GalleryEntry, RestaurantId } from '@/types/content';
import { saveGalleryAction, changeGalleryAction } from '@/server/content/site-actions';
import { AdminDialog, RestaurantSwitch, Status } from './Controls';
import ContentImagePicker from './ContentImagePicker';
import styles from './Admin.module.scss';
function PhotoForm({ gallery, item, available, onClose, onSaved }: { gallery: RestaurantGallery; item?: GalleryEntry; available: boolean; onClose: () => void; onSaved: () => void }) {
  const [file,setFile] = useState<File | null>(null);
  const [pending,setPending] = useState(false);
  const [dirty,setDirty] = useState(false);
  const [error,setError] = useState('');
  function close() { if(!pending && (!dirty || window.confirm('Discard unsaved changes?'))) onClose(); }
  return <AdminDialog title={item ? 'Edit Photo' : 'Add Photo'} onClose={close}><form className={styles.form} onChange={() => setDirty(true)} onSubmit={async e => {
    e.preventDefault();setPending(true);setError('');const data=new FormData(e.currentTarget);const upload=new FormData();if(file) upload.set('image',file);
    try { const response=await saveGalleryAction({restaurantId:gallery.restaurantId,version:gallery.version,id:item?.id,alt:data.get('alt'),visible:data.get('visible')==='on'},upload);if(response.error) setError(response.error);else onSaved(); } catch {setError('Could not save. Your changes remain in the form.');} finally {setPending(false);}
  }}><fieldset disabled={pending} className={styles.form}><ContentImagePicker image={item?.image} available={available} pending={pending} onChange={next => {setFile(next);setDirty(true);}}/><label>Image description *<input name="alt" required maxLength={300} defaultValue={item?.alt}/></label><label className={styles.check}><input type="checkbox" name="visible" defaultChecked={item?.visible ?? true}/>Visible</label></fieldset>{error && <p role="alert" className={styles.error}>{error}</p>}<footer className={styles.footer}><button type="button" className={styles.secondary} disabled={pending} onClick={close}>Cancel</button><button disabled={pending || (!item && !file)}>{pending?'Saving…':'Save Photo'}</button></footer></form></AdminDialog>;
}
export default function Galleries({ galleries, storageAvailable }: { galleries: RestaurantGallery[]; storageAvailable: boolean }) {
  const router=useRouter();
  const [restaurant,setRestaurant]=useState<RestaurantId>('papapasta');
  const [editing,setEditing]=useState<{gallery:RestaurantGallery;item?:GalleryEntry}|null>(null);
  const [pending,setPending]=useState(false);
  const [error,setError]=useState('');
  const [message,setMessage]=useState('');
  const gallery=galleries.find(g=>g.restaurantId===restaurant)!;
  async function change(item:GalleryEntry,action:'up'|'down'|'delete') {
    if(pending || (action==='delete' && !window.confirm('Delete this gallery photo?'))) return;
    setPending(true);setError('');setMessage('');
    try { const response=await changeGalleryAction({restaurantId:restaurant,version:gallery.version,id:item.id,action});if(response.error)setError(response.error);else {setMessage('Gallery updated.');router.refresh();} } catch {setError('Could not update gallery.');}finally{setPending(false);}
  }
  return <><header className={styles.pageHeader}><div><h1>Gallery</h1><p>Shared photo carousel on restaurant pages</p></div><RestaurantSwitch value={restaurant} onChange={id=>{if(!pending){setRestaurant(id as RestaurantId);setError('');setMessage('');}}}/><button type="button" disabled={pending || !storageAvailable} onClick={()=>setEditing({gallery})}><FiPlus/>Add Photo</button></header>{!storageAvailable && <p className={styles.muted}>Uploads are unavailable. You can edit descriptions, visibility and order.</p>}{error && <p role="alert" className={styles.error}>{error}</p>}{message && <p role="status" className={styles.success}>{message}</p>}<div className={styles.tableWrap} aria-busy={pending}><table className={styles.table}><thead><tr><th>Photo</th><th>Status</th><th>Actions</th></tr></thead><tbody>{gallery.images.map((item,index)=><tr key={item.id}><td><div className={styles.dish}>{item.image && <Image src={item.image.src} width={90} height={65} alt={item.alt}/>}<strong>{item.alt}</strong></div></td><td><Status active={item.visible}/></td><td><div className={styles.actions}><button type="button" className={styles.iconButton} aria-label={`Move ${item.alt} up`} disabled={pending||index===0} onClick={()=>void change(item,'up')}><FiArrowUp/></button><button type="button" className={styles.iconButton} aria-label={`Move ${item.alt} down`} disabled={pending||index===gallery.images.length-1} onClick={()=>void change(item,'down')}><FiArrowDown/></button><button type="button" className={styles.iconButton} aria-label={`Edit ${item.alt}`} disabled={pending} onClick={()=>setEditing({gallery,item})}><FiEdit2/></button><button type="button" className={`${styles.iconButton} ${styles.danger}`} aria-label={`Delete ${item.alt}`} disabled={pending} onClick={()=>void change(item,'delete')}><FiTrash2/></button></div></td></tr>)}</tbody></table>{!gallery.images.length && <p className={styles.empty}>No photos. The public carousel is hidden.</p>}</div>{editing && <PhotoForm {...editing} available={storageAvailable} onClose={()=>setEditing(null)} onSaved={()=>{setEditing(null);setError('');setMessage('Photo saved.');router.refresh();}}/>}</>;
}
