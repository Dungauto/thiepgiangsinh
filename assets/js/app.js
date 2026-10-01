/**
 * Main Application Logic & Customization Controller
 * Author: Dung Automation
 */

const WISH_PRESETS = [
  "Chúc em Giáng Sinh luôn dáng xinh, ngập tràn nụ cười, ấm áp và mãi luôn hạnh phúc bên những người thân yêu! 💙❄️",
  "Noel này chúc em nhận được thật nhiều quà, luôn rạng rỡ như ánh sao trên đỉnh cây thông và bình an mỗi ngày! 🌟🎄",
  "Chúc công chúa nhỏ một mùa Giáng Sinh an lành, ngọt ngào như thanh socola và may mắn luôn mỉm cười với em! 🍫🎁",
  "Gửi ngàn lời chúc tốt đẹp nhất đến em! Mong mọi điều ước đêm Giáng Sinh của em đều sẽ sớm trở thành hiện thực! ✨💙",
  "Mùa đông năm nay có thể lạnh, nhưng mong rằng sự quan tâm và tình cảm này sẽ sưởi ấm trái tim em mỗi ngày! 🧸🔥"
];

let cardData = {
  name: "My Girl cute",
  nickname: "",
  wish: WISH_PRESETS[0],
  avatar: "assets/images/avatar.png",
  fbUrl: "https://www.facebook.com/",
  igUrl: "https://www.instagram.com/",
  trackIndex: 0
};

let currentWishIndex = 0;
let typewriterTimeout = null;

/* --------------------------------------------------------------------------
   Initialization
   -------------------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  loadSavedOrUrlData();
  initSnowCanvas();
  initConfettiCanvas();
  initAudioSystem();
  startChristmasCountdown();
  setupMouseInteractions();
});

function loadSavedOrUrlData() {
  const params = new URLSearchParams(window.location.search);

  // Priority: URL params > LocalStorage > Default
  const saved = localStorage.getItem("christmas_card_custom_data");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.name === "Hương Giang") {
        parsed.name = "My Girl cute";
        parsed.nickname = "";
      }
      cardData = { ...cardData, ...parsed };
    } catch (e) {
      console.error("Failed to parse saved card data", e);
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
  loadTrack(cardData.trackIndex, false);
}

function applyCardDataToUI() {
  const titleEl = document.getElementById("display-greeting-title");
  if (cardData.nickname && cardData.nickname.trim() !== "") {
    titleEl.textContent = `Gửi tặng ${cardData.name} (${cardData.nickname}) 💙`;
  } else {
    titleEl.textContent = `Gửi tặng ${cardData.name} 💙`;
  }

  document.getElementById("display-avatar").src = cardData.avatar;
  document.getElementById("modal-avatar-preview").src = cardData.avatar;

  document.getElementById("link-facebook").href = cardData.fbUrl || "#";
  document.getElementById("link-instagram").href = cardData.igUrl || "#";

  document.getElementById("input-girl-name").value = cardData.name;
  document.getElementById("input-girl-nick").value = cardData.nickname;
  document.getElementById("input-wish-msg").value = cardData.wish;
  document.getElementById("input-fb-url").value = cardData.fbUrl;
  document.getElementById("input-ig-url").value = cardData.igUrl;
  document.getElementById("select-bg-music").value = cardData.trackIndex;
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
  currentWishIndex = (currentWishIndex + 1) % WISH_PRESETS.length;
  cardData.wish = WISH_PRESETS[currentWishIndex];
  document.getElementById("input-wish-msg").value = cardData.wish;
  startTypewriter(cardData.wish);
  showToast("Đã đổi lời chúc mới! ✨");
}

function triggerMagicSparkles() {
  fireConfettiBurst();
  createParticleHeart();
  showToast("Gửi ngàn trái tim & sao lấp lánh! 💖");
}

/* --------------------------------------------------------------------------
   Mouse Interaction
   -------------------------------------------------------------------------- */
function setupMouseInteractions() {
  window.addEventListener("click", (e) => {
    if (e.target.closest("button, input, textarea, a, .modal-card, .music-dock")) return;
    spawnClickHeart(e.clientX, e.clientY);
  });

  window.addEventListener("mousemove", (e) => {
    wind = (e.clientX / window.innerWidth - 0.5) * 1.5;
  });
}

/* --------------------------------------------------------------------------
   Christmas Countdown
   -------------------------------------------------------------------------- */
function startChristmasCountdown() {
  const countdownEl = document.getElementById("countdown-text");
  function update() {
    const now = new Date();
    const currentYear = now.getFullYear();
    let target = new Date(currentYear, 11, 24, 19, 0, 0);

    if (now > target) {
      target = new Date(currentYear + 1, 11, 24, 19, 0, 0);
    }

    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / 1000 / 60) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    if (days === 0 && hours === 0 && mins === 0 && secs === 0) {
      countdownEl.innerHTML = "🎄 <strong>Đêm Giáng Sinh Đã Đến! Merry Christmas!</strong> 🎅";
    } else {
      countdownEl.innerHTML = `Đếm ngược Noel: <strong>${days}d ${hours}h ${mins}m ${secs}s</strong>`;
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
      showToast("Đã chọn ảnh mới thành công! 📸");
    };
    reader.readAsDataURL(file);
  }
}

function saveCustomCard() {
  playTapSFX();
  cardData.name = document.getElementById("input-girl-name").value.trim() || "Em";
  cardData.nickname = document.getElementById("input-girl-nick").value.trim();
  cardData.wish = document.getElementById("input-wish-msg").value.trim() || WISH_PRESETS[0];
  cardData.fbUrl = document.getElementById("input-fb-url").value.trim();
  cardData.igUrl = document.getElementById("input-ig-url").value.trim();
  cardData.trackIndex = parseInt(document.getElementById("select-bg-music").value);

  try {
    localStorage.setItem("christmas_card_custom_data", JSON.stringify(cardData));
  } catch (e) {
    console.warn("Storage full or blocked", e);
  }

  applyCardDataToUI();
  closeModal();
  startTypewriter(cardData.wish);
  showToast("Đã lưu và áp dụng thông tin mới! 💙");
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

  navigator.clipboard.writeText(url.toString()).then(() => {
    showToast("Đã sao chép link! Hãy gửi ngay cho cô ấy 💌");
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
