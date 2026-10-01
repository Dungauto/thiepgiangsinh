/**
 * Festive Audio Player & Web Audio SFX
 * Author: Dung Automation
 */

const PLAYLIST = [
  {
    title: "Khúc Nhạc Giáng Sinh An Lành (Original)",
    src: "assets/audio/your_music.mp3"
  },
  {
    title: "We Wish You A Merry Christmas (Acoustic Chill)",
    src: "https://actions.google.com/sounds/v1/holidays/jingle_bells.ogg"
  },
  {
    title: "Deck The Halls (Festive Orchestral)",
    src: "https://actions.google.com/sounds/v1/holidays/deck_the_halls.ogg"
  },
  {
    title: "Joy To The World (Holiday Chimes)",
    src: "https://actions.google.com/sounds/v1/holidays/joy_to_the_world.ogg"
  }
];

let currentTrackIndex = 0;
let isPlaying = false;
let sfxEnabled = true;
let audioEl = null;

function initAudioSystem() {
  audioEl = document.getElementById("main-audio");
  if (!audioEl) return;

  audioEl.addEventListener("timeupdate", () => {
    if (audioEl.duration) {
      const progressPercent = (audioEl.currentTime / audioEl.duration) * 100;
      const bar = document.getElementById("track-progress-bar");
      if (bar) bar.style.width = `${progressPercent}%`;
    }
  });

  audioEl.addEventListener("ended", () => {
    nextTrack();
  });

  audioEl.addEventListener("error", (e) => {
    console.warn("Audio load error, fallback to local track", e);
    if (currentTrackIndex !== 0) {
      loadTrack(0, true);
    }
  });
}

function loadTrack(index, autoPlay = true) {
  if (!audioEl) audioEl = document.getElementById("main-audio");
  currentTrackIndex = index;
  const track = PLAYLIST[index];
  audioEl.src = track.src;

  const titleEl = document.getElementById("track-title");
  if (titleEl) titleEl.textContent = track.title;

  const selectEl = document.getElementById("select-bg-music");
  if (selectEl) selectEl.value = index;

  if (autoPlay) {
    audioEl.play().then(() => {
      setPlayState(true);
    }).catch(err => {
      console.log("Autoplay waiting for user gesture:", err);
      setPlayState(false);
    });
  }
}

function toggleMusic(e) {
  if (e) e.stopPropagation();
  if (!audioEl) audioEl = document.getElementById("main-audio");
  if (isPlaying) {
    audioEl.pause();
    setPlayState(false);
  } else {
    audioEl.play().then(() => {
      setPlayState(true);
    }).catch(err => console.log(err));
  }
}

function setPlayState(playing) {
  isPlaying = playing;
  const dockIcon = document.getElementById("dock-play-icon");
  const avatarIcon = document.getElementById("avatar-music-icon");
  const dock = document.getElementById("music-dock");
  const avatarContainer = document.getElementById("avatar-container");

  if (playing) {
    if (dockIcon) dockIcon.className = "fa-solid fa-pause";
    if (avatarIcon) avatarIcon.className = "fa-solid fa-volume-high";
    if (dock) dock.classList.add("playing");
    if (avatarContainer) avatarContainer.classList.add("playing");
  } else {
    if (dockIcon) dockIcon.className = "fa-solid fa-play";
    if (avatarIcon) avatarIcon.className = "fa-solid fa-music";
    if (dock) dock.classList.remove("playing");
    if (avatarContainer) avatarContainer.classList.remove("playing");
  }
}

function nextTrack() {
  playTapSFX();
  let next = (currentTrackIndex + 1) % PLAYLIST.length;
  loadTrack(next, true);
  if (typeof showToast === "function") showToast(`Đang phát: ${PLAYLIST[next].title}`);
}

function prevTrack() {
  playTapSFX();
  let prev = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  loadTrack(prev, true);
  if (typeof showToast === "function") showToast(`Đang phát: ${PLAYLIST[prev].title}`);
}

function changeTrackFromSelect(val) {
  loadTrack(parseInt(val), isPlaying);
}

function seekTrack(event) {
  const container = document.getElementById("track-progress-container");
  if (!container || !audioEl || !audioEl.duration) return;
  const rect = container.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  audioEl.currentTime = (clickX / rect.width) * audioEl.duration;
}

/* --------------------------------------------------------------------------
   Web Audio API Sound Effects (Zero External Files Needed)
   -------------------------------------------------------------------------- */
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playChimeSFX() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // C E G C
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.2, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.8);
    });
  } catch (e) {}
}

function playTapSFX() {
  if (!sfxEnabled) return;
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

function toggleSoundSFX() {
  sfxEnabled = !sfxEnabled;
  const btn = document.getElementById("btn-sound-sfx");
  if (btn) {
    btn.innerHTML = sfxEnabled 
      ? '<i class="fa-solid fa-volume-high"></i>' 
      : '<i class="fa-solid fa-volume-xmark"></i>';
  }
  if (typeof showToast === "function") {
    showToast(sfxEnabled ? "Đã bật hiệu ứng âm thanh 🔔" : "Đã tắt hiệu ứng âm thanh 🔕");
  }
}
