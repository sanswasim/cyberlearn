export function TopBar({ title }: { title?: string }) {
  return (
    <header className="flex h-14 items-center border-b border-[#1E2A44] bg-[#121A2B] px-6">
      {title && <h1 className="text-lg font-semibold text-[#E6EDF3]">{title}</h1>}
    </header>
  );
}
