import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const pages = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/catalogo-auditoria.html', 'catalogo-auditoria.html'],
  ['/iconografia.html', 'iconografia.html'],
]);
const root = new URL('../../', import.meta.url);
const port = Number(process.env.MINERALCHEMY_TEST_PORT ?? 4178);

createServer(async (request, response) => {
  const pathname = request.url?.split('?')[0];
  const filename = pages.get(pathname);
  if (!filename) {
    response.writeHead(pathname === '/favicon.ico' ? 204 : 404).end();
    return;
  }
  try {
    const html = await readFile(new URL(filename, root));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(request.method === 'HEAD' ? undefined : html);
  } catch {
    response.writeHead(500).end('Página indisponível para o teste.');
  }
}).listen(port, '127.0.0.1');
