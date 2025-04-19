document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const teraboxLinkInput = document.getElementById('terabox-link');
    const processLinkBtn = document.getElementById('process-link');
    const playerResult = document.getElementById('player-result');
    const copyLinkArea = document.getElementById('copy-link-area');
    const copyLinkBtn = document.getElementById('copy-link-btn');
    const copySuccess = document.getElementById('copy-success');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // Current video URL
    let currentVideoUrl = null;
    
    // Process terabox link
    processLinkBtn.addEventListener('click', function() {
        const link = teraboxLinkInput.value.trim();
        
        if (!link) {
            alert('Please enter a Terabox link');
            return;
        }
        
        // Show loading in player area
        playerResult.innerHTML = '<div class="loading">Processing link... Please wait</div>';
        playerResult.classList.add('active');
        
        // Make API request to process the link
        fetch('/api/process-link', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ link }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                playerResult.innerHTML = <div class="error">${data.error}</div>;
                copyLinkArea.style.display = 'none';
                return;
            }
            
            // Store the direct video URL
            currentVideoUrl = data.directUrl;
            
            // Create and embed video player
            createVideoPlayer(data.directUrl, playerResult);
            
            // Show copy link area
            copyLinkArea.style.display = 'flex';
        })
        .catch(error => {
            playerResult.innerHTML = <div class="error">Error processing link: ${error.message}</div>;
            copyLinkArea.style.display = 'none';
        });
    });
    
    // Copy link button
    copyLinkBtn.addEventListener('click', function() {
        if (!currentVideoUrl) return;
        
        navigator.clipboard.writeText(currentVideoUrl)
            .then(() => {
                copySuccess.style.display = 'block';
                setTimeout(() => {
                    copySuccess.style.display = 'none';
                }, 3000);
            })
            .catch(err => {
                console.error('Could not copy text: ', err);
            });
    });
    
    // FAQ accordion functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            item.classList.toggle('active');
            const icon = item.querySelector('.toggle-icon');
            icon.textContent = item.classList.contains('active') ? '−' : '+';
        });
    });
});
