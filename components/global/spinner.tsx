"use client";
import { useSpinnerContext } from "../spinner/spinner-state";
import { CircularProgress } from "@mui/material";

export default function SpinnerComponent() {
  const spinnerContext = useSpinnerContext();

  const { spinner } = spinnerContext;

  return (
    <>
      {spinner.show ? (
        <div className="overlay">
          <CircularProgress color="primary" />
        </div>
      ) : null}
    </>
  );
}
