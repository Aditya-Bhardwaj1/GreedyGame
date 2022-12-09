import { useEffect } from "react";
import { useState } from "react";

const useSearchParams = (cb) => {
  const [params, setParams] = useState(
    (() => {
      let p = new URLSearchParams(window.location.search);
      const entries = p.entries();
      const result = {};
      for (const [key, value] of entries) {
        result[key] = value;
      }
      return result;
    })()
  );
  useEffect(() => {
    const searchParams = new URLSearchParams(params);
    // const entries = searchParams.entries();
    // for (const [key, value] of entries) {
    //   if (!(key in params)) {
    //     searchParams.delete(key);
    //   }
    // }
    // for (let key in params) {
    //   searchParams.set(key, params[key]);
    // }
    let url = window.location.pathname;
    if (searchParams.toString().length > 0) {
      url += "?" + searchParams.toString();
    }
    window.history.replaceState({}, "", url);
  }, [params]);
  function onChange() {
    const searchParams = new URLSearchParams(window.location.search);
    let entries = searchParams.entries();
    let temp = { ...params };
    for (const [key, value] of entries) {
      temp[key] = value;
    }
    setParams(temp);
  }
  useEffect(() => {
    window.addEventListener("popstate", onChange);
    window.addEventListener("pushstate", onChange);
    // window.addEventListener("replacestate", onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener("pushstate", onChange);
      // window.removeEventListener("replacestate", onChange);
    };
  }, []);
  return [params, setParams];
};
export default useSearchParams;
