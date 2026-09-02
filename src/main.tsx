import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {
  validateModel,
  validatePrimaryPersonaCoverage,
  validateSkippedPrimaryPersonaCoverage,
} from "./lib/modelValidation";
import "./styles.css";

if (import.meta.env.DEV) {
  const modelErrors = validateModel();
  if (modelErrors.length > 0) {
    throw new Error(`Invalid persona model:\n${modelErrors.join("\n")}`);
  }

  const coverageErrors = validatePrimaryPersonaCoverage();
  if (coverageErrors.length > 0) {
    throw new Error(`Invalid primary persona coverage:\n${coverageErrors.join("\n")}`);
  }

  const skippedCoverageErrors = validateSkippedPrimaryPersonaCoverage();
  if (skippedCoverageErrors.length > 0) {
    throw new Error(
      `Invalid skipped primary persona coverage:\n${skippedCoverageErrors.join("\n")}`,
    );
  }
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
