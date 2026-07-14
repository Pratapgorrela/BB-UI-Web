import {
  CategoryGridSection,
  HomeHeader,
  HomeSearchBar,
  OffersSection,
  PopularCombosSection,
  ReferralCard,
  SupportFab,
  TestimonialsSection,
} from '../features/home';
import { cartItemCount, useCartStore } from '../store/useCartStore';

export function Component() {
  const cartCount = useCartStore((state) => cartItemCount(state.items));

  return (
    <>
      {/* pb clears the floating Support button above the last section */}
      <div className="flex flex-col gap-6 py-4 pb-20">
        {/* Landmark for the heading hierarchy — sections below start at h2. */}
        <h1 className="sr-only">Beauty Bus — salon services at your doorstep</h1>
        <HomeHeader cartCount={cartCount} />
        <HomeSearchBar />
        <CategoryGridSection />
        <PopularCombosSection />
        <OffersSection />
        <TestimonialsSection />
        <ReferralCard />
      </div>
      <SupportFab />
    </>
  );
}
