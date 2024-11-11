import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TooltipProvider } from "./components/ui/tooltip";
import { ThemeProvider } from "./components/shared/ThemeProvider";
import { Toaster } from "./components/ui/toaster";
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <TooltipProvider
    ><App /><Toaster /></TooltipProvider></ThemeProvider></ClerkProvider>
  </React.StrictMode>,
);
