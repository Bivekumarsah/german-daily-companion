/* DeutschDaily: original, accessible word-order practice using existing A1 lesson examples.
   Does not change course progression or claim to assess Goethe exam proficiency. */
(() => {
  'use strict';
  const MAX_WORDS = 18;
  function tokensOf(sentence) {
    return typeof sentence === 'string' ? sentence.trim().split(/\s+/u).filter(Boolean) : [];
  }
  // Deterministic shuffled order: stable across redraws, without any external dependency.
  function mixTokens(words, seed) {
    const result = words.map((word, index) => ({word, index}));
    let x = 2166136261;
    for (const char of String(seed)) x = Math.imul(x ^ char.codePointAt(0), 16777619) >>> 0;
    for (let i = result.length - 1; i > 0; i--) {
      x ^= x << 13; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
      const j = x % (i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    if (result.length > 1 && result.every((item, i) => item.index === i))
      result.push(result.shift());
    return result;
  }
  function node(tag, klass, contents) {
    const element = document.createElement(tag);
    if (klass) element.className = klass;
    if (contents !== undefined) element.textContent = contents;
    return element;
  }
  function makeButton(label, callback, klass = 'sb-action') {
    const button = node('button', klass, label);
    button.type = 'button';
    button.addEventListener('click', callback);
    return button;
  }
  function render(host, unit, speak) {
    const grammar = unit?.grammar;
    if (!host || !grammar || typeof speak !== 'function') return false;
    const original = tokensOf(grammar.example);
    if (original.length < 3 || original.length > MAX_WORDS ||
        !grammar.exampleEn || !grammar.exampleNe) return false;

    const lab = node('section', 'sentence-builder');
    lab.setAttribute('aria-label', 'Build a German sentence');
    const intro = node('div', 'sb-header');
    intro.append(node('span', 'sb-kicker', '🧩 BUILD • HEAR • SPEAK'),
      node('h5', 'sb-title', 'Build a German sentence'),
      node('p', 'sb-help', 'Tap the German words in the right order. No timer or penalty. You can undo any word.'));
    lab.append(intro);

    const hint = node('div', 'sb-translation');
    hint.append(node('span', 'sb-translate-label', 'WHAT YOU WANT TO SAY'),
      node('p', 'sb-english', grammar.exampleEn),
      node('p', 'sb-nepali', grammar.exampleNe));
    lab.append(hint);

    const audio = node('div', 'sb-actions');
    audio.append(
      makeButton('🔊 Hear German', () => speak(grammar.example, false)),
      makeButton('◷ Hear slowly', () => speak(grammar.example, true)));
    lab.append(audio);

    const chosenTitle = node('p', 'sb-label', 'YOUR SENTENCE');
    const built = node('div', 'sb-built');
    built.setAttribute('role', 'group');
    built.setAttribute('aria-label', 'Your sentence. Tap a chosen word to remove it.');
    const placeholder = node('span', 'sb-placeholder', 'Tap a word below to start building your sentence.');
    const optionsTitle = node('p', 'sb-label', 'TAP WORDS TO ARRANGE THEM');
    const bank = node('div', 'sb-bank');
    bank.setAttribute('role', 'group');
    bank.setAttribute('aria-label', 'Available German words');

    lab.append(chosenTitle, built, optionsTitle, bank);

    const feedback = node('p', 'sb-feedback');
    feedback.setAttribute('role', 'status');
    feedback.setAttribute('aria-live', 'polite');
    const controls = node('div', 'sb-actions sb-controls');
    const answer = node('div', 'sb-answer');
    answer.hidden = true;
    const de = node('p', 'sb-correct-sentence', grammar.example);
    de.lang = 'de';
    answer.append(node('strong', '', 'Example sentence'), de);
    const chosen = [];
    const order = mixTokens(original, unit.id);
    let errors = 0;
    let solved = false;
    let buttons = [];
    const check = makeButton('Check my sentence ✓', verify, 'sb-check');
    const undo = makeButton('← Undo', () => {if (chosen.length && !solved) {chosen.pop();feedback.textContent='';refresh();}});
    const clear = makeButton('Start again ↻', () => {
      chosen.length = 0;
      solved = false;
      errors = 0;
      feedback.textContent = '';
      answer.hidden = true;
      refresh();
    });
    const show = makeButton('Show example', () => {
      answer.hidden = false;
      feedback.textContent = 'Compare with the example, then try arranging the words yourself.';
    });
    show.hidden = true;
    controls.append(check, undo, clear, show);
    lab.append(controls, feedback, answer);

    for (const item of order) {
      const control = makeButton(item.word, () => {
        if (solved || chosen.includes(item.index)) return;
        chosen.push(item.index);
        answer.hidden = true;
        feedback.textContent = '';
        refresh();
      }, 'sb-word');
      control.lang = 'de';
      control.setAttribute('aria-label', 'Add '+item.word);
      control.dataset.wordIndex = String(item.index);
      bank.append(control);
      buttons.push(control);
    }

    function refresh() {
      built.replaceChildren();
      if (!chosen.length) built.append(placeholder);
      for (const [position, originalIndex] of chosen.entries()) {
        const control = makeButton(original[originalIndex], () => {
          if (solved) return;
          chosen.splice(position, 1);
          feedback.textContent = '';
          refresh();
        }, 'sb-selected');
        control.lang = 'de';
        control.disabled = solved;
        control.setAttribute('aria-label', 'Remove '+original[originalIndex]+' from your sentence');
        built.append(control);
      }
      for (const button of buttons) {
        const sourceIndex = Number(button.dataset.wordIndex);
        button.disabled = solved || chosen.includes(sourceIndex);
      }
      check.disabled = solved || chosen.length !== original.length;
      undo.disabled = solved || chosen.length === 0;
      show.hidden = errors === 0 && !solved;
      if (solved) clear.textContent = 'Practise again ↻';
      else clear.textContent = 'Start again ↻';
    }

    function verify() {
      if (solved || chosen.length !== original.length) return;
      const candidate = chosen.map(i => original[i]);
      if (candidate.every((word, position) => word === original[position])) {
        solved = true;
        feedback.textContent = '✓ Richtig! Well done. Listen again and say the sentence aloud. This is practice, not an exam score.';
        answer.hidden = false;
      } else {
        errors++;
        feedback.textContent = 'Not quite yet. Check the first word and the position of the verb. Undo or tap any word to change it.';
        show.hidden = false;
      }
      refresh();
    }
    refresh();
    host.append(lab);
    return true;
  }
  window.DEUTSCH_SENTENCE_BUILDER = {render, tokensOf, mixTokens};
})();