import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItemData {
  id: string;
  title: string;
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  className?: string;
}

function Accordion({ items, defaultOpenId, className = '' }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(defaultOpenId ?? null);

  return (
    <div className={['divide-y divide-neutral-300', className].filter(Boolean).join(' ')}>
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          item={item}
          isOpen={openId === item.id}
          onToggle={() => setOpenId((prev) => (prev === item.id ? null : item.id))}
        />
      ))}
    </div>
  );
}

/* ── Single Accordion Item ── */

interface AccordionItemProps {
  item: AccordionItemData;
  isOpen: boolean;
  onToggle: () => void;
}

function AccordionItem({ item, isOpen, onToggle }: AccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen, item.content]);

  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex items-center justify-between w-full py-4 text-left group"
      >
        <span className="text-body font-medium text-neutral-800 pr-4">
          {item.title}
        </span>
        <ChevronDown
          size={20}
          className={[
            'shrink-0 text-neutral-500 transition-transform duration-normal ease-normal',
            isOpen ? 'rotate-180' : '',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>

      <div
        style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
        className="overflow-hidden transition-[max-height] duration-normal ease-normal"
      >
        <div ref={contentRef} className="pb-4 text-body-sm text-neutral-600 leading-body-sm">
          {item.content}
        </div>
      </div>
    </div>
  );
}

export { Accordion };
export type { AccordionProps, AccordionItemData };
