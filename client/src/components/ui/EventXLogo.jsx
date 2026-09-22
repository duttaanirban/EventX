export function EventXLogo({ className = 'h-10 w-10' }) {
  return (
    <>
      <img src={`${import.meta.env.BASE_URL}eventx-logo-mono.svg`} alt="" aria-hidden="true" className={`shrink-0 dark:hidden ${className}`} />
      <img src={`${import.meta.env.BASE_URL}eventx-logo.svg`} alt="" aria-hidden="true" className={`hidden shrink-0 dark:block ${className}`} />
    </>
  );
}
