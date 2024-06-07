import React, { useEffect, useState } from 'react';

interface Result {
    [key: string]: string | null;
}

const useWindow = (params: string[]) => {
    const [result, setResult] = useState<Result>({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const res: Result = {};
            params.forEach((param: string) => {
                const value = localStorage.getItem(param) ?? null;
                res[param] = value;
            });
            setResult(res);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return result;
};

export default useWindow;
