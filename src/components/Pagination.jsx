import { useEffect, useRef, useState } from "react";

const PAGE_SIZES = [10, 20, 30];

const Pagination = () => {
    const [pageSize, setPageSize] = useState(10);
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const prefetchCache = useRef({ pageNum: 0, pageSize: 0, products: [] });
    const requestId = useRef({ currPage: 0, nextPage: 0 });

    useEffect(() => {
        const controller = new AbortController();

        const fetchPage = async (page) => {
            requestId.current.currPage++;
            const thisRequestId = requestId.current.currPage;

            setIsLoading(true);
            const skip = (page - 1) * pageSize;
            try {
                const res = await fetch(
                    `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`,
                    { signal: controller.signal },
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                if (thisRequestId !== requestId.current.currPage) return;

                const maxPages = Math.ceil(data.total / pageSize);
                setTotalPages(maxPages);
                setCurrPage((prev) => Math.min(maxPages, prev));
                setProducts(data.products);
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Fetching failed:", error);
            } finally {
                setIsLoading(false);
            }
        };

        const prefetchNext = async (page) => {
            requestId.current.nextPage++;
            const thisRequestId = requestId.current.nextPage;

            const nextPage = page + 1;
            const skip = page * pageSize;
            try {
                const res = await fetch(
                    `https://dummyjson.com/products?limit=${pageSize}&skip=${skip}`,
                    { signal: controller.signal },
                );
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const data = await res.json();

                if (thisRequestId !== requestId.current.nextPage) return;

                prefetchCache.current = {
                    pageNum: nextPage,
                    pageSize: pageSize,
                    products: data.products,
                };
            } catch (error) {
                if (error.name === "AbortError") return;
                console.error("Prefetching failed:", error);
            }
        };

        // Use cache if it matches, otherwise fetch
        const cache = prefetchCache.current;
        if (cache.pageNum === currPage && cache.pageSize === pageSize) {
            setProducts(cache.products);
        } else {
            fetchPage(currPage);
        }

        // Prefetch the next page
        if (currPage < totalPages) {
            prefetchNext(currPage);
        }

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
                    prefetchCache.current = {
                        pageNum: 0,
                        pageSize: 0,
                        products: [],
                    };
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

export default Pagination;