import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve("out-screenshots/sections");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function verify() {
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

    await page.goto("http://127.0.0.1:3333", { waitUntil: "networkidle" });
    await page.click("body").catch(() => {});
    await page.waitForTimeout(1600);

    // 1. Check & Screenshot SKILLS
    await page.evaluate(() => {
      const el = document.getElementById("skills");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(800);
    const skillsPath = path.join(outDir, `skills-${vp.name}.png`);
    await page.screenshot({ path: skillsPath });
    console.log(`Saved: ${skillsPath}`);

    // 2. Check & Screenshot JOURNEY
    await page.evaluate(() => {
      const el = document.getElementById("journey");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(800);
    const journeyPath = path.join(outDir, `journey-${vp.name}.png`);
    await page.screenshot({ path: journeyPath });
    console.log(`Saved: ${journeyPath}`);

    // If desktop, test horizontal scroll scrub
    if (vp.width >= 768) {
      await page.evaluate(() => {
        window.scrollBy(0, 1200);
      });
      await page.waitForTimeout(600);
      const journeyScrolledPath = path.join(outDir, `journey-scrolled-${vp.name}.png`);
      await page.screenshot({ path: journeyScrolledPath });
      console.log(`Saved: ${journeyScrolledPath}`);
    }

    // 3. Check & Screenshot ABOUT
    await page.evaluate(() => {
      const el = document.getElementById("about");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(800);
    const aboutPath = path.join(outDir, `about-${vp.name}.png`);
    await page.screenshot({ path: aboutPath });
    console.log(`Saved: ${aboutPath}`);

    // Check horizontal overflow
    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    if (overflow.hasOverflow) {
      report.overflows.push(`Viewport ${vp.name}px: scrollWidth ${overflow.scrollWidth} > clientWidth ${overflow.clientWidth}`);
    }

    await context.close();
  }

  // 4. Test resize handling (from desktop to mobile and back)
  console.log("Testing dynamic resize responsiveness...");
  const resizeContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const resizePage = await resizeContext.newPage();
  await resizePage.goto("http://127.0.0.1:3333", { waitUntil: "networkidle" });
  await resizePage.click("body").catch(() => {});
  await resizePage.waitForTimeout(1000);

  // Resize to mobile
  await resizePage.setViewportSize({ width: 390, height: 844 });
  await resizePage.waitForTimeout(800);
  const resizeMobileOverflow = await resizePage.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log("Resize to 390px has horizontal overflow:", resizeMobileOverflow);

  // Resize back to desktop
  await resizePage.setViewportSize({ width: 1440, height: 900 });
  await resizePage.waitForTimeout(800);
  const resizeDesktopOverflow = await resizePage.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  console.log("Resize back to 1440px has horizontal overflow:", resizeDesktopOverflow);

  await resizeContext.close();
  await browser.close();

  console.log("VERIFICATION REPORT:\n" + JSON.stringify(report, null, 2));
}

verify();
