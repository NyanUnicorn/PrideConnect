"use client";

import { ThemeProvider } from "@material-tailwind/react";

function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

export { ThemeProviderWrapper };
