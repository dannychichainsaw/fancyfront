document.addEventListener('DOMContentLoaded', () => {
  const h1 = document.querySelector('h1');
  h1.addEventListener('click', () => {
    const text = h1.textContent;
    h1.innerHTML = '';
    for (let char of text) {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.position = 'relative';
      span.style.display = 'inline-block';
      h1.appendChild(span);
    }
    const spans = h1.querySelectorAll('span');
    spans.forEach((span, index) => {
      setTimeout(() => {
        span.style.transition = 'transform 0.5s, opacity 0.5s';
        span.style.transform = `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`;
        span.style.opacity = '0';
      }, index * 100);
    });
  });
});
