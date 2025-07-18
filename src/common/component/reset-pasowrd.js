import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { liveUrl, token } from "./url";
import Navbar from "./navbar";
import OurServices from "./ourServices";
import Searching from "./searching";
import BottomBar from "./bottomBar";

export default function ResetPassword() {
  const { tokenPath } = useParams();
  const navigate = useNavigate(); // ✅ Correct way
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setMessage("");

    // Basic validation
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${liveUrl}api/User/resetPassword`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: tokenPath,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.status === "success") {
        // ✅ Redirect after successful reset
        navigate("/success"); 
      } else {
        setMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Reset error:", error);
      setMessage("Server error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold text-black text-center mb-6">
            Reset Password
          </h2>

          {message && (
            <p
              className={`text-center mb-4 ${
                message.includes("success") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mb-4">
            <label className="block mb-1 font-medium">New Password</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded text-white font-medium ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
      <OurServices />
      <Searching />
      <BottomBar />
    </>
  );
}
