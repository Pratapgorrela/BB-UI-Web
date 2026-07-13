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

export function Component() {
  return (
    <>
      {/* pb clears the floating Support button above the last section */}
      <div className="flex flex-col gap-6 py-4 pb-20">
        <HomeHeader />
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
