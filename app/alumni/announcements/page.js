import ProtectedRoute from "../../../components/ProtectedRoute";

export default function AlumniAnnouncementsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="mt-4 text-lg text-gray-600">
            Latest news and announcements for alumni.
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}