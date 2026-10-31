import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve("out-screenshots");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function inspect() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Users\\SHAHUL\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe",
  });

  const viewports = [
    { name: "390", width: 390, height: 844, isMobile: true },
    { name: "768", width: 768, height: 1024, isMobile: false },
    { name: "1440", width: 1440, height: 900, isMobile: false },
  ];

  const report = {
    errors: [],
    overflows: [],
  };

  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
    });
    const page = await context.newPage();

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`[Console Error @ ${vp.name}px]: ${msg.text()}`);
        report.errors.push(`[${vp.name}px] ${msg.text()}`);
      }
    });

    // 1. Visit homepage
    await page.goto("http://localhost:3333", { waitUntil: "networkidle" });
    
    // Skip intro if visible by clicking
    const introEl = await page.$("div.fixed.inset-0.z-\\[9999\\]");
    if (introEl) {
      await page.click("div.fixed.inset-0.z-\\[9999\\]").catch(() => {});
    }
    await page.waitForTimeout(1000);

    // Scroll to #work
    await page.evaluate(() => {
      const work = document.getElementById("work");
      if (work) work.scrollIntoView();
    });
    await page.waitForTimeout(1000);

    // Check overflow
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    if (overflow.hasOverflow) {
      report.overflows.push(`Homepage @ ${vp.name}px: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`);
    }

    // Capture work section
    const shotPath = path.join(outDir, `work-${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Saved screenshot: ${shotPath}`);

    // Check case study page
    await page.goto("http://localhost:3333/work/renewaldesk/", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const csOverflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    if (csOverflow.hasOverflow) {
      report.overflows.push(`CaseStudy @ ${vp.name}px: scrollWidth ${csOverflow.scrollWidth} > clientWidth ${csOverflow.clientWidth}`);
    }

    const csShotPath = path.join(outDir, `case-study-${vp.name}.png`);
    await page.screenshot({ path: csShotPath });
    console.log(`Saved case study screenshot: ${csShotPath}`);

    await context.close();
  }

  // 2. Test interactive page transition on desktop
  const transContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const transPage = await transContext.newPage();
  await transPage.goto("http://localhost:3333", { waitUntil: "networkidle" });
  await transPage.click("body").catch(() => {});
  await transPage.waitForTimeout(1000);

  await transPage.evaluate(() => {
    const work = document.getElementById("work");
    if (work) work.scrollIntoView();
  });
  await transPage.waitForTimeout(800);

  // Click the first card
  console.log("Testing click on featured card to trigger curtain transition...");
  const firstPanel = await transPage.$("[data-cursor='View']");
  if (firstPanel) {
    await firstPanel.click();
    // Wait for navigation and curtain
    await transPage.waitForURL("**/work/renewaldesk*", { timeout: 6000 });
    console.log("Navigated successfully to:", transPage.url());
  }
  await transContext.close();

  await browser.close();
  console.log("INSPECTION REPORT:", JSON.stringify(report, null, 2));
}

inspect();
