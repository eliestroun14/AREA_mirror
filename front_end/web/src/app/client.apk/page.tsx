"use client";
import { useEffect, useState } from "react";

export default function DownloadApkPage() {
  const [downloadFailed, setDownloadFailed] = useState(false);

  useEffect(() => {
    const downloadApk = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const response = await fetch(`${apiUrl}/download/apk`);
        if (!response.ok) throw new Error('Failed to download file');
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'client.apk';
        if (contentDisposition) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(contentDisposition);
          if (matches != null && matches[1]) {
            filename = matches[1].replace(/['"]/g, '');
          }
        }
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setTimeout(() => {
          window.history.back();
        }, 1000);
      } catch {
        setDownloadFailed(true);
      }
    };
    downloadApk();
  }, []);

  return (
    <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h2>The download will start soon...</h2>
      {downloadFailed && (
        <p style={{ color: 'red' }}>Download failed. Please click the link below to try again.</p>
      )}
      <p>
        If nothing happens, <a href="#" onClick={e => { e.preventDefault(); window.location.reload(); }}>click here</a>.
      </p>
    </main>
  );
}
