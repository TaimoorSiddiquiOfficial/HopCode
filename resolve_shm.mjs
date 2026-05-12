import fs from 'fs';

// Resolve SessionMessageHandler.test.ts
let testFile = fs.readFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.test.ts', 'utf8');
// Remove conflict markers, keeping the ours side (first block between <<<<<<< and =======)
testFile = testFile.replace(/\r\n/g, '\n'); // normalize line endings

// Find and resolve all conflicts programmatically
let result = '';
const lines = testFile.split('\n');
let inOurs = false;
let inTheirs = false;
let skipTheirs = false;

for (const line of lines) {
  if (line.startsWith('<<<<<<< HEAD')) {
    inOurs = true;
    continue;
  }
  if (line.startsWith('=======') && inOurs) {
    inOurs = false;
    inTheirs = true;
    skipTheirs = true;
    continue;
  }
  if (line.startsWith('>>>>>>> ')) {
    inTheirs = false;
    skipTheirs = false;
    continue;
  }
  if (skipTheirs) continue;
  result += line + '\n';
}

fs.writeFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.test.ts', result, 'utf8');
console.log('SessionMessageHandler.test.ts resolved');

// Resolve SessionMessageHandler.ts - more complex, needs merge for conflict 3
let handlerFile = fs.readFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.ts', 'utf8');
handlerFile = handlerFile.replace(/\r\n/g, '\n');

// Process line by line, with special handling for the "empty ours" case
result = '';
const hLines = handlerFile.split('\n');
inOurs = false;
inTheirs = false;
skipTheirs = false;
let oursContent = [];

for (let i = 0; i < hLines.length; i++) {
  const line = hLines[i];
  if (line.startsWith('<<<<<<< HEAD')) {
    inOurs = true;
    oursContent = [];
    continue;
  }
  if (line.startsWith('=======') && inOurs) {
    inOurs = false;
    inTheirs = true;
    skipTheirs = true;
    // If ours content is empty (structural conflict), check if theirs has a qwen case
    if (oursContent.length === 0) {
      // Check ahead for what comes after >>>>>> — if there's already a newHopCodeSession case, skip theirs entirely
    }
    // Append ours content
    for (const ol of oursContent) {
      result += ol + '\n';
    }
    continue;
  }
  if (line.startsWith('>>>>>>> ')) {
    inTheirs = false;
    skipTheirs = false;
    continue;
  }
  if (inOurs) {
    oursContent.push(line);
    continue;
  }
  if (skipTheirs) continue;
  result += line + '\n';
}

fs.writeFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.ts', result, 'utf8');
console.log('SessionMessageHandler.ts resolved');

// Verify
let verify1 = fs.readFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.test.ts', 'utf8');
let verify2 = fs.readFileSync('packages/vscode-ide-companion/src/webview/handlers/SessionMessageHandler.ts', 'utf8');
console.log('Test file conflicts remaining:', (verify1.match(/<<<<<<< HEAD/g) || []).length);
console.log('Handler file conflicts remaining:', (verify2.match(/<<<<<<< HEAD/g) || []).length);