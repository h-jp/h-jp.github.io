(() => {
  // Shared anchors identify the same section or course in both languages.
  const sharedAnchors = new Set(['news-title', 'papers-title', 'research-title', 'projects-title', 'teaching-title', 'blog-title', 'about-title', 'artificial-intelligence', 'intelligent-software-engineering', 'intelligent-robotics', 'multi-agent-collaboration', 'code-generation', 'intro-computer-science', 'data-structures', 'computer-networks', 'cross-media', 'linux-programming', 'requirements-engineering', 'large-models-principles-practice', 'student-supervision', 'courses-heading']);
  document.querySelectorAll('[data-translation][data-preserve-anchor]').forEach(link => {
    link.addEventListener('click', () => {
      const target = new URL(link.href);
      const anchor = location.hash.slice(1);
      if (sharedAnchors.has(anchor)) target.hash = anchor;
      link.href = target.href;
    });
  });
  const menu = document.querySelector('.mobile-menu');
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.open) {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  document.addEventListener('click', event => {
    if (menu?.open && !menu.contains(event.target)) menu.open = false;
  });
})();
