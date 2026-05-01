import { writeFileSync } from 'fs';
import { pathToFileURL } from 'url';

async function main() {
  const base = pathToFileURL('D:/HopCode/packages/quran-guidance/dist/src/mcp/quran-mcp-client.js').href;
  
  const mod = await import(base);
  const client = mod.createQuranMcpClient();

  let log = '';

  // Test 1: getAyah
  try {
    const result = await client.getAyah({ surah: 1, ayah: 1 });
    log += 'getAyah(1:1): SUCCESS\n';
    log += JSON.stringify(result).slice(0, 500) + '\n';
  } catch (e) {
    log += 'getAyah(1:1): FAILED - ' + e.message + '\n';
  }

  // Test 2: searchQuran
  try {
    const result = await client.searchQuran({ query: 'patience', limit: 2 });
    log += 'searchQuran("patience"): SUCCESS\n';
    log += JSON.stringify(result).slice(0, 500) + '\n';
  } catch (e) {
    log += 'searchQuran("patience"): FAILED - ' + e.message + '\n';
  }

  writeFileSync('D:/HopCode/.tmp_mcp_test.txt', log);
  console.log('done');
}
main().catch(e => console.error('Fatal:', e));
