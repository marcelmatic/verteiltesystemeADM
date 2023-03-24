import Abstractview from "./Abstractview.js";

let isLoggedIn = false;

export default class extends Abstractview {
  constructor(params) {
    super(params);
    this.setTitle("Login");
  }

  async getHtml() {
    // Check if the user is logged in
    if (!getLoggedIn()) {
      const response = await fetch("/static/src/login.html");
      const htmlContent = await response.text();
      return htmlContent;
    }
    const response = await fetch("/static/src/welcome.html");
    const htmlContent = await response.text();

    return htmlContent;
  }
}

export function setLogged(value) {
  console.log("WAHR" + value);

  isLoggedIn = value;
}

function getLoggedIn() {
  return isLoggedIn;
}
