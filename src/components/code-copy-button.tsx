
"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { usePathname } from "next/navigation";

interface CopyButtonProps {
  textToCopy: string;
}

function SingleCodeCopyButton({ textToCopy }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded-md text-sm text-foreground/60 bg-background/50 hover:bg-muted hover:text-foreground transition-opacity"
      aria-label={isCopied ? "Copied!" : "Copy code"}
    >
      {isCopied ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <Copy size={16} />
      )}
    </button>
  );
}

export function CodeCopyButton() {
  const [codeBlocks, setCodeBlocks] = useState<string[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    // Find all code blocks and prepare them for rendering with copy buttons
    const getCodeBlocks = () => {
      const allPres = document.querySelectorAll<HTMLElement>(".prose pre");
      const blocks: string[] = [];
      allPres.forEach((block, index) => {
        const codeElement = block.querySelector("code");
        if (codeElement) {
          block.classList.add("group", "relative");
          // Assign a unique ID to each block so React can manage them
          block.setAttribute("data-code-block-id", `code-block-${index}`);
          blocks.push(codeElement.innerText);
        }
      });
      setCodeBlocks(blocks);
    };

    // Use a small delay to ensure the article content is fully rendered
    const timer = setTimeout(getCodeBlocks, 50);

    return () => clearTimeout(timer);
  }, [pathname]); // Re-run when the page route changes

  useEffect(() => {
    // This effect renders the buttons into the DOM via React Portals
    const allPres = document.querySelectorAll<HTMLElement>("[data-code-block-id]");
    if (typeof window !== "undefined") {
      const { createRoot } = require("react-dom/client");
      allPres.forEach((pre, index) => {
        const existingButton = pre.querySelector(".code-copy-button-wrapper");
        if (existingButton) {
          // If a button is already there, don't add another one
          return;
        }

        const buttonWrapper = document.createElement("div");
        buttonWrapper.className = "code-copy-button-wrapper";
        pre.appendChild(buttonWrapper);
        const root = createRoot(buttonWrapper);
        root.render(<SingleCodeCopyButton textToCopy={codeBlocks[index] || ''} />);
      });
    }
  }, [codeBlocks]);


  return null; // This component does not render anything itself
}
