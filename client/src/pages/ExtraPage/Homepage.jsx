import { Link } from "react-router-dom";
import {
  Home as HomeIcon,
  AlertTriangle,
  ArrowRight,
  Compass,
  BookOpen,
  BarChart3,
  User,
} from "lucide-react";

const HomePage = () => (
  <div className="min-h-screen bg-gray-900 py-12 px-4">
    <div className="max-w-4xl mx-auto text-center">
      {/* Hero Section */}
      <div className="mb-16">
        <div className="inline-flex items-center justify-center p-3 bg-blue-900 bg-opacity-20 rounded-full mb-6">
          <BookOpen className="h-10 w-10 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to <span className="text-blue-400">QuizMaster</span>
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Test your knowledge, challenge your friends, and track your progress
          with our interactive quiz platform.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="inline-flex items-center justify-center p-3 bg-blue-900 bg-opacity-20 rounded-full mb-4">
            <Compass className="h-6 w-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Explore Quizzes
          </h3>
          <p className="text-gray-400">
            Discover a wide range of quizzes on various topics from our
            community.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="inline-flex items-center justify-center p-3 bg-purple-900 bg-opacity-20 rounded-full mb-4">
            <BarChart3 className="h-6 w-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Track Progress
          </h3>
          <p className="text-gray-400">
            Monitor your performance with detailed analytics and progress
            tracking.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition-colors">
          <div className="inline-flex items-center justify-center p-3 bg-green-900 bg-opacity-20 rounded-full mb-4">
            <User className="h-6 w-6 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Compete with Friends
          </h3>
          <p className="text-gray-400">
            Challenge your friends and see who can achieve the highest scores.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mt-16 flex flex-wrap justify-center gap-8 text-center">
        <div className="bg-gray-800 p-4 rounded-lg min-w-[150px]">
          <div className="text-3xl font-bold text-blue-400 mb-1">500+</div>
          <div className="text-gray-400">Active Quizzes</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg min-w-[150px]">
          <div className="text-3xl font-bold text-purple-400 mb-1">10K+</div>
          <div className="text-gray-400">Users</div>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg min-w-[150px]">
          <div className="text-3xl font-bold text-green-400 mb-1">95%</div>
          <div className="text-gray-400">Satisfaction Rate</div>
        </div>
      </div>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4">
    <div className="max-w-md mx-auto text-center">
      <div className="inline-flex items-center justify-center p-4 bg-red-900 bg-opacity-20 rounded-full mb-6">
        <AlertTriangle className="h-12 w-12 text-red-400" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
        404 - Page Not Found
      </h1>
      <p className="text-xl text-gray-300 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
        <h2 className="text-lg font-semibold text-white mb-3">
          Here are some helpful links:
        </h2>
        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center justify-center p-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Home Page
          </Link>
          <Link
            to="/quizzes"
            className="flex items-center justify-center p-3 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            Browse Quizzes
          </Link>
        </div>
      </div>

      <Link
        to="/"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        <HomeIcon className="h-5 w-5 mr-2" />
        Return to Homepage
      </Link>
    </div>
  </div>
);

export { HomePage, NotFoundPage };
