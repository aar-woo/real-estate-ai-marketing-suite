interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`w-full flex flex-row justify-center px-4 sm:px-6 lg:px-8 py-6 ${className}`}
    >
      {children}
    </div>
  );
}
