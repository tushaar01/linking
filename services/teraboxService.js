const axios = require('axios');
const { extractErrorMessage } = require('../utils/helpers');

// Regular expressions for validating Terabox links
const teraboxDomains = [
    'terabox.com',
    'terabox.app',
    '4funbox.com',
    '1024tera.com',
    'mirrobox.com',
    'nephobox.com',
    'teraboxapp.com',
    'momerybox.com',
    'tibibox.com',
    'terabox.fun'
];

// Create regex pattern for all domains
const teraboxDomainsPattern = teraboxDomains.map(domain => 
    domain.replace('.', '\\.'))
    .join('|');

const teraboxRegex = new RegExp(https?://(?:www\\.)?(?:${teraboxDomainsPattern})/.+, 'i');

// Validate if a link is a valid Terabox link
exports.isValidTeraboxLink = (link) => {
    return teraboxRegex.test(link);
};

// Get direct URL from Terabox link
exports.getDirectUrl = async (link) => {
    try {
        // Extract link parameters (surl)
        const urlObj = new URL(link);
        const pathParts = urlObj.pathname.split('/');
        const surlIndex = pathParts.findIndex(part => part === 's');
        
        if (surlIndex === -1 || !pathParts[surlIndex + 1]) {
            return { error: 'Invalid Terabox link structure' };
        }
        
        const surl = pathParts[surlIndex + 1];
        
        // Make first request to get sign parameters and logid
        const response1 = await axios.get(https://www.terabox.com/share/link?surl=${surl}&product=share);
        
        if (!response1.data || !response1.data.sign) {
            return { error: 'Failed to get file information' };
        }
        
        const { sign, timestamp, shareid, uk } = response1.data;
        
        // Make second request to get file details and download URL
        const response2 = await axios.post('https://www.terabox.com/api/download', {
            product: 'share',
            primaryid: shareid,
            uk: uk,
            sign: sign,
            timestamp: timestamp,
        });
        
        if (!response2.data || !response2.data.dlink) {
            return { error: 'Failed to get direct download link' };
        }
        
        // Final request to get actual redirect URL
        const response3 = await axios.get(response2.data.dlink, {
            maxRedirects: 0,
            validateStatus: status => status >= 200 && status < 400
        });
        
        if (!response3.headers.location) {
            return { error: 'Failed to get final video URL' };
        }
        
        // Return the direct URL and file information
        return {
            directUrl: response3.headers.location,
            fileName: response2.data.server_filename || 'Unknown',
            fileSize: response2.data.size || 0,
            qualityOptions: response2.data.quality_options || []
        };
    } catch (error) {
        console.error('Error in getDirectUrl:', error);
        return { error: extractErrorMessage(error) };
    }
};
