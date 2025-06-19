// utils/getPdfPageCount.js

const cloudinary = require("../config/cloudinary");

async function getPdfPageCount(publicId) {
    try {
        const resource = await cloudinary.api.resource(publicId, {
            resource_type: "image",
            type: "upload",
            pages: true
        });

        return resource.pages || 1;
    } catch (err) {
        console.error("Error fetching PDF metadata:", err);
        throw err;
    }
}

module.exports = getPdfPageCount;
