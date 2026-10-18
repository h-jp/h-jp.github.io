(() => {
  const section = document.getElementById('comments');
  const status = section?.querySelector('[data-comments-status]');
  if (!status) return;
  const frame = () => section.querySelector('iframe.giscus-frame');
  let timer;
  let observer;
  const loaded = () => {
    status.hidden = true;
    clearTimeout(timer);
    observer?.disconnect();
    window.removeEventListener('message', receive);
  };
  const receive = event => {
    if (event.origin !== 'https://giscus.app' || event.source !== frame()?.contentWindow) return;
    if (typeof event.data?.giscus?.resizeHeight === 'number' && event.data.giscus.resizeHeight > 0) loaded();
  };
  const startWaiting = () => {
    observer?.disconnect();
    timer = setTimeout(() => {
      status.textContent = status.dataset.timeoutMessage;
    }, 12000);
  };
  window.addEventListener('message', receive);
  if (frame() && !frame().classList.contains('giscus-frame--loading')) {
    loaded();
  } else if ('IntersectionObserver' in window) {
    // Do not report a timeout while the reader is still above the lazy iframe.
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) startWaiting();
    }, {rootMargin: '1000px'});
    observer.observe(section);
  } else {
    startWaiting();
  }
})();
