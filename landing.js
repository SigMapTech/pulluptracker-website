// Progressive enhancement: screenshots remain scrollable without JavaScript.
const previewTrack = document.getElementById('app-previews');
const previewControls = document.querySelector('.preview-controls');
const previewButtons = [...previewControls.querySelectorAll('button')];
const previewSlides = [...previewTrack.children];
previewControls.hidden = false;
previewButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    previewTrack.scrollTo({
      left: previewSlides[index].offsetLeft - previewSlides[0].offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  });
});
let previewFrame;
previewTrack.addEventListener('scroll', () => {
  cancelAnimationFrame(previewFrame);
  previewFrame = requestAnimationFrame(() => {
    const index = Math.round(previewTrack.scrollLeft / previewTrack.clientWidth);
    previewButtons.forEach((button, position) => button.setAttribute('aria-pressed', String(position === index)));
  });
}, { passive: true });

// This is an illustrative, in-memory example, never a real workout log.
const demoForm = document.getElementById('demo-form');
const demoReps = document.getElementById('demo-reps');
const demoTotal = document.getElementById('demo-total');
const demoProgress = document.getElementById('demo-progress');
const demoStatus = document.getElementById('demo-status');
let total = 20;
demoForm.hidden = false;
function renderDemo() {
  demoTotal.textContent = total;
  demoProgress.value = Math.min(total, 30);
  demoProgress.textContent = `${total} of 30 reps`;
}
demoForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!demoForm.reportValidity()) return;
  const reps = Number(demoReps.value);
  total += reps;
  renderDemo();
  demoStatus.textContent = `${reps} ${reps === 1 ? 'rep' : 'reps'} added. ${total} reps today.${total >= 30 ? ' Daily goal reached!' : ` ${30 - total} to your daily goal.`}`;
});
demoForm.addEventListener('reset', () => {
  total = 20;
  renderDemo();
  demoStatus.textContent = 'Example reset. Enter your reps, then save your set.';
});
