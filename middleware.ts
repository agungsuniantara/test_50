import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith('/docs')) {
    const DOCS_URL = process.env.NEXT_PUBLIC_DOCS_URL || 'mindseat.mintlify.app';
    const CUSTOM_URL = process.env.NEXT_PUBLIC_CUSTOM_URL || 'localhost:3000';

    // Create a new URL object with the DOCS_URL as the hostname
    const proxyUrl = new URL(request.url);
    proxyUrl.hostname = DOCS_URL;
    proxyUrl.protocol = 'https'; // Use HTTPS protocol

    // Create a new fetch request to the proxy URL
    const proxyRequest = new Request(proxyUrl.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? await request.arrayBuffer() : undefined,
    });

    // Fetch the proxied URL
    const response = await fetch(proxyRequest);

    // If the response is OK, modify it to replace asset paths
    if (response.ok) {
      let body = await response.text();

      // Replace all instances of CUSTOM_URL with DOCS_URL in the response body
      body = body.replace(new RegExp(`https://${CUSTOM_URL}`, 'g'), `https://${DOCS_URL}`);
      body = body.replace(new RegExp(`http://${CUSTOM_URL}`, 'g'), `https://${DOCS_URL}`);

      // Create a new response with the modified body
      const newResponse = new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });

      // Set the base URL in the headers to the DOCS_URL
      newResponse.headers.set('Content-Base', `https://${DOCS_URL}`);
      newResponse.headers.set('Base', `https://${DOCS_URL}`);

      return newResponse;
    }

    // If the response is not OK, return it as is
    return response;
  }

  // If not visiting /docs, return a response as usual
  return NextResponse.next();
}