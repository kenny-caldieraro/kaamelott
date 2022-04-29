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
    author.textContent = `- ${data.author}`;
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
    const link = document.querySelector('.link');
    sound.textContent = `${data.name}`;
    link.textContent = `${data.path}`;
  },
};

document.addEventListener('DOMContentLoaded', app.init);
