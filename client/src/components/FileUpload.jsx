import { useState } from "react";
import { Upload } from "lucide-react"; // Upload icon

function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Utility for showing browser notifications
  const showNotification = (title, body) => {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, { body });
        }
      });
    } else {
      // fallback if blocked
      alert(`${title}: ${body}`);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification("Upload Error", "Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/api/files/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      showNotification("Upload Successful", `${file.name} uploaded.`);
      onUploadSuccess(data);
      setFile(null); // reset after upload
    } catch (error) {
      console.error(error);
      showNotification("Upload Error", error.message);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 text-center">
      {/* File select area */}
      <label
        htmlFor="fileInput"
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition"
      >
        <Upload className="h-8 w-8 text-blue-500 mb-2" />
        <span className="text-gray-600 font-medium">
          {file ? file.name : "Choose a file to upload"}
        </span>
      </label>
      <input
        type="file"
        id="fileInput"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file}
        className={`mt-4 px-6 py-2 rounded-lg shadow transition ${
          file
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Upload
      </button>
    </div>
  );
}

export default FileUpload;
