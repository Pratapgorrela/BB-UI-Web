import { Star } from 'lucide-react';
import { Avatar, Card } from '../../../components/ui';
import type { Testimonial } from '../types/home';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/** A single featured testimonial: purple band, avatar, star rating, quote, author. */
function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card variant="raised" padding="none" className="w-full">
      <div className="h-9 bg-primary-500" aria-hidden="true" />

      <div className="flex flex-col items-center gap-2 px-4 pb-4 text-center">
        <div className="-mt-8">
          <Avatar
            src={testimonial.avatarUrl ?? undefined}
            name={testimonial.authorName}
            size="lg"
            className="ring-4 ring-neutral-0"
          />
        </div>

        <div
          className="flex gap-0.5"
          role="img"
          aria-label={`Rated ${testimonial.rating} out of 5`}
        >
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={18}
              aria-hidden="true"
              className={
                index < testimonial.rating
                  ? 'fill-warning-500 text-warning-500'
                  : 'text-neutral-300'
              }
            />
          ))}
        </div>

        <p className="text-body-sm text-neutral-600">“{testimonial.quote}”</p>
        <p className="text-body-sm font-semibold text-neutral-900">
          {testimonial.authorName}, {testimonial.authorLocation}
        </p>
      </div>
    </Card>
  );
}

export { TestimonialCard };
export type { TestimonialCardProps };
