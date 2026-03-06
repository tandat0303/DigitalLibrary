// import { useNavigate } from "react-router-dom";
import { SearchX } from "lucide-react";
// import { Button, Result } from "antd";

export default function NotFound() {
  //   const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-blue-50 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Animation */}
        <div className="flex items-center justify-center mb-6 sm:mb-8 select-none">
          <span className="text-6xl sm:text-8xl md:text-9xl font-bold text-gray-200">
            4
          </span>

          <span className="relative text-6xl sm:text-8xl md:text-9xl font-bold text-gray-200 mx-2 sm:mx-4">
            -
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white rounded-full p-2 sm:p-3 md:p-4 shadow-xl transform hover:scale-110 transition-transform duration-300">
                <SearchX className="w-6 h-6 sm:w-8 sm:h-8 md:w-12 md:h-12 text-gray-600" />
              </span>
            </span>
          </span>

          <span className="text-6xl sm:text-8xl md:text-9xl font-bold text-gray-200">
            4
          </span>
        </div>

        {/* Message */}
        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
          Material not found
        </h2>
        {/* <p className="text-xs sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 px-4 leading-relaxed">
          Sorry, we couldn't find the page you were looking for. The page may
          have been deleted, moved, or may no longer exist.
        </p> */}

        {/* Action Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center px-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-sm sm:text-base hover:border-gray-400 hover:shadow-md transition-all duration-200 transform hover:scale-105 cursor-pointer"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Go back
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#5f5f5f] text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-[#ababac] hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
          >
            <Home size={18} className="sm:w-5 sm:h-5" />
            Back to Home Page
          </button>
        </div> */}

        {/* Decorative Elements */}
        <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto opacity-50">
          <div className="h-1.5 sm:h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <div className="h-1.5 sm:h-2 bg-gray-500 rounded-full animate-pulse delay-100"></div>
          <div className="h-1.5 sm:h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
    // <Result
    //   status="404"
    //   title="404"
    //   subTitle="Sorry, the page you visited does not exist."
    //   extra={<Button type="primary">Back Home</Button>}
    //   className="items-center justify-center mt-25"
    // />
  );
}
