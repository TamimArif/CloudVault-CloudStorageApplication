import { useEffect, useState } from "react";
import FileUpload from "../components/FileUpload";
import FileList from "../components/FileList";

function Home() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/files");
        const data = await res.json();

        if (res.ok) {
          setFiles(data);
        } else {
          setError(data.error || "Failed to load files");
        }
      } catch (err) {
        setError("Error fetching files: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleDelete = async (file) => {
    try {
      const res = await fetch(`http://localhost:5000/api/files/${file.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
      } else {
        const err = await res.json();
        alert("Delete failed: " + err.error);
      }
    } catch (err) {
      alert("Delete error: " + err.message);
    }
  };

  const handleUploadSuccess = (newFile) => {
    setFiles((prev) => [...prev, newFile]);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-8 px-4">
      {/* Upload section */}
      <FileUpload onUploadSuccess={handleUploadSuccess} />

      {/* Status/Error */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading files...</p>
      ) : (
        <FileList files={files} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default Home;
