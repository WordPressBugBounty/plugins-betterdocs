import { useState, useEffect } from "react";

/**
 *
 * @param {string|number} searchKeyword
 * @param {number} delayTimeout
 *
 * @returns {string|number} returns debouncedKeyword
 */
const useDebounce = (searchKeyword, delay = 500) => {
  const [debouncedKeyword, setDebouncedKeyword] = useState(searchKeyword);

  /**
   * Debounce The Search Keyword
   */
  useEffect(() => {
    let timeout = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchKeyword, delay]);

  return debouncedKeyword;
};

export default useDebounce;
