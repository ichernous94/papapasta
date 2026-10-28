import Loader from '@/components/ui/Loader';
import { Fragment } from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Fragment>
      <Loader />
      {children}
    </Fragment>
  );
}
