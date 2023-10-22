class App {
  constructor($el, { quotes, quoteTemplate } = {}) {
    this.$el = $el;
    this.quotes = quotes;
    this.quoteTemplate = quoteTemplate;

    this.renderQuoteElement(this.getQuoteElement(this.getRandomItem(quotes)));
  }

  getRandomItem(array) {
    const quotesSize = array.length;
    const randomIndex = Math.floor(Math.random() * quotesSize);
    return array[randomIndex];
  }

  getQuoteElement({ quote, author, title }) {
    this.quoteTemplate.querySelector(".quote-text").textContent = quote;
    this.quoteTemplate.querySelector(".author-text").textContent = author;
    this.quoteTemplate.querySelector(".title-text").textContent = title;

    // Hide the title until design is ready.
    this.quoteTemplate.querySelector(".title").classList.add("hidden");

    return this.quoteTemplate.cloneNode(true);
  }

  renderQuoteElement(quoteElement) {
    this.$el.innerHTML = "";
    this.$el.appendChild(quoteElement);
  }
}

(async () => {
  const response = await fetch("./data/goodquotes.json");
  const quotes = await response.json();
  new App(document.getElementById("app"), {
    quotes,
    quoteTemplate: document.getElementById("quote-template").content,
  });
})();
