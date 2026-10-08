import { useState } from "react";
import Icon from "../shared/Icon";
export default function AiUpload({
  loading,
  onFile,
}: {
  loading: boolean;
  onFile: (file: File) => void;
}) {
  const [drag, setDrag] = useState(false);
  return (
    <label
      className={`drop-zone${drag ? " drag-active" : ""}`}
      onDragOver={(e) => e.preventDefault()}
      onDragEnter={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        if (!loading && e.dataTransfer.files[0])
          onFile(e.dataTransfer.files[0]);
      }}
    >
      <Icon name="upload" />
      <span>
        {loading ? "Finding visually similar styles..." : "Drop an image here"}
      </span>
      <strong>or click to upload</strong>
      <small>JPG, PNG up to 10 MB</small>
      <input
        id="file-input"
        type="file"
        accept="image/jpeg,image/png"
        aria-label="Upload shoe image"
        disabled={loading}
        onChange={(e) => {
          if (e.target.files?.[0]) onFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
    </label>
  );
}
