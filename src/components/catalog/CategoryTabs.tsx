"use client";

import { useRef, useEffect } from "react";
import type { CategoryWithProducts } from "@/types";

interface Props {
  categories: CategoryWithProducts[];
  activeCategoryId: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({ categories, activeCategoryId, onSelect }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEl = document.getElementById(`cat-tab-${activeCategoryId}`);
    if (activeEl && scrollRef.current) {
      const container = scrollRef.current;
      const scrollLeft =
        activeEl.offsetLeft -
        container.offsetWidth / 2 +
        activeEl.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeCategoryId]);

  return (
    <div
      ref={scrollRef}
      className="flex overflow-x-auto scrollbar-hide gap-1.5 px-4 py-2.5 bg-[var(--brand-blush)]/50"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {categories.map((cat) => {
        const isActive = cat.id === activeCategoryId;
        return (
          <button
            key={cat.id}
            id={`cat-tab-${cat.id}`}
            onClick={() => onSelect(cat.id)}
            className={`
              flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${
                isActive
                  ? "gradient-brand text-white shadow-brand"
                  : "bg-white/70 backdrop-blur-sm text-[var(--neutral-600)] hover:bg-white hover:text-[var(--brand-primary)] border border-[var(--neutral-200)]/60"
              }
            `}
          >
            {cat.name}
            <span
              className={`ml-1.5 text-xs ${
                isActive ? "text-white/60" : "text-[var(--neutral-400)]"
              }`}
            >
              {cat.products.length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
