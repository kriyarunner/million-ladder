"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  type Currency,
  currencyFromCode,
  DEFAULT_CURRENCY,
} from "@/lib/currency";

type Ctx = {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
};

const CurrencyContext = createContext<Ctx>({
  currency: DEFAULT_CURRENCY,
  setCurrencyCode: () => {},
});

export function CurrencyProvider({
  initialCode,
  children,
}: {
  initialCode: string;
  children: React.ReactNode;
}) {
  const [code, setCode] = useState(initialCode);

  const setCurrencyCode = useCallback((next: string) => {
    setCode(next);
    if (typeof document !== "undefined") {
      document.cookie = `ml_ccy=${next}; path=/; max-age=31536000; samesite=lax`;
    }
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("ml_ccy", next);
      } catch {
        // ignore
      }
    }
  }, []);

  const value = useMemo<Ctx>(
    () => ({ currency: currencyFromCode(code), setCurrencyCode }),
    [code, setCurrencyCode]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): Ctx {
  return useContext(CurrencyContext);
}
