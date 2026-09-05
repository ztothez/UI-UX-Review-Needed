document.addEventListener('DOMContentLoaded', () => {
  const frame = document.querySelector('[data-preview-frame]');
  const image = document.querySelector('[data-preview-image]');
  if (!frame || !image) return;

  const candidate = document.body.dataset.candidate;
  const buttons = document.querySelectorAll('[data-view]');
  const paths = {
    overview: `../../assets/screenshots/candidate-${candidate}-overview-wide.png`,
    analysis: `../../assets/screenshots/candidate-${candidate}-analysis-wide.png`,
    mobile: `../../assets/screenshots/candidate-${candidate}-overview-mobile.png`,
    tablet: `../../assets/screenshots/candidate-${candidate}-overview-tablet.png`,
    desktop: `../../assets/screenshots/candidate-${candidate}-overview-desktop.png`,
    wide: `../../assets/screenshots/candidate-${candidate}-overview-wide.png`,
  };

  function select(view) {
    const imageView = view === 'overview' || view === 'analysis' ? view : 'overview';
    image.src = paths[view];
    image.alt = `Candidate ${candidate.toUpperCase()} ${imageView} ${view} view`;
    frame.dataset.viewport = view;
    buttons.forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
  }

  buttons.forEach((button) => button.addEventListener('click', () => select(button.dataset.view)));
  select('overview');
});
