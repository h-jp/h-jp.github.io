(() => {
  // Keep links to the former Teaching supervision section useful after the move.
  const redirectLegacySupervision = () => {
    const legacyTeaching = location.pathname.match(/^\/(zh\/)?teaching\/?$/);
    if (!legacyTeaching || location.hash !== '#student-supervision') return false;
    location.replace(`${legacyTeaching[1] ? '/zh' : ''}/students/#student-supervision`);
    return true;
  };
  window.addEventListener('hashchange', redirectLegacySupervision);
  if (redirectLegacySupervision()) return;
  // Shared anchors identify the same section or course in both languages.
  const sharedAnchors = new Set(['news-title', 'papers-title', 'research-title', 'projects-title', 'teaching-title', 'blog-title', 'about-title', 'artificial-intelligence', 'intelligent-software-engineering', 'intelligent-robotics', 'multi-agent-collaboration', 'code-generation', 'intro-computer-science', 'data-structures', 'computer-networks', 'cross-media', 'linux-programming', 'requirements-engineering', 'large-models-principles-practice', 'student-supervision', 'undergraduates', 'masters', 'admissions', 'undergraduate-innovation-projects-heading', 'undergraduate-capstone-awards-heading', 'courses-heading']);
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

(() => {
  // Progressive enhancement: rebalance short endings without editing the content.
  if (!window.Intl?.Segmenter || !CSS.supports('text-wrap', 'balance')) return;
  const candidates = [...document.querySelectorAll('main p, main h1, main h2, main h3, main .achievement-title, main li, .verse-line')].filter(element =>
    !element.querySelector('p, h1, h2, h3, ul, ol, br, pre, code, .verse-line') &&
    !element.closest('.post-tags, .post-navigation')
  );
  const segmenter = new Intl.Segmenter(document.documentElement.lang || 'en', {granularity: 'word'});
  const lineBoxes = element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    const lines = [];
    while (walker.nextNode()) {
      if (!walker.currentNode.textContent.trim()) continue;
      range.selectNodeContents(walker.currentNode);
      for (const rect of range.getClientRects()) {
        if (rect.width < .1 || rect.height < .1) continue;
        const middle = (rect.top + rect.bottom) / 2;
        let line = lines.find(item => Math.abs(item.middle - middle) < rect.height * .4);
        if (!line) { line = {middle, left: rect.left, right: rect.right}; lines.push(line); }
        else { line.left = Math.min(line.left, rect.left); line.right = Math.max(line.right, rect.right); }
      }
    }
    return lines.sort((a, b) => a.middle - b.middle);
  };
  const rootFor = element => {
    const content = [...element.childNodes].filter(node => node.nodeType !== Node.TEXT_NODE || node.textContent.trim());
    return content.length === 1 && content[0].nodeType === Node.ELEMENT_NODE && content[0].tagName === 'A' ? content[0] : element;
  };
  const startOfLine = (element, target) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim()) continue;
      range.selectNodeContents(node);
      if (![...range.getClientRects()].some(rect => rect.bottom > target)) continue;
      let lo = 0, hi = node.length;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        range.setStart(node, mid); range.setEnd(node, mid + 1);
        if (range.getBoundingClientRect().bottom > target) hi = mid; else lo = mid + 1;
      }
      if (lo < node.length) return {node, offset: lo};
    }
  };
  // A longer ending is a preference; natural spacing takes priority in justified text.
  const needsBalancing = (element, lines, minimum = .67) => {
    if (lines.length < 2) return false;
    const last = lines.at(-1), previous = lines.at(-2);
    if (last.right - last.left < minimum * (previous.right - previous.left)) return true;
    const start = startOfLine(element, last.middle);
    if (!start) return false;
    const range = document.createRange();
    range.setStart(start.node, start.offset); range.setEnd(element, element.childNodes.length);
    const text = range.toString().trim();
    return /[a-z]/i.test(text) && [...segmenter.segment(text)].filter(word => word.isWordLike).length === 1;
  };
  const reset = element => {
    element.classList.remove('balanced-copy');
    element.removeAttribute('data-fit-heading');
    element.style.removeProperty('--balanced-heading-size');
    element.querySelectorAll('.balanced-last-words').forEach(tail => tail.replaceWith(...tail.childNodes));
    element.normalize();
  };
  const endingRange = (root, start) => {
    const range = document.createRange();
    // Keep entire inline elements, so links retain their nodes and keyboard behavior.
    if (start.node.parentNode !== root) {
      let ancestor = start.node.parentNode;
      while (ancestor.parentNode !== root) ancestor = ancestor.parentNode;
      range.setStartBefore(ancestor);
    } else {
      let offset = start.offset;
      while (offset > 0 && /[([{“‘]/.test(start.node.textContent[offset - 1])) offset--;
      range.setStart(start.node, offset);
    }
    range.setEnd(root, root.childNodes.length);
    return range;
  };
  const wrapRange = (range, className) => {
    const tail = document.createElement('span');
    tail.className = className;
    tail.append(range.extractContents()); range.insertNode(tail);
    return tail;
  };
  const keepLastWords = (element, minimum = .7) => {
    const root = rootFor(element);
    const width = root.getBoundingClientRect().width;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const words = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      for (const word of segmenter.segment(node.textContent)) {
        if (word.isWordLike) words.push({node, offset: word.index});
      }
    }
    const probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;inline-size:max-content;max-inline-size:none;pointer-events:none';
    // Very narrow headings may need a smaller font to fit their last two words.
    // Keep the size above body text; never change the title or break a word to fit it.
    if ((/^H[1-3]$/.test(element.tagName) || element.matches('.achievement-title')) && words.length >= 2) {
      probe.append(endingRange(root, words[words.length - 2]).cloneContents());
      root.append(probe);
      const minimumWidth = probe.getBoundingClientRect().width;
      probe.remove();
      if (minimumWidth > width) {
        const current = parseFloat(getComputedStyle(element).fontSize);
        const minimum = parseFloat(getComputedStyle(document.body).fontSize) * 1.15;
        const size = Math.min(current, Math.max(minimum, current * (width - 2) / minimumWidth));
        element.style.setProperty('--balanced-heading-size', `${size}px`);
        element.setAttribute('data-fit-heading', '');
      }
    }
    // Measure candidates without changing the visible text or splitting a link.
    let chosen;
    for (let i = words.length - 2; i >= 0; i--) {
      const range = endingRange(root, words[i]);
      probe.replaceChildren(range.cloneContents());
      root.append(probe);
      const length = probe.getBoundingClientRect().width;
      probe.remove();
      if (length > width) break;
      chosen = words[i];
      if (length >= width * minimum) break;
    }
    if (chosen) wrapRange(endingRange(root, chosen), 'balanced-last-words');
  };
  const context = document.createElement('canvas').getContext('2d');
  const naturalSpaces = new Map();
  const spacing = element => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let maximum = 1, excess = 0;
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const style = getComputedStyle(node.parentElement);
      const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      if (!naturalSpaces.has(font)) {
        context.font = font;
        naturalSpaces.set(font, context.measureText(' ').width);
      }
      const natural = naturalSpaces.get(font);
      for (const match of node.textContent.matchAll(/[ \t\r\n]/g)) {
        range.setStart(node, match.index); range.setEnd(node, match.index + 1);
        const ratio = range.getBoundingClientRect().width / natural;
        maximum = Math.max(maximum, ratio);
        excess += Math.max(0, ratio - 2.5);
      }
    }
    // Chinese justification also expands gaps between characters, without spaces.
    let fill = 1;
    if (document.documentElement.lang.startsWith('zh')) {
      const alignment = element.style.getPropertyValue('text-align');
      const priority = element.style.getPropertyPriority('text-align');
      element.style.setProperty('text-align', 'start');
      fill = Math.min(1, ...lineBoxes(element).slice(0, -1).map(line => (line.right - line.left) / element.clientWidth));
      if (alignment) element.style.setProperty('text-align', alignment, priority);
      else element.style.removeProperty('text-align');
    }
    return {maximum, excess, fill};
  };
  const balanceJustified = element => {
    if (!context || !needsBalancing(element, lineBoxes(element), .65)) return;
    const original = spacing(element);
    const readable = () => {
      const current = spacing(element);
      return current.maximum <= Math.max(2.5, original.maximum + .05) &&
        current.excess <= original.excess + .1 &&
        current.fill >= Math.min(.9, original.fill - .005);
    };
    // Keep one continuous paragraph. Never insert block boundaries to force a ratio.
    keepLastWords(element, .66);
    if (!needsBalancing(element, lineBoxes(element), .65) && readable()) return;
    reset(element);
    element.classList.add('balanced-copy');
    if (!needsBalancing(element, lineBoxes(element), .65) && readable()) return;
    reset(element);
    // If the longer ending would stretch words, retain natural wrapping.
    if (needsBalancing(element, lineBoxes(element), 0)) {
      keepLastWords(element, 0);
      if (!readable()) reset(element);
    }
  };
  const balance = () => {
    naturalSpaces.clear();
    for (const element of candidates) {
      reset(element);
      if (!element.getClientRects().length) continue;
      const lines = lineBoxes(element);
      if (!needsBalancing(element, lines)) continue;
      if (getComputedStyle(element).textAlign === 'justify') {
        balanceJustified(element);
        continue;
      }
      if (lines.length <= 5) element.classList.add('balanced-copy');
      if (needsBalancing(element, lineBoxes(element))) {
        reset(element);
        const last = lines.at(-1), previous = lines.at(-2);
        const minimum = .41 * (last.right - last.left + previous.right - previous.left) / element.clientWidth;
        keepLastWords(element, Math.min(.7, minimum));
        if (needsBalancing(element, lineBoxes(element))) {
          reset(element);
          keepLastWords(element);
        }
      }
    }
  };
  balance();
  let timer;
  const schedule = () => {
    clearTimeout(timer);
    timer = setTimeout(balance, 100);
  };
  window.addEventListener('resize', schedule);
  document.fonts?.addEventListener('loadingdone', schedule);
  window.addEventListener('beforeprint', balance);
  window.addEventListener('afterprint', schedule);
})();
