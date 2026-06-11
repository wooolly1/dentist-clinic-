/**
 * Reusable vector tooth — used by the loading screen, navbar and footer.
 * Pure SVG so it scales crisply and can be animated via CSS / Framer.
 */
export default function ToothIcon({
  className = "",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M32 4C20 4 14 0.5 8 4 1.5 7.7 0 17 2.5 30c1.7 8.6 3.6 13.4 5.6 22.5C9.4 59 10.8 76 16.2 76c5 0 5.3-12 7-19 1.2-4.9 3.1-7.4 8.8-7.4s7.6 2.5 8.8 7.4c1.7 7 2 19 7 19 5.4 0 6.8-17 8.1-23.5 2-9.1 3.9-13.9 5.6-22.5C64 17 62.5 7.7 56 4c-6-3.5-12 0-24 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
