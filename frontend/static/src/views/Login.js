import Abstractview from "./Abstractview.js";

export default class extends Abstractview {
  constructor(params) {
    super(params);
    this.setTitle("Login");
  }

  async getHtml() {
    const response = await fetch("/static/src/login.html");
    const htmlContent = await response.text();

    return htmlContent;
  }
}
