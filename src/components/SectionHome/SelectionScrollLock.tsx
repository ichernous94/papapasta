'use client';
import useBodyScrollLock from '@/hooks/useBodyScrollLock';

// Lock only while the restaurant selection is mounted; restore normal pages on navigation.
export default function SelectionScrollLock() {
  useBodyScrollLock(true);
  return null;
}
