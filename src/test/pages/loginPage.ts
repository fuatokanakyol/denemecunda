import { Page, Locator } from "@playwright/test";

class LoginPage {
    page: Page;
    loginButton: Locator;
    emailInput: Locator;
    passwordInput: Locator;

  constructor(page:Page) {
    this.page = page;
    this.loginButton = this.page.getByRole('button', { name: "Login" })
    this.emailInput =  this.page.getByPlaceholder("Please enter Email")
    this.passwordInput= this.page.getByPlaceholder("Your password")
    
  }
  async loginFunc(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
}
}
export default LoginPage;