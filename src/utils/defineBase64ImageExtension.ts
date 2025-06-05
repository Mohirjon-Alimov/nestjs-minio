export function defineBase64ImageExtension(str: string): string | null {
  if (!str) throw new Error('Encoded image required');

  const signatures = {
    '/9j/4': 'jpg',
    UklGR: 'png',
    '89504E47': 'png',
    iVBORw0KGgo: 'png',
    '89504E470D0A1A0A': 'png',
    R0lGODlh: 'gif',
    '47494638': 'gif',
    FFD8FFDB: 'jpeg',
    FFD8FFE0: 'jpeg',
    FFD8FFE1: 'jpeg',
    FFD8FFE2: 'jpeg',
    FFD8FFE3: 'jpeg',
    FFD8FFE8: 'jpeg',
    FFD8FFEE: 'jpeg',
    '3C3F786D6C': 'svg',
    PD94bWw: 'svg',
    PHN2Z: 'svg',
    PHNjcmlwdD: 'svg',
  };

  for (const signature in signatures) {
    if (str.startsWith(signature)) {
      return signatures[signature];
    }
  }
  return null;
}
