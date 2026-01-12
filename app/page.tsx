"use client";

import { useState, useMemo } from "react";
import { usePosts, useCategories, useDateRange } from "@/hooks/usePosts";
import SearchBar from "@/components/SearchBar";
import DateFilter from "@/components/DateFilter";
import CategoryFilter from "@/components/CategoryFilter";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { categories } = useCategories();
  const { dateRange } = useDateRange();

  const filters = useMemo(
    () => ({
      category: selectedCategory,
      search: searchQuery,
      dateFrom,
      dateTo,
    }),
    [selectedCategory, searchQuery, dateFrom, dateTo],
  );

  const { posts, pagination, loading, error } = usePosts(
    filters,
    currentPage,
    12,
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleDateFilter = () => {
    setDateFrom(tempDateFrom);
    setDateTo(tempDateTo);
    setCurrentPage(1);
  };

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    setTempDateFrom("");
    setTempDateTo("");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSubmit={handleSearch}
      />

      <DateFilter
        dateFrom={tempDateFrom}
        dateTo={tempDateTo}
        onDateFromChange={setTempDateFrom}
        onDateToChange={setTempDateTo}
        onApply={handleDateFilter}
        onClear={clearDateFilter}
        minDate={dateRange.minDate}
        maxDate={dateRange.maxDate}
      />

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
      />

      {/* Posts Grid */}
      {error ? (
        <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
          <p className="text-xl text-red-600">{error}</p>
        </div>
      ) : loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading articles...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-xl text-gray-600">No articles found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
