import { NextRequest } from "next/server";

export default async function middleware(
  request: NextRequest,
) {
  try {
    const urlObject = new URL(request.url);
    // If the request is to the docs subdirectory
    if (/^\/docs/.test(urlObject.pathname)) {
      // Then Proxy to Mintlify
      const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || '';
      const CUSTOM_URL = process.env.NEXT_PUBLIC_CUSTOM_URL || "";

      let url = new URL(request.url);
      url.hostname = DOCS_URL;



      let proxyRequest = new Request(url, request);

      proxyRequest.headers.set('Host', DOCS_URL);
      proxyRequest.headers.set('X-Forwarded-Host', CUSTOM_URL);
      proxyRequest.headers.set('X-Forwarded-Proto', 'https');

      return await fetch(proxyRequest);
    }
  } catch (error) {
    console.log(error);

    return await fetch(request);
  }

  return await fetch(request);

}
