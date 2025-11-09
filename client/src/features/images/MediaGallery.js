import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";

const MediaGallery = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE_URL}/media/files`);
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: "Failed to fetch files" }));
          throw new Error(errorData.error || "Failed to fetch files");
        }
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files:", err);
        setError(err.message || "שגיאה בטעינת קבצים");
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  if (loading) return <div>נטען...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>גלריה</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {files.length === 0 ? (
          <p>אין קבצים להציג</p>
        ) : (
          files.map((file) =>
            file.metadata?.mimetype?.startsWith("image/") ? (
              <img key={file.id || file.name} src={file.url} alt={file.name} width="200" />
            ) : (
              <video key={file.id || file.name} src={file.url} controls width="200" />
            )
          )
        )}
      </div>
    </div>
  );
};

export default MediaGallery;
