
import React from 'react';

const ResetPasswordPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Reset Password</h1>
        <form>
          <div className="space-y-4">
            <div>
              <label className="block mb-1">New Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                placeholder="Enter new password"
              />
            </div>
            <div>
              <label className="block mb-1">Confirm Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                placeholder="Confirm new password"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded"
            >
              Set New Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
