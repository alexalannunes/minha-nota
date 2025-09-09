"use client";
import { ComponentProps, useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  text,
  className,
  ...props
}: { text?: string } & ComponentProps<"button">) {
  const [copied, setCopied] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleCopy = async () => {
    if (!text) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    setCopied(true);
    await navigator.clipboard.writeText(text);

    timerRef.current = setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef?.current);
    };
  }, []);

  const safeText = text ?? "";

  return (
    <Button
      type="button"
      aria-label={copied ? "Copiado" : "Copiar"}
      disabled={!text || text === ""}
      className={cn(
        "absolute right-1 top-1/2 -translate-y-1/2 size-7 text-gray-500",
        className
      )}
      variant={"ghost"}
      onClick={handleCopy}
      {...props}
    >
      <Check
        className={cn("scale-0 absolute transition-transform", {
          "scale-100 stroke-green-500": copied,
        })}
      />
      <Copy
        className={cn("scale-100 rotate-0 transition-transform", {
          "scale-0": copied,
        })}
      />
    </Button>
  );
}
