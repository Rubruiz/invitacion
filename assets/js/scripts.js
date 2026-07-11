(() => {
  const monthMap = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    setiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11,
  };

  const text = (selector) => {
    const element = document.querySelector(selector);
    return element ? element.textContent.trim() : "";
  };

  const parseTime = (value) => {
    const clean = value.toLowerCase().replace(/\s+/g, " ").trim();
    const match = clean.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
    if (!match) return { hours: 0, minutes: 0 };

    let hours = Number(match[1]);
    const minutes = Number(match[2] || 0);
    const suffix = match[3];

    if (suffix === "pm" && hours < 12) hours += 12;
    if (suffix === "am" && hours === 12) hours = 0;
    if (hours > 23) hours = 23;

    return { hours, minutes: Math.min(minutes, 59) };
  };

  const getEventDate = () => {
    const day = Number(text('[data-editable-text="texto-005"]').replace(/\D/g, ""));
    const monthName = text('[data-editable-text="texto-007"]')
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const year = Number(text('[data-editable-text="texto-008"]').replace(/\D/g, ""));
    const { hours, minutes } = parseTime(text('[data-editable-time="event-time"]'));

    if (!day || monthMap[monthName] == null || !year) return null;
    return new Date(year, monthMap[monthName], day, hours, minutes, 0, 0);
  };

  const updateCountdown = () => {
    const root = document.querySelector("#boss-countdown");
    if (!root) return;

    const target = getEventDate();
    const now = new Date();
    const diff = target ? Math.max(0, target.getTime() - now.getTime()) : 0;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    root.querySelector("[data-countdown-days]").textContent = days;
    root.querySelector("[data-countdown-hours]").textContent = String(hours).padStart(2, "0");
    root.querySelector("[data-countdown-minutes]").textContent = String(minutes).padStart(2, "0");
    root.querySelector("[data-countdown-seconds]").textContent = String(seconds).padStart(2, "0");
  };

  const updateWhatsAppLinks = () => {
    document.querySelectorAll("[data-whatsapp-phone]").forEach((link) => {
      const phone = (link.dataset.whatsappPhone || "").replace(/\D/g, "");
      const message = link.dataset.whatsappMessage || "Confirmo mi asistencia.";
      if (!phone) return;
      link.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    });
  };

  const formatCalendarDate = (date) => {
    const pad = (value) => String(value).padStart(2, "0");
    return [
      date.getFullYear(),
      pad(date.getMonth() + 1),
      pad(date.getDate()),
      "T",
      pad(date.getHours()),
      pad(date.getMinutes()),
      "00",
    ].join("");
  };

  const updateCalendarLinks = () => {
    const eventDate = getEventDate();
    if (!eventDate) return;

    const eventEnd = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000);
    document.querySelectorAll("[data-editable-link='enlace-004']").forEach((link) => {
      const title = link.dataset.calendarTitle || "Baby Shower";
      const location = link.dataset.calendarLocation || text('[data-editable-text="texto-011"]');
      const description =
        link.dataset.calendarDescription ||
        "Te esperamos para celebrar este dia especial. Recordatorio sugerido: 1 dia antes.";
      const timezone = link.dataset.calendarTimezone || "America/New_York";
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: title,
        dates: `${formatCalendarDate(eventDate)}/${formatCalendarDate(eventEnd)}`,
        details: `${description}\n\nRecordatorio sugerido: 1 dia antes del evento.`,
        location,
        ctz: timezone,
      });
      link.href = `https://calendar.google.com/calendar/render?${params.toString()}`;
    });
  };

  const initAudioToggle = () => {
    const toggles = [...document.querySelectorAll("[data-audio-toggle]")];
    if (!toggles.length) return;

    const primaryToggle = toggles[0];
    const audio = document.querySelector("[data-background-audio]") || new Audio(primaryToggle.dataset.audioSrc || "assets/misc/music.mp3");
    if (!audio.getAttribute("src")) audio.setAttribute("src", primaryToggle.dataset.audioSrc || "assets/misc/music.mp3");
    audio.loop = true;
    audio.preload = "auto";

    const setPlaying = (isPlaying) => {
      toggles.forEach((toggle) => {
        const icon = toggle.querySelector("[data-audio-icon]");
        const playSrc = toggle.dataset.playSrc || (icon ? icon.getAttribute("src") : "");
        const pauseSrc = toggle.dataset.pauseSrc || playSrc;
        toggle.setAttribute("aria-pressed", String(isPlaying));
        toggle.setAttribute("aria-label", isPlaying ? "Pausar musica de fondo" : "Reproducir musica de fondo");
        if (icon) icon.src = isPlaying ? pauseSrc : playSrc;
      });
    };

    const togglePlayback = async () => {
      const isVisuallyPlaying = primaryToggle.getAttribute("aria-pressed") === "true";
      if (!isVisuallyPlaying) {
        setPlaying(true);
        try {
          await audio.play();
          setPlaying(true);
        } catch (error) {
          // Some local file/browser contexts reject play() even after a click.
          // Keep the visual state responsive; the next click will still reset it.
          setPlaying(true);
        }
        return;
      }

      audio.pause();
      setPlaying(false);
    };

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", togglePlayback);
      toggle.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        togglePlayback();
      });
    });
    audio.addEventListener("pause", () => setPlaying(false));
    audio.addEventListener("play", () => setPlaying(true));
  };

  const stabilizeMobileBackgrounds = () => {
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => {
      document.querySelectorAll('img[src*="image-010-606794bbbd23.gif"], img[data-animated-src*="image-010-606794bbbd23.gif"]').forEach((image) => {
        if (!image.dataset.animatedSrc) image.dataset.animatedSrc = image.getAttribute("src");
        image.src = "assets/images/image-010-static.png";
      });
    };

    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
    } else if (media.addListener) {
      media.addListener(update);
    }
  };

  updateCountdown();
  updateWhatsAppLinks();
  updateCalendarLinks();
  initAudioToggle();
  stabilizeMobileBackgrounds();
  window.setInterval(updateCountdown, 1000);
})();
