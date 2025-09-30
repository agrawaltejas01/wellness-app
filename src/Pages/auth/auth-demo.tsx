import React from "react";
import { RouteComponentProps, navigate } from "@reach/router";

interface IAuthDemoProps extends RouteComponentProps {}

const AuthDemo: React.FC<IAuthDemoProps> = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Auth Flow Demo
          </h1>
          <p className="text-gray-600">
            Test the new login/signup and profile completion flow
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/new-login")}
            className="w-full py-4 px-6 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
          >
            Test New Login Flow
          </button>

          <button
            onClick={() => navigate("/login")}
            className="w-full py-4 px-6 bg-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Old Login Flow (for comparison)
          </button>

          <button
            onClick={() => navigate("/profile-completion")}
            className="w-full py-4 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Test Profile Completion
          </button>
        </div>

        <div className="text-center pt-6">
          <button
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthDemo;
