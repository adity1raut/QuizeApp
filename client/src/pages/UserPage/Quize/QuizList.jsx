import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizListHeader from "./QuizListHeader";
import SearchFilterSection from "./SearchFilterSection";
import QuizGrid from "./QuizGrid";
import EmptyState from "./EmptyState";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all"); // all, premium, free

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("/api/quizzes");
      setQuizzes(response.data.quizzes);
    } catch (error) {
      setError("Failed to fetch quizzes");
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter quizzes based on search term and filter
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         (filter === "premium" && quiz.isPremium) || 
                         (filter === "free" && !quiz.isPremium);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <LoadingSpinner message="Loading quizzes..." />;
  }

  if (error) {
    return <ErrorMessage error={error} onRetry={fetchQuizzes} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <QuizListHeader />
        
        <SearchFilterSection 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
        />

        {filteredQuizzes.length === 0 ? (
          <EmptyState 
            searchTerm={searchTerm}
            onClearSearch={() => {
              setSearchTerm("");
              setFilter("all");
            }}
          />
        ) : (
          <QuizGrid 
            quizzes={filteredQuizzes}
            filter={filter}
          />
        )}
      </div>
    </div>
  );
};

export default QuizList;