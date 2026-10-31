// Current Application State
let currentScenario = 'banking';
let confidenceScore = 85;

// Scenario Metadata & Quest Definitions
const scenarioData = {
  banking: {
    url: 'https://secure.firstbank.com/transfer',
    title: 'Send $20 safely to a family member',
    desc: 'Practice inspecting transfer fields and confirming details before hitting send.',
    steps: [
      { text: 'Inspect recipient & transfer amount', done: true },
      { text: 'Check the Fee Disclosure box', done: false },
      { text: 'Click Confirm & Send to safely complete', done: false }
    ]
  },
  email: {
    url: 'https://mail.secure-inbox.com/message/89201',
    title: 'Identify safe vs suspicious messages',
    desc: 'Analyze sender addresses and warning banners before clicking links.',
    steps: [
      { text: 'Inspect sender domain name', done: false },
      { text: 'Evaluate urgency alert warning', done: false },
      { text: 'Select safe manual app navigation', done: false }
    ]
  },
  gov: {
    url: 'https://account.recovery.gov/reset-password',
    title: 'Confidently handle account recovery',
    desc: 'Verify official .gov addresses and select strong passphrases.',
    steps: [
      { text: 'Verify official .gov URL in browser bar', done: true },
      { text: 'Review security notice banner', done: false },
      { text: 'Select a strong passphrase strategy', done: false }
    ]
  }
};

// Switch Active Scenario View
function loadScenario(type) {
  currentScenario = type;

  // Update Navigation Cards UI in Sidebar
  document.querySelectorAll('.scenario-card').forEach(card => card.classList.remove('active'));
  const activeCard = document.getElementById(`scen-${type}`);
  if (activeCard) activeCard.classList.add('active');

  // Hide all scenario views and reveal the selected one
  document.querySelectorAll('.scenario-view').forEach(view => view.style.display = 'none');
  const targetView = document.getElementById(`view-${type}`);
  if (targetView) targetView.style.display = 'block';

  // Update Browser URL Bar & Quest Box Metadata
  const data = scenarioData[type];
  if (data) {
    const urlEl = document.getElementById('sim-url');
    const titleEl = document.getElementById('quest-title');
    const descEl = document.getElementById('quest-desc');

    if (urlEl) urlEl.innerText = data.url;
    if (titleEl) titleEl.innerText = data.title;
    if (descEl) descEl.innerText = data.desc;

    // Render Quest Checklist Steps
    const stepsContainer = document.getElementById('quest-steps');
    if (stepsContainer) {
      stepsContainer.innerHTML = '';
      data.steps.forEach(step => {
        const item = document.createElement('div');
        item.className = `quest-step-item ${step.done ? 'done' : ''}`;
        item.innerHTML = `
          <i class="${step.done ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
          <span>${step.text}</span>
        `;
        stepsContainer.appendChild(item);
      });
    }
  }
}

// Live Inspector Hover / Click Panel Updates
function inspectElement(title, level, description, tip) {
  const cardStatus = document.getElementById('inspect-status');
  const statusIcon = document.getElementById('inspect-status-icon');
  const statusText = document.getElementById('inspect-status-text');

  if (!cardStatus || !statusIcon || !statusText) return;

  // Set Status Badge Styles & Icons based on Safety Level
  cardStatus.className = `card-status status-${level.toLowerCase()}`;
  statusText.innerText = level.toUpperCase();

  if (level === 'Safe') {
    statusIcon.className = 'fa-solid fa-shield-check';
  } else if (level === 'Caution') {
    statusIcon.className = 'fa-solid fa-triangle-exclamation';
  } else {
    statusIcon.className = 'fa-solid fa-bug';
  }

  // Update Text Content in the Right Inspector Panel
  const titleEl = document.getElementById('inspect-title');
  const descEl = document.getElementById('inspect-desc');
  const tipEl = document.getElementById('inspect-tip');

  if (titleEl) titleEl.innerText = title;
  if (descEl) descEl.innerText = description;
  if (tipEl) tipEl.innerText = tip;
}

// Success & Mistake Modal Handlers
function triggerSuccess(title, message) {
  confidenceScore = Math.min(100, confidenceScore + 5);
  updateScoreUI();
  showModal(title, message, 'success');
}

function triggerOops(title, message) {
  confidenceScore = Math.max(0, confidenceScore - 10);
  updateScoreUI();
  showModal(title, message, 'danger');
}

function showModal(title, message, type) {
  const modal = document.getElementById('feedback-modal');
  const titleEl = document.getElementById('modal-title');
  const msgEl = document.getElementById('modal-message');
  const iconBg = document.getElementById('modal-icon-bg');
  const iconEl = document.getElementById('modal-icon');

  if (!modal) return;

  titleEl.innerText = title;
  msgEl.innerText = message;
  iconBg.className = `modal-icon-container ${type}`;

  if (type === 'success') {
    iconEl.className = 'fa-solid fa-shield-check';
  } else {
    iconEl.className = 'fa-solid fa-triangle-exclamation';
  }

  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('feedback-modal');
  if (modal) modal.style.display = 'none';
}

// Update Header Confidence Score Display
function updateScoreUI() {
  const valEl = document.querySelector('.confidence-info .val');
  if (valEl) valEl.innerText = `${confidenceScore} / 100`;
}

// Reset Current Simulation View
function resetCurrentScenario() {
  loadScenario(currentScenario);
}

// Toggle Guided vs Free Exploration Modes
function setMode(mode) {
  document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
  if (mode === 'guided') {
    const guidedBtn = document.getElementById('btn-guided');
    if (guidedBtn) guidedBtn.classList.add('active');
  } else {
    const freeBtn = document.getElementById('btn-free');
    if (freeBtn) freeBtn.classList.add('active');
  }
}

// Initialize Default State on Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadScenario('banking');
});S