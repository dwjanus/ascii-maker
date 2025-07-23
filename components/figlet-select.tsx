"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fontList } from "@/fonts/fontList";
import { useClickAway } from "@uidotdev/usehooks";

const ITEM_HEIGHT = fontList.length;
const VISIBLE_COUNT = 8;

type Props = {
  value?: string;
  onChange: (value: string) => void;
};

const options = fontList;

export default function FigletSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrollRef = useClickAway<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === null || prev === options.length - 1 ? 0 : prev + 1
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === null || prev === 0 ? options.length - 1 : prev - 1
      );
    } else if (e.key === "Enter" && activeIndex !== null) {
      onChange(options[activeIndex]);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (!activeIndex) return;
    onChange(options[activeIndex]);
  }, [activeIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (activeIndex !== null && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  return (
    <div
      className="relative w-44 h-12 focus-within:outline-none focus-within:border-none"
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <button
        aria-pressed={isOpen}
        onClick={() => {
          if (!isOpen) {
            setIsOpen((prev) => !prev);
          }
          return;
        }}
        className="relative group w-full px-4 py-2 text-left border rounded-md bg-secondary"
      >
        {options.find((opt) => opt === value) || "Select..."}
        <ChevronDown className="group-aria-pressed:rotate-180 absolute right-1 top-1/2 -translate-y-1/2 transition-all duration-200" />
      </button>

      {isOpen && (
        <ScrollArea
          ref={scrollRef}
          className="absolute z-10 mt-1 w-full max-h-36 border rounded-md bg-secondary shadow-lg"
        >
          <div
            ref={listRef}
            style={{ maxHeight: VISIBLE_COUNT * ITEM_HEIGHT }}
            className="overflow-y-auto "
          >
            {options.map((option, index) => (
              <div
                key={`figlet-${option}-${index.toString()}`}
                ref={(el: HTMLDivElement | null) => {
                  optionRefs.current[index] = el;
                }}
                onClick={() => {
                  setActiveIndex(index);
                }}
                className={cn(
                  "cursor-pointer px-4 py-2 flex justify-between items-center",
                  activeIndex === index ? "bg-background" : "",
                  value === option ? "font-semibold" : ""
                )}
              >
                <span>{option}</span>
                {value === option && (
                  <Check className="w-4 h-4 text-green-500" />
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
