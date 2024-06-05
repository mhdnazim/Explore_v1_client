'use client'
import { useRef, useEffect } from "react";
export default function App() {
  const div = useRef(document.createElement("div"))
  /* useEffect(() =>
    div.current.scrollIntoView({ behavior: "smooth", block: "end" })
  ); useEffect will automatically scroll to bottom*/

  useEffect(() => {
    div.current.scrollIntoView({ behavior: "smooth", block: "end" })
  }, [])
  

  console.log(div.current);
  return (
    <div className="App" ref={div}>
      <h1>Welcome to web application</h1>
      <button
      >
        Scroll to bottom
      </button>
      lorem*650
    </div>
  );
}
