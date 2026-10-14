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

(() => {
  // Progressive enhancement: rebalance short endings without editing the content.
  if (!window.Intl?.Segmenter || !CSS.supports('text-wrap', 'balance')) return;
  const candidates = [...document.querySelectorAll('main p, main h1, main h2, main h3, main li, .verse-line')].filter(element =>
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
  // Allow a small margin above the requested 65% of the preceding line.
  const needsBalancing = (element, lines) => {
    if (lines.length < 2) return false;
    const last = lines.at(-1), previous = lines.at(-2);
    if (last.right - last.left < .67 * (previous.right - previous.left)) return true;
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
    element.querySelectorAll('.balanced-ending, .balanced-last-words').forEach(tail => tail.replaceWith(...tail.childNodes));
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
  const wrapEnding = (element, lines) => {
    const root = rootFor(element);
    // Native balancing has a line-count limit; only rebalance the last five lines.
    const start = startOfLine(root, lines[lines.length - 5].middle);
    if (start) wrapRange(endingRange(root, start), 'balanced-ending');
  };
  const keepLastWords = element => {
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
    if (/^H[1-3]$/.test(element.tagName) && words.length >= 2) {
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
      if (length >= width * .7) break;
    }
    if (chosen) wrapRange(endingRange(root, chosen), 'balanced-last-words');
  };
  const balance = () => {
    for (const element of candidates) {
      reset(element);
      if (!element.getClientRects().length) continue;
      const lines = lineBoxes(element);
      if (!needsBalancing(element, lines)) continue;
      if (lines.length <= 5) element.classList.add('balanced-copy');
      else wrapEnding(element, lines);
      if (needsBalancing(element, lineBoxes(element))) {
        reset(element);
        keepLastWords(element);
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
