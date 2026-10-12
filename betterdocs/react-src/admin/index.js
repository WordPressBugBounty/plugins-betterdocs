import React, { useState, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPanel from "./components/AdminPanel";
import { createRoot } from 'react-dom/client';

// Import styles
import "react-toastify/dist/ReactToastify.css";
import "./scss/dashboard.scss";
import "./scss/faq-builder/bd-faq.scss";
import "./scss/settings.scss";
import "./scss/responsive.scss";

const container = document.getElementById("betterdocs-dashboard-app");

// Add error handling for null container
if (!container) {
  throw new Error("Failed to find the betterdocs-dashboard-app element");
}

createRoot(container).render(<AdminPanel />);
