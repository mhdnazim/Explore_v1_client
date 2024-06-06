import React, { useEffect, useState } from 'react'

interface Result {
    [key: string]: string
}

const useWindow = (params: string[]) => {

  const [result, setResult] = useState<Result>({})

  useEffect(()=> {

    if (typeof window !== "undefined") {
        params.map((param: string)=> {
            const value = localStorage.getItem(param)!  ?? null
            const res = {...result, [param]: value}
            setResult(res)
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return result;
}

export default useWindow