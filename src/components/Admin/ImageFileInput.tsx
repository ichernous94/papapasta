'use client';
import { forwardRef, type InputHTMLAttributes } from 'react';
import styles from './Admin.module.scss';

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & { filename?: string; label?: string };
const ImageFileInput = forwardRef<HTMLInputElement, Props>(function ImageFileInput({ filename, label = 'Click to upload or drag and drop', ...props }, ref) {
  return <label className={styles.uploadLabel}><span>{label}</span><span className={styles.fileControl}><span className={styles.fileButton}>Choose file</span><span className={styles.fileName}>{filename || 'No file selected'}</span></span><input {...props} ref={ref} className={styles.srOnly} type="file"/></label>;
});
export default ImageFileInput;
