import { writeFileSync } from 'fs';

async function main() {
  const h = { 'Content-Type': 'application/json', 'Accept': 'application/json, text/event-stream' };
  let log = '';

  const i = await fetch('https://mcp.quran.ai/', { method: 'POST', headers: h, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'hopcode', version: '0.22.0' } } }) });
  log += 'init status: ' + i.status + '\n';
  // Get session ID from response header
  const sessionId = i.headers.get('mcp-session-id');
  log += 'session-id: ' + sessionId + '\n';
  const it = await i.text();
  log += 'init body: ' + it.slice(0, 300) + '\n';

  // Set session header for subsequent requests
  const h2 = { ...h, 'Mcp-Session-Id': sessionId };

  await fetch('https://mcp.quran.ai/', { method: 'POST', headers: h2, body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) });

  const tr = await fetch('https://mcp.quran.ai/', { method: 'POST', headers: h2, body: JSON.stringify({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }) });
  log += 'tools status: ' + tr.status + '\n';
  const tt = await tr.text();
  log += 'body: ' + tt + '\n';

  writeFileSync('D:/HopCode/.tmp_mcp_discovery.txt', log);
  console.log('done');
}
main().catch(e => console.error('Error:', e));
