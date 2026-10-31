// Current Application State
let currentScenario = 'banking';
let confidenceScore = 85;
let currentMode = 'guided';
let feeChecked = false;
let isVoiceActive = false;

// Scenario Metadata and Quest Definitions
const scenarioData = {
  banking: {
    url: 'https://secure.firstbank.com/transfer',
    title: 'Lesson 1: Money Transfer',
    desc: 'Practice inspecting transfer fields and confirming details before sending.',
    steps: [
      { text: 'Check recipient name & amount', done: true },
      { text: 'Check the agreement box below', done: false },
      { text: 'Click Confirm & Send safely', done: false }
    ]
  },
  email: {
    url: 'https://mail.secure-inbox.com/message/89201',
    title: 'Lesson 2: Fake Email Alert',
    desc: 'Analyze sender addresses and warning banners before clicking links.',
    steps: [
      { text: 'Inspect sender web address', done: false },
      { text: 'Read the warning message', done: false },
      { text: 'Select safe manual app navigation', done: false }
    ]
  },
  gov: {
    url: 'https://account.recovery.gov/reset-password',
    title: 'Lesson 3: Official Account Reset',
    desc: 'Verify official .gov addresses and select strong passphrases.',
    steps: [
      { text: 'Verify official .gov web address', done: true },
      { text: 'Review security notice banner', done: false },
      { text: 'Select a strong passphrase', done: false }
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

  // Update Browser URL Bar and Quest Box Metadata
  const data = scenarioData[type];
  if (data) {
    const urlEl = document.getElementById('sim-url');
    const titleEl = document.getElementById('quest-title');
    const descEl = document.getElementById('quest-desc');

    if (urlEl) urlEl.innerText = data.url;
    if (titleEl) titleEl.innerText = data.title;
    if (descEl) descEl.innerText = data.desc;

    // Render Quest Checklist Steps
    renderQuestSteps(data);
  }
}

function renderQuestSteps(data) {
  const stepsContainer = document.getElementById('quest-steps');
  if (!stepsContainer) return;
  stepsContainer.innerHTML = '';
  
  data.steps.forEach((step, index) => {
    const item = document.createElement('div');
    let isDone = step.done;
    if (currentScenario === 'banking' && index === 1) {
      isDone = feeChecked;
    }
    item.className = `quest-step-item ${isDone ? 'done' : ''}`;
    item.innerHTML = `
      <i class="${isDone ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}"></i>
      <span>${step.text}</span>
    `;
    stepsContainer.appendChild(item);
  });
}

// Toggle Fee Disclosure Checkbox in Bank Transfer
function toggleFeeCheckbox() {
  const checkbox = document.getElementById('fee-checkbox');
  if (!checkbox) return;
  checkbox.checked = !checkbox.checked;
  feeChecked = checkbox.checked;

  if (currentScenario === 'banking') {
    renderQuestSteps(scenarioData.banking);
  }
}

// Attempt Bank Transfer with Checkbox Validation
function attemptBankTransfer() {
  const checkbox = document.getElementById('fee-checkbox');
  if (checkbox && !checkbox.checked) {
    triggerOops('Checkbox Needed', 'Please check the agreement box before clicking Confirm & Send.');
    return;
  }
  triggerSuccess('Transfer Completed Safely!', 'Great job! You checked the recipient name, confirmed the amount, and completed a safe bank transfer.');
}

// Live Inspector Hover / Click Panel Updates
function inspectElement(title, level, description, tip) {
  const cardStatus = document.getElementById('inspect-status');
  const statusIcon = document.getElementById('inspect-status-icon');
  const statusText = document.getElementById('inspect-status-text');

  if (!cardStatus || !statusIcon || !statusText) return;

  cardStatus.className = `card-status status-${level.toLowerCase()}`;
  statusText.innerText = level.toUpperCase();

  if (level === 'Safe') {
    statusIcon.className = 'fa-solid fa-shield-check';
  } else if (level === 'Caution') {
    statusIcon.className = 'fa-solid fa-triangle-exclamation';
  } else {
    statusIcon.className = 'fa-solid fa-bug';
  }

  const titleEl = document.getElementById('inspect-title');
  const descEl = document.getElementById('inspect-desc');
  const tipEl = document.getElementById('inspect-tip');

  if (titleEl) titleEl.innerText = title;
  if (descEl) descEl.innerText = description;
  if (tipEl) tipEl.innerText = tip;

  if (isVoiceActive && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${title}. ${description}`);
    window.speechSynthesis.speak(utterance);
  }
}

// Read Aloud Screen Speech Synthesis
function toggleReadAloud() {
  isVoiceActive = !isVoiceActive;
  if (isVoiceActive) {
    alert('🔊 Screen Reader Guidance Active! Move your mouse over elements to hear explanations.');
  } else {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    alert('🔇 Screen Reader Guidance Disabled.');
  }
}

// Modal Handlers with Animated Transitions
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
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

function closeModal() {
  const modal = document.getElementById('feedback-modal');
  if (!modal) return;

  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 250);
}

// Update Header Confidence Score Display
function updateScoreUI() {
  const valEl = document.querySelector('.confidence-info .val');
  if (valEl) valEl.innerText = `${confidenceScore} / 100`;
}

// Reset Current Simulation View
function resetCurrentScenario() {
  if (currentScenario === 'banking') {
    feeChecked = false;
    const checkbox = document.getElementById('fee-checkbox');
    if (checkbox) checkbox.checked = false;
  }
  loadScenario(currentScenario);
}

// Toggle Guided vs Free Exploration Modes
function setMode(mode) {
  currentMode = mode;
  document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));

  const bodyEl = document.body;
  const questBox = document.getElementById('quest-box');
  const sandboxBadge = document.getElementById('sandbox-badge');

  if (mode === 'guided') {
    const guidedBtn = document.getElementById('btn-guided');
    if (guidedBtn) guidedBtn.classList.add('active');

    bodyEl.classList.remove('free-mode-active');
    if (questBox) questBox.style.display = 'block';
    if (sandboxBadge) sandboxBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> SAFE TEST MODE — NO REAL MONEY USED';
  } else {
    const freeBtn = document.getElementById('btn-free');
    if (freeBtn) freeBtn.classList.add('active');

    bodyEl.classList.add('free-mode-active');
    if (questBox) questBox.style.display = 'none';
    if (sandboxBadge) sandboxBadge.innerHTML = '<i class="fa-solid fa-gamepad"></i> FREE PRACTICE MODE ACTIVE';
  }
}

// Initialize Default State on Page Load
document.addEventListener('DOMContentLoaded', () => {
  loadScenario('banking');
});