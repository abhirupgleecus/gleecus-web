export default function Spinner({ className = "h-5 w-5 border-2" }: { className?: string }) {
  return <span className={`${className} inline-block animate-spin rounded-full border-current border-t-transparent`} />;
}