// Tiny local web server: node serve.js  ->  http://localhost:5500
// Chrome only allows the microphone / speech recognition on http://localhost or https, not on a double-clicked file.
const http = require('http'), fs = require('fs'), path = require('path'), port = +process.env.PORT || 5500;
const types = {'.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.png': 'image/png', '.mp4': 'video/mp4', '.wasm': 'application/wasm', '.txt': 'text/plain', '.json': 'application/json'};
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.join(__dirname, path.normalize(p));
  if (!f.startsWith(__dirname)) { res.writeHead(403); return res.end(); }
  fs.stat(f, (e, st) => {
    if (e || !st.isFile()) { res.writeHead(404); return res.end('Not found'); }
    const type = types[path.extname(f).toLowerCase()] || 'application/octet-stream', m = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    if (m) {                                         // byte ranges, so the videos can seek
      const a = m[1] ? +m[1] : 0, z = m[2] ? Math.min(+m[2], st.size - 1) : st.size - 1;
      res.writeHead(206, {'Content-Type': type, 'Content-Range': 'bytes ' + a + '-' + z + '/' + st.size, 'Accept-Ranges': 'bytes', 'Content-Length': z - a + 1});
      return fs.createReadStream(f, {start: a, end: z}).pipe(res);
    }
    res.writeHead(200, {'Content-Type': type, 'Content-Length': st.size, 'Accept-Ranges': 'bytes'}); fs.createReadStream(f).pipe(res);
  });
}).listen(port, '127.0.0.1', () => console.log('ZeroWatt Wind is running at  http://localhost:' + port + '   (Ctrl+C to stop)'));
