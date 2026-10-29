// page-flip 2.0.7 does not publish declarations. This is the adapter's public API subset.
declare module 'page-flip' {
  export class PageFlip {
    constructor(element: HTMLElement, settings: {
      width: number; height: number; size: 'fixed'; startPage: number;
      usePortrait: boolean; autoSize: boolean; showCover: boolean;
      mobileScrollSupport: boolean; useMouseEvents: boolean; flippingTime: number;
      maxShadowOpacity: number; showPageCorners: boolean; disableFlipByClick: boolean;
    });
    loadFromHTML(pages: HTMLElement[]): void;
    on(event: 'flip', listener: (event: { data: number }) => void): void;
    flipNext(): void; flipPrev(): void;
    turnToPage(page: number): void;
    getCurrentPageIndex(): number;
    getOrientation(): 'portrait' | 'landscape';
    destroy(): void;
  }
  const api: { PageFlip: typeof PageFlip };
  export default api;
}
