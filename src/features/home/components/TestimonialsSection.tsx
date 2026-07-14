import { useCallback, useRef, useState } from 'react';
import { DataState, SkeletonCard } from '../../../components/ui';
import { useFetchTestimonials } from '../hooks/useFetchTestimonials';
import type { Testimonial } from '../types/home';
import { TestimonialCard } from './TestimonialCard';
import { SectionHeading } from './SectionHeading';

const HEADING_ID = 'home-testimonials';

/** Scroll-snap carousel with dot indicators — no external carousel dependency (Rule 10). */
function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);

  const handleScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActive(index);
  }, []);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' });
  }, []);

  return (
    <div>
      <ul
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory list-none gap-4 overflow-x-auto pb-1"
      >
        {testimonials.map((testimonial) => (
          <li key={testimonial.id} className="w-full shrink-0 snap-center px-0.5">
            <TestimonialCard testimonial={testimonial} />
          </li>
        ))}
      </ul>

      {testimonials.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {testimonials.map((testimonial, index) => (
            <button
              key={testimonial.id}
              type="button"
              aria-label={`Go to testimonial ${index + 1}`}
              aria-current={index === active}
              onClick={() => goTo(index)}
              /* 24px hit area (a11y target-size) around the 8px visual dot */
              className="flex size-6 items-center justify-center rounded-full focus-visible:shadow-focus focus-visible:outline-none"
            >
              <span
                aria-hidden="true"
                className={`size-2 rounded-full transition-colors duration-fast ease-fast ${
                  index === active ? 'bg-primary-500' : 'bg-neutral-300'
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** "What Our Customers Say" — featured testimonials carousel. */
function TestimonialsSection() {
  const testimonialsQuery = useFetchTestimonials();

  return (
    <section aria-labelledby={HEADING_ID}>
      <SectionHeading
        id={HEADING_ID}
        title="What Our Customers Say"
        subtitle="Real experiences from people who love the Beauty Bus service."
      />

      <DataState
        data={testimonialsQuery.data}
        isLoading={testimonialsQuery.isLoading}
        error={testimonialsQuery.error}
        onRetry={() => void testimonialsQuery.refetch()}
        emptyMessage="No testimonials yet"
        skeleton={<SkeletonCard />}
      >
        {(testimonials) => <TestimonialCarousel testimonials={testimonials} />}
      </DataState>
    </section>
  );
}

export { TestimonialsSection };
