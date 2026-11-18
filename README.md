# Shantung

```sh
docker compose up --build        # first boot installs Drupal (~1 min), later boots take seconds
CMS_PORT=8082 docker compose up  # if 8081 is taken on your machine
```

| What | URL |
|---|---|
| BFF health (checks Redis + Drupal) | http://localhost:3000/health |
| Mini program, H5 build | http://localhost:3001 |
| Clienteling portal | http://localhost:3002 |
| Drupal back-office (admin / admin) | http://localhost:8081 |

**WeChat DevTools:** import `apps/miniprogram/dist/weapp` with the test AppID. It rebuilds live while compose runs.

**Drupal config:** after changing content types or roles in the admin UI, export them to the repo with
`docker compose exec cms drush config:export -y`, then commit `apps/cms/config/sync`.
Fresh installs then rebuild from those files (`apps/cms/entrypoint.sh`).

**Reset everything:** `docker compose down -v`
