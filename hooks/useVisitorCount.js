// hooks/useVisitorCount.js
import { useEffect } from "react";

export const useVisitorCount = (page = "", param = "") => {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Kecualikan halaman admin dan 404
        if (page.startsWith('/admin') || page === '/404') return;

        // Jika tidak mengandung visitor test param
        if (!param.includes("?visitor=rabbi")) {
          const queryParam = new URLSearchParams(param.slice(1));
          const source = queryParam.get("source");

          await fetch(
            `/api/visitor-count?pageVisited=${page}&source=${source || "unknown"}`
          );
        }
      } catch (error) {
        console.error("Visitor tracking error:", error);
      }
    };

    if (page && param) {
      trackVisitor();
    }
  }, [page, param]);
};
