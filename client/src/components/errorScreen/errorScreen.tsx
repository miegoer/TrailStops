import React from "react";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error: { statusText?: string; message?: string } = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>You seem to have went off track and an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}