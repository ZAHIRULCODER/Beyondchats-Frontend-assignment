import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  ToggleLeft as Google,
  Eye,
  EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";
import VerificationCode from "../components/VerificationCode";

/**
 * Registration component with multi-step form for user sign-up
 * Step 1: Collect user details (name, email, password)
 * Step 2: Verify email with a 6-digit code
 */
export default function Registration() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Tracks the current form step
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility
  const [verificationCode, setVerificationCode] = useState(""); // Stores the verification code

  /**
   * Handles form submission based on the current step
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      // Move to step 2 (verification) and notify the user
      setStep(2);
      toast.success("Verification code sent to your email!");
    } else {
      // Validate verification code before proceeding
      if (verificationCode.length === 6) {
        navigate("/organization"); // Redirect on successful verification
      } else {
        toast.error("Please enter the 6-digit verification code");
      }
    }
  };

  /**
   * Updates form data as the user types
   * @param {Event} e - Input change event
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
        {/* Form title based on the current step */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          {step === 1 ? "Create your account" : "Verify your email"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            // Step 1: User details form
            <>
              <div className="space-y-4">
                {/* Full Name Input */}
                <div className="relative">
                  <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Password Input with Toggle */}
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400">
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Divider for Social Login */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Login Button */}
              <button
                type="button"
                className="w-full border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 cursor-pointer">
                <Google className="w-5 h-5 text-red-500" />
                <span>Google</span>
              </button>
            </>
          ) : (
            // Step 2: Email Verification
            <div className="space-y-6">
              <p className="text-gray-600 text-center">
                We have sent a verification code to your email address -{" "}
                <span className="text-indigo-600">{formData.email}</span>
                <br /> Please enter it below.
              </p>

              {/* Verification Code Input */}
              <VerificationCode
                onChange={(code) => setVerificationCode(code)}
              />

              {/* Verify Email Button */}
              <button
                type="submit"
                className="w-full cursor-pointer bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition-colors">
                Verify Email
              </button>
            </div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
