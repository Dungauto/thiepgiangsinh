/**
 * Main Application Logic & Customization Controller (with i18n support)
 * Author: Dung Automation
 */

const CHRISTMAS_I18N = {
  vi: {
    wishes: [
      "Chúc em Giáng Sinh luôn dáng xinh, ngập tràn nụ cười, ấm áp và mãi luôn hạnh phúc bên những người thân yêu! 💙❄️",
      "Noel này chúc em nhận được thật nhiều quà, luôn rạng rỡ như ánh sao trên đỉnh cây thông và bình an mỗi ngày! 🌟🎄",
      "Chúc công chúa nhỏ một mùa Giáng Sinh an lành, ngọt ngào như thanh socola và may mắn luôn mỉm cười với em! 🍫🎁",
      "Gửi ngàn lời chúc tốt đẹp nhất đến em! Mong mọi điều ước đêm Giáng Sinh của em đều sẽ sớm trở thành hiện thực! ✨💙",
      "Mùa đông năm nay có thể lạnh, nhưng mong rằng sự quan tâm và tình cảm này sẽ sưởi ấm trái tim em mỗi ngày! 🧸🔥"
    ],
    greetingTitle: (name, nick) => nick ? `Gửi tặng ${name} (${nick}) 💙` : `Gửi tặng ${name} 💙`,
    countdownPrefix: "Đếm ngược Giáng Sinh:",
    countdownToday: "🎄 Đêm Giáng Sinh an lành & ấm áp đã tới rồi! 🎅✨",
    openPrompt: "Nhấn vào hộp quà để mở điều bất ngờ! 🎁",
    btnCustomizerText: "Tạo Thiệp Riêng",
    btnReplayText: "Gõ lại",
    btnChangeWishText: "Đổi lời chúc",
    btnSparklesText: "Thả tim",
    toastNewWish: "Đã đổi lời chúc mới! ✨",
    toastSparkles: "Gửi ngàn trái tim & sao lấp lánh! 💖",
    toastSaved: "Đã lưu và áp dụng thông tin mới! 💙",
    toastCopied: "Đã sao chép link! Hãy gửi ngay cho người ấy 💌",
    defaultName: "My Girl cute",
    langButtonText: "🇺🇸 EN"
  },
  en: {
    wishes: [
      "Wishing you a cozy, joyful Christmas filled with warm smiles, sweet moments, and endless happiness! 💙❄️",
      "May Santa shower you with beautiful gifts, good health, and peace. Shine brightly like the star on the tree! 🌟🎄",
      "Merry Christmas! Wishing you a magical holiday season as sweet as chocolate and as warm as a gentle fireplace! 🍫🎁",
      "Sending my warmest holiday wishes! May all your Christmas dreams and wishes come true this magical night! ✨💙",
      "Winter may be chilly, but may the warmth of love and caring keep your heart glowing every single day! 🧸🔥"
    ],
    greetingTitle: (name, nick) => nick ? `Dedicated to ${name} (${nick}) 💙` : `Dedicated to ${name} 💙`,
    countdownPrefix: "Christmas Countdown:",
    countdownToday: "🎄 Holy Christmas Eve is here! Merry Christmas! 🎅✨",
    openPrompt: "Click the gift box to reveal your surprise! 🎁",
    btnCustomizerText: "Create Card",
    btnReplayText: "Replay",
    btnChangeWishText: "New Wish",
    btnSparklesText: "Hearts",
    toastNewWish: "New holiday wish applied! ✨",
    toastSparkles: "Sending warm hearts and sparkling stars! 💖",
    toastSaved: "Custom card settings saved! 💙",
    toastCopied: "Link copied! Share it with someone special 💌",
    defaultName: "My Girl cute",
    langButtonText: "🇻🇳 VI"
  }
};

let currentLang = "vi";

function getI18n(key, ...args) {
  const dict = CHRISTMAS_I18N[currentLang] || CHRISTMAS_I18N.vi;
  const val = dict[key];
  if (typeof val === "function") return val(...args);
  return val || key;
}

let cardData = {
  name: "My Girl cute",
  nickname: "",
  wish: "",
  avatar: "assets/images/avatar_santa.png",
  fbUrl: "https://www.facebook.com/me",
  igUrl: "https://www.instagram.com/",
  trackIndex: 0
};

// Purge any legacy cached data
try {
  const rawSaved = localStorage.getItem("christmas_card_custom_data");
  if (rawSaved && (rawSaved.includes("Giang") || rawSaved.includes("100093282003231") || rawSaved.includes("huonggiang"))) {
    localStorage.removeItem("christmas_card_custom_data");
  }
} catch (e) {}

let currentWishIndex = 0;
let typewriterTimeout = null;

/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  detectLanguage();
  loadSavedOrUrlData();
  initSnowCanvas();
  initConfettiCanvas();
  initAudioSystem();
  startChristmasCountdown();
  setupMouseInteractions();
});

/* --------------------------------------------------------------------------
   Language Detection & Switching
   -------------------------------------------------------------------------- */
function detectLanguage() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("lang")) {
    currentLang = params.get("lang").toLowerCase().startsWith("vi") ? "vi" : "en";
    return;
  }
  try {
    const saved = localStorage.getItem("christmas_lang");
    if (saved && (saved === "vi" || saved === "en")) {
      currentLang = saved;
      return;
    }
  } catch (e) {}

  const navLang = (navigator.language || "").toLowerCase();
  currentLang = navLang.startsWith("vi") ? "vi" : "en";
}

function toggleLanguage() {
  playTapSFX();
  currentLang = currentLang === "vi" ? "en" : "vi";
  try {
    localStorage.setItem("christmas_lang", currentLang);
  } catch (e) {}

  // Update default wish if still using preset
  const wishes = CHRISTMAS_I18N[currentLang].wishes;
  cardData.wish = wishes[currentWishIndex % wishes.length];

  applyCardDataToUI();
  updateStaticTexts();
  startTypewriter(cardData.wish);
  showToast(currentLang === "vi" ? "Đã chuyển sang Tiếng Việt 🇻🇳" : "Switched to English 🇺🇸");
}

function updateStaticTexts() {
  const langBtn = document.getElementById("btn-lang-toggle");
  if (langBtn) langBtn.textContent = getI18n("langButtonText");

  const customizerBtnText = document.getElementById("btn-customizer-text");
  if (customizerBtnText) customizerBtnText.textContent = getI18n("btnCustomizerText");

  const openPromptEl = document.getElementById("open-prompt-text");
  if (openPromptEl) openPromptEl.textContent = getI18n("openPrompt");

  const replayBtnText = document.getElementById("btn-replay-text");
  if (replayBtnText) replayBtnText.textContent = getI18n("btnReplayText");

  const changeWishBtnText = document.getElementById("btn-change-wish-text");
  if (changeWishBtnText) changeWishBtnText.textContent = getI18n("btnChangeWishText");

  const sparklesBtnText = document.getElementById("btn-sparkles-text");
  if (sparklesBtnText) sparklesBtnText.textContent = getI18n("btnSparklesText");
}

function loadSavedOrUrlData() {
  const params = new URLSearchParams(window.location.search);
  const wishes = CHRISTMAS_I18N[currentLang].wishes;
  cardData.wish = wishes[0];

  // Priority: URL params > LocalStorage > Default
  const saved = localStorage.getItem("christmas_card_custom_data");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.name && (parsed.name.includes("Giang") || parsed.nickname?.includes("Milk") || parsed.fbUrl?.includes("100093282003231"))) {
        localStorage.removeItem("christmas_card_custom_data");
      } else {
        cardData = { ...cardData, ...parsed };
      }
    } catch (e) {
      localStorage.removeItem("christmas_card_custom_data");
    }
  }

  if (params.get("name")) cardData.name = params.get("name");
  if (params.get("nick")) cardData.nickname = params.get("nick");
  if (params.get("msg")) cardData.wish = params.get("msg");
  if (params.get("avatar")) cardData.avatar = params.get("avatar");
  if (params.get("fb")) cardData.fbUrl = params.get("fb");
  if (params.get("ig")) cardData.igUrl = params.get("ig");
  if (params.get("track")) {
    const t = parseInt(params.get("track"));
    if (!isNaN(t) && t >= 0 && t < PLAYLIST.length) cardData.trackIndex = t;
  }

  applyCardDataToUI();
  updateStaticTexts();
  loadTrack(cardData.trackIndex, false);
}

function applyCardDataToUI() {
  const titleEl = document.getElementById("display-greeting-title");
  if (titleEl) {
    titleEl.textContent = getI18n("greetingTitle", cardData.name, cardData.nickname);
  }

  const avatarDisplay = document.getElementById("display-avatar");
  if (avatarDisplay) avatarDisplay.src = cardData.avatar;
  const modalAvatar = document.getElementById("modal-avatar-preview");
  if (modalAvatar) modalAvatar.src = cardData.avatar;

  const fbLink = document.getElementById("link-facebook");
  if (fbLink) fbLink.href = cardData.fbUrl || "https://www.facebook.com/me";
  const igLink = document.getElementById("link-instagram");
  if (igLink) igLink.href = cardData.igUrl || "https://www.instagram.com/";

  const inputName = document.getElementById("input-girl-name");
  if (inputName) inputName.value = cardData.name;
  const inputNick = document.getElementById("input-girl-nick");
  if (inputNick) inputNick.value = cardData.nickname;
  const inputWish = document.getElementById("input-wish-msg");
  if (inputWish) inputWish.value = cardData.wish;
  const inputFb = document.getElementById("input-fb-url");
  if (inputFb) inputFb.value = cardData.fbUrl || "https://www.facebook.com/me";
  const inputIg = document.getElementById("input-ig-url");
  if (inputIg) inputIg.value = cardData.igUrl || "https://www.instagram.com/";
  const selectMusic = document.getElementById("select-bg-music");
  if (selectMusic) selectMusic.value = cardData.trackIndex;
}

/* --------------------------------------------------------------------------
   Surprise Unboxing & Typewriter
   -------------------------------------------------------------------------- */
function openSurpriseCard() {
  playChimeSFX();
  fireConfettiBurst();

  const boxScene = document.getElementById("unboxing-scene");
  const cardContainer = document.getElementById("card-container");

  boxScene.style.transform = "scale(0.3) rotate(-15deg)";
  boxScene.style.opacity = "0";

  setTimeout(() => {
    boxScene.style.display = "none";
    cardContainer.classList.add("active");
    
    startTypewriter(cardData.wish);
    
    if (!isPlaying) {
      toggleMusic();
    }
  }, 500);
}

function resetToBox() {
  const boxScene = document.getElementById("unboxing-scene");
  const cardContainer = document.getElementById("card-container");

  cardContainer.classList.remove("active");
  setTimeout(() => {
    boxScene.style.display = "flex";
    boxScene.style.transform = "scale(1)";
    boxScene.style.opacity = "1";
  }, 400);
}

function startTypewriter(text) {
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
  const container = document.getElementById("typewriter-content");
  if (!container) return;
  container.textContent = "";
  let i = 0;

  function typeChar() {
    if (i < text.length) {
      container.textContent += text.charAt(i);
      i++;
      typewriterTimeout = setTimeout(typeChar, 35 + Math.random() * 25);
    }
  }
  typeChar();
}

function replayTyping() {
  playTapSFX();
  startTypewriter(cardData.wish);
}

function cycleRandomWish() {
  playTapSFX();
  const wishes = CHRISTMAS_I18N[currentLang].wishes;
  currentWishIndex = (currentWishIndex + 1) % wishes.length;
  cardData.wish = wishes[currentWishIndex];
  const inputWish = document.getElementById("input-wish-msg");
  if (inputWish) inputWish.value = cardData.wish;
  startTypewriter(cardData.wish);
  showToast(getI18n("toastNewWish"));
}

function triggerMagicSparkles() {
  fireConfettiBurst();
  createParticleHeart();
  showToast(getI18n("toastSparkles"));
}

/* --------------------------------------------------------------------------
   Mouse Interaction
   -------------------------------------------------------------------------- */
function setupMouseInteractions() {
  window.addEventListener("click", (e) => {
    if (e.target.closest("button, input, textarea, a, .modal-card, .music-dock")) return;
    createClickHeart(e.clientX, e.clientY);
  });
}

function createClickHeart(x, y) {
  const heart = document.createElement("div");
  heart.className = "floating-heart";
  heart.textContent = Math.random() < 0.5 ? "❄️" : "💙";
  heart.style.left = `${x}px`;
  heart.style.top = `${y}px`;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 1200);
}

function createParticleHeart() {
  const x = window.innerWidth / 2;
  const y = window.innerHeight * 0.4;
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      createClickHeart(x + (Math.random() - 0.5) * 160, y + (Math.random() - 0.5) * 120);
    }, i * 100);
  }
}

/* --------------------------------------------------------------------------
   Countdown to Christmas
   -------------------------------------------------------------------------- */
function startChristmasCountdown() {
  const countdownEl = document.getElementById("countdown-text");
  if (!countdownEl) return;

  function update() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let target = new Date(currentYear, 11, 24, 0, 0, 0); // Dec 24

    if (now > target) {
      target = new Date(currentYear + 1, 11, 24, 0, 0, 0);
    }

    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (days === 0 && hours === 0 && mins === 0 && secs === 0) {
      countdownEl.textContent = getI18n("countdownToday");
    } else {
      if (currentLang === "vi") {
        countdownEl.textContent = `Đếm ngược Giáng Sinh: ${days} ngày ${hours} giờ ${mins} phút ${secs} giây`;
      } else {
        countdownEl.textContent = `Christmas Countdown: ${days}d ${hours}h ${mins}m ${secs}s`;
      }
    }
  }

  update();
  setInterval(update, 1000);
}

/* --------------------------------------------------------------------------
   Modal Customization & Shareable Link
   -------------------------------------------------------------------------- */
function openModal() {
  playTapSFX();
  document.getElementById("custom-modal").classList.add("open");
}

function closeModal() {
  playTapSFX();
  document.getElementById("custom-modal").classList.remove("open");
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64Img = e.target.result;
      cardData.avatar = base64Img;
      document.getElementById("modal-avatar-preview").src = base64Img;
      showToast(currentLang === "vi" ? "Đã chọn ảnh mới thành công! 📸" : "Avatar updated! 📸");
    };
    reader.readAsDataURL(file);
  }
}

function saveCustomCard() {
  playTapSFX();
  cardData.name = document.getElementById("input-girl-name").value.trim() || getI18n("defaultName");
  cardData.nickname = document.getElementById("input-girl-nick").value.trim();
  cardData.wish = document.getElementById("input-wish-msg").value.trim() || CHRISTMAS_I18N[currentLang].wishes[0];
  cardData.fbUrl = document.getElementById("input-fb-url").value.trim() || "https://www.facebook.com/me";
  cardData.igUrl = document.getElementById("input-ig-url").value.trim() || "https://www.instagram.com/";
  cardData.trackIndex = parseInt(document.getElementById("select-bg-music").value);

  try {
    localStorage.setItem("christmas_card_custom_data", JSON.stringify(cardData));
  } catch (e) {
    console.warn("Storage full or blocked", e);
  }

  applyCardDataToUI();
  closeModal();
  startTypewriter(cardData.wish);
  showToast(getI18n("toastSaved"));
}

function copyShareableUrl() {
  playTapSFX();
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set("name", document.getElementById("input-girl-name").value.trim() || cardData.name);
  if (cardData.nickname) url.searchParams.set("nick", document.getElementById("input-girl-nick").value.trim());
  url.searchParams.set("msg", document.getElementById("input-wish-msg").value.trim() || cardData.wish);
  if (cardData.fbUrl) url.searchParams.set("fb", cardData.fbUrl);
  if (cardData.igUrl) url.searchParams.set("ig", cardData.igUrl);
  url.searchParams.set("track", document.getElementById("select-bg-music").value);
  url.searchParams.set("lang", currentLang);

  navigator.clipboard.writeText(url.toString()).then(() => {
    showToast(getI18n("toastCopied"));
  }).catch(() => {
    showToast("Link: " + url.toString());
  });
}

function showToast(message) {
  const toast = document.getElementById("toast-notification");
  if (!toast) return;
  document.getElementById("toast-text").textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
