import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'os_accelerator_v1';

export function useProject() {
  const [project, setProject] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProject(JSON.parse(raw));
    } catch (_) {}
    setLoaded(true);
  }, []);

  const save = useCallback((data) => {
    setProject(data);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }, []);

  return { project, save, loaded };
}
