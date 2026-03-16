import { useEffect, useRef, useState } from "react";

const PAGE_SIZES = [10, 20, 30];

const Pagination2 = () => {
    const [pageSize, setPageSize] = useState(10);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const pageCacheRef = useRef(new Map());
    const requestId = useRef(0);

    // Fetch current page
    useEffect(() => {
        const controller = new AbortController();
        const key = `${pageSize}:${currPage}`;
        const cached = pageCacheRef.current.get(key);

        if (cached) {
            setProducts(cached);
            return;
        }

        const fetchPage = async () => {
            requestId.current++;
            const thisRequestId = requestId.current;

            setIsLoading(true);
            const skip = (currPage - 1) * pageSize;
            try {
                const res = await fetch(
                    `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`,
                    { signal: controller.signal },
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                if (thisRequestId !== requestId.current) return;

                const maxPages = Math.ceil(data.total / pageSize);
                pageCacheRef.current.set(key, data.products);
                setProducts(data.products);
                setCurrPage((prev) => Math.min(maxPages, prev));
                setTotalPages(maxPages);
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Fetching failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPage();
        return () => controller.abort();
    }, [currPage, pageSize]);

    // Prefetch next page
    useEffect(() => {
        const nextPage = currPage + 1;
        if (nextPage > totalPages) return;

        const key = `${pageSize}:${nextPage}`;
        if (pageCacheRef.current.has(key)) return;

        const controller = new AbortController();

        const prefetch = async () => {
            const skip = (nextPage - 1) * pageSize;
            try {
                const res = await fetch(
                    `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`,
                    { signal: controller.signal },
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();
                pageCacheRef.current.set(key, data.products);
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Prefetching failed:", error);
            }
        };

        prefetch();
        return () => controller.abort();
    }, [currPage, pageSize, totalPages]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <select
                value={pageSize}
                onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrPage(1);
                }}
            >
                {PAGE_SIZES.map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>

            {isLoading && <div>Loading...</div>}

            <ul
                style={{
                    listStyle: "none",
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                }}
            >
                {products.map((product) => (
                    <li key={product.id}>{product.title}</li>
                ))}
            </ul>

            <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                <button
                    onClick={() => setCurrPage((prev) => prev - 1)}
                    disabled={currPage === 1}
                >
                    Prev
                </button>
                <div>{currPage}</div>
                <button
                    onClick={() => setCurrPage((prev) => prev + 1)}
                    disabled={currPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination2;