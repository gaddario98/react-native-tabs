import { useEffect, useState } from "react";

let activeTabName = "";
const listeners: Array<(name: string) => void> = [];

export const setActiveTabName = (name: string) => {
  activeTabName = name;
  listeners.forEach((cb) => cb(name));
};

export const useActiveTab = <T extends string>() => {
  const [tab, setTab] = useState<T>(activeTabName as T);

  useEffect(() => {
    const cb = (name: string) => setTab(name as T);
    listeners.push(cb);
    return () => {
      const idx = listeners.indexOf(cb);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }, []);

  return tab;
};
