import { useEffect, useState } from 'react';

export const useLocalStorage = (
  key: string,
  initialValue = ''
) => {
  const [value, setValue] = useState(() => {
    return (
      localStorage.getItem(key) ||
      initialValue
    );
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};