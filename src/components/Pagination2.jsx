import { useEffect, useRef, useState } from "react";

const Pagination2 = () => {
  const [selectedPageSize, setSelectedPageSize] = useState(10);
  const [currPageNum, setCurrPageNum] = useState(1);
  const [totalPageNum, setTotalPageNum] = useState(1);
  const [currPageProducts, setcurrPageProducts] = useState([]);
  const pageCacheRef = useRef(new Map());

  const requestId = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCurrPage = async (abortController, limit, currPage) => {
    const key = `${limit}:${currPage}`;
    const cache = pageCacheRef.current.get(key);
    if (cache) {
      setcurrPageProducts(cache);
      return;
    }
    requestId.current++;
    const currRequestId = requestId.current;
    setIsLoading(true);
    const numToSkip = (currPage - 1) * limit;
    const url = `https://dummyjson.com/products?limit=${limit}&skip=${numToSkip}`;
    try {
      const res = await fetch(url, {
        signal: abortController.signal,
      });
      if (!res.ok) {
        setIsLoading(false);
        throw new Error(`Pretching HTTP ${res.status}`);
      }
      const data = await res.json();
      if (currRequestId !== requestId.current) {
        setIsLoading(false);
        return;
      }
      console.log(data);
      const currPage = data.products;
      const maxPageNum = Math.ceil(data.total / limit);
      console.log(currPage);
      pageCacheRef.current.set(key, currPage);
      setcurrPageProducts(currPage);
      setCurrPageNum((prev) => Math.min(maxPageNum, prev));
      setTotalPageNum(maxPageNum);
    } catch (error) {
      if (error.name === "AbortError") {
        setIsLoading(false);
        return;
      }
      console.error(`Fetching Failed`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNextPage = async (limit, nextPage) => {
    if (nextPage > totalPageNum) {
      return;
    }
    const key = `${limit}:${nextPage}`;
    const cache = pageCacheRef.current.get(key);
    if (cache) {
      return;
    }
    const numToSkip = (nextPage - 1) * limit;
    const url = `https://dummyjson.com/products?limit=${limit}&skip=${numToSkip}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Pretching HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      const nextPage = data.products;
      pageCacheRef.current.set(key, nextPage);
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
      console.error(`Fetching Failed`);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchCurrPage(abortController, selectedPageSize, currPageNum);
    return () => abortController.abort();
  }, [currPageNum, selectedPageSize]);

  useEffect(() => {
    fetchNextPage(selectedPageSize, currPageNum + 1);
  }, [currPageNum, selectedPageSize, totalPageNum]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <select
        value={selectedPageSize}
        onChange={(e) => {
          setSelectedPageSize(Number(e.target.value));
          setCurrPageNum(1);
        }}
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={30}>30</option>
      </select>
      {isLoading && <div>LOADING...</div>}
      <ul
        style={{
          listStyle: "none",
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "column",
        }}
      >
        {currPageProducts.map((product) => (
          <li key={product.id}>{product.title}</li>
        ))}
      </ul>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <button
          onClick={() => {
            if (currPageNum > 0) setCurrPageNum((prev) => prev - 1);
          }}
          disabled={currPageNum === 1}
        >
          Prev
        </button>
        <div>{currPageNum}</div>
        <button
          onClick={() => {
            setCurrPageNum((prev) => prev + 1);
          }}
          disabled={currPageNum === totalPageNum}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination2;
