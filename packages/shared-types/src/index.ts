// Types only: consumers use `import type`, so nothing here exists at runtime and no build step is needed.

export interface Health {
  status: 'ok'
  redis: boolean
  cms: boolean
}
