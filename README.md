# Shantung

The client app and boutique tools of **Shantung**, a fictional Shandong maison of silk scarves, ties and Laoshan green tea. A portfolio piece modelled on how agencies build luxury clienteling for China: a headless CMS, a BFF, a WeChat Mini Program and the advisors' iPad screens. Payments are out of scope.

```sh
docker compose up --build        # first boot installs Drupal from config and seeds content (about 10 s), later boots take seconds
CMS_PORT=8082 docker compose up  # if 8081 is taken on your machine
docker compose down -v           # start again from nothing
```

| What | URL |
|---|---|
| Mini Program, browser build (open at phone width) | http://localhost:3001 |
| Advisor portal (iPad) | http://localhost:3002 |
| Entrance kiosk (iPad, full screen) | http://localhost:3002/kiosk/QD01 (also `SH01`, `BJ01`) |
| BFF health | http://localhost:3000/health |
| Drupal back office (admin / admin) | http://localhost:8081/user/login |

## Try it

1. Open the Mini Program, go to **Membership** and pick a demo tier (Thread, Satin, Brocade, Kesi): each has its own card.
2. As **Kesi**, open the *Cloud Gate, Kesi Edition* limited release and reserve it. As **Thread**, the same piece says when your window opens.
3. Keep the **advisor portal** open beside it: the reservation arrives live, and clicking it opens the client's profile.
4. Open a **kiosk** and click its QR code (a phone would scan it): the client is checked in and the portal shows the arrival.
5. Book a **salon** seat or an **appointment**, save a piece to the **wishlist**, and open **Your invitation card** to download it.

## WeChat DevTools

While compose runs, `apps/miniprogram/dist/weapp` is rebuilt on every change. Import that folder in WeChat DevTools with the test AppID; domain checks are already off in `project.config.json`, so requests to `localhost:3000` go through.

## Tests

```sh
docker compose exec bff pnpm --filter bff test   # seat counter under 50 concurrent clients, tier windows, webhook signatures
```

## Where things live

| Path | What |
|---|---|
| `apps/cms` | Drupal 11 on PostgreSQL. The content model is YAML in `config/sync`; change it in the UI, then `docker compose exec cms drush config:export -y` |
| `apps/bff` | Fastify: catalog from JSON:API with a Redis cache, mock WeChat sign-in, reservations, signed WeCom-style feed |
| `apps/miniprogram` | Taro (React), built for WeChat (`dist/weapp`) and the browser |
| `apps/clienteling` | Vite + React: advisor portal and entrance kiosk |
| `packages/shared-types` | Types shared by the BFF and both front ends |
| `DESIGN.md`, `opendesigner/` | The design system. After `engine.py build`, run `pnpm --filter miniprogram tokens` |
| `apps/cms/seed/photos/CREDITS.md` | Every photo, its author and licence |
| `docs/architecture.md` | How the pieces talk, with sequence diagrams |
