function StarIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3.5 w-3.5 shrink-0"
      aria-hidden="true"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.958a1 1 0 0 0 .95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.367 2.446a1 1 0 0 0-.363 1.118l1.286 3.958c.3.921-.755 1.688-1.539 1.118l-3.367-2.446a1 1 0 0 0-1.175 0l-3.367 2.446c-.784.57-1.838-.197-1.539-1.118l1.286-3.958a1 1 0 0 0-.363-1.118L2.088 9.385c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 0 0 .95-.69z" />
    </svg>
  );
}

export default function StarRating({
  rating,
  hideNumber = false,
}: {
  rating: number;
  hideNumber?: boolean;
}) {
  const pct = Math.min(100, (rating / 5) * 100);

  return (
    <span
      className="inline-flex items-center gap-1"
      role="img"
      aria-label={`Rated ${rating} out of 5 stars`}
    >
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex text-zinc-600">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} />
          ))}
        </span>
        <span
          className="absolute inset-y-0 left-0 overflow-hidden whitespace-nowrap"
          style={{ width: `${pct}%` }}
        >
          <span className="flex shrink-0 text-accent">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} />
            ))}
          </span>
        </span>
      </span>
      {!hideNumber && (
        <span className="text-xs font-medium text-muted">{rating}</span>
      )}
    </span>
  );
}