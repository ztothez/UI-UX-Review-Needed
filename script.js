document.addEventListener('DOMContentLoaded', () => {
  // 1. Shuffle Candidate Sections
  const main = document.querySelector('main');
  const candidates = Array.from(main.querySelectorAll('.candidate-section'));
  
  if (candidates.length > 0) {
    // Fisher-Yates shuffle
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
    }
    
    // Append them back in the new random order
    candidates.forEach(candidate => main.appendChild(candidate));
  }

  // 2. Lightbox Logic
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  
  if (lightbox) {
    document.querySelectorAll('figure a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const img = link.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
        }
      });
    });

    // Close lightbox on click outside or on close button
    lightbox.addEventListener('click', (e) => {
      if (e.target !== lightboxImg) {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        lightbox.classList.remove('active');
        lightboxImg.src = '';
      }
    });
  }

  // 3. Copy-to-Clipboard Logic
  const copyBtn = document.getElementById('copy-btn');
  const templateText = document.getElementById('template-text');

  if (copyBtn && templateText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(templateText.textContent);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    });
  }

  // 4. Interactive Mode Toggle
  const modeToggle = document.getElementById('mode-toggle');
  const primaryGrids = document.querySelectorAll('.primary-grid');

  if (modeToggle) {
    modeToggle.addEventListener('change', (e) => {
      const isInteractive = e.target.checked;
      
      primaryGrids.forEach(grid => {
        const staticViews = grid.querySelectorAll('.static-view');
        const interactiveView = grid.querySelector('.interactive-view');
        
        if (isInteractive) {
          staticViews.forEach(v => v.style.display = 'none');
          if (interactiveView) {
            interactiveView.style.display = 'block';
            
            // Only Candidate E has a declared local preview. Do not create
            // broken localhost frames for anonymous screenshot candidates.
            const url = interactiveView.dataset.liveUrl;
            const isLocalPreview = url && ['localhost', '127.0.0.1'].includes(window.location.hostname);
            const existingFrame = interactiveView.querySelector('iframe');
            const existingMessage = interactiveView.querySelector('.preview-unavailable');
            if (isLocalPreview && !existingFrame) {
              if (existingMessage) existingMessage.remove();
              const iframe = document.createElement('iframe');
              iframe.src = url;
              iframe.title = interactiveView.dataset.liveLabel || "Interactive candidate preview";
              iframe.loading = "lazy";
              interactiveView.appendChild(iframe);
            } else if (!isLocalPreview && !existingFrame && !existingMessage && !interactiveView.querySelector('.static-preview-link')) {
              const message = document.createElement('p');
              message.className = 'preview-unavailable';
              message.textContent = url
                ? 'Live preview is local-only. Run Candidate E on port 4280 to inspect it.'
                : 'This candidate is available for review as a static capture only.';
              interactiveView.appendChild(message);
            }
          }
        } else {
          staticViews.forEach(v => v.style.display = 'block');
          if (interactiveView) {
            interactiveView.style.display = 'none';
          }
        }
      });
    });
  }
});
