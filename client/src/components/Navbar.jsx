function Navbar({ user, onLogout }) {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600 tracking-tight">
         CloudVault
      </h1>

      {user && (
        <div className="flex items-center space-x-4">
          <img
            src={user.picture}
            alt="profile"
            className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
          />

          <span className="font-medium text-gray-700 hidden sm:inline">
            {user.name}
          </span>

          <button
            onClick={onLogout}
            className="px-4 py-1.5 bg-red-500 text-white rounded-full 
                       hover:bg-red-600 transition font-medium text-sm shadow-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
