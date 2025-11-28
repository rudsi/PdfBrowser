"use client";

import React, { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 10;

export default function PdfBrowser() {
  const [relativePath, setRelativePath] = useState("");
  const [pdfFiles, setPdfFiles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const fetchPdfFiles = async () => {
    setError("");
    setPage(1);

    try {
      const res = await fetch(
        `http://localhost:5000/list-pdfs?path=${encodeURIComponent(relativePath)}`
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to load PDFs");
      setPdfFiles(data.pdfs);
    } catch (err: any) {
      setError(err.message || "Unknown error");
      setPdfFiles([]);
    }
  };

  const filteredFiles = useMemo(() => {
    let files = [...pdfFiles];

    if (searchQuery.trim()) {
      files = files.filter((file) =>
        file.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    files.sort((a, b) =>
      sortOrder === "asc" ? a.localeCompare(b) : b.localeCompare(a)
    );

    return files;
  }, [pdfFiles, searchQuery, sortOrder]);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const paginatedFiles = filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold text-center mb-4">
        Local PDF Browser
      </h2>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          placeholder="Enter relative path (e.g. Desktop)"
          value={relativePath}
          onChange={(e) => setRelativePath(e.target.value)}
          className="flex-1 border border-gray-300 rounded px-3 py-2"
        />
        <button
          onClick={fetchPdfFiles}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Load PDFs
        </button>
      </div>

      {pdfFiles.length > 0 && (
        <div className="mb-4 flex flex-col md:flex-row justify-between gap-3">
          <input
            type="text"
            placeholder="Search PDFs..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            className="border border-gray-300 rounded px-3 py-2 flex-1"
          />

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="asc">Sort: A → Z</option>
            <option value="desc">Sort: Z → A</option>
          </select>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <div className="space-y-3">
        {paginatedFiles.map((file, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-white shadow-sm border border-gray-200 p-3 rounded"
          >
            <span className="truncate">{file}</span>
            <a
              href={`http://localhost:5000/files?path=${encodeURIComponent(
                `${relativePath}/${file}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Open
            </a>
          </div>
        ))}
      </div>

      {filteredFiles.length > 0 && (
        <div className="flex items-center justify-center gap-4 mt-5">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm text-gray-600">
            Page {page} of {Math.ceil(filteredFiles.length / ITEMS_PER_PAGE)}
          </span>

          <button
            disabled={startIndex + ITEMS_PER_PAGE >= filteredFiles.length}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {filteredFiles.length === 0 && !error && (
        <p className="text-gray-500 text-center mt-6">No PDF files available</p>
      )}
    </div>
  );
}
