// Global Variables
const currentTestimonial = 0
const isLoading = false
let musicPlaying = false
let countdownInterval
let currentFontSize = 16
let readingMode = false
const favorites = JSON.parse(localStorage.getItem("bibleFavorites")) || []
const scheduleEvents = [
  {
    id: "cool-daud-1",
    name: "COOL Daud - Bang Juan",
    day: 5, // Friday (0 = Sunday, 1 = Monday, ..., 5 = Friday)
    hour: 19,
    minute: 0,
    duration: 65, // 1 hour 5 minutes
    leader: "Bang Juan",
  },
  {
    id: "cool-tree",
    name: "COOL Tree Of Life - Bang Dwi",
    day: 5, // Friday
    hour: 19,
    minute: 0,
    duration: 70, // 1 hour 10 minutes
    leader: "Bang Dwi",
  },
  {
    id: "doa-youth",
    name: "Doa Youth & Teens",
    day: 6, // Saturday
    hour: 18,
    minute: 0,
    duration: 80, // 1 hour 20 minutes
    leader: "Tim Doa",
  },
  {
    id: "ibadah-youth",
    name: "Ibadah Youth & Teens",
    day: 0, // Sunday
    hour: 13,
    minute: 30,
    duration: 90, // 1 hour 30 minutes
    leader: "Tim Pelayanan",
  },
]

// DOM Elements
const loadingScreen = document.getElementById("loading-screen")
const navbar = document.getElementById("navbar")
const hamburger = document.getElementById("hamburger")
const navMenu = document.getElementById("nav-menu")
const themeToggle = document.getElementById("theme-toggle")
const contactForm = document.getElementById("contact-form")
const testimonialsCarousel = document.getElementById("testimonials-carousel")
const carouselDots = document.getElementById("carousel-dots")
const lightbox = document.getElementById("lightbox")
const successModal = document.getElementById("success-modal")
const musicToggle = document.getElementById("music-toggle")
const backgroundMusic = document.getElementById("background-music")
const particlesContainer = document.getElementById("particles")
const bibleSearch = document.getElementById("bible-search")
const searchResults = document.getElementById("search-results")
const bookSelect = document.getElementById("book-select")
const chapterSelect = document.getElementById("chapter-select")
const verseSelect = document.getElementById("verse-select")
const selectedVerse = document.getElementById("selected-verse")
const favoritesList = document.getElementById("favorites-list")
const musicInfo = document.getElementById("music-info")

// Function declaration for createAdvancedParticle
function createAdvancedParticle() {
  // Placeholder for advanced particle creation logic
  console.log("Creating advanced particle")
}

// Bible verses database (sample data)
const bibleVerses = {
  daily: [
    {
      text: "Karena Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.",
      reference: "Yeremia 29:11",
    },
    {
      text: "Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku.",
      reference: "Filipi 4:13",
    },
    {
      text: "Sebab Allah begitu mengasihi dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal.",
      reference: "Yohanes 3:16",
    },
    {
      text: "Janganlah hendaknya kamu kuatir tentang apa pun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur.",
      reference: "Filipi 4:6",
    },
    {
      text: "TUHAN adalah gembalaku, takkan kekurangan aku.",
      reference: "Mazmur 23:1",
    },
    {
      text: "Kasihilah TUHAN, Allahmu, dengan segenap hatimu dan dengan segenap jiwamu dan dengan segenap akal budimu.",
      reference: "Matius 22:37",
    },
    {
      text: "Percayalah kepada TUHAN dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri.",
      reference: "Amsal 3:5",
    },
  ],
  searchable: [
    {
      text: "Allah adalah kasih.",
      reference: "1 Yohanes 4:8",
      keywords: ["kasih", "allah", "cinta"],
    },
    {
      text: "Iman adalah dasar dari segala sesuatu yang kita harapkan dan bukti dari segala sesuatu yang tidak kita lihat.",
      reference: "Ibrani 11:1",
      keywords: ["iman", "harapan", "percaya"],
    },
    {
      text: "Dan sekarang tinggal ketiga hal ini, yaitu iman, pengharapan dan kasih, dan yang paling besar di antaranya ialah kasih.",
      reference: "1 Korintus 13:13",
      keywords: ["iman", "pengharapan", "kasih", "cinta"],
    },
    {
      text: "Karena upah dosa ialah maut; tetapi karunia Allah ialah hidup yang kekal dalam Kristus Yesus, Tuhan kita.",
      reference: "Roma 6:23",
      keywords: ["dosa", "maut", "hidup", "kekal", "kristus"],
    },
    {
      text: "Kamu adalah terang dunia. Kota yang terletak di atas gunung tidak mungkin tersembunyi.",
      reference: "Matius 5:14",
      keywords: ["terang", "dunia", "kota", "gunung"],
    },
  ],
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("theme") || "light"
  document.documentElement.setAttribute("data-theme", savedTheme)
  updateThemeIcon(savedTheme)

  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme")
    const newTheme = currentTheme === "dark" ? "light" : "dark"

    // Add switching animation
    themeToggle.classList.add("switching")

    // Apply theme change
    document.documentElement.setAttribute("data-theme", newTheme)
    localStorage.setItem("theme", newTheme)
    updateThemeIcon(newTheme)

    // Remove animation class after animation completes
    setTimeout(() => {
      themeToggle.classList.remove("switching")
    }, 600)

    // Show notification
    showNotification(`Mode ${newTheme === "dark" ? "gelap" : "terang"} diaktifkan`, "success")
  })
}

function updateThemeIcon(theme) {
  const icon = themeToggle.querySelector("i")
  if (theme === "dark") {
    icon.className = "fas fa-sun"
    icon.style.color = "#ffd700"
  } else {
    icon.className = "fas fa-moon"
    icon.style.color = "var(--text-primary)"
  }
}

function initializeMusic() {
  const musicInfo = document.getElementById("music-info")

  musicToggle.addEventListener("click", () => {
    if (musicPlaying) {
      backgroundMusic.pause()
      musicToggle.classList.remove("playing")
      musicToggle.innerHTML = '<i class="fas fa-music"></i>'
      showNotification("Musik dihentikan", "info")
    } else {
      // Request user interaction for autoplay
      backgroundMusic
        .play()
        .then(() => {
          musicToggle.classList.add("playing")
          musicToggle.innerHTML = '<i class="fas fa-pause"></i>'
          showNotification("Musik diputar", "success")
        })
        .catch((e) => {
          console.log("Audio play failed:", e)
          showNotification("Gagal memutar musik. Klik sekali lagi.", "error")
        })
    }
    musicPlaying = !musicPlaying
  })

  backgroundMusic.addEventListener("ended", () => {
    musicToggle.classList.remove("playing")
    musicToggle.innerHTML = '<i class="fas fa-music"></i>'
    musicPlaying = false
    showNotification("Musik selesai", "info")
  })

  // Volume control
  backgroundMusic.volume = 0.3

  // Show music info on hover
  if (musicInfo) {
    musicToggle.addEventListener("mouseenter", () => {
      musicInfo.style.opacity = "1"
      musicInfo.style.transform = "translateX(0)"
    })

    musicToggle.addEventListener("mouseleave", () => {
      musicInfo.style.opacity = "0"
      musicInfo.style.transform = "translateX(20px)"
    })
  }
}

function handleFormSubmit(event) {
  event.preventDefault()

  const form = event.target
  const formData = new FormData(form)
  const formLoadingModal = document.getElementById("form-loading-modal")
  const successModal = document.getElementById("success-modal")

  // Show loading modal
  formLoadingModal.classList.add("active")

  // Simulate form processing with realistic timing
  setTimeout(() => {
    // Hide loading modal
    formLoadingModal.classList.remove("active")

    // Show success modal with simplified message
    setTimeout(() => {
      const modalContent = successModal.querySelector(".modal-content")
      modalContent.innerHTML = `
        <div class="modal-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h3>Terima Kasih! 🙏</h3>
        <p><strong>Permohonan doa Anda telah kami terima.</strong></p>
        <p>Tim God's DNA akan mendoakan Anda. Tuhan memberkati! 💝</p>
        <div style="margin-top: 2rem;">
          <button class="btn btn-primary" onclick="closeModal()">Amen! 🙏</button>
        </div>
      `
      successModal.classList.add("active")

      // Reset form
      form.reset()

      // Play success sound (if music is enabled)
      if (musicPlaying) {
        playSuccessSound()
      }
    }, 500)
  }, 3000) // 3 second loading time for realistic feel
}

function shareTestimony() {
  const message = `🙏 Saya baru saja mengirim permohonan doa ke God's DNA dan merasa sangat diberkati! 

✨ "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan." - Yeremia 29:11

💪 Tidak ada doa yang sia-sia di hadapan Tuhan! 

#GodsDNA #DoaBersama #TuhanMemberkati #YouthChristian`

  const url = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(url, "_blank")
  closeModal()
}

function playSuccessSound() {
  // Create a simple success tone
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()

  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)

  oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
  oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1) // E5
  oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2) // G5

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}

function closeModal() {
  document.getElementById("success-modal").classList.remove("active")
  document.getElementById("form-loading-modal").classList.remove("active")
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`

  const icons = {
    success: "fas fa-check-circle",
    error: "fas fa-exclamation-circle",
    info: "fas fa-info-circle",
    warning: "fas fa-exclamation-triangle",
  }

  notification.innerHTML = `
    <i class="${icons[type]}"></i>
    <span>${message}</span>
  `

  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 30px;
    background: var(--surface-glass);
    backdrop-filter: blur(20px);
    border: 1px solid var(--border);
    border-radius: 15px;
    padding: 15px 20px;
    color: var(--text-primary);
    font-weight: 500;
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transform: translateX(400px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 350px;
  `

  // Type-specific colors
  const colors = {
    success: "#4caf50",
    error: "#f44336",
    info: "#2196f3",
    warning: "#ff9800",
  }

  notification.style.borderLeftColor = colors[type]
  notification.querySelector("i").style.color = colors[type]

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove
  setTimeout(() => {
    notification.style.transform = "translateX(400px)"
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] God's DNA website initializing...")

  // Initialize all components
  initializeTheme()
  initializeMusic()
  initializeNavigation()
  initializeCountdown()
  initializeParticles()
  initializeScrollReveal()
  initializeDailyVerse()
  initializeFuturisticButtons()
  initializeLogoEffects()
  initializeScheduleLoading()
  initializeEnhancedButtons()
  initializeTimelineAnimations()

  // Gallery filters and lightbox navigation
  initializeGalleryFilters()
  initializeLightboxNavigation()

  // Remove loading screen
  setTimeout(() => {
    const loadingScreen = document.getElementById("loading-screen")
    if (loadingScreen) {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500)
    }
  }, 2000)

  // Show welcome notification
  setTimeout(() => {
    showNotification("Hey, welcome to God's DNA! 🔥", "success")
  }, 2500)
})

// Navigation
function initializeNavigation() {
  // Hamburger menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")
  })

  // Close menu when clicking on links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    })
  })

  // Navbar scroll effect - simplified
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Particles Animation
function initializeParticles() {
  const particleCount = 50
  for (let i = 0; i < particleCount; i++) {
    createParticle()
  }
  setInterval(createParticle, 300)
}

function createParticle() {
  const particle = document.createElement("div")
  particle.className = "particle"
  particle.style.left = Math.random() * 100 + "%"
  particle.style.animationDuration = Math.random() * 3 + 3 + "s"
  particle.style.animationDelay = Math.random() * 2 + "s"
  particlesContainer.appendChild(particle)

  setTimeout(() => {
    if (particle.parentNode) {
      particle.parentNode.removeChild(particle)
    }
  }, 6000)
}

// Scroll Reveal Animation
function initializeScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active")
      }
    })
  }, observerOptions)

  // Add reveal classes and observe elements
  document
    .querySelectorAll(
      ".section-header, .about-text, .habit-card, .vision-card, .gallery-item, .timeline-item, .contact-card",
    )
    .forEach((el) => {
      el.classList.add("reveal")
      observer.observe(el)
    })

  // Add specific reveal directions
  document.querySelectorAll(".about-text").forEach((el) => {
    el.classList.add("reveal-left")
    observer.observe(el)
  })

  document.querySelectorAll(".about-image").forEach((el) => {
    el.classList.add("reveal-right")
    observer.observe(el)
  })
}

// Bible Features Initialization
function initializeBible() {
  updateDailyVerse()
  loadFavorites()
  setInterval(updateDailyVerse, 24 * 60 * 60 * 1000) // Update daily
}

function updateDailyVerse() {
  const today = new Date()
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  const verseIndex = dayOfYear % bibleVerses.daily.length
  const verse = bibleVerses.daily[verseIndex]

  document.getElementById("daily-verse-text").textContent = `"${verse.text}"`
  document.getElementById("daily-verse-reference").textContent = verse.reference
  document.getElementById("verse-date").textContent = today.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function copyVerse() {
  const verseText = document.getElementById("daily-verse-text").textContent
  const verseRef = document.getElementById("daily-verse-reference").textContent
  const fullVerse = `${verseText}\n\n${verseRef}`

  navigator.clipboard
    .writeText(fullVerse)
    .then(() => {
      showNotification("Ayat berhasil disalin!", "success")
    })
    .catch(() => {
      showNotification("Gagal menyalin ayat", "error")
    })
}

function shareToWhatsApp() {
  const verseText = document.getElementById("daily-verse-text").textContent
  const verseRef = document.getElementById("daily-verse-reference").textContent
  const message = `🙏 *Ayat Harian God's DNA* 🙏\n\n${verseText}\n\n*${verseRef}*\n\n✨ Tuhan memberkati! ✨\n\n#GodsDNA #AyatHarian #FirmanTuhan`
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`

  window.open(url, "_blank")
}

function shareToInstagram() {
  const verseText = document.getElementById("daily-verse-text").textContent
  const verseRef = document.getElementById("daily-verse-reference").textContent
  const message = `🙏 Ayat Harian God's DNA 🙏\n\n${verseText}\n\n${verseRef}\n\n✨ Tuhan memberkati! ✨\n\n#GodsDNA #AyatHarian #FirmanTuhan #YouthChristian`

  // Copy to clipboard for Instagram
  navigator.clipboard.writeText(message).then(() => {
    showNotification("Teks disalin! Buka Instagram dan paste di story/post Anda", "success")
    // Open Instagram
    window.open("https://www.instagram.com/", "_blank")
  })
}

function searchBible() {
  const query = document.getElementById("bible-search").value.toLowerCase().trim()
  const resultsContainer = document.getElementById("search-results")

  if (!query) {
    resultsContainer.innerHTML = "<p>Masukkan kata kunci untuk mencari ayat</p>"
    return
  }

  const results = bibleVerses.searchable.filter(
    (verse) =>
      verse.keywords.some((keyword) => keyword.includes(query)) ||
      verse.text.toLowerCase().includes(query) ||
      verse.reference.toLowerCase().includes(query),
  )

  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>Tidak ada ayat yang ditemukan</p>"
    return
  }

  resultsContainer.innerHTML = results.map((verse) => ``).join("")
}

function selectSearchResult(text, reference) {
  document.getElementById("daily-verse-text").textContent = `"${text}"`
  document.getElementById("daily-verse-reference").textContent = reference
  showNotification("Ayat dipilih sebagai ayat aktif", "success")
}

function loadChapters() {
  const book = document.getElementById("book-select").value
  const chapterSelect = document.getElementById("chapter-select")

  // Sample chapter data
  const chapters = {
    kejadian: 50,
    keluaran: 40,
    mazmur: 150,
    amsal: 31,
    matius: 28,
    markus: 16,
    lukas: 24,
    yohanes: 21,
    roma: 16,
    "1korintus": 16,
    efesus: 6,
    filipi: 4,
  }

  chapterSelect.innerHTML = '<option value="">Pilih Pasal</option>'

  if (book && chapters[book]) {
    for (let i = 1; i <= chapters[book]; i++) {
      chapterSelect.innerHTML += `<option value="${i}">Pasal ${i}</option>`
    }
  }
}

function loadVerses() {
  const chapter = document.getElementById("chapter-select").value
  const verseSelect = document.getElementById("verse-select")

  verseSelect.innerHTML = '<option value="">Pilih Ayat</option>'

  if (chapter) {
    // Sample: assume 30 verses per chapter
    for (let i = 1; i <= 30; i++) {
      verseSelect.innerHTML += `<option value="${i}">Ayat ${i}</option>`
    }
  }
}

function displayVerse() {
  const book = document.getElementById("book-select").value
  const chapter = document.getElementById("chapter-select").value
  const verse = document.getElementById("verse-select").value
  const selectedVerseContainer = document.getElementById("selected-verse")

  if (book && chapter && verse) {
    // This would normally fetch from a Bible API
    selectedVerseContainer.innerHTML = `
      <div class="verse-result">
        <p><strong>${book.charAt(0).toUpperCase() + book.slice(1)} ${chapter}:${verse}</strong></p>
        <p>"Ini adalah contoh ayat yang dipilih. Dalam implementasi nyata, ini akan mengambil dari database Alkitab."</p>
      </div>
    `
  }
}

function increaseFontSize() {
  currentFontSize = Math.min(currentFontSize + 2, 24)
  updateFontSize()
}

function decreaseFontSize() {
  currentFontSize = Math.max(currentFontSize - 2, 12)
  updateFontSize()
}

function updateFontSize() {
  document.getElementById("daily-verse-text").style.fontSize = currentFontSize + "px"
  document.querySelectorAll(".verse-result p").forEach((p) => {
    p.style.fontSize = currentFontSize + "px"
  })
  showNotification(`Ukuran font: ${currentFontSize}px`, "info")
}

function toggleReadingMode() {
  readingMode = !readingMode
  const body = document.body

  if (readingMode) {
    body.classList.add("reading-mode")
    showNotification("Mode baca diaktifkan", "success")
  } else {
    body.classList.remove("reading-mode")
    showNotification("Mode baca dinonaktifkan", "info")
  }
}

function loadFavorites() {
  const favoritesList = document.getElementById("favorites-list")

  if (favorites.length === 0) {
    favoritesList.innerHTML =
      '<p class="no-favorites">Belum ada ayat favorit. Tambahkan ayat dengan menekan tombol ❤️</p>'
    return
  }

  favoritesList.innerHTML = favorites.map((verse, index) => ``).join("")
}

function removeFavorite(index) {
  favorites.splice(index, 1)
  localStorage.setItem("bibleFavorites", JSON.stringify(favorites))
  loadFavorites()
  showNotification("Ayat dihapus dari favorit", "info")
}

// Countdown Timer
function initializeCountdown() {
  console.log("[v0] Initializing countdown timer")
  updateCountdown()
  countdownInterval = setInterval(updateCountdown, 1000)
}

function getNextEvent() {
  const now = new Date()
  const currentDay = now.getDay()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentTime = currentHour * 60 + currentMinute // Convert to minutes for easier comparison

  console.log("[v0] Current time:", { currentDay, currentHour, currentMinute })

  let nextEvent = null
  let shortestTimeDiff = Number.POSITIVE_INFINITY

  // Check each event to find the one with the shortest time difference
  scheduleEvents.forEach((event) => {
    const eventDate = getEventDate(event)
    const timeDiff = eventDate - now

    // Only consider future events
    if (timeDiff > 0 && timeDiff < shortestTimeDiff) {
      shortestTimeDiff = timeDiff
      nextEvent = { event, date: eventDate }
    }
  })

  // If no event found this week, get the earliest event of next week
  if (!nextEvent) {
    const sortedEvents = [...scheduleEvents].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day
      if (a.hour !== b.hour) return a.hour - b.hour
      return a.minute - b.minute
    })

    const firstEvent = sortedEvents[0]
    const nextWeekDate = new Date()
    const daysUntilNextWeek = 7 - currentDay + firstEvent.day
    nextWeekDate.setDate(now.getDate() + daysUntilNextWeek)
    nextWeekDate.setHours(firstEvent.hour, firstEvent.minute, 0, 0)

    console.log("[v0] Next event found (next week):", firstEvent.name)
    return { event: firstEvent, date: nextWeekDate }
  }

  console.log("[v0] Next event found:", nextEvent.event.name)
  return nextEvent
}

function updateCountdown() {
  const { event, date: nextEventDate } = getNextEvent()
  const now = new Date()
  const timeDiff = nextEventDate - now

  console.log("[v0] Updating countdown, time diff:", timeDiff)

  if (timeDiff <= 0) {
    // Event has started or passed, find next event
    const nextEvent = getNextEvent()
    updateCountdownDisplay(nextEvent.event, nextEvent.date)
    updateIndividualTimers()
    return
  }

  updateCountdownDisplay(event, nextEventDate)
  updateIndividualTimers()
}

function updateCountdownDisplay(event, eventDate) {
  const now = new Date()
  const timeDiff = eventDate - now

  if (timeDiff <= 0) {
    document.getElementById("days").textContent = "00"
    document.getElementById("hours").textContent = "00"
    document.getElementById("minutes").textContent = "00"
    document.getElementById("seconds").textContent = "00"
    return
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

  document.getElementById("days").textContent = days.toString().padStart(2, "0")
  document.getElementById("hours").textContent = hours.toString().padStart(2, "0")
  document.getElementById("minutes").textContent = minutes.toString().padStart(2, "0")
  document.getElementById("seconds").textContent = seconds.toString().padStart(2, "0")

  // Update next event info
  const nextEventInfo = document.getElementById("next-event-info")
  if (nextEventInfo) {
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    const eventDay = dayNames[event.day]
    const eventTime = `${event.hour.toString().padStart(2, "0")}:${event.minute.toString().padStart(2, "0")}`

    nextEventInfo.innerHTML = `
      <span class="next-event-name">${event.name}</span>
      <span class="next-event-time">${eventDay}, ${eventTime}</span>
    `
  }
}

function getEventDate(event) {
  const now = new Date()
  const currentDay = now.getDay()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  let daysUntil = event.day - currentDay

  // If the event day has passed this week, move to next week
  if (daysUntil < 0) {
    daysUntil += 7
  }

  // If it's the same day, check if the time has passed
  if (daysUntil === 0) {
    const eventTimeInMinutes = event.hour * 60 + event.minute
    const currentTimeInMinutes = currentHour * 60 + currentMinute

    // If event time has passed today, move to next week
    if (eventTimeInMinutes <= currentTimeInMinutes) {
      daysUntil = 7
    }
  }

  const eventDate = new Date()
  eventDate.setDate(now.getDate() + daysUntil)
  eventDate.setHours(event.hour, event.minute, 0, 0)

  return eventDate
}

function updateIndividualTimers() {
  const now = new Date()

  scheduleEvents.forEach((event) => {
    const eventDate = getEventDate(event)
    const endTime = new Date(eventDate.getTime() + event.duration * 60 * 1000)
    const timeDiff = eventDate - now
    const timerElement = document.getElementById(`timer-${event.id}`)
    const statusElement = document.getElementById(`status-${event.id}`)

    if (!timerElement || !statusElement) return

    if (now >= eventDate && now <= endTime) {
      // Event is currently happening - GREEN
      statusElement.textContent = "Sedang Berlangsung"
      statusElement.className = "event-status ongoing"
      timerElement.innerHTML = '<i class="fas fa-play-circle"></i><span class="timer-text">Sedang berlangsung</span>'
    } else if (now > endTime) {
      // Event has finished - RED
      statusElement.textContent = "Selesai"
      statusElement.className = "event-status completed"
      timerElement.innerHTML = '<i class="fas fa-check-circle"></i><span class="timer-text">Selesai</span>'
    } else {
      // Event is upcoming - YELLOW variations
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

      let timeText = ""
      let statusClass = "event-status"

      if (days > 1) {
        timeText = `${days} hari ${hours} jam lagi`
        statusClass += " upcoming-far"
        statusElement.textContent = "Akan Datang"
      } else if (days === 1) {
        timeText = `${days} hari ${hours} jam lagi`
        statusClass += " upcoming-soon"
        statusElement.textContent = "Besok"
      } else if (hours > 2) {
        timeText = `${hours} jam ${minutes} menit lagi`
        statusClass += " upcoming-soon"
        statusElement.textContent = "Hari Ini"
      } else if (hours >= 1) {
        timeText = `${hours} jam ${minutes} menit lagi`
        statusClass += " upcoming-very-soon"
        statusElement.textContent = "Segera Dimulai"
      } else {
        timeText = `${minutes} menit lagi`
        statusClass += " upcoming-imminent"
        statusElement.textContent = "Hampir Dimulai"
      }

      statusElement.className = statusClass
      timerElement.innerHTML = `<i class="fas fa-clock"></i><span class="timer-text">${timeText}</span>`
    }
  })
}

// Scroll Effects
function initializeScrollEffects() {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    const parallax = document.querySelector(".hero-background")
    const speed = scrolled * 0.5

    if (parallax) {
      parallax.style.transform = `translateY(${speed}px)`
    }
  })
}

// Enhanced Logo Interactions (hanya untuk hero logo)
function initializeLogoEffects() {
  const logoMain = document.querySelector(".logo-main")
  if (logoMain) {
    // Mouse follow effect
    document.addEventListener("mousemove", (e) => {
      const rect = logoMain.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = (e.clientX - centerX) * 0.02
      const deltaY = (e.clientY - centerY) * 0.02

      logoMain.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.05)`
    })

    // Reset on mouse leave
    document.addEventListener("mouseleave", () => {
      logoMain.style.transform = "translate(0, 0) scale(1)"
    })

    // Click effect
    logoMain.addEventListener("click", () => {
      logoMain.style.animation = "none"
      logoMain.offsetHeight // Trigger reflow
      logoMain.style.animation =
        "logoFloat 3s ease-in-out infinite, logoGlow 2s ease-in-out infinite alternate, logoSpin 1s ease-in-out"
    })
  }
}

// Futuristic Button Effects
function initializeFuturisticButtons() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-3px) scale(1.05)"
      btn.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.2)"
    })

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translateY(0) scale(1)"
    })

    btn.addEventListener("click", (e) => {
      // Ripple effect
      const ripple = document.createElement("span")
      const rect = btn.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      btn.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

// Enhanced Maps Integration
function initializeMapsIntegration() {
  const mapsLink = document.querySelector('a[href*="maps.google.com"]')
  if (mapsLink) {
    mapsLink.addEventListener("click", (e) => {
      // Add loading effect
      const originalText = mapsLink.innerHTML
      mapsLink.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Membuka Maps...'

      setTimeout(() => {
        mapsLink.innerHTML = originalText
      }, 2000)

      // Track event
      trackEvent("maps_click", { location: "GBI Setia Mekar" })
    })
  }
}

// Navigation cross icon effects
function initializeNavigationEffects() {
  const navCross = document.querySelector(".nav-logo i")
  if (navCross) {
    navCross.addEventListener("mouseenter", () => {
      navCross.style.transform = "scale(1.2) rotate(15deg)"
      navCross.style.color = "var(--primary-color)"
    })

    navCross.addEventListener("mouseleave", () => {
      navCross.style.transform = "scale(1) rotate(0deg)"
      navCross.style.color = "var(--primary-color)"
    })
  }
}

// Add CSS for ripple effect
const rippleCSS = `.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: rippleEffect 0.6s linear;
    pointer-events: none;
}

@keyframes rippleEffect {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes logoSpin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}`

// Inject CSS
const style = document.createElement("style")
style.textContent = rippleCSS
document.head.appendChild(style)

// Utility Functions
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  // Close modals with Escape key
  if (e.key === "Escape") {
    if (lightbox.classList.contains("active")) {
      lightbox.classList.remove("active")
    }
    if (successModal.classList.contains("active")) {
      successModal.classList.remove("active")
    }
  }

  // Navigate favorites with arrow keys
  if (e.key === "ArrowLeft") {
    changeFavorite(-1)
  } else if (e.key === "ArrowRight") {
    changeFavorite(1)
  }
})

// Performance Optimization
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Remove or simplify the optimizedScrollHandler
const optimizedScrollHandler = debounce(() => {
  const scrolled = window.pageYOffset
  // Simple scroll handling - let CSS handle the styling
  if (scrolled > 100) {
    navbar.classList.add("scrolled")
  } else {
    navbar.classList.remove("scrolled")
  }
}, 10)

window.addEventListener("scroll", optimizedScrollHandler)

// Preload Images
function preloadImages() {
  const images = [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
    "/placeholder.svg?height=300&width=400",
  ]

  images.forEach((src) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.src = src
  })
}

// Initialize preloading
preloadImages()

// Service Worker Registration (for PWA capabilities)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration)
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError)
      })
  })
}

// Analytics and Tracking (placeholder)
function trackEvent(eventName, eventData) {
  // Implement analytics tracking here
  console.log("Event tracked:", eventName, eventData)
}

// Track user interactions
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn, .nav-link, .social-link")) {
    trackEvent("click", {
      element: e.target.className,
      text: e.target.textContent.trim(),
    })
  }
})

// Error Handling
window.addEventListener("error", (e) => {
  console.error("Global error:", e.error)
  // Implement error reporting here
})

// Unhandled Promise Rejection
window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason)
  // Implement error reporting here
})

// Page Visibility API
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Pause animations and music when tab is not visible
    if (musicPlaying) {
      backgroundMusic.pause()
    }
  } else {
    // Resume when tab becomes visible
    if (musicPlaying) {
      backgroundMusic.play().catch((e) => console.log("Resume play failed:", e))
    }
  }
})

// Touch and Gesture Support
let touchStartX = 0
let touchEndX = 0

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX
})

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleGesture()
})

function handleGesture() {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next favorite
      changeFavorite(1)
    } else {
      // Swipe right - previous favorite
      changeFavorite(-1)
    }
  }
}

function changeFavorite(direction) {
  const favoriteVerses = document.querySelectorAll(".favorite-verse")

  if (favoriteVerses.length === 0) return

  const currentIndex = Array.from(favoriteVerses).findIndex((fav) => fav.classList.contains("active"))

  if (currentIndex === -1) {
    favoriteVerses[0].classList.add("active")
    return
  }

  favoriteVerses[currentIndex].classList.remove("active")

  let newIndex = currentIndex + direction
  if (newIndex >= favoriteVerses.length) {
    newIndex = 0
  } else if (newIndex < 0) {
    newIndex = favoriteVerses.length - 1
  }

  favoriteVerses[newIndex].classList.add("active")
}

// Intersection Observer for lazy loading
const lazyImageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.remove("lazy")
      lazyImageObserver.unobserve(img)
    }
  })
})

// Apply lazy loading to images
document.querySelectorAll("img[data-src]").forEach((img) => {
  lazyImageObserver.observe(img)
})

// Console Easter Egg
console.log(`🙏 God's DNA - Youth & Teens Community 🙏
═══════════════════════════════════════════
"Karena Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan." - Yeremia 29:11

Built with ❤️ for God's glory
Contact: https://wa.me/6282114282506
Instagram: @godsdna_setiamekar
═══════════════════════════════════════════`)

function joinWhatsApp(eventType) {
  const whatsappNumbers = {
    "cool-daud": "6282114282506",
    "cool-tree": "6285281020900",
    "doa-youth": "6282114282506",
    "ibadah-youth": "6282114282506",
  }

  const number = whatsappNumbers[eventType] || "6282114282506"
  const message = `Halo! Saya ingin bergabung dalam kegiatan ${eventType.replace("-", " ").toUpperCase()} God's DNA. Mohon info lebih lanjut 🙏`
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank")
}

function addToCalendar(eventType) {
  const event = scheduleEvents.find((e) => e.id === eventType)
  if (!event) return

  const eventDate = getEventDate(event)
  const endDate = new Date(eventDate.getTime() + event.duration * 60 * 1000) // 90 minutes duration

  const startTime = eventDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
  const endTime = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"

  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}&dates=${startTime}/${endTime}&details=${encodeURIComponent("Kegiatan rohani God's DNA - GBI Setia Mekar")}&location=${encodeURIComponent("GBI Setia Mekar, Bekasi")}`

  window.open(calendarUrl, "_blank")
}

function openLocation() {
  window.open("https://maps.app.goo.gl/BuP752X3oUaJVkEH6", "_blank")
}

function initializeDailyVerse() {
  updateDailyVerse()
  setInterval(updateDailyVerse, 24 * 60 * 60 * 1000) // Update daily
}

function openLightbox(button) {
  const galleryItem = button.closest(".gallery-item")
  const img = galleryItem.querySelector("img")
  const title = galleryItem.querySelector("h4").textContent
  const description = galleryItem.querySelector("p").textContent

  const lightbox = document.getElementById("lightbox")
  const lightboxImg = document.getElementById("lightbox-img")
  const lightboxTitle = document.getElementById("lightbox-title")
  const lightboxDescription = document.getElementById("lightbox-description")

  lightboxImg.src = img.src
  lightboxImg.alt = img.alt
  lightboxTitle.textContent = title
  lightboxDescription.textContent = description

  lightbox.classList.add("active")
  document.body.style.overflow = "hidden"

  // Track current index
  const items = Array.from(document.querySelectorAll(".gallery-item"))
  window.__galleryItems = items
  window.__currentIndex = items.indexOf(galleryItem)
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox")
  lightbox.classList.remove("active")
  document.body.style.overflow = "auto"
}

// Close lightbox when clicking outside the image
document.getElementById("lightbox").addEventListener("click", function (e) {
  if (e.target === this) {
    closeLightbox()
  }
})

// Close lightbox with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeLightbox()
  }
  if (lightbox.classList.contains("active")) {
    if (e.key === "ArrowRight") nextLightbox()
    if (e.key === "ArrowLeft") prevLightbox()
  }
})

// Gallery Filters
function initializeGalleryFilters() {
  const filterContainer = document.getElementById("gallery-filters")
  if (!filterContainer) return

  const buttons = filterContainer.querySelectorAll(".filter-btn")
  const items = Array.from(document.querySelectorAll(".gallery-item"))

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const filter = btn.dataset.filter
      items.forEach((item) => {
        const category = item.dataset.category
        const match = filter === "all" || category === filter
        if (match) {
          item.classList.remove("hide")
          item.style.display = "block"
          item.style.opacity = "1"
        } else {
          item.classList.add("hide")
          item.style.opacity = "0"
          setTimeout(() => {
            if (item.classList.contains("hide")) item.style.display = "none"
          }, 200)
        }
      })
    })
  })
}

// Lightbox navigation
function setLightboxFromIndex(index) {
  const items = window.__galleryItems || Array.from(document.querySelectorAll(".gallery-item"))
  if (!items.length) return
  const safeIndex = ((index % items.length) + items.length) % items.length
  window.__currentIndex = safeIndex
  const item = items[safeIndex]
  const img = item.querySelector("img")
  const title = item.querySelector("h4").textContent
  const description = item.querySelector("p").textContent

  const lightboxImg = document.getElementById("lightbox-img")
  const lightboxTitle = document.getElementById("lightbox-title")
  const lightboxDescription = document.getElementById("lightbox-description")

  lightboxImg.src = img.src
  lightboxImg.alt = img.alt
  lightboxTitle.textContent = title
  lightboxDescription.textContent = description

  // Preload neighbors
  const prevItem = items[((safeIndex - 1) % items.length + items.length) % items.length]
  const nextItem = items[(safeIndex + 1) % items.length]
  ;[prevItem, nextItem].forEach((it) => {
    if (!it) return
    const i = new Image()
    i.src = it.querySelector("img").src
  })
}

function nextLightbox() {
  if (typeof window.__currentIndex !== "number") return
  setLightboxFromIndex(window.__currentIndex + 1)
}

function prevLightbox() {
  if (typeof window.__currentIndex !== "number") return
  setLightboxFromIndex(window.__currentIndex - 1)
}

function initializeLightboxNavigation() {
  // If lightbox already opened previously, ensure indices exist
  if (!window.__galleryItems) {
    window.__galleryItems = Array.from(document.querySelectorAll(".gallery-item"))
  }
}

// Schedule Loading Screen
function initializeScheduleLoading() {
  const scheduleLoading = document.getElementById("schedule-loading")
  const scheduleSection = document.getElementById("schedule")
  
  if (!scheduleLoading || !scheduleSection) return

  // Show loading screen when schedule section comes into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Show loading screen
        scheduleLoading.classList.remove("hidden")
        
        // Simulate loading time
        setTimeout(() => {
          scheduleLoading.classList.add("hidden")
          showNotification("Jadwal rohani siap! 🙏", "success")
        }, 2500)
        
        // Stop observing after first trigger
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })

  observer.observe(scheduleSection)
}

// Enhanced Button Ripple Effects
function initializeEnhancedButtons() {
  document.querySelectorAll(".action-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Create ripple effect
      const ripple = document.createElement("div")
      const rect = btn.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s linear;
        pointer-events: none;
        z-index: 1;
      `

      btn.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })
}

// Add ripple effect CSS (only if not already added)
if (!document.getElementById("ripple-effect-style")) {
  const rippleCSS = `
@keyframes rippleEffect {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
`

  const style = document.createElement("style")
  style.id = "ripple-effect-style"
  style.textContent = rippleCSS
  document.head.appendChild(style)
}

// Enhanced Timeline Animations
function initializeTimelineAnimations() {
  const timelineItems = document.querySelectorAll(".timeline-item, .timeline-verse")
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = "running"
      }
    })
  }, { threshold: 0.2 })

  timelineItems.forEach((item) => {
    item.style.animationPlayState = "paused"
    observer.observe(item)
  })
}

// Enhanced Countdown with Flip Animation
function updateCountdownDisplay(event, eventDate) {
  const now = new Date()
  const timeDiff = eventDate - now

  if (timeDiff <= 0) {
    document.getElementById("days").textContent = "00"
    document.getElementById("hours").textContent = "00"
    document.getElementById("minutes").textContent = "00"
    document.getElementById("seconds").textContent = "00"
    return
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

  // Add flip animation for changing numbers
  const daysEl = document.getElementById("days")
  const hoursEl = document.getElementById("hours")
  const minutesEl = document.getElementById("minutes")
  const secondsEl = document.getElementById("seconds")

  if (daysEl.textContent !== days.toString().padStart(2, "0")) {
    daysEl.classList.add("flip")
    setTimeout(() => {
      daysEl.textContent = days.toString().padStart(2, "0")
      daysEl.classList.remove("flip")
    }, 300)
  }

  if (hoursEl.textContent !== hours.toString().padStart(2, "0")) {
    hoursEl.classList.add("flip")
    setTimeout(() => {
      hoursEl.textContent = hours.toString().padStart(2, "0")
      hoursEl.classList.remove("flip")
    }, 300)
  }

  if (minutesEl.textContent !== minutes.toString().padStart(2, "0")) {
    minutesEl.classList.add("flip")
    setTimeout(() => {
      minutesEl.textContent = minutes.toString().padStart(2, "0")
      minutesEl.classList.remove("flip")
    }, 300)
  }

  if (secondsEl.textContent !== seconds.toString().padStart(2, "0")) {
    secondsEl.classList.add("flip")
    setTimeout(() => {
      secondsEl.textContent = seconds.toString().padStart(2, "0")
      secondsEl.classList.remove("flip")
    }, 300)
  }

  // Update next event info
  const nextEventInfo = document.getElementById("next-event-info")
  if (nextEventInfo) {
    const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    const eventDay = dayNames[event.day]
    const eventTime = `${event.hour.toString().padStart(2, "0")}:${event.minute.toString().padStart(2, "0")}`

    nextEventInfo.innerHTML = `
      <span class="next-event-name">${event.name}</span>
      <span class="next-event-time">${eventDay}, ${eventTime}</span>
    `
  }
}

// Enhanced Event Status Updates
function updateIndividualTimers() {
  const now = new Date()

  scheduleEvents.forEach((event) => {
    const eventDate = getEventDate(event)
    const endTime = new Date(eventDate.getTime() + event.duration * 60 * 1000)
    const timeDiff = eventDate - now
    const timerElement = document.getElementById(`timer-${event.id}`)
    const statusElement = document.getElementById(`status-${event.id}`)

    if (!timerElement || !statusElement) return

    if (now >= eventDate && now <= endTime) {
      // Event is currently happening - GREEN
      statusElement.textContent = "Sedang Berlangsung"
      statusElement.className = "event-status ongoing"
      timerElement.innerHTML = '<i class="fas fa-play-circle"></i><span class="timer-text">Sedang berlangsung</span>'
    } else if (now > endTime) {
      // Event has finished - RED
      statusElement.textContent = "Selesai"
      statusElement.className = "event-status completed"
      timerElement.innerHTML = '<i class="fas fa-check-circle"></i><span class="timer-text">Selesai</span>'
    } else {
      // Event is upcoming - YELLOW variations
      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))

      let timeText = ""
      let statusClass = "event-status"

      if (days > 1) {
        timeText = `${days} hari ${hours} jam lagi`
        statusClass += " upcoming-far"
        statusElement.textContent = "Akan Datang"
      } else if (days === 1) {
        timeText = `${days} hari ${hours} jam lagi`
        statusClass += " upcoming-soon"
        statusElement.textContent = "Besok"
      } else if (hours > 2) {
        timeText = `${hours} jam ${minutes} menit lagi`
        statusClass += " upcoming-soon"
        statusElement.textContent = "Hari Ini"
      } else if (hours >= 1) {
        timeText = `${hours} jam ${minutes} menit lagi`
        statusClass += " upcoming-very-soon"
        statusElement.textContent = "Segera Dimulai"
      } else {
        timeText = `${minutes} menit lagi`
        statusClass += " upcoming-imminent"
        statusElement.textContent = "Hampir Dimulai"
      }

      statusElement.className = statusClass
      timerElement.innerHTML = `<i class="fas fa-clock"></i><span class="timer-text">${timeText}</span>`
    }
  })
}

// Initialize enhanced features
document.addEventListener("DOMContentLoaded", () => {
  initializeEnhancedButtons()
  initializeTimelineAnimations()
})

// Typing animation for inspirational verse above gallery
function initializeGalleryTypingVerse() {
  const el = document.getElementById("gallery-verse-text")
  if (!el) return
  const verses = [
    '“Segala yang kamu lakukan, lakukanlah dengan segenap hatimu seperti untuk Tuhan.” — Kolose 3:23',
    '“Kamu adalah terang dunia.” — Matius 5:14',
    '“Biarlah segala yang bernafas memuji TUHAN!” — Mazmur 150:6',
  ]
  let idx = 0
  let char = 0
  let deleting = false
  el.classList.add('typing')

  function type() {
    const current = verses[idx]
    if (!deleting) {
      char++
      el.textContent = current.slice(0, char)
      if (char === current.length) {
        deleting = true
        setTimeout(type, 1800)
        return
      }
    } else {
      char--
      el.textContent = current.slice(0, Math.max(char, 0))
      if (char === 0) {
        deleting = false
        idx = (idx + 1) % verses.length
      }
    }
    const delay = deleting ? 25 : 38
    setTimeout(type, delay)
  }
  type()
}

// Staggered reveal for gallery items
function staggerRevealGallery() {
  const items = Array.from(document.querySelectorAll('.gallery-grid .gallery-item'))
  if (!items.length) return
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target
        const index = items.indexOf(el)
        el.style.transitionDelay = `${Math.min(index * 60, 300)}ms`
        el.classList.add('revealed')
        obs.unobserve(el)
      }
    })
  }, { threshold: 0.1 })
  items.forEach((it) => obs.observe(it))
}

// Enhance lightbox with next/prev buttons
function ensureLightboxNav() {
  const lightbox = document.getElementById('lightbox')
  if (!lightbox) return
  const content = lightbox.querySelector('.lightbox-content')
  if (!content) return
  if (!content.querySelector('.lightbox-prev')) {
    const prevBtn = document.createElement('button')
    prevBtn.className = 'lightbox-nav lightbox-prev'
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>'
    prevBtn.addEventListener('click', prevLightbox)
    content.appendChild(prevBtn)
  }
  if (!content.querySelector('.lightbox-next')) {
    const nextBtn = document.createElement('button')
    nextBtn.className = 'lightbox-nav lightbox-next'
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>'
    nextBtn.addEventListener('click', nextLightbox)
    content.appendChild(nextBtn)
  }
}

// Hook ensureLightboxNav in openLightbox if present
const _openLightbox = typeof openLightbox === 'function' ? openLightbox : null
if (_openLightbox) {
  window.openLightbox = function(button){
    _openLightbox(button)
    ensureLightboxNav()
  }
}

// After DOM ready, run initializers if available
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    try { initializeGalleryTypingVerse() } catch(e) {}
    try { staggerRevealGallery() } catch(e) {}
  })
} else {
  try { initializeGalleryTypingVerse() } catch(e) {}
  try { staggerRevealGallery() } catch(e) {}
}