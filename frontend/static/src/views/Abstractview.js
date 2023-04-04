export default class {
  constructor(params) {
    this.params = params;
    console.log(params);
  }

  // Definiere eine Methode, um den Titel des Dokuments zu ändern
  setTitle(title) {
    document.title = title;
  }

  // Definiere eine asynchrone Methode, die einen leeren HTML-String zurückgibt
  async getHtml() {
    return "";
  }
}
