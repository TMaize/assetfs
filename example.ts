import { serve, Status, STATUS_TEXT } from 'https://deno.land/std@0.120.0/http/mod.ts'
import { extname } from 'https://deno.land/std@0.120.0/path/mod.ts'
import * as fs from './example_data.ts'

const MEDIA_TYPES: Record<string, string> = {
  '.html': 'text/html',
  '.ico': 'image/vnd.microsoft.icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.json': 'application/json',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.txt': 'text/plain'
}

function getContentType(path: string): string {
  const ext = extname(path)
  return MEDIA_TYPES[ext] || 'text/plain'
}

function handler(req: Request): Response {
  let path = new URL(req.url).pathname
  if (path.endsWith('/')) path += 'index.html'

  const headers = new Headers()
  headers.set('server', 'deno')

  if (!fs.existsSync(path)) {
    const status = Status.NotFound
    headers.set('content-type', 'text/plain')
    return new Response(STATUS_TEXT.get(status), { status, headers })
  }

  const data = fs.readFileSync(path)
  headers.set('content-type', getContentType(path))
  return new Response(data, { headers })
}

console.log('Listening on http://localhost:8000')
await serve(handler, { hostname: '0.0.0.0', port: 8000 })
