import { Trash2 } from "lucide-react";

function FileList({ files, onDelete }) {
  const handleDelete = (file) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${file.originalname}"?`);
    if (confirmDelete) {
      onDelete(file); // send the whole file object instead of just index
    }
  };

  return (
    <div className="mt-6 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Uploaded Files</h2>

      {files.length === 0 ? (
        <p className="text-gray-500 italic">No files uploaded yet.</p>
      ) : (
        <ul className="space-y-3">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div>
                <p className="font-medium text-gray-800">{file.originalname}</p>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  {file.filename}
                </a>
              </div>

              <button
                onClick={() => handleDelete(file)}
                className="text-red-500 hover:text-red-700 transition p-2 rounded-full hover:bg-red-100"
                title="Delete file"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FileList;
