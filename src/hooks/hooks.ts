import {BeforeAll,AfterAll, Before, After, Status, AfterStep} from "@cucumber/cucumber"
import { chromium  ,Browser, Page, BrowserContext} from "@playwright/test";
import {pageFixture} from"./pageFixture";
import { invokeBrowser } from "../helper/browsers/browserManager";
import { getEnv } from "../helper/env/env";
import { createLogger } from "winston";
import { options } from "../helper/util/logger";
const fs = require("fs-extra");

let browser: Browser;
let context: BrowserContext;

BeforeAll(async function () {
    getEnv();
    browser = await invokeBrowser();
});
// It will trigger for not auth scenarios
Before({ tags: "not @auth" }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    context = await browser.newContext({
        recordVideo: {
            dir: "test-results/videos",
        },
    });
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    const page = await context.newPage();
    pageFixture.page = page;
    pageFixture.logger = createLogger(options(scenarioName));
});


// It will trigger for auth scenarios
Before({ tags: '@auth' }, async function ({ pickle }) {
    const scenarioName = pickle.name + pickle.id
    context =await browser.newContext({
        recordVideo:{
            dir: "test-results/videos",
        },
    });
  
    await context.tracing.start({
        name: scenarioName,
        title: pickle.name,
        sources: true,
        screenshots: true, snapshots: true
    });
    const page = await context.newPage();
    pageFixture.page = page;
    pageFixture.logger = createLogger(options(scenarioName));
});

After(async function ({ pickle, result }) {
    let videoPath: string;
    let img: Buffer;
    const path = `./test-results/trace/${pickle.id}.zip`;
        img = await pageFixture.page.screenshot(
            { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" })
        videoPath = await pageFixture.page.video().path();
    // if (result?.status == Status.PASSED) {
    //     img = await pageFixture.page.screenshot(
    //         { path: `./test-results/screenshots/${pickle.name}.png`, type: "png" })
    //     videoPath = await pageFixture.page.video().path();
    // }
    await context.tracing.stop({ path: path });
    await pageFixture.page.close();
    await context.close();
        await this.attach(
            img, "image/png"
        );
        // if (result?.status == Status.PASSED) {
        //     await this.attach(
        //         img, "image/png"
        //     );
        await this.attach(
            fs.readFileSync(videoPath),
            'video/webm'
        );
        const traceFileLink = `<a href="https://trace.playwright.dev/">Open ${path}</a>`
        await this.attach(`Trace file: ${traceFileLink}`, 'text/html');

    }

);

AfterAll(async function () {
    await browser.close();
})