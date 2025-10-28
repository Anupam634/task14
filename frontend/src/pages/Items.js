import React, { useEffect, useState } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
// import { FixedSizeList as List } from 'react-window'; // Virtualization skipped due to installation issues

function Items() {
  const { items, fetchItems } = useData();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  useEffect(() => {
    let active = true;

    const loadItems = async () => {
      setLoading(true);
      try {
        const result = await fetchItems({ q: search, page, limit });
        if (active) {
          setTotal(result.total);
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadItems();

    return () => {
      active = false;
    };
  }, [fetchItems, search, page, limit]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => prev - 1);

  if (loading && !items.length) return <p>Loading...</p>;



  return (
    <div>
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={handleSearch}
        style={{ marginBottom: '10px', padding: '5px' }}
      />
      {items.length > 0 ? (
        <>
          <ul style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {items.map(item => (
              <li key={item.id}>
                <Link to={`/items/${item.id}`}>{item.name}</Link>
              </li>
            ))}
          </ul>
          <div style={{ marginTop: '10px' }}>
            <button onClick={prevPage} disabled={page === 1}>Previous</button>
            <span> Page {page} of {Math.ceil(total / limit)} </span>
            <button onClick={nextPage} disabled={page >= Math.ceil(total / limit)}>Next</button>
          </div>
        </>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}

export default Items;
