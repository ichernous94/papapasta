# Category return with immediately visible dishes — 2026-11-05

## Behavior

Both themed restaurant MenuTabs immediately select a different category and update ARIA state. If the menu's beginning is above the measured Header, the viewport smoothly returns to that MenuTabs origin minus Header height. It does not return to the page/banner top. If the beginning is already visible, no page movement is requested; selecting the current category does not restart anything.

During the return, the root keeps its occupied height via a temporary min-block-size, preventing a long-to-short category switch from collapsing the layout under the viewport. The new panel is visible immediately, including during smooth scrolling. No waiting opacity attribute or additional fade animation is applied. Once positioned, the guard is removed. Browser-native smooth-scroll duration varies; a requestAnimationFrame tracker detects arrival and limits waiting to 1.5 seconds.

Rapid selections cancel the older operation while retaining its height guard until the new operation takes ownership. Wheel, touch movement, outside pointer interaction and manual scrolling keys interrupt the return while the selected category remains visible. Native default input is not prevented. Reduced motion uses instant positioning; changing that preference during a return completes immediately. Keyboard category navigation/focus and horizontal tab reveal are preserved. Header/viewport changes retarget an in-progress return.

Only user selection begins a transition. Initial render, data refresh and cached Activity restoration do not animate. Animation frames, listeners and temporary size are cleaned up on completion/cancellation/hiding. Cleanup avoids scrolling a new URL during navigation. No URL/history mutation is added. Centro's clip observer also watches root size so releasing the height guard updates the sticky/clipping geometry.

## Kontakt

The separate “Otwórz mapę Google” link/container below Centro's iframe was removed. The embed, Google-provided controls, address and gallery remain. PapaPasta contact content is unchanged.

## Verification

- Updated shared MenuTabs source was bundled into browser fixtures alongside the actual production Header. Both themes passed at 375, 768 and 1440 px: immediate ARIA selection, opacity 1 throughout interpolated return, no panel animation, long-to-short height retention/release, no action on repeated selection and no unnecessary scrolling at the menu beginning.
- Rapid selection, manual wheel cancellation, keyboard End/focus/horizontal reveal, Header/viewport changes, Activity cleanup/restoration and reduced motion passed. Centro clipping exposed the first content below categories; URL stayed unchanged.
- TypeScript, targeted ESLint and SCSS compilation passed. Physical Safari/iPhone was unavailable.

Changed areas for the immediate-visibility revision: useCategoryTransition, MenuTabs styles and documentation. Smooth-scroll management and Centro clipping remain. This supersedes the previous 250 ms fade behavior. No dependency, API, migration, database/R2 object or deployment configuration changes are required.
