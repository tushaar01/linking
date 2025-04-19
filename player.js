// Function to create and embed video player
function createVideoPlayer(videoUrl, container) {
    // Clear container
    container.innerHTML = '';
    
    // Create video element
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = false;
    video.style.width = '100%';
    video.style.maxHeight = '450px';
    
    // Create source element
    const source = document.createElement('source');
    source.src = videoUrl;
    source.type = 'video/mp4'; // Default type, may need to be adjusted based on response
    
    // Append source to video
    video.appendChild(source);
    
    // Add error handling
    video.addEventListener('error', function() {
        container.innerHTML = '<div class="error">Error loading video. The link may be invalid or expired.</div>';
    });
    
    // Append video to container
    container.appendChild(video);
}
