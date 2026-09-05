document.addEventListener('DOMContentLoaded', () => {
  /* 1. Shuffle Candidates */
  const main = document.querySelector('main');
  const candidateSections = Array.from(main.querySelectorAll('.candidate-section'));
  
  if (candidateSections.length > 0) {
    // Shuffle array using Fisher-Yates
    for (let i = candidateSections.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidateSections[i], candidateSections[j]] = [candidateSections[j], candidateSections[i]];
    }

    // Re-append to main to reflect new order
    // We want to insert them after the static content, but before footer if it was in main.
    // In index.html, they are the last sections in main.
    candidateSections.forEach(section => main.appendChild(section));

    // Also reorder the navigation links to match
    const navInner = document.querySelector('.nav-inner');
    const navLinks = Array.from(navInner.querySelectorAll('a'));
    
    // Create a map of candidate id to its nav link
    const navLinkMap = {};
    navLinks.forEach(link => {
      const href = link.getAttribute('href').substring(1); // remove #
      navLinkMap[href] = link;
    });

    // Append links in the new randomized order
    candidateSections.forEach(section => {
      const link = navLinkMap[section.id];
      if (link) {
        navInner.appendChild(link);
      }
    });
  }

  /* 2. Copy Template to Clipboard */
  const copyBtn = document.getElementById('copy-btn');
  const templateText = document.getElementById('template-text');
  
  if (copyBtn && templateText) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(templateText.textContent)
        .then(() => {
          const originalText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('copied');
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
        });
    });
  }

  /* 3. Lightbox Logic */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  
  if (lightbox && lightboxImg && lightboxClose) {
    // Open lightbox when clicking any image link
    const imageLinks = document.querySelectorAll('figure a');
    imageLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const imgUrl = link.getAttribute('href');
        if (imgUrl) {
          lightboxImg.src = imgUrl;
          lightbox.classList.add('active');
        }
      });
    });

    // Close lightbox functions
    const closeLightbox = () => {
      lightbox.classList.remove('active');
      setTimeout(() => { lightboxImg.src = ''; }, 200); // clear image after fade out
    };

    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close on clicking outside the image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
});
