// src/hooks/useInfiniteScroll.js
import { useEffect, useRef, useState } from "react";

export default function useInfiniteScroll(fetchFn, deps = []) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [end, setEnd] = useState(false);
  const loader = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFn(page);

        // Handle different response formats:
        // 1. Direct array: [item1, item2, ...]
        // 2. Object with array property: { blogs: [...], pagination: {...} }
        // 3. Object with items property: { items: [...], pagination: {...} }
        let itemsArray = [];

        if (Array.isArray(data)) {
          itemsArray = data;
        } else if (data?.blogs) {
          itemsArray = data.blogs;
        } else if (data?.reels) {
          itemsArray = data.reels;
        } else if (data?.memories) {
          itemsArray = data.memories;
        } else if (data?.locations) {
          itemsArray = data.locations;
        } else if (data?.items) {
          itemsArray = data.items;
        } else if (data && typeof data === 'object') {
          // Try to find any array property
          const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
          if (arrayKey) {
            itemsArray = data[arrayKey];
          }
        }

        if (!Array.isArray(itemsArray)) {
          console.error('useInfiniteScroll: Expected array but got:', data);
          itemsArray = [];
        }

        if (itemsArray.length === 0) {
          setEnd(true);
        } else {
          setItems((prev) => {
            const existingIds = new Set(prev.map(item => item._id));
            const uniqueNewItems = itemsArray.filter(item => !existingIds.has(item._id));
            return [...prev, ...uniqueNewItems];
          });
        }
      } catch (error) {
        console.error('useInfiniteScroll error:', error);
        setEnd(true);
      }
    };
    load();
  }, [page, ...deps]);

  // Reset items when filters change
  useEffect(() => {
    setItems([]);
    setPage(1);
    setEnd(false);
    // eslint-disable-next-line
  }, deps);

  useEffect(() => {
    if (end) return;

    const currentLoader = loader.current;
    if (!currentLoader) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(currentLoader);

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
      observer.disconnect();
    };
  }, [end]);

  return { items, loader, end };
}
