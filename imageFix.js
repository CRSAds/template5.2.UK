export function setupImageFix() {
  // Trigger scroll event bij paginalaad om lazyload mechanismes te activeren
  window.dispatchEvent(new Event('scroll'));
}

export function reloadImages(section) {
  // Trigger scroll event opnieuw bij sectie-wijziging
  window.dispatchEvent(new Event('scroll'));

  const images = section.querySelectorAll('img');
  images.forEach(img => {
    if (img.dataset.src && !img.src.includes(img.dataset.src)) {
      img.src = img.dataset.src;
    } else {
      const src = img.src;
      img.src = '';
      img.src = src;
    }

    img.style.opacity = '1';
    img.style.visibility = 'visible';
  });
}
