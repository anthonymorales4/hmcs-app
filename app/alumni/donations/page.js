import ProtectedRoute from "../../../components/ProtectedRoute";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SportsIcon from "@mui/icons-material/Sports";
import GroupsIcon from "@mui/icons-material/Groups";
import VerifiedIcon from "@mui/icons-material/Verified";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

const DONATION_URL = "https://community.alumni.harvard.edu/give/15716515";

const donationTiers = [
  {
    amount: 50,
    description: "Covers gas costs for travel to away games in Worcester",
    icon: DirectionsCarIcon,
  },
  {
    amount: 100,
    description: "Covers half of a tournament entry fee",
    icon: EmojiEventsIcon,
  },
  {
    amount: 275,
    description: "Covers referee fees for one match",
    icon: SportsIcon,
  },
];

const LoadingSkeleton = (
  <div className="min-h-screen bg-gray-50 py-12">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section Skeleton */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 animate-pulse" />
        <div className="h-12 w-72 bg-gray-300 rounded animate-pulse mx-auto mb-4" />
        <div className="h-6 w-96 max-w-full bg-gray-200 rounded animate-pulse mx-auto" />
      </div>

      {/* Main Card Skeleton */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        {/* Stats Banner Skeleton */}
        <div className="bg-gray-300 px-8 py-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="h-8 w-20 bg-gray-400 rounded mx-auto mb-2" />
                <div className="h-4 w-32 bg-gray-400/70 rounded mx-auto" />
              </div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="p-8">
          {/* Why Donate Skeleton */}
          <div className="mb-8">
            <div className="h-7 w-64 bg-gray-300 rounded animate-pulse mb-4" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>

          {/* Donation Tiers Skeleton */}
          <div className="mb-8">
            <div className="h-7 w-40 bg-gray-300 rounded animate-pulse mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border border-gray-200 rounded-xl p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="h-7 w-16 bg-gray-300 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-gray-200 rounded" />
                    <div className="h-3 w-4/5 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="h-4 w-72 bg-gray-200 rounded animate-pulse mx-auto mt-4" />
          </div>

          {/* CTA Button Skeleton */}
          <div className="flex justify-center mb-8">
            <div className="h-14 w-44 bg-gray-300 rounded-lg animate-pulse" />
          </div>

          {/* Trust Indicators Skeleton */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-4 w-36 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Card Skeleton */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="h-6 w-40 bg-gray-300 rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0" />
              <div className="h-4 w-full bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Thank You Skeleton */}
      <div className="flex justify-center mt-8">
        <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

export default function AlumniDonationsPage() {
  return (
    <ProtectedRoute loadingComponent={LoadingSkeleton}>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#A51C30]/10 rounded-full mb-6">
              <VolunteerActivismIcon
                className="text-[#A51C30]"
                sx={{ fontSize: 32 }}
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Support the Club
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your contribution helps keep Harvard Men&apos;s Club Soccer
              thriving for current players and future generations.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Stats Banner */}
            <div className="bg-gradient-to-r from-[#A51C30] to-[#8B1828] px-8 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-white">
                <div>
                  <div className="text-3xl font-bold">60+</div>
                  <div className="text-sm text-white/80">
                    Players across two teams
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold">$10,000+</div>
                  <div className="text-sm text-white/80">Annual operating costs</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-white/80">
                    Goes directly to the club
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Why Donate */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Why Your Support Matters
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  While the Club Sports Office provides some funding, it
                  doesn&apos;t cover the full costs of participation. Your
                  donation helps cover referee fees, tournament entries, travel
                  expenses, and equipment—allowing our players to compete at the
                  highest levels of club soccer.
                </p>
              </div>

              {/* Donation Tiers */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Your Impact
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {donationTiers.map((tier) => (
                    <div
                      key={tier.amount}
                      className="border border-gray-200 rounded-xl p-6 hover:border-[#A51C30] hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-[#A51C30]/10 rounded-full flex items-center justify-center group-hover:bg-[#A51C30]/20 transition-colors">
                          <tier.icon
                            className="text-[#A51C30]"
                            fontSize="small"
                          />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                          ${tier.amount}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{tier.description}</p>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Any amount makes an immediate impact on our program.
                </p>
              </div>

              {/* CTA Button */}
              <div className="text-center mb-8">
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#A51C30] text-white px-8 py-4 rounded-lg hover:bg-[#8B1828] transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Donate Now
                  <OpenInNewIcon fontSize="small" />
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-gray-500 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-2">
                  <VerifiedIcon fontSize="small" className="text-green-600" />
                  <span>Official Harvard donation portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <GroupsIcon fontSize="small" className="text-[#A51C30]" />
                  <span>Tax-deductible contribution</span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              How to Donate
            </h2>
            <ol className="space-y-3 text-gray-600">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#A51C30] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </span>
                <span>
                  Click the &quot;Donate Now&quot; button above to visit the
                  Harvard Athletics Online Donation Site
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#A51C30] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </span>
                <span>
                  Under &quot;Select a fund,&quot; choose{" "}
                  <strong>&quot;Soccer Club (Men)&quot;</strong>
                </span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#A51C30] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </span>
                <span>Fill out the remainder of the form with your details</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#A51C30] text-white rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </span>
                <span>
                  You&apos;ll receive a receipt from the University as proof of
                  your tax-deductible donation
                </span>
              </li>
            </ol>
          </div>

          {/* Thank You Note */}
          <div className="text-center mt-8 text-gray-500">
            <p>
              Thank you for being part of our Harvard Men&apos;s Soccer Club
              family.
            </p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
