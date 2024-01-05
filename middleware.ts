import { NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  const urlObject = new URL(request.url);
  const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || '';
  const CUSTOM_URL = process.env.NEXT_PUBLIC_CUSTOM_URL || "";

  // Check if the request is for /docs or for assets under /docs
  if (urlObject.pathname.startsWith('/docs')) {
    // Rewrite the request to the external documentation site
    urlObject.hostname = DOCS_URL;
    urlObject.protocol = 'https';

    // Create a new fetch request with the updated URL
    const proxyRequest = new Request(urlObject.toString(), {
      headers: request.headers,
      method: request.method,
      body: request.method !== 'GET' ? await request.text() : undefined,
    });

    // Fetch the proxied URL
    const response = await fetch(proxyRequest);

    // If the response is OK, return it directly
    if (response.ok) {
      return response;
    }

    // If the response is not OK (e.g., a 404 for an asset), return a custom response
    // or handle it in a specific way
    if (response.status === 404) {
      // Handle 404 for assets, potentially by serving a default asset or logging
      console.error(`Asset not found at ${urlObject.toString()}`);
      // Return a default asset or a custom 404 response here if necessary
    }

    // Return the original response for all other cases
    return response;
  }

  // For all other paths, return the response as usual
  return NextResponse.next();
}