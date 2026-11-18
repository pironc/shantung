# Architecture

```mermaid
flowchart LR
  subgraph Clients
    MP[Mini Program<br/>Taro: WeChat + browser]
    AP[Advisor portal + kiosk<br/>Vite + React]
  end
  subgraph BFF[BFF · Fastify :3000]
    CAT[catalog]
    MEM[members]
    RES[reservations]
    WC[WeCom bridge]
  end
  CMS[Drupal 11 · JSON:API :8081]
  PG[(PostgreSQL<br/>drupal + app)]
  RD[(Redis<br/>cache · counters · pub/sub)]
  MP -- REST + JWT --> BFF
  AP -- REST + associate key, SSE --> BFF
  CAT -- JSON:API, /zh-hans prefix --> CMS
  CMS --> PG
  MEM & RES --> PG
  CAT & RES & WC --> RD
  RES -- signed webhook --> WC
```

## Sign-in

A real Mini Program sends the code from `wx.login()`; the BFF exchanges it with WeChat (`jscode2session`, with the AppSecret that never leaves the server) for an OpenID (this app) and a UnionID (every app of the brand). Without a registered AppID, the client sends `mock_<device id>` and both IDs are derived from it.

```mermaid
sequenceDiagram
  participant P as Mini Program
  participant B as BFF
  participant D as Postgres
  P->>B: POST /api/auth/wx-login { code: mock_<device> }
  Note over B: production: jscode2session(code) → openid, unionid
  B->>D: upsert member (unionid, openid, tier)
  B-->>P: JWT + member
```

## A limited release

Each tier opens a day apart (Kesi first). The seat or piece is taken atomically in Redis, then written to Postgres, whose unique index is the final word; if the write fails, the unit goes back.

```mermaid
sequenceDiagram
  participant P as Mini Program
  participant B as BFF
  participant R as Redis
  participant D as Postgres
  P->>B: POST /api/products/:id/reserve { boutique }
  B->>B: window open for this tier?
  B->>R: Lua: not already holder → DECR left (refuse below 0) → SADD holder
  alt full or already holding
    B-->>P: 409
  else unit taken
    B->>D: INSERT reservation (unique per client and piece)
    B-->>P: 201
  end
```

## Telling the boutique

Every reservation, booking, appointment, wishlist addition and arrival becomes a WeCom-style markdown card, signed with HMAC-SHA256 over timestamp, nonce and body. The simulated WeCom endpoint verifies it, refuses anything older than five minutes or replayed, stores it and publishes it; advisor screens receive it over Server-Sent Events. In production `WECOM_URL` would point at WeCom.

```mermaid
sequenceDiagram
  participant B as BFF (reservations)
  participant W as WeCom endpoint
  participant R as Redis
  participant A as Advisor portal
  B->>W: POST /wecom/webhook + X-Timestamp, X-Nonce, X-Signature
  W->>W: verify signature, age ≤ 5 min
  W->>R: SET nonce NX (replay check)
  W->>R: PUBLISH feed
  R-->>A: SSE /api/feed
```

## Kiosk check-in

The entrance screen shows a QR code holding the boutique code and a token that changes every five minutes, so a photo of it cannot check anyone in later. In WeChat it would be a Mini Program code carrying the same two values.

```mermaid
sequenceDiagram
  participant K as Kiosk
  participant P as Client's phone
  participant B as BFF
  participant A as Advisor portal
  K->>B: GET /api/kiosk/QD01/token (every 5 min)
  P->>B: scan → POST /api/checkin { boutique, token }
  B-->>A: arrival (signed webhook → SSE)
  B-->>K: arrival → "Welcome" (no name on a public screen)
```

## Decisions

| Decision | Why |
|---|---|
| One pnpm workspace, no Turborepo | Five packages; shared types need no build step |
| Drupal structure in `config/sync` | Reviewable YAML; a fresh install rebuilds the same site in seconds |
| Redis counter, not a lock | A lock queues requests; a counter guarantees nothing is promised twice |
| HMAC only between servers | A secret in an app bundle can be extracted |
| Server-Sent Events | One-way feed; native `EventSource` reconnects by itself |
| Fastify | Four route groups; no dependency-injection framework needed |
| Tokens scoped to `.ds` for WeChat | WXSS rejects `:root` and attribute selectors; `scripts/tokens.mjs` generates the file |
| Invitation card in a subpackage | Canvas drawing and the QR library stay out of the 2 MB main package |
