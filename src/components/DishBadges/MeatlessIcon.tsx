import { useId } from 'react';

/** Crossed-out steak, shared by public dish badges and the admin picker. */
export default function MeatlessIcon({ className }: { className?: string }) {
  const cutoutId = `meatless-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return <svg viewBox="0 0 160 160" width="1em" height="1em" fill="none" color="#397322" className={className} aria-hidden="true" focusable="false">
    <defs>
      <mask id={cutoutId} maskUnits="userSpaceOnUse" x="0" y="0" width="160" height="160">
        <rect width="160" height="160" fill="#fff"/>
        <path d="M34 34 126 126" stroke="#000" strokeWidth="14"/>
      </mask>
    </defs>
    <path mask={`url(#${cutoutId})`} fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M34 76C36 64 45 56 57 58C72 62 83 56 96 51C107 46 119 49 123 57C130 73 117 89 103 99C85 112 60 113 44 106C33 101 30 89 34 76Z M115 56C115 52 109 52 106 54C100 58 103 63 108 62C112 61 115 59 115 56Z M35 79C39 70 47 73 54 77C60 80 65 77 70 79C78 82 84 88 94 87C105 86 115 79 121 70L119 76C113 87 102 92 91 91C80 91 75 84 69 83C62 82 58 85 51 81C44 77 39 75 36 82Z M34 88C38 99 54 103 66 101C74 102 81 98 87 96L91 100C82 107 67 110 53 107C42 105 35 100 33 94Z"/>
    <circle cx="80" cy="80" r="65" stroke="currentColor" strokeWidth="6"/>
    <path d="M34 34 126 126" stroke="currentColor" strokeWidth="6"/>
  </svg>;
}
