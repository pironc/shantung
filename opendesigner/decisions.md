# Decisions

Append-only, ADR-style (spec 7.9): one entry per decision, newest last. A later entry for the same path supersedes an earlier one; nothing is edited or deleted. set_by is chosen, confirmed_default, auto_default, assumed, delegated, reference, asset or standard.

## D-0001 · init with defaults
- set_by: auto_default · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: Start of the design system; every default traces to references/levers.json.

## D-0002 · context.product = "WeChat DevTools: import apps/miniprogram/dist/weapp with the test AppID."
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: read from the first paragraph of README.md; say if that's wrong
- previous value: ""

## D-0003 · answers.Q-plat-01 = ["web"]
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: read from the files (HTML pages); say if that's wrong
- also set: raw.platforms = ["web"] (from Q-plat-01)

## D-0004 · answers.Q-scope-07 = "near-launch"
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: read from the repo: code and deploy settings (Dockerfile, docker-compose.yml), but no released version yet; say if that's wrong

## D-0005 · raw.stack = []
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: package.json names no UI framework; say if the stack is different

## D-0006 · House standards v4: 291 applied
- set_by: standard · locked: yes · date: 2026-11-18 · supersedes: none · source_ref: standards.json v4
- reason: OpenDesigner's house standards (sources marked non-negotiable) are applied without asking and locked. Change one only when the person asks: engine.py standard override <id> --why "<their words>".
- <details><summary>291 standards</summary> STD-when-to-animate-01, STD-when-to-animate-03, STD-when-to-animate-04, STD-when-to-animate-05, STD-when-to-animate-06, STD-when-to-animate-07, STD-when-to-animate-08, STD-when-to-animate-09, STD-when-to-animate-10, STD-when-to-animate-11, STD-when-to-animate-13, STD-when-to-animate-15, STD-when-to-animate-16, STD-when-to-animate-17, STD-when-to-animate-20, STD-when-to-animate-22, STD-easing-duration-01, STD-easing-duration-02, STD-easing-duration-03, STD-easing-duration-06, STD-easing-duration-07, STD-easing-duration-09, STD-easing-duration-10, STD-easing-duration-11, STD-easing-duration-12, STD-easing-duration-13, STD-easing-duration-15, STD-easing-duration-17, STD-easing-duration-19, STD-enter-exit-origin-01, STD-enter-exit-origin-02, STD-enter-exit-origin-03, STD-enter-exit-origin-04, STD-enter-exit-origin-06, STD-enter-exit-origin-08, STD-enter-exit-origin-09, STD-enter-exit-origin-10, STD-enter-exit-origin-11, STD-enter-exit-origin-12, STD-enter-exit-origin-13, STD-enter-exit-origin-16, STD-enter-exit-origin-17, STD-enter-exit-origin-21, STD-enter-exit-origin-23, STD-enter-exit-origin-24, STD-enter-exit-origin-26, STD-enter-exit-origin-27, STD-enter-exit-origin-28, STD-enter-exit-origin-29, STD-enter-exit-origin-30, STD-enter-exit-origin-31, STD-enter-exit-origin-37, STD-enter-exit-origin-38, STD-enter-exit-origin-39, STD-enter-exit-origin-40, STD-enter-exit-origin-41, STD-enter-exit-origin-42, STD-enter-exit-origin-43, STD-enter-exit-origin-44, STD-springs-gestures-01, STD-springs-gestures-02, STD-springs-gestures-04, STD-springs-gestures-05, STD-springs-gestures-06, STD-springs-gestures-07, STD-springs-gestures-08, STD-springs-gestures-09, STD-springs-gestures-11, STD-springs-gestures-12, STD-springs-gestures-13, STD-springs-gestures-14, STD-springs-gestures-15, STD-springs-gestures-16, STD-springs-gestures-17, STD-springs-gestures-18, STD-springs-gestures-19, STD-springs-gestures-20, STD-springs-gestures-21, STD-springs-gestures-25, STD-springs-gestures-26, STD-springs-gestures-28, STD-springs-gestures-30, STD-springs-gestures-34, STD-springs-gestures-39, STD-springs-gestures-41, STD-springs-gestures-42, STD-springs-gestures-45, STD-springs-gestures-59, STD-springs-gestures-60, STD-springs-gestures-61, STD-springs-gestures-63, STD-performance-properties-01, STD-performance-properties-02, STD-performance-properties-06, STD-performance-properties-09, STD-performance-properties-10, STD-performance-properties-11, STD-performance-properties-12, STD-performance-properties-13, STD-performance-properties-14, STD-performance-properties-15, STD-performance-properties-16, STD-performance-properties-17, STD-performance-properties-24, STD-performance-properties-25, STD-accessibility-motion-01, STD-accessibility-motion-02, STD-accessibility-motion-05, STD-accessibility-motion-06, STD-accessibility-motion-07, STD-accessibility-motion-08, STD-accessibility-motion-09, STD-accessibility-motion-10, STD-accessibility-motion-11, STD-accessibility-motion-12, STD-accessibility-motion-13, STD-accessibility-motion-15, STD-accessibility-motion-16, STD-accessibility-motion-17, STD-accessibility-motion-18, STD-accessibility-motion-20, STD-accessibility-motion-23, STD-accessibility-motion-24, STD-accessibility-motion-26, STD-accessibility-motion-27, STD-components-toasts-drawers-03, STD-components-toasts-drawers-07, STD-components-toasts-drawers-10, STD-components-toasts-drawers-11, STD-components-toasts-drawers-12, STD-components-toasts-drawers-13, STD-components-toasts-drawers-14, STD-components-toasts-drawers-15, STD-components-toasts-drawers-16, STD-components-toasts-drawers-17, STD-components-toasts-drawers-18, STD-components-toasts-drawers-25, STD-components-toasts-drawers-29, STD-components-toasts-drawers-30, STD-components-toasts-drawers-33, STD-components-toasts-drawers-34, STD-components-toasts-drawers-37, STD-components-toasts-drawers-40, STD-components-toasts-drawers-44, STD-components-toasts-drawers-45, STD-components-toasts-drawers-48, STD-components-toasts-drawers-65, STD-components-toasts-drawers-72, STD-components-toasts-drawers-77, STD-mobile-touch-02, STD-mobile-touch-03, STD-mobile-touch-05, STD-mobile-touch-06, STD-mobile-touch-07, STD-mobile-touch-08, STD-mobile-touch-09, STD-mobile-touch-10, STD-mobile-touch-11, STD-mobile-touch-13, STD-mobile-touch-14, STD-mobile-touch-15, STD-mobile-touch-16, STD-mobile-touch-17, STD-mobile-touch-18, STD-mobile-touch-19, STD-mobile-touch-20, STD-mobile-touch-21, STD-mobile-touch-24, STD-mobile-touch-28, STD-mobile-touch-70, STD-visual-details-01, STD-visual-details-02, STD-visual-details-03, STD-visual-details-04, STD-visual-details-05, STD-visual-details-06, STD-visual-details-07, STD-visual-details-08, STD-visual-details-09, STD-visual-details-10, STD-visual-details-11, STD-visual-details-13, STD-visual-details-14, STD-visual-details-15, STD-visual-details-16, STD-visual-details-17, STD-visual-details-18, STD-visual-details-19, STD-visual-details-20, STD-visual-details-21, STD-visual-details-24, STD-visual-details-25, STD-visual-details-26, STD-visual-details-27, STD-visual-details-28, STD-visual-details-29, STD-visual-details-30, STD-visual-details-31, STD-visual-details-32, STD-visual-details-33, STD-visual-details-34, STD-visual-details-35, STD-visual-details-36, STD-visual-details-37, STD-visual-details-38, STD-visual-details-39, STD-visual-details-40, STD-visual-details-41, STD-visual-details-42, STD-visual-details-43, STD-visual-details-44, STD-visual-details-45, STD-visual-details-46, STD-visual-details-47, STD-visual-details-48, STD-visual-details-49, STD-visual-details-50, STD-visual-details-51, STD-visual-details-55, STD-visual-details-56, STD-visual-details-57, STD-visual-details-59, STD-visual-details-64, STD-process-review-taste-01, STD-process-review-taste-02, STD-process-review-taste-03, STD-process-review-taste-04, STD-process-review-taste-05, STD-process-review-taste-06, STD-process-review-taste-07, STD-process-review-taste-08, STD-process-review-taste-09, STD-process-review-taste-10, STD-process-review-taste-11, STD-process-review-taste-12, STD-process-review-taste-13, STD-process-review-taste-14, STD-process-review-taste-15, STD-process-review-taste-16, STD-process-review-taste-17, STD-process-review-taste-18, STD-process-review-taste-19, STD-process-review-taste-20, STD-process-review-taste-21, STD-process-review-taste-22, STD-process-review-taste-23, STD-process-review-taste-24, STD-process-review-taste-25, STD-process-review-taste-26, STD-process-review-taste-27, STD-process-review-taste-28, STD-process-review-taste-29, STD-process-review-taste-30, STD-process-review-taste-31, STD-process-review-taste-32, STD-process-review-taste-33, STD-process-review-taste-34, STD-process-review-taste-35, STD-process-review-taste-36, STD-process-review-taste-37, STD-process-review-taste-38, STD-process-review-taste-39, STD-process-review-taste-40, STD-process-review-taste-41, STD-process-review-taste-42, STD-process-review-taste-43, STD-process-review-taste-44, STD-process-review-taste-45, STD-process-review-taste-46, STD-process-review-taste-47, STD-process-review-taste-48, STD-process-review-taste-49, STD-process-review-taste-50, STD-process-review-taste-51, STD-process-review-taste-52, STD-process-review-taste-53, STD-process-review-taste-54, STD-process-review-taste-55, STD-process-review-taste-56, STD-process-review-taste-57, STD-process-review-taste-58, STD-process-review-taste-59, STD-process-review-taste-60, STD-process-review-taste-62, STD-process-review-taste-63, STD-process-review-taste-64, STD-process-review-taste-65, STD-process-review-taste-66, STD-process-review-taste-67, STD-visual-details-65, STD-visual-details-66</details>
- STD-when-to-animate-01: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-03: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-04: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-05: motion.duration.instant = 0ms
- STD-when-to-animate-06: followed; it sets no values (DESIGN.md and review carry it)
- STD-when-to-animate-07: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-08: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-09: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-10: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-11: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-13: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-15: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-16: followed; it sets no values
- STD-when-to-animate-17: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-20: followed; it sets no values (DESIGN.md carries it)
- STD-when-to-animate-22: followed; it sets no values
- STD-easing-duration-01: motion.easing.linear = [0, 0, 1, 1]
- STD-easing-duration-01: motion.easing.hover = [0.25, 0.1, 0.25, 1]
- STD-easing-duration-02: motion.easing.enter = [0.23, 1, 0.32, 1]
- STD-easing-duration-02: motion.easing.exit = [0.23, 1, 0.32, 1]
- STD-easing-duration-02: motion.easing.standard = [0.77, 0, 0.175, 1]
- STD-easing-duration-03: followed; it sets no values (DESIGN.md and review carry it)
- STD-easing-duration-06: followed; it sets no values (DESIGN.md and review carry it)
- STD-easing-duration-07: motion.duration.micro = 100ms
- STD-easing-duration-07: motion.duration.short = 150ms
- STD-easing-duration-07: motion.duration.medium = 200ms
- STD-easing-duration-07: motion.duration.long = 250ms
- STD-easing-duration-09: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-10: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-11: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-12: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-13: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-15: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-17: followed; it sets no values (DESIGN.md carries it)
- STD-easing-duration-19: followed; it sets no values
- STD-enter-exit-origin-01: motion.scale.enter = 0.95
- STD-enter-exit-origin-02: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-03: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-04: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-06: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-08: motion.duration.medium = 200ms
- STD-enter-exit-origin-08: motion.scale.enter = 0.95
- STD-enter-exit-origin-09: motion.duration.tooltip = 125ms
- STD-enter-exit-origin-09: motion.scale.enter-tooltip = 0.97
- STD-enter-exit-origin-10: motion.duration.instant = 0ms
- STD-enter-exit-origin-11: motion.duration.modal = 250ms
- STD-enter-exit-origin-11: motion.scale.enter-modal = 0.96
- STD-enter-exit-origin-12: motion.duration.modal = 250ms
- STD-enter-exit-origin-13: motion.duration.stagger = 50ms
- STD-enter-exit-origin-16: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-17: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-21: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-23: motion.duration.medium = 200ms
- STD-enter-exit-origin-24: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-26: motion.duration.reveal = 600ms
- STD-enter-exit-origin-27: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-28: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-29: motion.blur.crossfade = 2px
- STD-enter-exit-origin-30: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-31: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-37: followed; it sets no values
- STD-enter-exit-origin-38: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-39: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-40: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-41: motion.easing.drawer = [0.32, 0.72, 0, 1]
- STD-enter-exit-origin-41: motion.duration.drawer = 500ms
- STD-enter-exit-origin-42: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-43: followed; it sets no values (DESIGN.md carries it)
- STD-enter-exit-origin-44: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-01: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-02: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-04: motion.spring.spatial.dampingRatio = 1.0
- STD-springs-gestures-04: motion.spring.spatial.stiffness = 246.7
- STD-springs-gestures-05: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-06: motion.spring.momentum = {"dampingRatio": 0.8, "stiffness": 246.7, "mass": 1}
- STD-springs-gestures-07: followed; it sets no values (DESIGN.md and review carry it)
- STD-springs-gestures-08: motion.spring.sheet = {"dampingRatio": 0.8, "stiffness": 438.6, "mass": 1}
- STD-springs-gestures-09: motion.spring.rotation = {"dampingRatio": 0.8, "stiffness": 246.7, "mass": 1}
- STD-springs-gestures-11: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-12: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-13: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-14: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-15: followed; it sets no values (DESIGN.md and review carry it)
- STD-springs-gestures-16: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-17: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-18: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-19: motion.gesture.deceleration-rate = 0.998
- STD-springs-gestures-20: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-21: motion.gesture.dismiss-velocity = 0.11
- STD-springs-gestures-25: motion.gesture.rubberband-constant = 0.55
- STD-springs-gestures-26: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-28: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-30: motion.gesture.direction-threshold = 10px
- STD-springs-gestures-34: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-39: followed; it sets no values (DESIGN.md and review carry it)
- STD-springs-gestures-41: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-42: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-45: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-59: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-60: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-61: followed; it sets no values (DESIGN.md carries it)
- STD-springs-gestures-63: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-01: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-02: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-06: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-09: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-10: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-11: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-12: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-13: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-14: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-15: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-16: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-17: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-24: followed; it sets no values (DESIGN.md carries it)
- STD-performance-properties-25: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-01: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-02: raw.reducedMotion = "replace"
- STD-accessibility-motion-02: motion.duration.reduced-fade = 200ms
- STD-accessibility-motion-02: reduced:motion.transition.enter = {"duration": "{motion.duration.reduced-fade}", "delay": {"value": 0, "unit": "ms"}, "timingFunction": [0.25, 0.1, 0.25, 1]}
- STD-accessibility-motion-02: reduced:motion.transition.exit = {"duration": "{motion.duration.reduced-fade}", "delay": {"value": 0, "unit": "ms"}, "timingFunction": [0.25, 0.1, 0.25, 1]}
- STD-accessibility-motion-02: reduced:motion.transition.expand = {"duration": "{motion.duration.reduced-fade}", "delay": {"value": 0, "unit": "ms"}, "timingFunction": [0.25, 0.1, 0.25, 1]}
- STD-accessibility-motion-05: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-06: followed; it sets no values
- STD-accessibility-motion-07: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-08: followed; it sets no values (DESIGN.md and review carry it)
- STD-accessibility-motion-09: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-10: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-11: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-12: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-13: followed; it sets no values (DESIGN.md and review carry it)
- STD-accessibility-motion-15: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-16: followed; it sets no values (DESIGN.md and review carry it)
- STD-accessibility-motion-17: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-18: followed; it sets no values
- STD-accessibility-motion-20: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-23: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-24: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-26: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-27: followed; it sets no values (DESIGN.md and review carry it)
- STD-components-toasts-drawers-03: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-07: motion.duration.toast = 400ms
- STD-components-toasts-drawers-07: motion.easing.toast = [0.25, 0.1, 0.25, 1]
- STD-components-toasts-drawers-10: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-11: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-12: component.toast.gap = 14px
- STD-components-toasts-drawers-13: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-14: component.toast.visible = 3
- STD-components-toasts-drawers-15: component.toast.duration = 4000ms
- STD-components-toasts-drawers-16: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-17: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-18: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-25: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-29: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-30: component.toast.offset.desktop = 32px
- STD-components-toasts-drawers-30: component.toast.offset.mobile = 16px
- STD-components-toasts-drawers-33: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-34: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-37: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-40: motion.easing.drawer = [0.32, 0.72, 0, 1]
- STD-components-toasts-drawers-44: motion.gesture.drag-lock-after-scroll = 100ms
- STD-components-toasts-drawers-45: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-48: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-65: followed; it sets no values
- STD-components-toasts-drawers-72: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-77: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-02: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-03: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-05: motion.scale.press = 0.97
- STD-mobile-touch-05: motion.duration.micro = 100ms
- STD-mobile-touch-06: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-07: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-08: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-09: size.target.touch = 44px
- STD-mobile-touch-09: size.target.min = 44px
- STD-mobile-touch-10: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-11: font.size.input = 16px
- STD-mobile-touch-13: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-14: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-15: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-16: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-17: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-18: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-19: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-20: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-21: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-24: followed; it sets no values
- STD-mobile-touch-28: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-70: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-01: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-02: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-03: followed; it sets no values (DESIGN.md and review carry it)
- STD-visual-details-04: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-05: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-06: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-07: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-08: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-09: followed; it sets no values (DESIGN.md and review carry it)
- STD-visual-details-10: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-11: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-13: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-14: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-15: followed; it sets no values (DESIGN.md and review carry it)
- STD-visual-details-16: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-17: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-18: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-19: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-20: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-21: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-24: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-25: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-26: followed; it sets no values (DESIGN.md and review carry it)
- STD-visual-details-27: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-28: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-29: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-30: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-31: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-32: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-33: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-34: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-35: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-36: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-37: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-38: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-39: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-40: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-41: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-42: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-43: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-44: followed; it sets no values
- STD-visual-details-45: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-46: followed; it sets no values
- STD-visual-details-47: followed; it sets no values
- STD-visual-details-48: followed; it sets no values
- STD-visual-details-49: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-50: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-51: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-55: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-56: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-57: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-59: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-64: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-01: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-02: followed; it sets no values
- STD-process-review-taste-03: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-04: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-05: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-06: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-07: followed; it sets no values
- STD-process-review-taste-08: followed; it sets no values
- STD-process-review-taste-09: followed; it sets no values
- STD-process-review-taste-10: followed; it sets no values
- STD-process-review-taste-11: followed; it sets no values
- STD-process-review-taste-12: followed; it sets no values
- STD-process-review-taste-13: followed; it sets no values
- STD-process-review-taste-14: followed; it sets no values
- STD-process-review-taste-15: followed; it sets no values
- STD-process-review-taste-16: followed; it sets no values
- STD-process-review-taste-17: followed; it sets no values
- STD-process-review-taste-18: followed; it sets no values
- STD-process-review-taste-19: followed; it sets no values
- STD-process-review-taste-20: followed; it sets no values
- STD-process-review-taste-21: followed; it sets no values
- STD-process-review-taste-22: followed; it sets no values
- STD-process-review-taste-23: followed; it sets no values
- STD-process-review-taste-24: followed; it sets no values
- STD-process-review-taste-25: followed; it sets no values
- STD-process-review-taste-26: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-27: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-28: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-29: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-30: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-31: followed; it sets no values
- STD-process-review-taste-32: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-33: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-34: followed; it sets no values
- STD-process-review-taste-35: followed; it sets no values
- STD-process-review-taste-36: followed; it sets no values (DESIGN.md carries it)
- STD-process-review-taste-37: followed; it sets no values
- STD-process-review-taste-38: followed; it sets no values
- STD-process-review-taste-39: followed; it sets no values
- STD-process-review-taste-40: followed; it sets no values (review carries it)
- STD-process-review-taste-41: followed; it sets no values (review carries it)
- STD-process-review-taste-42: followed; it sets no values
- STD-process-review-taste-43: followed; it sets no values
- STD-process-review-taste-44: followed; it sets no values
- STD-process-review-taste-45: followed; it sets no values
- STD-process-review-taste-46: followed; it sets no values
- STD-process-review-taste-47: followed; it sets no values
- STD-process-review-taste-48: followed; it sets no values
- STD-process-review-taste-49: followed; it sets no values
- STD-process-review-taste-50: followed; it sets no values
- STD-process-review-taste-51: followed; it sets no values
- STD-process-review-taste-52: followed; it sets no values
- STD-process-review-taste-53: followed; it sets no values
- STD-process-review-taste-54: followed; it sets no values
- STD-process-review-taste-55: followed; it sets no values
- STD-process-review-taste-56: followed; it sets no values
- STD-process-review-taste-57: followed; it sets no values
- STD-process-review-taste-58: followed; it sets no values
- STD-process-review-taste-59: followed; it sets no values
- STD-process-review-taste-60: followed; it sets no values
- STD-process-review-taste-62: followed; it sets no values
- STD-process-review-taste-63: followed; it sets no values
- STD-process-review-taste-64: followed; it sets no values
- STD-process-review-taste-65: followed; it sets no values
- STD-process-review-taste-66: followed; it sets no values
- STD-process-review-taste-67: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-65: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-66: followed; it sets no values (DESIGN.md carries it)

## D-0007 · dials.roundness = 6
- set_by: reference · locked: no · date: 2026-11-18 · supersedes: none · source_ref: lacquer-gallery
- reason: from reference lacquer-gallery (medium confidence): most common control radius 0.0 -> A5 band

## D-0008 · dials.density = 27
- set_by: reference · locked: no · date: 2026-11-18 · supersedes: none · source_ref: lacquer-gallery
- reason: from reference lacquer-gallery (medium confidence): body 17.0px, 32% of the height blank -> A3 bands

## D-0009 · dials.depth = 8
- set_by: reference · locked: no · date: 2026-11-18 · supersedes: none · source_ref: lacquer-gallery
- reason: from reference lacquer-gallery (medium confidence): borders -> A6 bands

## D-0010 · dials.colorfulness = 45
- set_by: reference · locked: no · date: 2026-11-18 · supersedes: none · source_ref: lacquer-gallery
- reason: from reference lacquer-gallery (high confidence): top accent HCT chroma 62.1, 3.9% of the page in colour -> A7 anchors

## D-0011 · dials.warmth = 50
- set_by: reference · locked: no · date: 2026-11-18 · supersedes: none · source_ref: lacquer-gallery
- reason: from reference lacquer-gallery (high confidence): neutral tint chroma 0.0 at hue 90.0 -> A8 anchors

## D-0012 · context.product = "a WeChat Mini Program for the clients of Shantung, a Shandong luxury maison (silk scarves, ties, Laoshan green tea), plus the iPad tools its boutiques use: the advisors portal and an entrance kiosk"
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: D-0002 · source_ref: none
- reason: from the owner's description of the product
- previous value: "WeChat DevTools: import apps/miniprogram/dist/weapp with the test AppID."

## D-0013 · answers.Q-plat-01 = ["ios", "android", "web"]
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: D-0003 · source_ref: none
- reason: the Mini Program runs inside WeChat on iPhone and Android phones; the browser version and the boutique iPad screens are web
- previous value: ["web"]
- also set: raw.platforms = ["ios", "android", "web"] (from Q-plat-01)

## D-0014 · House standards v4 for android, compose, css, ios, swift, web: 138 now apply, 0 no longer apply
- set_by: standard · locked: yes · date: 2026-11-18 · supersedes: none · source_ref: standards.json v4
- reason: The platforms or the stack changed, so the house standards were re-scoped: the ones that now apply are applied and locked; the ones that no longer apply are unlocked, not reverted.
- <details><summary>138 standards</summary> STD-when-to-animate-14, STD-enter-exit-origin-25, STD-enter-exit-origin-33, STD-performance-properties-18, STD-performance-properties-19, STD-performance-properties-20, STD-components-toasts-drawers-08, STD-components-toasts-drawers-60, STD-mobile-touch-30, STD-mobile-touch-33, STD-mobile-touch-34, STD-mobile-touch-35, STD-mobile-touch-36, STD-mobile-touch-37, STD-mobile-touch-38, STD-mobile-touch-39, STD-mobile-touch-41, STD-mobile-touch-42, STD-mobile-touch-44, STD-mobile-touch-48, STD-mobile-touch-51, STD-mobile-touch-60, STD-mobile-touch-61, STD-mobile-touch-62, STD-mobile-touch-67, STD-swift-01, STD-swift-02, STD-swift-03, STD-swift-04, STD-swift-05, STD-swift-06, STD-swift-07, STD-swift-08, STD-swift-09, STD-swift-10, STD-swift-11, STD-swift-12, STD-swift-13, STD-swift-14, STD-swift-15, STD-swift-16, STD-swift-17, STD-swift-18, STD-swift-19, STD-swift-20, STD-swift-21, STD-swift-22, STD-swift-23, STD-swift-24, STD-swift-25, STD-swift-26, STD-swift-27, STD-swift-28, STD-swift-29, STD-swift-30, STD-swift-31, STD-swift-32, STD-swift-33, STD-swift-34, STD-swift-35, STD-swift-36, STD-swift-37, STD-swift-38, STD-swift-39, STD-swift-40, STD-swift-41, STD-swift-42, STD-swift-43, STD-swift-44, STD-swift-45, STD-swift-46, STD-swift-47, STD-swift-48, STD-swift-49, STD-swift-50, STD-swift-51, STD-swift-52, STD-swift-53, STD-swift-54, STD-swift-55, STD-swift-56, STD-swift-57, STD-swift-58, STD-swift-59, STD-swift-60, STD-swift-61, STD-swift-62, STD-swift-63, STD-swift-64, STD-swift-65, STD-swift-66, STD-swift-67, STD-swift-68, STD-swift-69, STD-swift-70, STD-swift-71, STD-swift-72, STD-swift-73, STD-swift-74, STD-swift-75, STD-swift-76, STD-swift-77, STD-swift-78, STD-swift-79, STD-swift-80, STD-swift-81, STD-swift-82, STD-swift-83, STD-swift-84, STD-swift-85, STD-swift-86, STD-swift-87, STD-swift-88, STD-swift-89, STD-swift-90, STD-swift-91, STD-swift-92, STD-swift-93, STD-swift-94, STD-swift-95, STD-swift-96, STD-swift-97, STD-swift-98, STD-swift-99, STD-swift-100, STD-swift-101, STD-swift-102, STD-swift-103, STD-swift-104, STD-swift-105, STD-swift-106, STD-swift-107, STD-swift-108, STD-swift-109, STD-swift-110, STD-swift-111, STD-swift-112, STD-swift-113</details>
- STD-when-to-animate-14: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-25: followed; it sets no values (DESIGN.md and review carry it)
- STD-enter-exit-origin-33: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-18: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-19: followed; it sets no values (DESIGN.md and review carry it)
- STD-performance-properties-20: followed; it sets no values (DESIGN.md and review carry it)
- STD-components-toasts-drawers-08: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-60: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-30: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-33: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-34: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-35: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-36: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-37: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-38: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-39: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-41: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-42: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-44: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-48: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-51: motion.spring.spatial.dampingRatio = 1.0
- STD-mobile-touch-60: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-61: followed; it sets no values (DESIGN.md and review carry it)
- STD-mobile-touch-62: followed; it sets no values (DESIGN.md carries it)
- STD-mobile-touch-67: followed; it sets no values (DESIGN.md carries it)
- STD-swift-01: followed; it sets no values (DESIGN.md carries it)
- STD-swift-02: followed; it sets no values (DESIGN.md carries it)
- STD-swift-03: followed; it sets no values (DESIGN.md carries it)
- STD-swift-04: followed; it sets no values
- STD-swift-05: followed; it sets no values
- STD-swift-06: followed; it sets no values
- STD-swift-07: followed; it sets no values (DESIGN.md carries it)
- STD-swift-08: followed; it sets no values
- STD-swift-09: followed; it sets no values
- STD-swift-10: followed; it sets no values
- STD-swift-11: followed; it sets no values
- STD-swift-12: followed; it sets no values
- STD-swift-13: followed; it sets no values
- STD-swift-14: followed; it sets no values
- STD-swift-15: followed; it sets no values (DESIGN.md carries it)
- STD-swift-16: followed; it sets no values (DESIGN.md carries it)
- STD-swift-17: followed; it sets no values (DESIGN.md carries it)
- STD-swift-18: followed; it sets no values (DESIGN.md carries it)
- STD-swift-19: followed; it sets no values (DESIGN.md and review carry it)
- STD-swift-20: followed; it sets no values
- STD-swift-21: followed; it sets no values
- STD-swift-22: followed; it sets no values
- STD-swift-23: followed; it sets no values
- STD-swift-24: followed; it sets no values
- STD-swift-25: followed; it sets no values
- STD-swift-26: followed; it sets no values
- STD-swift-27: followed; it sets no values
- STD-swift-28: followed; it sets no values
- STD-swift-29: followed; it sets no values
- STD-swift-30: followed; it sets no values
- STD-swift-31: followed; it sets no values
- STD-swift-32: followed; it sets no values
- STD-swift-33: followed; it sets no values
- STD-swift-34: followed; it sets no values
- STD-swift-35: followed; it sets no values (DESIGN.md carries it)
- STD-swift-36: followed; it sets no values (review carries it)
- STD-swift-37: followed; it sets no values
- STD-swift-38: followed; it sets no values
- STD-swift-39: followed; it sets no values
- STD-swift-40: followed; it sets no values
- STD-swift-41: followed; it sets no values
- STD-swift-42: followed; it sets no values
- STD-swift-43: followed; it sets no values (DESIGN.md and review carry it)
- STD-swift-44: followed; it sets no values (DESIGN.md carries it)
- STD-swift-45: followed; it sets no values (DESIGN.md carries it)
- STD-swift-46: followed; it sets no values (DESIGN.md carries it)
- STD-swift-47: followed; it sets no values
- STD-swift-48: followed; it sets no values
- STD-swift-49: followed; it sets no values
- STD-swift-50: followed; it sets no values
- STD-swift-51: followed; it sets no values
- STD-swift-52: followed; it sets no values (review carries it)
- STD-swift-53: followed; it sets no values
- STD-swift-54: followed; it sets no values
- STD-swift-55: followed; it sets no values
- STD-swift-56: followed; it sets no values
- STD-swift-57: followed; it sets no values
- STD-swift-58: followed; it sets no values
- STD-swift-59: followed; it sets no values
- STD-swift-60: followed; it sets no values (review carries it)
- STD-swift-61: followed; it sets no values
- STD-swift-62: followed; it sets no values
- STD-swift-63: followed; it sets no values
- STD-swift-64: followed; it sets no values
- STD-swift-65: followed; it sets no values
- STD-swift-66: followed; it sets no values
- STD-swift-67: followed; it sets no values
- STD-swift-68: followed; it sets no values
- STD-swift-69: followed; it sets no values (review carries it)
- STD-swift-70: followed; it sets no values
- STD-swift-71: followed; it sets no values
- STD-swift-72: followed; it sets no values
- STD-swift-73: followed; it sets no values
- STD-swift-74: followed; it sets no values
- STD-swift-75: followed; it sets no values
- STD-swift-76: followed; it sets no values
- STD-swift-77: followed; it sets no values
- STD-swift-78: followed; it sets no values
- STD-swift-79: followed; it sets no values
- STD-swift-80: followed; it sets no values
- STD-swift-81: followed; it sets no values
- STD-swift-82: followed; it sets no values
- STD-swift-83: followed; it sets no values
- STD-swift-84: followed; it sets no values
- STD-swift-85: followed; it sets no values
- STD-swift-86: followed; it sets no values
- STD-swift-87: followed; it sets no values
- STD-swift-88: followed; it sets no values (review carries it)
- STD-swift-89: followed; it sets no values
- STD-swift-90: followed; it sets no values
- STD-swift-91: followed; it sets no values
- STD-swift-92: followed; it sets no values
- STD-swift-93: followed; it sets no values
- STD-swift-94: followed; it sets no values
- STD-swift-95: followed; it sets no values
- STD-swift-96: followed; it sets no values
- STD-swift-97: followed; it sets no values (DESIGN.md and review carry it)
- STD-swift-98: followed; it sets no values
- STD-swift-99: followed; it sets no values
- STD-swift-100: followed; it sets no values
- STD-swift-101: followed; it sets no values
- STD-swift-102: followed; it sets no values
- STD-swift-103: followed; it sets no values
- STD-swift-104: followed; it sets no values
- STD-swift-105: followed; it sets no values
- STD-swift-106: followed; it sets no values
- STD-swift-107: followed; it sets no values
- STD-swift-108: followed; it sets no values
- STD-swift-109: followed; it sets no values
- STD-swift-110: followed; it sets no values
- STD-swift-111: followed; it sets no values
- STD-swift-112: followed; it sets no values
- STD-swift-113: followed; it sets no values

## D-0015 · House standards: 1 value back to the engine's own for these platforms
- set_by: standard · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: The platforms changed, so a value a standard held no longer passes a check the engine enforces (accessibility floors outrank every standard, KNOWLEDGE.md 2). It went back to the engine's own value, as a fresh sketch for these platforms does.
- STD-mobile-touch-09: size.target.touch went back to the engine's own value for these platforms; 44px would break a check (size.target.touch is 44px, below the 48px minimum)

## D-0016 · answers.Q-scope-07 = "building"
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: D-0004 · source_ref: none
- reason: the repo is a running skeleton with no screens yet; the Dockerfile is for local dev, not a launch
- previous value: "near-launch"

## D-0017 · answers.Q-aud-01 = "large"
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: the main surface is the clients' Mini Program, opened now and then on phones; the advisors' iPad portal is used all day and gets its own density later
- also set: dials.density = 15 (from Q-aud-01)

## D-0018 · raw.stack = ["react"]
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: D-0005 · source_ref: none
- reason: Taro (React) for the Mini Program and Vite + React for the iPad screens, from apps/*/package.json
- previous value: []

## D-0019 · House standards v4 for android, compose, css, ios, react, swift, web: 21 now apply, 0 no longer apply
- set_by: standard · locked: yes · date: 2026-11-18 · supersedes: none · source_ref: standards.json v4
- reason: The platforms or the stack changed, so the house standards were re-scoped: the ones that now apply are applied and locked; the ones that no longer apply are unlocked, not reverted.
- <details><summary>21 standards</summary> STD-springs-gestures-24, STD-accessibility-motion-03, STD-accessibility-motion-25, STD-components-toasts-drawers-02, STD-components-toasts-drawers-04, STD-components-toasts-drawers-05, STD-components-toasts-drawers-19, STD-components-toasts-drawers-20, STD-components-toasts-drawers-21, STD-components-toasts-drawers-22, STD-components-toasts-drawers-23, STD-components-toasts-drawers-24, STD-components-toasts-drawers-26, STD-components-toasts-drawers-27, STD-components-toasts-drawers-28, STD-components-toasts-drawers-35, STD-components-toasts-drawers-38, STD-components-toasts-drawers-39, STD-components-toasts-drawers-78, STD-visual-details-61, STD-visual-details-62</details>
- STD-springs-gestures-24: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-03: followed; it sets no values (DESIGN.md carries it)
- STD-accessibility-motion-25: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-02: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-04: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-05: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-19: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-20: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-21: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-22: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-23: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-24: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-26: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-27: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-28: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-35: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-38: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-39: followed; it sets no values (DESIGN.md carries it)
- STD-components-toasts-drawers-78: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-61: followed; it sets no values (DESIGN.md carries it)
- STD-visual-details-62: followed; it sets no values (DESIGN.md and review carry it)

## D-0020 · answers.Q-aud-01 = "large"
- set_by: chosen · locked: no · date: 2026-11-18 · supersedes: D-0017 · source_ref: none
- reason: sketch: Level 0 answer
- previous value: "large"
- also set: dials.density = 15 (from Q-aud-01)

## D-0021 · context.audience = "people who use it now and then, often on a phone"
- set_by: assumed · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: sketch: plain words for Q-aud-01
- previous value: ""

## D-0022 · raw.brandColor = "#932b1e"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: sketch: picked for them

## D-0023 · answers.Q-plat-01 = ["ios", "android", "web"]
- set_by: chosen · locked: no · date: 2026-11-18 · supersedes: D-0013 · source_ref: none
- reason: sketch: Level 0 answer
- previous value: ["ios", "android", "web"]
- also set: raw.platforms = ["ios", "android", "web"] (from Q-plat-01)

## D-0024 · macros = ["premium", "heritage", "deferential", "minimal"]
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: sketch: picked for them (feel words: premium, heritage, calm, minimal)
- previous value: []

## D-0025 · taste.feelWords = ["premium", "heritage", "calm", "minimal"]
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: sketch: feel words picked for them

## D-0026 · taste.brief = "dark red, black and white, with sunny clear-blue-sky Chinese architecture"
- set_by: chosen · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: sketch: the person's picture of the look

## D-0027 · answers.Q-theme-01 = "system-light-dark"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: sketch: picked for them
- also set: raw.flags.darkMode = true (from Q-theme-01)
- also set: raw.defaultTheme = "system" (from Q-theme-01)

## D-0028 · answers.Q-scope-06 = ["mini program:experience", "advisor portal:operate", "entrance kiosk:experience"]
- set_by: chosen · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: sketch: Level 0 answer
- also set: context.surfaces = [{"name": "mini program", "mode": "Experience"}, {"name": "advisor portal", "mode": "Operate"}, {"name": "entrance kiosk", "mode": "Experience"}] (from Q-scope-06)
- also set: raw.productType = "marketing" (from Q-scope-06)
- also set: raw.marketingSurfaces = true (from Q-scope-06)

## D-0029 · defaults.persuade = ["spacing", "hero"]
- set_by: auto_default · locked: no · date: 2026-11-18 · supersedes: none · source_ref: DC-L03-16, DC-L06-03, S-L03-074, S-L06-002
- reason: Marketing page defaults for what you have not answered, set or locked (main surface: Experience). Confirm or change any of them like any other answer.
- spacing: Spacious spacing by default, with 48px controls (buttons on the page 48 to 56px) [DC-L03-07, S-L03-082, S-L03-074]
- hero: Headings step up by at least 1.25, with hero moments and a separate display scale [DC-L06-03, S-L06-002, DC-L02-09]

## D-0030 · answers.Q-dir-01 = "flat2"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: delegated: flat surfaces with thin rules over tonal or glass, matching the measured reference (no shadows, 1px lines); to undo, pick Q-dir-01 again
- also set: preset = "flat2" (from Q-dir-01)

## D-0031 · answers.Q-color-02 = "signature-surface"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: delegated: red stays rare (about 4% of the page) but owns full-width bands (salons, limited releases, the Brocade card) over accent-only; to undo, pick Q-color-02 accent
- also set: overrides.color.brandRole = "accent+signature-surface" (from Q-color-02)
- also set: overrides.chrome.navTreatment = "neutral" (from Q-color-02)
- also set: overrides.color.surfaces = "tinted-containers" (from Q-color-02)

## D-0032 · answers.Q-type-01 = "brand-display"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: delegated: a free luxury serif for titles and labels, the device font for running text (PingFang/Songti keep Chinese fast, nothing heavy to load in WeChat) over a serif everywhere; to undo, pick Q-type-01 again
- also set: raw.textFace = "system" (from Q-type-01)
- also set: raw.displayFace = "=brandFace" (from Q-type-01)

## D-0033 · answers.Q-motion-01 = "two-mode"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: delegated: plain, calm motion for most actions and slow, polished moments for a few (tier card reveal, gallery entrances) over springs; owner asked for smooth and premium
- also set: dials.energy = 50 (from Q-motion-01)
- also set: raw.flags.motionOff = false (from Q-motion-01)

## D-0034 · overrides.font.family.display = "\"Cormorant Garamond\", \"Songti SC\", \"Noto Serif SC\", \"Noto Serif CJK SC\", serif"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: delegated: Cormorant Garamond (SIL OFL, free to self-host) is an open old-style serif of the same class as the measured reference display face; Chinese titles fall back to the phone's own Song serif so nothing heavy loads in WeChat

## D-0035 · overrides.font.family.text = "-apple-system, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans SC\", \"Microsoft YaHei\", Roboto, \"Helvetica Neue\", Arial, sans-serif"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: delegated: the device's own sans for running text, with the Chinese system faces listed first after the Apple stack so zh-Hans text never falls back to a Japanese face

## D-0036 · raw.fontLicence = {"web": true, "app": true, "selfHost": true}
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: Cormorant Garamond is SIL Open Font License 1.1: web, app and self-hosting allowed
- previous value: {"web": null, "app": null, "selfHost": null}

## D-0037 · dials.energy = 20
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: delegated: calm and slow (owner: smooth, premium); no bounce
- previous value: 50

## D-0038 · overrides.font.family.display = ["Cormorant Garamond", "Songti SC", "Noto Serif SC", "Noto Serif CJK SC", "serif"]
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: D-0034 · source_ref: none
- reason: delegated: Cormorant Garamond (SIL OFL) is an open old-style serif of the same class as the measured reference display face; Chinese titles fall back to the phone's own Song serif, so nothing heavy loads in WeChat
- previous value: "\"Cormorant Garamond\", \"Songti SC\", \"Noto Serif SC\", \"Noto Serif CJK SC\", serif"

## D-0039 · overrides.font.family.text = ["-apple-system", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", "Roboto", "Helvetica Neue", "Arial", "sans-serif"]
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: D-0035 · source_ref: none
- reason: delegated: the device's own sans for running text, with Chinese system faces early so zh-Hans never falls back to a Japanese face
- previous value: "-apple-system, \"PingFang SC\", \"Hiragino Sans GB\", \"Noto Sans SC\", \"Microsoft YaHei\", Roboto, \"Helvetica Neue\", Arial, sans-serif"

## D-0040 · hooks.H-photo.status = "open-library"
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: 27 open-licence photos from Wikimedia Commons (CC0, PD, CC BY, CC BY-SA), reviewed for brands and people, credits in apps/cms/seed/photos/CREDITS.md; a real maison would commission its own shoot
- previous value: "pending"

## D-0041 · overrides.motion.distance.reveal = {"value": 12, "unit": "px"}
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: house rule: entrances rise 12px while fading in
- new dimension token in semantic.tokens.json

## D-0042 · overrides.font.tracking.caps-display = 0.04
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: delegated: serif capitals in titles and navigation read luxurious with air between letters (measured reference); 0.01em was too tight for Cormorant caps

## D-0043 · overrides.motion.distance.photo-zoom = {"value": 16, "unit": "px"}
- set_by: delegated · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: house rule: photos settle into place as they enter; expressed as a 16px zoom inset (scale 1.04 on a ~400px photo) because the token set has no scale type
- new dimension token in semantic.tokens.json

## D-0044 · overrides.motion.duration.page = {"value": 320, "unit": "ms"}
- set_by: chosen · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: owner: page changes need a quick but visible entrance
- quote: "Going from one page another should have a rather quick, but visible transition with a premium feel."
- new duration token in primitives.tokens.json

## D-0045 · overrides.radius.panel = "{radius.16}"
- set_by: chosen · locked: no · date: 2026-11-18 · supersedes: none · source_ref: none
- reason: A panel floating over a full-bleed photo (the kiosk card) is rounded so it reads as an object, not a flat white plane; other containers stay square
- quote: "make sure the white card has rounded corners so it doesn't look like a big flat white plane"
- new dimension token in semantic.tokens.json
