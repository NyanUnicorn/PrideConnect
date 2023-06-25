import { NextResponse } from "next/server";

interface ErrorResponseData {
  error: Error | string | undefined;
}

const headers = new Headers({
  "content-type": "application/json",
  "cache-control": "max-age=60, s-maxage=120",
});

export const ErrorResponse = (
  error: Error | string | undefined,
  status: number = 500
): NextResponse<ErrorResponseData> => {
  const data: ErrorResponseData = {
    error,
  };

  return new NextResponse(JSON.stringify(data), {
    status,
    headers,
  });
};
