import React, { createContext, useCallback, useContext, useState } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async ({ q = '', page = 1, limit = 10 } = {}) => {
    const params = new URLSearchParams({ q, page: page.toString(), limit: limit.toString() });
    const res = await fetch(`http://localhost:3001/api/items?${params}`);
    const json = await res.json();
    setItems(json.items);
    return { total: json.total, items: json.items };
  }, []);

  return (
    <DataContext.Provider value={{ items, fetchItems }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
