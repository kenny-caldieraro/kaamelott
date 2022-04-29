const app = {
  mainURL: 'https://kaamelott.xyz/api/v1/',

  init() {
    app.handleClick();
  },

  handleClick() {
    document.getElementById('getQuote').addEventListener('click', () => {
      app.getQuote();
    });
    document.getElementById('getSound').addEventListener('click', () => {
      app.getSound();
    });
  },

  async getQuote() {
    try {
      const response = await fetch(`${app.mainURL}quote/random`);
      const data = await response.json();
      app.viewQuote(data);
    } catch (error) {
      console.log(error);
    }
  },

  viewQuote(data) {
    const quote = document.querySelector('.quote');
    const author = document.querySelector('.author');
    quote.textContent = `"${data.content}"`;
    author.textContent = `- ${data.characts}`;
  },

  async getSound() {
    try {
      const response = await fetch(`${app.mainURL}sound/random`);
      const data = await response.json();
      app.viewSound(data);
    } catch (error) {
      console.log(error);
    }
  },

  viewSound(data) {
    const sound = document.querySelector('.sound');
    const link = document.querySelectorAll('.link');
    const play = document.querySelector('#play');
    sound.textContent = `${data.name.split('_').join(' ')}`;
    link[0].textContent = 'Download';

    for (let i = 0; i < link.length; i++) {
      link[i].style.display = 'inline-block';
    }

    link[0].href = `${data.path}`;
    play.textContent = 'Play';
    play.href = `${data.path}`;

    play.addEventListener('click', (e) => {
      e.preventDefault();
      const audio = new Audio(play.href);
      audio.play();
    });
  },
};

document.addEventListener('DOMContentLoaded', app.init);
