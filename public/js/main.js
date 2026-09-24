const API_URL = '/api/v1/';

const app = {
  audio: new Audio(),
  currentItem: null,

  init() {
    // Le script est aussi chargé sur la page d'erreur, qui n'a pas ces éléments
    if (!document.getElementById('player')) return;

    app.quote = document.getElementById('quote');
    app.player = document.getElementById('player');
    app.playerToggle = document.getElementById('playerToggle');
    app.playerProgress = document.getElementById('playerProgress');
    app.soundTitle = document.getElementById('soundTitle');
    app.downloadSound = document.getElementById('downloadSound');

    app.audio.preload = 'none';
    app.bindQuote();
    app.bindPlayer();
    app.bindLibrary();
    app.bindApiConsole();
  },

  async fetchJSON(endpoint) {
    const response = await fetch(endpoint, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  },

  toast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      toast.setAttribute('role', 'status');
      document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(app.toastTimer);
    app.toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  },

  /* ---------- Citations ---------- */

  bindQuote() {
    const button = document.getElementById('getQuote');
    button.addEventListener('click', async () => {
      button.disabled = true;
      app.quote.classList.add('is-loading');
      try {
        const data = await app.fetchJSON(`${API_URL}quote/random`);
        app.renderQuote(data);
      } catch (error) {
        app.toast('Impossible de récupérer une citation');
      } finally {
        button.disabled = false;
        app.quote.classList.remove('is-loading');
      }
    });

    document.getElementById('copyQuote').addEventListener('click', async () => {
      const text = app.quote.querySelector('.quote-text').textContent.trim();
      const author = app.quote.querySelector('.quote-character').textContent.trim();
      try {
        await navigator.clipboard.writeText(`${text} — ${author}`);
        app.toast('Citation copiée !');
      } catch (error) {
        app.toast('Copie impossible');
      }
    });
  },

  renderQuote(data) {
    const clean = (value) => (value || '').trim();
    app.quote.querySelector('.quote-text').textContent = `« ${clean(data.content)} »`;
    app.quote.querySelector('.quote-character').textContent = clean(data.characts);
    app.quote.querySelector('.quote-details').textContent = [data.actor, data.season, data.episode]
      .map(clean)
      .filter(Boolean)
      .join(' · ');
  },

  /* ---------- Lecteur ---------- */

  bindPlayer() {
    const button = document.getElementById('getSound');
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const data = await app.fetchJSON(`${API_URL}sound/random`);
        app.play(data.path, app.prettify(data.name));
      } catch (error) {
        app.toast('Impossible de récupérer un son');
      } finally {
        button.disabled = false;
      }
    });

    app.playerToggle.addEventListener('click', () => {
      if (app.audio.paused) app.audio.play();
      else app.audio.pause();
    });

    app.audio.addEventListener('play', () => app.setPlaying(true));
    app.audio.addEventListener('pause', () => app.setPlaying(false));
    app.audio.addEventListener('ended', () => {
      app.setPlaying(false);
      app.playerProgress.style.width = '0';
    });
    app.audio.addEventListener('timeupdate', () => {
      const { currentTime, duration } = app.audio;
      if (duration) app.playerProgress.style.width = `${(currentTime / duration) * 100}%`;
    });
  },

  prettify(fileName) {
    const label = fileName
      .replace(/\.mp3$/i, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\s*\d+$/, '')
      .trim();
    return label.charAt(0).toUpperCase() + label.slice(1);
  },

  play(src, title, item = null) {
    app.audio.src = src;
    app.audio.play().catch(() => app.toast('Lecture impossible'));

    app.soundTitle.textContent = title;
    app.playerToggle.disabled = false;
    app.downloadSound.href = src;
    app.downloadSound.classList.remove('is-hidden');

    if (app.currentItem) app.currentItem.classList.remove('is-playing');
    app.currentItem = item;
  },

  setPlaying(isPlaying) {
    app.player.classList.toggle('is-playing', isPlaying);
    app.playerToggle.setAttribute('aria-label', isPlaying ? 'Mettre en pause' : 'Lire la réplique');
    if (app.currentItem) app.currentItem.classList.toggle('is-playing', isPlaying);
  },

  /* ---------- Sonothèque ---------- */

  bindLibrary() {
    const grid = document.getElementById('soundGrid');
    const search = document.getElementById('soundSearch');
    const count = document.getElementById('soundCount');
    const empty = document.getElementById('soundEmpty');
    const items = [...grid.children];

    grid.addEventListener('click', (event) => {
      const button = event.target.closest('.sound-item');
      if (!button) return;
      const item = button.parentElement;
      if (item === app.currentItem) {
        if (app.audio.paused) app.audio.play();
        else app.audio.pause();
        return;
      }
      app.play(button.dataset.src, button.dataset.title, item);
    });

    const normalize = (text) => text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

    search.addEventListener('input', () => {
      const words = normalize(search.value).split(' ').filter(Boolean);
      let visible = 0;
      items.forEach((item) => {
        const match = words.every((word) => item.dataset.keywords.includes(word));
        item.classList.toggle('is-hidden', !match);
        if (match) visible += 1;
      });
      count.textContent = `${visible} son${visible > 1 ? 's' : ''}`;
      empty.classList.toggle('is-hidden', visible > 0);
    });
  },

  /* ---------- Console API ---------- */

  bindApiConsole() {
    const endpointLabel = document.getElementById('consoleEndpoint');
    const output = document.getElementById('consoleOutput');

    document.querySelectorAll('.try').forEach((button) => {
      button.addEventListener('click', async () => {
        const { endpoint } = button.dataset;
        endpointLabel.textContent = `GET ${endpoint}`;
        output.textContent = 'Chargement…';
        try {
          const data = await app.fetchJSON(endpoint);
          output.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          output.textContent = `Erreur : ${error.message}`;
        }
      });
    });
  },
};

document.addEventListener('DOMContentLoaded', app.init);
