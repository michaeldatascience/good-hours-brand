import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';

const preferred = 4321;
const astroBin = path.join(process.cwd(), 'node_modules', 'astro', 'bin', 'astro.mjs');

function canListen(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

async function isThisSite(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/`, {
      signal: AbortSignal.timeout(1500),
    });
    const html = await response.text();
    return html.includes('Good Hours');
  } catch {
    return false;
  }
}

function windowsFreeCommand(port) {
  return `Get-NetTCPConnection -LocalPort ${port} -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`;
}

let port = preferred;
if (!(await canListen(preferred))) {
  if (await isThisSite(preferred)) {
    console.log('');
    console.log('The site is already running.');
    console.log(`Open http://localhost:${preferred}`);
    console.log('');
    console.log('You only need one window. If the page will not load, the old copy is stuck.');
    console.log('In PowerShell, run this, then npm run dev again:');
    console.log(`  ${windowsFreeCommand(preferred)}`);
    console.log('');
    process.exit(0);
  }

  for (let next = preferred + 1; next <= preferred + 10; next += 1) {
    if (await canListen(next)) {
      port = next;
      break;
    }
  }

  if (port === preferred) {
    console.log('');
    console.log(`Port ${preferred} is blocked, and the next ports are too.`);
    console.log('In PowerShell, run this, then npm run dev again:');
    console.log(`  ${windowsFreeCommand(preferred)}`);
    console.log('');
    process.exit(1);
  }

  console.log(`Port ${preferred} is busy. Starting on http://localhost:${port} instead.`);
}

const child = spawn(process.execPath, [astroBin, 'dev', '--host', '127.0.0.1', '--port', String(port)], {
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) process.exit(1);
  process.exit(code ?? 0);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    child.kill(signal);
  });
}
