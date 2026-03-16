import { useCallback, useEffect, useRef, useState } from "react";

const LIMIT = 50;

const InfiniteScroll = () => {
    const [items, setItems] = useState([]);
    const sentinelRef = useRef(null);
    const currPageNum = useRef(0);
    const hasMoreRef = useRef(true);
    const inFlight = useRef(false);

    const loadMore = useCallback(async () => {
        if (inFlight.current || !hasMoreRef.current) return;

        inFlight.current = true;
        const skip = currPageNum.current * LIMIT;

        try {
            const res = await fetch(
                `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`,
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            const totalPages = Math.ceil(data.total / LIMIT);

            hasMoreRef.current = currPageNum.current + 1 < totalPages;
            currPageNum.current++;
            setItems((prev) => [...prev, ...data.products]);
        } catch (error) {
            console.error(`Fetching failed: ${error}`);
        } finally {
            inFlight.current = false;
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        });
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [loadMore]);

    return (
        <>
            <ul style={{ listStyle: "none" }}>
                {items.map((item) => (
                    <li key={item.id}>{item.title}</li>
                ))}
            </ul>
            <div ref={sentinelRef} style={{ height: 1 }} />
        </>
    );
};

export default InfiniteScroll;