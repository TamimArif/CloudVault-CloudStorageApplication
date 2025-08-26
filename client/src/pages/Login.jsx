import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Google icon
console.log("VITE_GOOGLE_CLIENT_ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);


function Login() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log("Google login success:", tokenResponse);

        // ✅ tokenResponse contains access_token, not credential
        const { access_token } = tokenResponse;

        // Fetch user info from Google API
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const userInfo = await res.json();
        console.log("User Info:", userInfo);

        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(userInfo));

        navigate("/home");
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50">
      <h1 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
        Welcome to <span className="text-blue-600">CloudVault</span>
      </h1>
      <p className="mb-8 text-gray-600">Sign in securely with Google</p>

      <button
        onClick={() => login()}
        className="flex items-center gap-3 px-6 py-3 rounded-2xl shadow-md bg-white border border-gray-300 hover:shadow-xl hover:scale-105 transform transition-all duration-300 ease-in-out"
      >
        <FcGoogle size={24} />
        <span className="font-medium text-gray-700 text-lg">
          Continue with Google
        </span>
      </button>

      <p className="mt-6 text-sm text-gray-400">Secure • Fast • Easy</p>
    </div>
  );
}

export default Login;