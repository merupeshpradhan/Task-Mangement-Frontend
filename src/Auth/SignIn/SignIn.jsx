import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../Api/api";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const userSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/users/signin", { email, password });
      console.log(res.data);

      const userData = res.data.data;
      localStorage.setItem("user", JSON.stringify(userData));

      localStorage.setItem("accessToken", userData.accessToken);

      const successsMsg = res.data?.message || "SignIn success";
      console.log(successsMsg);

      // navigate("/taskmanagement");
      navigate("/select-role");

      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.response) {
        const errorMsg =
          error.response?.data?.message ||
          "SignIn failed. Something went wrong.";
        alert(errorMsg);

        console.log(errorMsg);
      } else {
        const errorMsg = "Something went wrong. Please try again.";

        console.log(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[99.9vh] flex flex-col lg:flex-row items-center justify-around">
      <div className="lg:w-1/2 flex items-center justify-center lg:justify-between">
        <img src="/Login.jpg" alt="role" className="w-[70%] lg:w-[90%] lg:h-[99.9vh]" />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-bold">Welcome Back</h1>
        <p className="text-sm">Login in to manage your task and track progress.</p>

        <form onSubmit={userSignIn} className="w-[80vw] lg:w-[30vw] space-y-5 mt-7 lg:mt-10">
          {/* Email */}
          <div>
            <label className="font-semibold text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-pink-300 rounded-md p-1.5 focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative ">
            <label className="font-semibold text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-pink-300 rounded-md p-1.5 md:p-2 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-pink-500 mt-3 md:mt-0 text-white py-1.5 md:py-2 rounded-md md:font-semibold hover:bg-pink-600 transition cursor-pointer flex justify-center items-center gap-2 ${
              loading && "opacity-70 cursor-not-allowed"
            }`}
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-600 mt-3 md:mt-6 text-[14px] tracking-wide">
          Don't have an account?
          <Link
            to="/signup"
            className="text-pink-500 md:font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
