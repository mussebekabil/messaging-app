import React, { useState, useEffect } from "react";

function useFetch(baseUrl, offset) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setItems([]);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setError(false);

    async function fetchItems () {
      try {
          const response = await fetch(`${baseUrl}?offset=${offset}`);
          const result = await response.json();
          const updatedItems = [...new Set([...items, ...result])];
          setItems(updatedItems)
          setHasMore(updatedItems.length < updatedItems[0]?.count)
      } catch (error) {
        console.log(error)
        setError(error.toString())
      } finally {
        setIsLoading(false)
      }
		}
		fetchItems()
  }, [offset]);

  return { isLoading, error, items, setItems, hasMore };
}

export default useFetch;
