import { useCallback, useEffect, useRef, useState } from "react";

const InfiniteScroll = () => {
  const [hasMore, setHasMore] = useState(true);
  const totalPage = useRef(0);
  const [items, setItems] = useState([]);
  const sentinelRef = useRef();
  const currPageNum = useRef(0);
  const inFlight = useRef(false);

  const loadMore = useCallback(async (limit, pageNum) => {
    console.log(inFlight.current);
    if(inFlight.current){
        return;
    }
    inFlight.current = true;
    const numToSkip = pageNum * limit;
    const url = `https://dummyjson.com/products?limit=${limit}&skip=${numToSkip}`;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();
      console.log(data);
      const totalNumPage = Math.ceil(data.total / limit);
      totalPage.current = totalNumPage;
      setHasMore(pageNum + 1 < totalNumPage);
      setItems((prev) => [...prev, ...data.products]);
      currPageNum.current++;
    } catch (error) {
        console.error("Fetching Failed!!!!");
    } finally {
        inFlight.current = false;
    }
  }, [hasMore]);

  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entires) => {
        console.log("observer");
        if(hasMore && entires[0].isIntersecting){
            console.log("in observer")
            loadMore(50, currPageNum.current);
            console.log("out observer")
        }
    });
    intersectionObserver.observe(sentinelRef.current);
    return () => intersectionObserver.disconnect();
  }, [loadMore, hasMore]);

  return (
    <>
      <ul style={{ listStyle: "none" }}>
        {items.map((item) => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
      {}
      <div style={{height: "1px"}} ref={sentinelRef} />
    </>
  );
};

export default InfiniteScroll;
