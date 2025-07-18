import React, { useState, useEffect, useContext } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "../styles/PdfViewer.css"; // ✅ Link to custom CSS
import { authContext } from "../App";

// Use local worker file
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const PdfViewer = ({
    testId ,
    studentId ,
}) => {
    const [numPages, setNumPages] = useState(null);
    const [blobUrl, setBlobUrl] = useState("");
    const {authInfo} = useContext(authContext)


    useEffect(() => {
        const fetchBlob = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/${authInfo.role}/getAnswersheet/${studentId._id}/${testId}`,
                    {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                    }
                );
                const data = await response.json();
                if (!response.ok || !data?.fileUrl) throw new Error("Failed to fetch PDF");

                setBlobUrl(data.fileUrl);
            } catch (err) {
                console.error("PDF load error:", err);
            }
        };

        fetchBlob();
        return () => {
            if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
    }, []);

    return (
        <div className="pdf-viewer-wrapper">
            <header className="evaluation-header">
                {/* SVG Icon for visual appeal */}
                <svg className="header-icon" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    <path d="M9 12l2 2 4-4"></path>
                </svg>
                <h1>Student Answersheet</h1>
            </header>

            <div className="pdf-viewer-panel" style={{ marginTop: "1rem" }}>
                {blobUrl ? (
                    <Document
                        file={blobUrl}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    >
                        {Array.from({ length: numPages }, (_, i) => (
                            <Page key={i} pageNumber={i + 1} width={600} />
                        ))}
                    </Document>
                ) : (
                    <p style={{ color: "red" }}>Loading PDF...</p>
                )}
            </div>
        </div>
    );
};

export default PdfViewer;
