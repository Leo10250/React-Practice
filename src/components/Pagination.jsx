import { useEffect, useRef, useState } from "react";

const Pagination = () => {
    const [selectedPageSize, setSelectedPageSize] = useState(10);
    const [currPageNum, setCurrPageNum] = useState(1);
    const [totalPageNum, setTotalPageNum] = useState(1);
    const [currPageProducts, setcurrPageProducts] = useState([]);
    const [prefech, setPrefech] = useState({
        pageNum: currPageNum + 1,
        pageSize: selectedPageSize,
        products: [],
    });
    const requestId = useRef({ currPage: 0, nextPage: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const fetchCurrPage = async (abortController, limit, currPage) => {
        requestId.current.currPage++;
        const currRequestId = requestId.current.currPage;
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
            if (currRequestId !== requestId.current.currPage) {
                setIsLoading(false);
                return;
            }
            console.log(data);
            const currPage = data.products;
            const maxPageNum = Math.ceil(data.total / limit);
            console.log(currPage);
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

    const prefetchNextPage = async (abortController, limit, currPage) => {
        requestId.current.nextPage++;
        const currRequestId = requestId.current.nextPage;
        const numToSkip = currPage * limit;
        const url = `https://dummyjson.com/products?limit=${limit}&skip=${numToSkip}`;
        try {
            const res = await fetch(url, {
                signal: abortController.signal,
            });
            if (!res.ok) {
                throw new Error(`Prefetching HTTP ${res.status}`);
            }
            const data = await res.json();
            if (currRequestId !== requestId.current.nextPage) {
                return;
            }
            const nextPage = data.products;
            setPrefech({
                pageNum: currPage + 1,
                pageSize: limit,
                products: nextPage,
            });
        } catch (error) {
            if (error.name === "AbortError") {
                return;
            }
            console.error(`Prefetching Failed`);
        }
    };

    useEffect(() => {
        const abortController = new AbortController();
        const canPreFectch =
            prefech.pageNum === currPageNum &&
            prefech.pageSize === selectedPageSize;
        if (canPreFectch) {
            setcurrPageProducts(prefech.products);
            setPrefech({
                pageNum: currPageNum + 1,
                pageSize: selectedPageSize,
                products: [],
            });
        } else {
            fetchCurrPage(abortController, selectedPageSize, currPageNum);
            console.log("fetch");
        }
        if (currPageNum < totalPageNum) {
            prefetchNextPage(abortController, selectedPageSize, currPageNum);
        }
        console.log("finished");
        return () => abortController.abort();
    }, [
        currPageNum,
        prefech.pageNum,
        prefech.pageSize,
        prefech.products,
        selectedPageSize,
        totalPageNum,
    ]);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <select
                value={selectedPageSize}
                onChange={(e) => {
                    setSelectedPageSize(Number(e.target.value));
                    setCurrPageNum(1);
                    setPrefech({
                        pageNum: 2,
                        pageSize: Number(e.target.value),
                        products: [],
                    });
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

export default Pagination;
