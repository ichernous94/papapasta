# Gallery viewport and vertical scroll — 2026-11-13

The mobile lightbox mixed the shared Modal's `max-block-size: calc(100svh - 2rem)` and `overflow-y: auto` with a slider sized from `100dvh`. When the mobile browser's small and dynamic viewport heights differed by 120px, both restaurants reproduced 100px of internal overflow. A vertical gesture moved the dialog's scrollTop to 100 while the document's scrollY remained unchanged.

Only Gallery's scoped styles change. Its whole dialog now uses `min(calc(100dvh - 2rem), 52.75rem)` with the same dynamic-viewport maximum. The upper bound preserves the previous maximum desktop composition: 46rem of photography plus the existing close-button padding, controls and spacing.

An open lightbox uses two grid rows, `minmax(0, 1fr) auto`, with the existing 0.75rem gap. The slider fills the available first row and can shrink with min-block-size zero. The control row remains in flow; its previous top margin is replaced by the grid gap. The display override applies only to [open], so closed dialogs remain hidden.

The lightbox has hidden overflow and no overscroll chaining. `touch-action: pinch-zoom` on the lightbox, slider and backdrop prevents native one-finger vertical panning while preserving browser pinch zoom. The slider selector explicitly overrides Swiper's default pan-y. Swiper still handles horizontal swipes in JavaScript.

The shared Modal/scroll-lock implementation, card dialogs, image contain-fit, width, controls and animation timings are unchanged.

## Verification

- Production build and its TypeScript checks passed.
- All five targeted gallery motion/image-presentation tests passed.
- Chromium verified PapaPasta/Centro photo strips and the PapaPasta venue grid at 320×568, 375×812, 430×932, 812×375 and 1440×900. Mobile cases included 0px and 120px small/dynamic viewport differences: 27 combinations in total.
- Every combination had zero dialog scrollTop, no vertical overflow and visible controls. Vertical gestures over the photo, counter and backdrop left both the dialog and document position unchanged. Horizontal swipes and arrow controls worked throughout.
- Native two-finger pinch zoom and keyboard arrows passed for all three gallery contexts. Closing retained the background lock through its animation, restored the original page position, and released ordinary page scrolling. Reopening stayed non-scrolling.
- Mobile and desktop screenshots were reviewed for contain-fit images and accessible controls.

No source changes were made to the shared Modal or scroll-lock hook. Physical iPhone/Safari and Android devices were unavailable; mobile Chromium emulation does not replace those device checks. This is a local change and has not been deployed to the public domains.
