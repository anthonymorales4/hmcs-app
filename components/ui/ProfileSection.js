"use client";

export default function ProfileSection({ title, children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 shadow-lg rounded-xl hover:shadow-xl transition-all-smooth ${className}`}>
      {title && (
        <div className="px-6 py-5 border-b-2 border-b-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
        </div>
      )}
      <div className="px-8 pt-6 pb-8">{children}</div>
    </div>
  );
}