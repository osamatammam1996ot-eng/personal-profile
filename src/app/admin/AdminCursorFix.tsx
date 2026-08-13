'use client';

import { useEffect } from 'react';

export function AdminCursorFix() {
  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, []);

  return null;
}
