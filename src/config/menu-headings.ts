// Initial banner copy only. Published dishes always come from PostgreSQL.
export const menuHeadings = {
  papapasta: {
    main: { title: 'MENU GŁÓWNE', subtitle: 'specjalności lokalu' },
    autumn: { title: 'MENU JESIENNE', subtitle: 'Sapori d’Autunno' },
    kids: { title: 'MENU', subtitle: 'bambini' },
    wine: { title: 'WINO', subtitle: 'i inne alkohole' },
    recommendations: { title: 'Z CAŁEGO SERCA', subtitle: 'polecamy' },
  },
  centro: {
    main: { title: 'MENU GŁÓWNE', subtitle: 'specjalności lokalu' },
    breakfast: { title: 'MENU ŚNIADAŃ', subtitle: '' },
    autumn: { title: 'JESIENNE SMAKI', subtitle: 'Sapori d’Autunno' },
    kids: { title: 'MENU', subtitle: 'bambini' },
    recommendations: { title: 'Z CAŁEGO SERCA', subtitle: 'polecamy' },
  },
} as const;
