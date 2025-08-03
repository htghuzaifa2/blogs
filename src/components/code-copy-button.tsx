
"use client";

import { useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { renderToString } from 'react-dom/server';

export function CodeCopyButton() {
  useEffect(() => {
    const codeBlocks = document.querySelectorAll<HTMLElement>(".prose pre");

    codeBlocks.forEach((block) => {
      const codeElement = block.querySelector("code");
      if (!codeElement) return;

      const copyButton = document.createElement("button");
      copyButton.className =
        "absolute top-2 right-2 p-1.5 rounded-md text-sm text-foreground/60 bg-background/50 hover:bg-muted hover:text-foreground transition-opacity opacity-0 group-hover:opacity-100";
      copyButton.setAttribute("aria-label", "Copy code");
      copyButton.innerHTML = renderToString(<Copy size={16} />);

      block.classList.add("group", "relative");
      block.appendChild(copyButton);

      copyButton.addEventListener("click", () => {
        const code = codeElement.innerText;
        navigator.clipboard.writeText(code).then(() => {
          copyButton.innerHTML = renderToString(<Check size={16} className="text-green-500" />);
          copyButton.setAttribute("aria-label", "Copied!");

          setTimeout(() => {
            copyButton.innerHTML = renderToString(<Copy size={16} />);
            copyButton.setAttribute("aria-label", "Copy code");
          }, 2000);
        });
      });
    });
  }, []);

  return null;
}
