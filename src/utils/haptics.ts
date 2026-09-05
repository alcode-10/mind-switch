// Mobile haptic vibration helper

export function triggerHaptic(type: 'light' | 'success' | 'error') {
  if (typeof window === 'undefined' || !navigator.vibrate) return;
  try {
    if (type === 'light') {
      navigator.vibrate(10);
    } else if (type === 'success') {
      navigator.vibrate([15, 30, 20]);
    } else if (type === 'error') {
      navigator.vibrate([40, 40, 40]);
    }
  } catch {
    // Ignore lack of permissions or unsupported browser
  }
}
