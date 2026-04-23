# @hoptrendy/web-dashboard

Standalone web dashboard for **HopCode** — browse session history, read chat transcripts, and track token/cost stats — all from your browser.

## Features

- **Session browser** — lists all sessions across every project, sorted by recency
- **Search** — filter sessions by prompt text, CWD, or session ID
- **Chat viewer** — full conversation replay with tool calls, code blocks, and markdown
- **Stats bar** — total sessions, messages, tokens, and top model at a glance
- **Zero config** — reads directly from `~/.hopcode/projects/`

## Usage

```bash
# From HopCode root (after build)
hopcode dashboard

# Custom port
hopcode dashboard --port 8080

# Without auto-opening browser
hopcode dashboard --no-open

# Or run directly
npx hopcode-dashboard
```

Then open **http://localhost:7899** in your browser.

## Environment Variables

| Variable                 | Default      | Description                         |
| ------------------------ | ------------ | ----------------------------------- |
| `HOPCODE_DASHBOARD_PORT` | `7899`       | HTTP port for the server            |
| `HOPCODE_RUNTIME_DIR`    | `~/.hopcode` | Override the HopCode data directory |

## Development

```bash
cd packages/web-dashboard

# Dev mode (Vite + server with hot reload)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

## Architecture

```
packages/web-dashboard/
├── server/index.ts        Express API server (reads session JSONL files)
├── src/
│   ├── App.tsx            Root layout (header + sidebar + main)
│   ├── components/
│   │   ├── SessionList.tsx  Left sidebar — session list with search
│   │   ├── ChatPanel.tsx    Main area — chat replay using @hoptrendy/webui
│   │   └── StatsBar.tsx     Top-right global stats
│   └── styles.css         Dark-mode UI styles
├── vite.config.ts         Vite build config (proxies /api → :7899)
└── index.html             HTML entry point
```

### API Endpoints

| Endpoint                                    | Description                    |
| ------------------------------------------- | ------------------------------ |
| `GET /api/sessions?page=1&limit=20&search=` | List sessions (paginated)      |
| `GET /api/sessions/:sessionId?project=`     | Load all records for a session |
| `GET /api/stats`                            | Global aggregate stats         |

Session data is read from `~/.hopcode/projects/*/chats/*.jsonl`.
