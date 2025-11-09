import React, { useEffect, useState } from "react";
import "./ImageGallery.css";
import { API_BASE_URL, getAuthHeadersFormData, getAuthHeaders, isAuthenticated } from "../../config";
import { Box, Button, Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const CATEGORIES = [
  { value: "all", label: "הכל" },
  { value: "hanukkah", label: "חנוכה" },
  { value: "purim", label: "פורים" },
  { value: "pesach", label: "פסח" },
  { value: "shavuot", label: "שבועות" },
  { value: "rosh-hashana", label: "ראש השנה" },
  { value: "yom-kippur", label: "יום כיפור" },
  { value: "sukkot", label: "סוכות" },
  { value: "lag-baomer", label: "ל\"ג בעומר" },
  { value: "events", label: "אירועים" },
  { value: "general", label: "כללי" },
];

const ImageGallery = () => {
  const [activeTab, setActiveTab] = useState("images");
  const [allFiles, setAllFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("general");
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const folder = activeTab === "images" ? "images" : "videos";

  // פונקציה לחילוץ קטגוריה משם הקובץ
  const getCategoryFromFileName = (fileName) => {
    const parts = fileName.split("_");
    if (parts.length > 1) {
      const categoryPart = parts[0];
      return CATEGORIES.find(cat => cat.value === categoryPart) ? categoryPart : "general";
    }
    return "general";
  };

  // סינון קבצים לפי קטגוריה
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredFiles(allFiles);
    } else {
      setFilteredFiles(
        allFiles.filter(file => {
          const fileCategory = getCategoryFromFileName(file.name);
          return fileCategory === selectedCategory;
        })
      );
    }
  }, [selectedCategory, allFiles]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/media/files?folder=${folder}`);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Failed to fetch files" }));
        throw new Error(errorData.error || "Failed to fetch files");
      }
      const data = await res.json();
      setAllFiles(data);
      setFilteredFiles(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "שגיאה בטעינת קבצים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
    setSelectedCategory("all");
  }, [activeTab]);

  const handleUploadClick = () => {
    if (!isAuthenticated()) {
      alert("נדרשת התחברות כמנהל להעלאת קבצים");
      return;
    }
    setUploadDialogOpen(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (activeTab === "images" && !file.type.startsWith("image/")) {
      alert("ניתן להעלות רק תמונות בלשונית זו!");
      return;
    }
    if (activeTab === "videos" && !file.type.startsWith("video/")) {
      alert("ניתן להעלות רק סרטונים בלשונית זו!");
      return;
    }

    setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      alert("נא לבחור קובץ");
      return;
    }

    // שומרים את הקטגוריה בשם הקובץ: category_timestamp_originalname
    const timestamp = Date.now();
    const originalName = uploadFile.name;
    const newFileName = `${uploadCategory}_${timestamp}_${originalName}`;
    
    // יצירת File חדש עם שם מעודכן
    const renamedFile = new File([uploadFile], newFileName, { type: uploadFile.type });
    
    const formData = new FormData();
    formData.append("file", renamedFile);
    formData.append("folder", folder);

    try {
      setUploading(true);
      setError("");
      const res = await fetch(`${API_BASE_URL}/media/upload`, {
        method: "POST",
        headers: getAuthHeadersFormData(),
        body: formData,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(errorData.error || "Upload failed");
      }
      
      setUploadDialogOpen(false);
      setUploadFile(null);
      setUploadCategory("general");
      await fetchFiles();
    } catch (err) {
      console.error(err);
      setError(err.message || "שגיאה בהעלאת קובץ");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (filePath) => {
    if (!isAuthenticated()) {
      alert("נדרשת התחברות כמנהל למחיקת קבצים");
      return;
    }

    const confirmDelete = window.confirm("האם אתה בטוח שברצונך למחוק את הקובץ?");
    if (!confirmDelete) return;

    try {
      setError("");
      const res = await fetch(`${API_BASE_URL}/media/delete`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ path: filePath }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Delete failed" }));
        throw new Error(errorData.error || "Delete failed");
      }
      
      await fetchFiles();
    } catch (err) {
      console.error(err);
      setError(err.message || "שגיאה במחיקת קובץ");
    }
  };

  const renderFiles = (files, isVideo = false) => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }
    
    if (!files.length) {
      return (
        <Box textAlign="center" p={4}>
          <p style={{ fontSize: "18px", color: "#666" }}>אין קבצים להציג בקטגוריה זו</p>
        </Box>
      );
    }

    return files.map((file) => {
      const filePath = `${folder}/${file.name}`;
      const category = getCategoryFromFileName(file.name);
      const categoryLabel = CATEGORIES.find(cat => cat.value === category)?.label || "כללי";
      
      return (
        <div key={file.name} className="image-card">
          {isVideo ? (
            <video src={file.url} controls className="video" />
          ) : (
            <img src={file.url} alt={file.name} className="image" />
          )}
          <div className="image-card-overlay">
            <Chip 
              label={categoryLabel} 
              size="small" 
              className="category-chip"
              style={{ marginBottom: "5px" }}
            />
            {isAuthenticated() && (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete(filePath)}
                className="delete-btn"
              >
                מחיקה
              </Button>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className="gallery-container">
      <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}>גלריה</h1>
      
      <div className="tab-buttons">
        <button
          className={activeTab === "images" ? "active" : ""}
          onClick={() => setActiveTab("images")}
        >
          תמונות
        </button>
        <button
          className={activeTab === "videos" ? "active" : ""}
          onClick={() => setActiveTab("videos")}
        >
          וידאו
        </button>
      </div>

      {error && (
        <Alert severity="error" sx={{ mb: 2, maxWidth: "800px", margin: "0 auto 20px" }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} maxWidth="1200px" margin="0 auto" flexWrap="wrap" gap={2}>
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel>סינון לפי נושא</InputLabel>
          <Select
            value={selectedCategory}
            label="סינון לפי נושא"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat.value} value={cat.value}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {isAuthenticated() && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleUploadClick}
            sx={{ minWidth: "150px" }}
          >
            העלה {activeTab === "images" ? "תמונה" : "סרטון"}
          </Button>
        )}
      </Box>

      <div className={activeTab === "images" ? "image-grid" : "video-grid"}>
        {renderFiles(filteredFiles, activeTab === "videos")}
      </div>

      {/* Dialog להעלאת קובץ */}
      <Dialog open={uploadDialogOpen} onClose={() => !uploading && setUploadDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>העלאת {activeTab === "images" ? "תמונה" : "סרטון"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>בחר נושא</InputLabel>
              <Select
                value={uploadCategory}
                label="בחר נושא"
                onChange={(e) => setUploadCategory(e.target.value)}
              >
                {CATEGORIES.filter(cat => cat.value !== "all").map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <input
              type="file"
              accept={activeTab === "images" ? "image/*" : "video/*"}
              onChange={handleFileSelect}
              style={{ padding: "10px" }}
            />
            {uploadFile && (
              <Alert severity="info">
                נבחר: {uploadFile.name}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            ביטול
          </Button>
          <Button onClick={handleUpload} variant="contained" disabled={!uploadFile || uploading}>
            {uploading ? "מעלה..." : "העלה"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
