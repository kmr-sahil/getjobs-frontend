"use client";

import createDOMPurify from "dompurify";

const DOMPurify = createDOMPurify(window);

export default function SafeHTML({ html }: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html),
      }}
    />
  );
}
