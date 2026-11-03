const pages = ['beranda', 'bantu', 'talang', 'profil'];
const pageNames = {
  beranda: 'Beranda',
  bantu: 'Rewang Bantu',
  talang: 'Rewang Talang',
  profil: 'Profil saya',
};

const programs = {
  '2043': {
    department: 'Statistika Bisnis',
    faculty: 'Fakultas Vokasi',
  },
};

const loginPage = document.querySelector('#login-page');
const appShell = document.querySelector('#app-shell');
const bottomNav = document.querySelector('#app-bottom-nav');
const loginForm = document.querySelector('#login-form');
const emailInput = document.querySelector('#its-email');
const displayNameInput = document.querySelector('#display-name');
const proofInput = document.querySelector('#myits-proof');
const loginError = document.querySelector('#login-error');
const proofError = document.querySelector('#proof-error');
let currentProfile = null;
let currentActivities = [];

function formatActivityTime(date) {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function createActivityRow(activity, compact) {
  const row = document.createElement('div');
  row.className = compact ? 'activity-item' : 'history-entry';

  if (compact) {
    const bullet = document.createElement('span');
    bullet.className = `activity-bullet ${activity.type === 'talang' ? 'bullet-purple' : 'bullet-green'}`;
    row.append(bullet);
  } else {
    const icon = document.createElement('span');
    icon.className = `history-icon ${activity.type === 'talang' ? 'file-icon' : 'print-icon'}`;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', activity.type === 'talang' ? '#i-wallet' : '#i-hand');
    svg.append(use);
    icon.append(svg);
    row.append(icon);
  }

  const description = document.createElement('span');
  description.className = 'activity-description';
  const title = document.createElement('strong');
  title.textContent = activity.title;
  const time = document.createElement('small');
  time.textContent = `${formatActivityTime(activity.createdAt)}${activity.detail ? ` · ${activity.detail}` : ''}`;
  description.append(title, time);
  row.append(description);

  const status = document.createElement('span');
  status.className = `activity-status ${activity.type === 'talang' ? 'status-done' : 'status-waiting'}`;
  status.textContent = activity.status;
  row.append(status);
  return row;
}

function renderActivities() {
  const homeList = document.querySelector('#home-activity-list');
  const profileList = document.querySelector('#profile-activity-list');
  homeList.replaceChildren(...currentActivities.slice(0, 2).map((activity) => createActivityRow(activity, true)));
  profileList.replaceChildren(...currentActivities.map((activity) => createActivityRow(activity, false)));

  const isEmpty = currentActivities.length === 0;
  document.querySelector('#home-activity-empty').hidden = !isEmpty;
  document.querySelector('#profile-activity-empty').hidden = !isEmpty;
  document.querySelector('#home-activity-count').textContent = String(currentActivities.length).padStart(2, '0');
  document.querySelector('#home-activity-caption').textContent = isEmpty
    ? 'Mulai dari satu langkah kecil.'
    : 'Aktivitasmu terus bertambah.';
  document.querySelector('#profile-activity-count').textContent = String(currentActivities.length);
  document.querySelector('#profile-help-count').textContent = String(
    currentActivities.filter((activity) => activity.type === 'help').length,
  );
  document.querySelector('#profile-talang-count').textContent = String(
    currentActivities.filter((activity) => activity.type === 'talang').length,
  );
}

function addActivity({ type, title, detail, status }) {
  currentActivities.unshift({
    type,
    title,
    detail,
    status,
    createdAt: new Date(),
  });
  renderActivities();
}

function setProfile(profile) {
  currentProfile = profile;
  const initials = profile.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toLocaleUpperCase('id'))
    .join('');
  document.querySelectorAll('[data-profile-initials]').forEach((element) => {
    element.textContent = initials;
  });
  document.querySelectorAll('[data-profile-name]').forEach((element) => {
    element.textContent = profile.name;
  });
  document.querySelectorAll('[data-profile-department]').forEach((element) => {
    element.textContent = profile.department;
  });
  document.querySelectorAll('[data-profile-faculty]').forEach((element) => {
    element.textContent = profile.faculty;
  });
  document.querySelectorAll('[data-profile-email]').forEach((element) => {
    element.textContent = profile.email;
  });
  document.querySelector('[data-profile-first-name]').textContent = profile.name.split(/\s+/)[0];
  document.querySelector('.avatar-top').setAttribute('aria-label', `Buka profil ${profile.name}`);
  document.querySelector('#profile-verification-status').lastChild.textContent = ' Bukti lokal dipilih · belum diperiksa';
}

function signIn(email, displayName) {
  const match = email.match(/^(\d{10})@student\.its\.ac\.id$/);
  if (!match) {
    loginError.textContent = 'Gunakan format email mahasiswa seperti 2043231084@student.its.ac.id.';
    loginError.hidden = false;
    return;
  }
  const programCode = match[1].slice(0, 4);
  const program = programs[programCode];
  if (!program) {
    loginError.textContent = `Kode program ${programCode} belum tersedia. Silakan hubungi pengelola REWANG.`;
    loginError.hidden = false;
    return;
  }
  const profile = {
    email,
    name: displayName,
    department: program.department,
    faculty: program.faculty,
  };
  loginError.hidden = true;
  setProfile(profile);
  currentActivities = [];
  renderActivities();
  loginPage.hidden = true;
  appShell.hidden = false;
  bottomNav.hidden = false;
  showPage('beranda');
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput.value.trim().toLocaleLowerCase('id');
  const displayName = displayNameInput.value.trim();
  const proof = proofInput.files?.[0];
  if (!emailInput.checkValidity() || !/^\d{10}@student\.its\.ac\.id$/i.test(email)) {
    loginError.textContent = 'Masukkan email mahasiswa ITS dengan format 10 digit NRP@student.its.ac.id.';
    loginError.hidden = false;
    emailInput.focus();
    return;
  }
  if (!displayName) {
    loginError.textContent = 'Masukkan nama lengkap untuk profil.';
    loginError.hidden = false;
    displayNameInput.focus();
    return;
  }
  if (!proof) {
    proofError.textContent = 'Pilih tangkapan layar profil myITS untuk melanjutkan.';
    proofError.hidden = false;
    proofInput.focus();
    return;
  }
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(proof.type) || proof.size > 5 * 1024 * 1024) {
    proofError.textContent = 'Pilih gambar PNG, JPG, atau WEBP berukuran maksimal 5 MB.';
    proofError.hidden = false;
    proofInput.value = '';
    document.querySelector('#proof-file-label').textContent = 'Pilih gambar profil akun myITS';
    proofInput.focus();
    return;
  }
  proofError.hidden = true;
  signIn(email, displayName);
});

proofInput.addEventListener('change', () => {
  const proof = proofInput.files?.[0];
  proofError.hidden = true;
  document.querySelector('#proof-file-label').textContent = proof
    ? `${proof.name} · ${(proof.size / (1024 * 1024)).toFixed(1)} MB`
    : 'Pilih gambar profil akun myITS';
});

document.querySelector('#sign-out').addEventListener('click', () => {
  currentProfile = null;
  bottomNav.hidden = true;
  appShell.hidden = true;
  loginPage.hidden = false;
  loginError.hidden = true;
  emailInput.value = '';
  displayNameInput.value = '';
  proofInput.value = '';
  proofError.hidden = true;
  document.querySelector('#proof-file-label').textContent = 'Pilih gambar profil akun myITS';
  currentActivities = [];
  renderActivities();
  document.title = 'REWANG ITS — Tumbuh bareng, saling bantu';
  emailInput.focus();
});

function showPage(name) {
  if (!pages.includes(name)) return;
  document.querySelectorAll('.page-section').forEach((section) => {
    section.classList.toggle('active', section.id === `page-${name}`);
  });
  document.querySelectorAll('[data-page]').forEach((control) => {
    const active = control.dataset.page === name;
    control.classList.toggle('active', active);
    if (control.matches('.nav-link, .bottom-link')) {
      if (active) control.setAttribute('aria-current', 'page');
      else control.removeAttribute('aria-current');
    }
  });
  document.querySelector('#page-label').textContent = pageNames[name];
  document.title = `${pageNames[name]} — REWANG ITS`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelectorAll('[data-page]').forEach((control) => {
  control.addEventListener('click', () => showPage(control.dataset.page));
});

const dialog = document.querySelector('#request-dialog');
const serviceSelect = document.querySelector('#request-service');
const requestForm = document.querySelector('#request-form');
const toast = document.querySelector('#toast');
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove('visible'), 3600);
}

function openRequest(service = '') {
  serviceSelect.value = [...serviceSelect.options].some((option) => option.value === service)
    ? service
    : '';
  dialog.showModal();
}

document.querySelectorAll('[data-service]').forEach((control) => {
  control.addEventListener('click', () => openRequest(control.dataset.service));
});

requestForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!requestForm.reportValidity()) return;
  const service = serviceSelect.value;
  const location = document.querySelector('#request-location').value.trim();
  addActivity({
    type: 'help',
    title: `Permintaan: ${service}`,
    detail: location,
    status: 'Tersimpan',
  });
  dialog.close();
  requestForm.reset();
  showToast('Permintaan ditambahkan ke aktivitas sesi ini. Belum dikirim ke penyedia.');
});

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

let activeFilter = 'Semua';
const searchInput = document.querySelector('#service-search');

function filterServices() {
  const search = searchInput.value.trim().toLocaleLowerCase('id');
  document.querySelectorAll('.market-card').forEach((card) => {
    const matchesCategory = activeFilter === 'Semua'
      || card.dataset.category.split(' ').includes(activeFilter);
    const matchesSearch = !search || card.textContent.toLocaleLowerCase('id').includes(search);
    card.hidden = !(matchesCategory && matchesSearch);
  });
}

document.querySelectorAll('.filter-chip').forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll('.filter-chip').forEach((chip) => {
      const selected = chip === button;
      chip.classList.toggle('selected', selected);
      chip.setAttribute('aria-pressed', String(selected));
    });
    filterServices();
  });
});
searchInput.addEventListener('input', filterServices);
document.querySelectorAll('.filter-chip').forEach((chip) => {
  chip.setAttribute('aria-pressed', String(chip.classList.contains('selected')));
});

const amountInput = document.querySelector('#fund-amount');
const amountRange = document.querySelector('#fund-range');
const monthsButtons = [...document.querySelectorAll('.term-option')];
let selectedMonths = 6;

function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value).replace(/\u00a0/g, ' ');
}

function updateEstimate(source) {
  let amount = Number(source.value);
  if (!Number.isFinite(amount)) amount = 50000;
  amount = Math.min(5000000, Math.max(50000, Math.round(amount / 50000) * 50000));
  amountInput.value = String(amount);
  amountRange.value = String(amount);
  document.querySelector('#estimate-total').textContent = formatRupiah(amount);
  document.querySelector('#estimate-monthly').textContent = formatRupiah(Math.ceil(amount / selectedMonths));
  document.querySelector('#estimate-term').textContent = `${selectedMonths} bulan`;
}

amountInput.addEventListener('input', () => updateEstimate(amountInput));
amountInput.addEventListener('change', () => updateEstimate(amountInput));
amountRange.addEventListener('input', () => updateEstimate(amountRange));

monthsButtons.forEach((button) => {
  button.setAttribute('aria-pressed', String(button.classList.contains('selected')));
  button.addEventListener('click', () => {
    selectedMonths = Number(button.dataset.months);
    monthsButtons.forEach((option) => {
      const selected = option === button;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
    updateEstimate(amountInput);
  });
});
updateEstimate(amountInput);

document.querySelector('#apply-fund').addEventListener('click', () => {
  addActivity({
    type: 'talang',
    title: 'Menghitung rencana talangan',
    detail: `${formatRupiah(Number(amountInput.value))} · ${selectedMonths} bulan`,
    status: 'Perkiraan',
  });
  showToast('Rencana kontribusi dihitung. Pengajuan dana belum tersedia.');
});

document.querySelector('#edit-profile').addEventListener('click', () => {
  showToast('Profil akun contoh tidak dapat diedit.');
});

document.querySelector('.notification-button').addEventListener('click', () => {
  showToast('Kamu sudah melihat semua notifikasi.');
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((error) => {
      console.error('Pendaftaran service worker gagal:', error);
    });
  });
}
