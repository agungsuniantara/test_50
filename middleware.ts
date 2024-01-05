import { NextRequest } from "next/server";

export default async function middleware(request: NextRequest) {
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

      const response = await fetch(proxyRequest);

      // Modify the response's URL for static assets
      if (response.ok) {
        const text = await response.text();
        const modifiedText = text.replace(
          new RegExp(`http://${CUSTOM_URL}/_next/`, 'g'),
          `https://${DOCS_URL}/_next/`
        );
        return new Response(modifiedText, response);
      }

      return response;
    }
  } catch (error) {
    console.log(error);
  }

  return await fetch(request);
}