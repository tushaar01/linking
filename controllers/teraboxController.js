const teraboxService = require('../services/teraboxService');

// Process Terabox link to extract direct video URL
exports.processLink = async (req, res) => {
    try {
        const { link } = req.body;
        
        if (!link) {
            return res.status(400).json({ error: 'Please provide a Terabox link' });
        }
        
        // Validate if it's a valid Terabox link
        if (!teraboxService.isValidTeraboxLink(link)) {
            return res.status(400).json({ error: 'Invalid Terabox link format' });
        }
        
        // Get direct URL from Terabox link
        const result = await teraboxService.getDirectUrl(link);
        
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
        
        return res.json({
            success: true,
            directUrl: result.directUrl,
            fileName: result.fileName,
            fileSize: result.fileSize,
            qualityOptions: result.qualityOptions
        });
    } catch (error) {
        console.error('Error processing link:', error);
        return res.status(500).json({ error: 'Server error when processing link' });
    }
};
