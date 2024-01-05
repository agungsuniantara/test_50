export async function GET(
  request: Request,
) {
  try {
    const DOCS_URL = 'mindseat.mintlify.app';
    const CUSTOM_URL = 'localhost:3005';

    let url = new URL(request.url);
    url.hostname = DOCS_URL;

    let proxyRequest = new Request(url, request);


    proxyRequest.headers.set('Host', DOCS_URL);
    proxyRequest.headers.set('X-Forwarded-Host', CUSTOM_URL);
    proxyRequest.headers.set('X-Forwarded-Proto', 'https');

    return await fetch(proxyRequest);
    // return new Response(JSON.stringify({ test: "123" }));
  } catch (err) {
    console.log(err);

  }


}
