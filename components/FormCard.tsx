interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

export default function FormCard({ title, children }: FormCardProps) {
  return (
    <div className="card-mandal animate-fade-in p-5 sm:p-6">
      <h2 className="mb-5 font-heading text-lg font-semibold text-maroon">{title}</h2>
      {children}
    </div>
  );
}
