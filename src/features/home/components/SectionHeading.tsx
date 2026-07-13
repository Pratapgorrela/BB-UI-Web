interface SectionHeadingProps {
  id: string;
  title: string;
  subtitle?: string;
}

/** Shared "title + subtitle" heading used above each Home section. */
function SectionHeading({ id, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-3">
      <h2 id={id} className="font-heading text-h4 font-semibold text-neutral-900">
        {title}
      </h2>
      {subtitle && <p className="text-body-sm text-neutral-500">{subtitle}</p>}
    </div>
  );
}

export { SectionHeading };
export type { SectionHeadingProps };
