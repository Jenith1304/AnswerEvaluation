// utils/pdfToImageUrls.js

// Format: https://res.cloudinary.com/<cloud_name>/image/upload/pg_<page_number>/your_folder/filename.pdf

const generateImageUrlsFromCloudinaryPDF = (fileUrl, totalPages) => {
    const fileUrlParts = fileUrl.split("/upload/");
    const [baseUrl, resourcePath] = fileUrlParts;

    const imageUrls = [];

    for (let i = 1; i <= totalPages; i++) {
        // const imageUrl = `${baseUrl}/upload/pg_${i}/${resourcePath}`;
        // Remove .pdf extension if present
        const cleanResourcePath = resourcePath.replace(/\.pdf$/, "");

            // Generate JPG URL
        const imageUrl = `${baseUrl}/upload/pg_${i}/${cleanResourcePath}.jpg`;
        imageUrls.push(imageUrl);
    }

    return imageUrls;
};


module.exports = generateImageUrlsFromCloudinaryPDF;
