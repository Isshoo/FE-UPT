'use client';

import { Button } from './button';

export default function Pagination({ page = 1, total = 0, pageSize = 10, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil((total || 0) / (pageSize || 10)));
  const current = Math.min(Math.max(1, page || 1), totalPages);

  const canPrev = current > 1;
  const canNext = current < totalPages;

  const goto = (p) => {
    if (!onPageChange) return;
    const next = Math.min(Math.max(1, p), totalPages);
    if (next !== current) onPageChange(next);
  };

  const renderNumbers = () => {
    const pages = [];
    const maxNumbers = 5;
    let start = Math.max(1, current - Math.floor(maxNumbers / 2));
    let end = Math.min(totalPages, start + maxNumbers - 1);
    if (end - start + 1 < maxNumbers) {
      start = Math.max(1, end - maxNumbers + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <Button
          key={i}
          variant={i === current ? 'default' : 'outline'}
          size="sm"
          onClick={() => goto(i)}
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="inline-flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => goto(1)} disabled={!canPrev}>
        «
      </Button>
      <Button variant="outline" size="sm" onClick={() => goto(current - 1)} disabled={!canPrev}>
        ‹
      </Button>

      <div className="inline-flex items-center gap-1">
        {renderNumbers()}
      </div>

      <Button variant="outline" size="sm" onClick={() => goto(current + 1)} disabled={!canNext}>
        ›
      </Button>
      <Button variant="outline" size="sm" onClick={() => goto(totalPages)} disabled={!canNext}>
        »
      </Button>
    </div>
  );
}