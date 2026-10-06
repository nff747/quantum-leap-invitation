/* ==========================================================================
   QUANTUM LEAP INVITATION — JAVASCRIPT
   Countdown, Interactive FX, RSVP, Audio, Calendar Integration
   ========================================================================== */

(function () {
  'use strict';

  // Event Target Date: 10 October 2026, 10:00 AM IST (Indian Standard Time, UTC+5:30)
  const EVENT_DATE = new Date('2026-10-10T10:00:00+05:30');

  // DOM Elements
  const fxCanvas = document.getElementById('fxCanvas');
  const cardWrapper = document.getElementById('cardWrapper');
  const spotlightBeams = document.getElementById('spotlightBeams');
  const countdownText = document.getElementById('countdownText');
  const countdownBtn = document.getElementById('countdownBtn');
  const openRsvpBtn = document.getElementById('openRsvpBtn');
  const rsvpModal = document.getElementById('rsvpModal');
  const closeRsvpBtn = document.getElementById('closeRsvpBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpSuccessMessage = document.getElementById('rsvpSuccessMessage');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const calendarMenuBtn = document.getElementById('calendarMenuBtn');
  const calendarDropdown = document.getElementById('calendarDropdown');
  const googleCalLink = document.getElementById('googleCalLink');
  const downloadIcsBtn = document.getElementById('downloadIcsBtn');
  const copyShareBtn = document.getElementById('copyShareBtn');
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const modeToggleBtn = document.getElementById('modeToggleBtn');
  const toastNotification = document.getElementById('toastNotification');

  // Hotspot Buttons
  const spotlightsBtn = document.getElementById('spotlightsBtn');
  const lilyBtn = document.getElementById('lilyBtn');
  const starBtn = document.getElementById('starBtn');
  const penguinsBtn = document.getElementById('penguinsBtn');
  const toastBubble = document.getElementById('toastBubble');
  const dancersBtn = document.getElementById('dancersBtn');
  const danceNotes = document.getElementById('danceNotes');
  const dateBtn = document.getElementById('dateBtn');

  // ==========================================================================
  // Telemetry & Advanced Analytics Helper (Microsoft Clarity)
  // ==========================================================================
  function trackMove(eventName, metadata) {
    try {
      if (typeof window.clarity === 'function') {
        window.clarity('event', eventName);
        if (metadata && typeof metadata === 'object') {
          for (const key in metadata) {
            if (Object.prototype.hasOwnProperty.call(metadata, key)) {
              window.clarity('set', key, String(metadata[key]));
            }
          }
        }
      }
    } catch (e) {
      // analytics fail-safe
    }
  }

  // Record initial visit event
  trackMove('invitation_viewed', { referrer: document.referrer || 'direct' });


  // ==========================================================================
  // Canvas FX Particle Engine
  // ==========================================================================
  const ctx = fxCanvas.getContext('2d');
  let particles = [];
  let animationFrameId = null;

  function resizeCanvas() {
    const rect = fxCanvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    fxCanvas.width = rect.width * dpr;
    fxCanvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', resizeCanvas);
  setTimeout(resizeCanvas, 100);

  class Particle {
    constructor(x, y, type = 'star', options = {}) {
      this.x = x;
      this.y = y;
      this.type = type; // 'star', 'petal', 'confetti'
      this.life = 1.0;
      this.decay = options.decay || (0.008 + Math.random() * 0.012);

      if (type === 'petal') {
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = 1.2 + Math.random() * 2.0;
        this.size = 8 + Math.random() * 10;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.06;
        this.color = options.color || (Math.random() > 0.4 ? '#8B0021' : '#b31238');
      } else if (type === 'confetti') {
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = -(4 + Math.random() * 8);
        this.gravity = 0.25;
        this.size = 6 + Math.random() * 6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.15;
        const colors = ['#fcd34d', '#f59e0b', '#ef4444', '#ec4899', '#ffffff', '#38bdf8'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      } else {
        // star / sparkle
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.size = 3 + Math.random() * 4;
        this.color = options.color || '#fef08a';
      }
    }

    update() {
      this.life -= this.decay;
      if (this.type === 'confetti') {
        this.vy += this.gravity;
      }
      this.x += this.vx;
      this.y += this.vy;
      if (this.rotation !== undefined) {
        this.rotation += this.rotationSpeed;
      }
    }

    draw(context) {
      if (this.life <= 0) return;
      context.save();
      context.globalAlpha = Math.max(0, this.life);

      if (this.type === 'petal') {
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.fillStyle = this.color;
        context.beginPath();
        context.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        context.fill();
      } else if (this.type === 'confetti') {
        context.translate(this.x, this.y);
        context.rotate(this.rotation);
        context.fillStyle = this.color;
        context.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
      } else {
        // star / sparkle
        context.translate(this.x, this.y);
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(0, 0, this.size, 0, Math.PI * 2);
        context.fill();
        context.shadowColor = '#fcd34d';
        context.shadowBlur = 6;
      }

      context.restore();
    }
  }

  function runFxLoop() {
    const rect = fxCanvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    if (particles.length > 0) {
      animationFrameId = requestAnimationFrame(runFxLoop);
    } else {
      animationFrameId = null;
    }
  }

  function spawnParticles(x, y, count = 20, type = 'star', options = {}) {
    resizeCanvas();
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, type, options));
    }
    if (!animationFrameId) {
      animationFrameId = requestAnimationFrame(runFxLoop);
    }
  }

  // ==========================================================================
  // Hotspot Action Listeners
  // ==========================================================================

  // 1. Spotlights toggle
  if (spotlightsBtn) {
    spotlightsBtn.addEventListener('click', () => {
      const isActive = spotlightBeams.classList.toggle('active');
      showToast(isActive ? '🔦 Stage Spotlights On!' : 'Stage Spotlights Off');
      playTone(isActive ? 660 : 440, 0.1);
      trackMove('spotlights_toggled', { state: isActive ? 'on' : 'off' });
    });
  }

  // 2. Lily Flower click -> shower petals
  if (lilyBtn) {
    lilyBtn.addEventListener('click', (e) => {
      const rect = fxCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnParticles(x, y, 24, 'petal');
      showToast('🌸 Crimson petals floating...');
      trackMove('petals_showered');
    });
  }

  // 3. Shooting Star click -> sparkle burst
  if (starBtn) {
    starBtn.addEventListener('click', (e) => {
      const rect = fxCanvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawnParticles(x, y, 35, 'star', { color: '#fde047' });
      playTone(880, 0.15, 'sine');
      showToast('💫 Quantum Leap is shining!');
      trackMove('star_twinkled');
    });
  }

  // ==========================================================================
  // 4. Living Penguin Video Integration
  // ==========================================================================
  const penguinVideoContainer = document.getElementById('penguinVideoContainer');
  const penguinVideo = document.getElementById('penguinVideo');
  const videoPlayPill = document.getElementById('videoPlayPill');
  const videoPlaybackBar = document.getElementById('videoPlaybackBar');
  const btnVideoPause = document.getElementById('btnVideoPause');
  const btnVideoSound = document.getElementById('btnVideoSound');
  const btnVideoReplay = document.getElementById('btnVideoReplay');
  const btnVideoClose = document.getElementById('btnVideoClose');

  let wasSynthPlayingBeforeVideo = false;

  function playPenguinVideo(e) {
    if (e) e.stopPropagation();
    if (!penguinVideo) return;

    // Pause ambient synth if playing to avoid audio clash
    if (isPlayingMusic) {
      wasSynthPlayingBeforeVideo = true;
      toggleMusic();
    }

    penguinVideoContainer.classList.add('playing');
    if (videoPlayPill) videoPlayPill.hidden = true;
    if (videoPlaybackBar) videoPlaybackBar.hidden = false;
    if (btnVideoPause) btnVideoPause.textContent = '⏸️';

    // Turn on spotlights for the performance!
    if (spotlightBeams && !spotlightBeams.classList.contains('active')) {
      spotlightBeams.classList.add('active');
    }

    // Burst festive stars
    const rect = fxCanvas.getBoundingClientRect();
    spawnParticles(rect.width / 2, rect.height * 0.5, 30, 'star', { color: '#fde047' });

    penguinVideo.currentTime = 0;
    penguinVideo.muted = false;
    const playPromise = penguinVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fall back to muted playback if autoplay blocked
        penguinVideo.muted = true;
        penguinVideo.play();
        if (btnVideoSound) btnVideoSound.textContent = '🔇';
      });
    }

    showToast('🐧 The party is live! Madagascar penguins taking over! 🎵');
    trackMove('penguin_video_started');
  }

  function pausePenguinVideo() {
    if (!penguinVideo) return;
    if (penguinVideo.paused) {
      penguinVideo.play();
      btnVideoPause.textContent = '⏸️';
      trackMove('penguin_video_resumed');
    } else {
      penguinVideo.pause();
      btnVideoPause.textContent = '▶️';
      trackMove('penguin_video_paused');
    }
  }

  function toggleVideoSound() {
    if (!penguinVideo) return;
    penguinVideo.muted = !penguinVideo.muted;
    btnVideoSound.textContent = penguinVideo.muted ? '🔇' : '🔊';
    trackMove('penguin_video_sound_toggled', { muted: String(penguinVideo.muted) });
  }

  function replayPenguinVideo() {
    if (!penguinVideo) return;
    penguinVideo.currentTime = 0;
    penguinVideo.play();
    btnVideoPause.textContent = '⏸️';
    trackMove('penguin_video_replayed');
  }

  function closePenguinVideo(e) {
    if (e) e.stopPropagation();
    if (!penguinVideo) return;
    trackMove('penguin_video_closed');
    penguinVideo.pause();
    penguinVideo.currentTime = 0;
    penguinVideoContainer.classList.remove('playing');
    if (videoPlayPill) videoPlayPill.hidden = false;
    if (videoPlaybackBar) videoPlaybackBar.hidden = true;

    if (spotlightBeams) {
      spotlightBeams.classList.remove('active');
    }

    // Resume ambient synth if it was playing before
    if (wasSynthPlayingBeforeVideo && !isPlayingMusic) {
      toggleMusic();
      wasSynthPlayingBeforeVideo = false;
    }
  }

  if (videoPlayPill) videoPlayPill.addEventListener('click', playPenguinVideo);
  if (penguinsBtn) penguinsBtn.addEventListener('click', playPenguinVideo);
  if (btnVideoPause) btnVideoPause.addEventListener('click', (e) => { e.stopPropagation(); pausePenguinVideo(); });
  if (btnVideoSound) btnVideoSound.addEventListener('click', (e) => { e.stopPropagation(); toggleVideoSound(); });
  if (btnVideoReplay) btnVideoReplay.addEventListener('click', (e) => { e.stopPropagation(); replayPenguinVideo(); });
  if (btnVideoClose) btnVideoClose.addEventListener('click', closePenguinVideo);

  if (penguinVideo) {
    penguinVideo.addEventListener('ended', () => {
      // Revert seamlessly to invitation card once video finishes
      trackMove('penguin_video_completed');
      closePenguinVideo();
      showToast('🐧 That was a blast! Tap penguins to watch again.');
    });
  }

  // 5. Dancers click -> groove
  let danceTimer = null;
  if (dancersBtn) {
    dancersBtn.addEventListener('click', () => {
      danceNotes.classList.add('show');
      clearTimeout(danceTimer);
      danceTimer = setTimeout(() => {
        danceNotes.classList.remove('show');
      }, 2500);

      playTone(440, 0.1, 'triangle');
      setTimeout(() => playTone(554.37, 0.1, 'triangle'), 120);
      showToast('🕺💃 Groovin’ to the party tracks!');
      trackMove('dancers_grooved');
    });
  }

  // 6. Date click -> open Calendar Options
  if (dateBtn) {
    dateBtn.addEventListener('click', () => {
      trackMove('date_hotspot_clicked');
      toggleCalendarDropdown();
    });
  }

  // ==========================================================================
  // Countdown Timer to 10 Oct 2026, 10:00 AM
  // ==========================================================================
  function updateCountdown() {
    const now = new Date();
    const diff = EVENT_DATE - now;

    if (diff <= 0) {
      countdownText.textContent = '🎉 LIVE NOW!';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    countdownText.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  if (countdownBtn) {
    countdownBtn.addEventListener('click', () => {
      trackMove('countdown_badge_clicked');
      showToast('Event: 10 October 2026 at 10:00 AM IST (Indian Standard Time)');
    });
  }

  // ==========================================================================
  // Calendar Links & .ics Generator (IST / Asia/Kolkata)
  // ==========================================================================
  function getGoogleCalendarUrl() {
    const title = encodeURIComponent('QUANTUM LEAP 💫 — Freshers Party 2026');
    const details = encodeURIComponent(
      'Celebrating the birth of new luminous batch (●\'◡\'●)\n\n' +
      'Theme: WESTERN 🤠 (Denim, Boots, Flannel / Casual Western)\n' +
      'Time: 10:00 AM IST onwards\n' +
      'Venue: Hostel Common Room\n\n' +
      'Get ready for icebreakers, DJ dance floor, and freshers party titles!'
    );
    const location = encodeURIComponent('Hostel Common Room');
    // Start: 2026-10-10 10:00:00 IST = 2026-10-10 04:30:00 UTC
    const startStr = '20261010T043000Z';
    const endStr = '20261010T083000Z';
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}&ctz=Asia/Kolkata`;
  }

  if (googleCalLink) {
    googleCalLink.href = getGoogleCalendarUrl();
    googleCalLink.addEventListener('click', () => {
      trackMove('google_calendar_clicked');
    });
  }

  function downloadIcs() {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Quantum Leap//Freshers Party//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VTIMEZONE',
      'TZID:Asia/Kolkata',
      'LAST-MODIFIED:20240422T000000Z',
      'BEGIN:STANDARD',
      'TZNAME:IST',
      'TZOFFSETFROM:+0530',
      'TZOFFSETTO:+0530',
      'DTSTART:19700101T000000',
      'END:STANDARD',
      'END:VTIMEZONE',
      'BEGIN:VEVENT',
      'UID:quantum-leap-freshers-20261010@hostel.party',
      'DTSTAMP:20261010T000000Z',
      'DTSTART;TZID=Asia/Kolkata:20261010T100000',
      'DTEND;TZID=Asia/Kolkata:20261010T140000',
      'SUMMARY:QUANTUM LEAP 💫 — Hostel Freshers Party',
      'DESCRIPTION:Celebrating the birth of new luminous batch (●\'◡\'●). Theme: WESTERN (Denim, Boots, Casual Western).',
      'LOCATION:Hostel Common Room',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quantum-leap-freshers.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('📅 Freshers party saved to calendar (IST)!');
    closeCalendarDropdown();
  }

  if (downloadIcsBtn) {
    downloadIcsBtn.addEventListener('click', () => {
      trackMove('ics_downloaded');
      downloadIcs();
    });
  }

  function toggleCalendarDropdown() {
    calendarDropdown.classList.toggle('show');
  }

  function closeCalendarDropdown() {
    calendarDropdown.classList.remove('show');
  }

  if (calendarMenuBtn) {
    calendarMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      trackMove('calendar_menu_toggled');
      toggleCalendarDropdown();
    });
  }

  document.addEventListener('click', (e) => {
    if (!calendarDropdown.contains(e.target) && e.target !== calendarMenuBtn) {
      closeCalendarDropdown();
    }
  });

  // Copy Link
  if (copyShareBtn) {
    copyShareBtn.addEventListener('click', () => {
      trackMove('share_link_copied');
      const url = window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('🔗 Link copied to clipboard!');
        }).catch(() => {
          showToast('Invitation link ready!');
        });
      } else {
        showToast('Invitation URL: ' + url);
      }
      closeCalendarDropdown();
    });
  }

  // ==========================================================================
  // Anonymous Senior Q&A & Saloon Wall Logic
  // ==========================================================================
  const tabDropBtn = document.getElementById('tabDropBtn');
  const tabFeedBtn = document.getElementById('tabFeedBtn');
  const paneDrop = document.getElementById('paneDrop');
  const paneFeed = document.getElementById('paneFeed');
  const wallFeed = document.getElementById('wallFeed');
  const wallCount = document.getElementById('wallCount');

  // Pre-loaded hostel starter shoutouts
  const DEFAULT_SHOUTOUTS = [
    {
      id: 1,
      category: 'Ask Seniors 🙋',
      message: 'How do we survive 8:30 AM lectures after hostel night-outs? Real survival fundas only please 🙏',
      author: 'Sleepy Fresher 😴',
      time: '45m ago',
      likes: 42
    },
    {
      id: 2,
      category: 'Senior Roast 🔥',
      message: 'Heard 3rd years boast about their dance moves, hope you guys can match our energy on Oct 10! 🕺🔥',
      author: 'Frontrow Fresher 🕶️',
      time: '2h ago',
      likes: 58
    },
    {
      id: 3,
      category: 'DJ Song Request 🎧',
      message: 'Petition for the DJ to blast 2000s Bollywood party anthems & Punjabi beats so the common room goes crazy!',
      author: 'Dancefloor King 🎧',
      time: '4h ago',
      likes: 49
    },
    {
      id: 4,
      category: 'Wing Shoutout 🍻',
      message: 'Huge shoutout to the wingmates who share boiling water and Maggi at 2 AM before assignment deadlines 🤝',
      author: 'Hostel Night Owl 🍜',
      time: '6h ago',
      likes: 67
    }
  ];

  function getShoutouts() {
    try {
      const stored = localStorage.getItem('quantum_leap_shoutouts_v2');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
    return DEFAULT_SHOUTOUTS;
  }

  function saveShoutouts(list) {
    try {
      localStorage.setItem('quantum_leap_shoutouts_v2', JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }
  }

  function renderWall() {
    const list = getShoutouts();
    if (wallCount) wallCount.textContent = list.length;
    if (!wallFeed) return;

    wallFeed.innerHTML = list.map(item => `
      <div class="wall-card" data-id="${item.id}">
        <div class="wall-card-header">
          <span class="wall-card-badge">${escapeHtml(item.category)}</span>
          <span class="wall-card-author">${escapeHtml(item.author)} • ${item.time || 'Today'}</span>
        </div>
        <div class="wall-card-msg">${escapeHtml(item.message)}</div>
        <div class="wall-card-footer">
          <button type="button" class="like-chip" data-id="${item.id}">
            ❤️ <span class="like-num">${item.likes || 0}</span>
          </button>
        </div>
      </div>
    `).join('');

    // Attach like handlers
    wallFeed.querySelectorAll('.like-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = Number(btn.getAttribute('data-id'));
        toggleLike(id, btn);
      });
    });
  }

  function toggleLike(id, btn) {
    const list = getShoutouts();
    const item = list.find(x => x.id === id);
    if (!item) return;

    if (btn.classList.contains('liked')) {
      item.likes = Math.max(0, (item.likes || 1) - 1);
      btn.classList.remove('liked');
    } else {
      item.likes = (item.likes || 0) + 1;
      btn.classList.add('liked');
      playTone(587.33, 0.1); // D5
    }

    btn.querySelector('.like-num').textContent = item.likes;
    saveShoutouts(list);
    trackMove('shoutout_liked', { post_id: id, total_likes: item.likes });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  // Tab switching
  function switchTab(tabName) {
    trackMove('ama_tab_switched', { tab: tabName });
    if (tabName === 'drop') {
      tabDropBtn.classList.add('active');
      tabFeedBtn.classList.remove('active');
      paneDrop.hidden = false;
      paneFeed.hidden = true;
    } else {
      tabFeedBtn.classList.add('active');
      tabDropBtn.classList.remove('active');
      paneFeed.hidden = false;
      paneDrop.hidden = true;
      renderWall();
    }
  }

  if (tabDropBtn) tabDropBtn.addEventListener('click', () => switchTab('drop'));
  if (tabFeedBtn) tabFeedBtn.addEventListener('click', () => switchTab('feed'));

  function openRsvp() {
    trackMove('ama_wall_opened');
    renderWall();
    switchTab('drop');
    rsvpModal.showModal();
  }

  function closeRsvp() {
    trackMove('ama_wall_closed');
    rsvpModal.close();
    setTimeout(() => {
      rsvpForm.hidden = false;
      rsvpSuccessMessage.hidden = true;
    }, 300);
  }

  if (openRsvpBtn) openRsvpBtn.addEventListener('click', openRsvp);
  if (closeRsvpBtn) closeRsvpBtn.addEventListener('click', closeRsvp);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeRsvp);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', () => {
    switchTab('feed');
    rsvpForm.hidden = false;
    rsvpSuccessMessage.hidden = true;
  });

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const category = document.getElementById('shoutoutCategory').value;
      const message = document.getElementById('shoutoutMessage').value.trim();
      const codename = document.getElementById('shoutoutCodename').value.trim() || 'Anonymous Fresher 🕶️';

      if (!message) return;

      const newDrop = {
        id: Date.now(),
        category,
        message,
        author: codename,
        time: 'Just now',
        likes: 1
      };

      const list = getShoutouts();
      list.unshift(newDrop);
      saveShoutouts(list);

      trackMove('shoutout_submitted', { category: category, codename: codename });

      // Confetti shower!
      const rect = fxCanvas.getBoundingClientRect();
      spawnParticles(rect.width / 2, rect.height * 0.4, 70, 'confetti');

      document.getElementById('shoutoutMessage').value = '';
      document.getElementById('shoutoutCodename').value = '';

      rsvpForm.hidden = true;
      rsvpSuccessMessage.hidden = false;

      playCelebrationChime();
      showToast('📌 Pinned anonymously to the board!');
    });
  }

  // Initial render
  renderWall();

  // URL query parameter support (e.g. ?open=1&tab=feed, ?play=1)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('open') === '1') {
    openRsvp();
    if (urlParams.get('tab') === 'feed') {
      switchTab('feed');
    }
  } else if (urlParams.get('play') === '1') {
    setTimeout(playPenguinVideo, 300);
  }

  // ==========================================================================
  // Web Audio Synthesizer (Ambient Western Lofi Synth)
  // ==========================================================================
  let audioCtx = null;
  let isPlayingMusic = false;
  let musicInterval = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playTone(freq, duration = 0.2, type = 'sine') {
    try {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio autoplay policy handled silently
    }
  }

  function playCelebrationChime() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => playTone(freq, 0.3, 'triangle'), idx * 120);
    });
  }

  // Western Ambient Chord Loop
  const chords = [
    [220, 261.63, 329.63], // Am
    [174.61, 220, 261.63], // F
    [261.63, 329.63, 392], // C
    [196, 246.94, 293.66]  // G
  ];
  let chordIndex = 0;

  function playAmbientChord() {
    if (!isPlayingMusic || !audioCtx) return;
    const currentChord = chords[chordIndex % chords.length];
    chordIndex++;

    currentChord.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const filter = audioCtx.createBiquadFilter();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 0.8);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 3.2);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 3.2);
    });
  }

  function toggleMusic() {
    initAudio();
    isPlayingMusic = !isPlayingMusic;
    trackMove('ambient_music_toggled', { playing: String(isPlayingMusic) });

    if (isPlayingMusic) {
      musicToggleBtn.classList.add('active');
      musicToggleBtn.title = 'Mute ambient synth music';
      playAmbientChord();
      musicInterval = setInterval(playAmbientChord, 3000);
      showToast('🎵 Ambient Western Synth: Playing');
    } else {
      musicToggleBtn.classList.remove('active');
      musicToggleBtn.title = 'Play ambient party lofi synth';
      clearInterval(musicInterval);
      showToast('🔇 Music Muted');
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', toggleMusic);
  }

  // ==========================================================================
  // Clean / Pure Mode Toggle
  // ==========================================================================
  let isCleanMode = false;
  if (modeToggleBtn) {
    modeToggleBtn.addEventListener('click', () => {
      isCleanMode = !isCleanMode;
      document.body.classList.toggle('clean-mode', isCleanMode);
      trackMove('clean_mode_toggled', { clean: String(isCleanMode) });
      if (isCleanMode) {
        modeToggleBtn.title = 'Restore interactive view';
        showToast('🖼️ Clean Invitation Mode (Exact flyer view)');
      } else {
        modeToggleBtn.title = 'Toggle Clean Invitation / Interactive Mode';
        showToast('✨ Interactive Mode Active');
      }
    });
  }

  // ==========================================================================
  // Toast Helper
  // ==========================================================================
  let toastTimeout = null;
  function showToast(msg) {
    if (!toastNotification) return;
    toastNotification.textContent = msg;
    toastNotification.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

})();
