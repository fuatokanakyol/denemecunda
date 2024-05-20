import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { pageFixture } from "../../hooks/pageFixture";
import LoginPage from "../pages/loginPage";
import * as data from "../../helper/test-data/userData.json";
let loginPage: LoginPage;
Given("User navigate to Cunda Website", async function () {
  loginPage = new LoginPage(pageFixture.page);
  await pageFixture.page.goto(process.env.BASEURL);
  await pageFixture.logger.info("User navigated to Loginpage")
});

Given("User login the valid email and valid password", async function () {
  loginPage = new LoginPage(pageFixture.page);

  await loginPage.loginFunc(
    data.loginPage.validEmail,
    data.loginPage.validPasword
  );

});
Given("User login the valid email and invalid password", async function () {
  loginPage = new LoginPage(pageFixture.page);

  await loginPage.loginFunc(
    data.loginPage.validEmail,
    data.loginPage.invalidPassword
  );

  await loginPage.loginButton.click();
});

Given("User login the invalid email and valid password", async function () {
  loginPage = new LoginPage(pageFixture.page);

  await loginPage.loginFunc(
    data.loginPage.invalidEmail,
    data.loginPage.validEmail
  );

  await loginPage.loginButton.click();
});

Given("User login the invalid email and invalid password", async function () {
  loginPage = new LoginPage(pageFixture.page);

  await loginPage.loginFunc(
    data.loginPage.invalidEmail,
    data.loginPage.invalidPassword
  );

  await loginPage.loginButton.click();
});

Then("Verify user logged", async function () {
  loginPage = new LoginPage(pageFixture.page);

  await expect(pageFixture.page).toHaveURL(
    "https://testcloud.cunda.ai/login?returnUrl=%2Finsights"
  );
});

Then("User take error message", async function () {
  loginPage = new LoginPage(pageFixture.page);

  await expect(
    loginPage.page.getByLabel(data.loginPage.invalidCredentialsMessage)
  ).toBeVisible();
});
