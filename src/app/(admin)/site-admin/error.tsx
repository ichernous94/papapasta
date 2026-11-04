'use client';
export default function ErrorPage({ reset }: {
    reset: () => void;
}) { return <main><h1>Could not open the admin panel</h1><p>The admin panel is temporarily unavailable. Please try again.</p><button type="button" onClick={reset}>Try again</button></main>; }
