import http from "http";
import fs from "fs";
import path from "path";
import { chromium } from "playwright";

const OUT_DIR = path.resolve("out");
const PORT = 3333;
const BASE_URL = `http://localhost:${PORT}`;
const CHROME_PATH = "C:\\Users\\SHAHUL\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
const SCREENSHOTS_DIR = path.resolve("out-screenshots");

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

// Simple static file server for out/ directory
function createStaticServer() {
  const mimeTypes = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".css": "text/css",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".txt": "text/plain",
    ".xml": "application/xml",
    ".ico": "image/x-icon",
  };

  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split("?")[0]);
    if (reqPath.endsWith("/")) reqPath += "index.html";
    else if (!path.extname(reqPath)) {
      if (fs.existsSync(path.join(OUT_DIR, reqPath, "index.html"))) {
        reqPath = path.join(reqPath, "index.html");
      } else if (fs.existsSync(path.join(OUT_DIR, reqPath + ".html"))) {
        reqPath += ".html";
      }
    }

    const filePath = path.join(OUT_DIR, reqPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const notFoundPath = path.join(OUT_DIR, "404.html");
      if (fs.existsSync(notFoundPath)) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(fs.readFileSync(notFoundPath));
      } else {
        res.writeHead(404);
        res.end("Not Found");
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(fs.readFileSync(filePath));
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`Static server running on ${BASE_URL}`);
      resolve(server);
    });
  });
}

async function run() {
  const server = await createStaticServer();

  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_PATH,
  });

  const consoleLogs = [];
  const testResults = [];

  function record(name, status, details = "") {
    console.log(`[${status}] ${name} ${details ? "- " + details : ""}`);
    testResults.push({ name, status, details });
  }

  try {
    // ==========================================
    // 1. DESKTOP NAVIGATION TESTS (1440px)
    // ==========================================
    console.log("\n--- Testing Desktop Navigation (1440px) ---");
    const dContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const dPage = await dContext.newPage();
    dPage.on("console", (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text(), location: dPage.url() });
    });

    // A. Logo click from /work/rentflow/
    await dPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await dPage.waitForTimeout(600);
    const logo = dPage.locator("header a[data-cursor='Home']").first();
    await logo.click();
    await dPage.waitForURL(`${BASE_URL}/`);
    await dPage.waitForTimeout(1200);
    const scrollYAfterLogo = await dPage.evaluate(() => window.scrollY);
    record("Desktop: Logo click returns to home top", dPage.url() === `${BASE_URL}/` && scrollYAfterLogo < 100 ? "FIXED" : "NOT FIXED", `scrollY=${scrollYAfterLogo}`);

    // B. Nav Work click from /work/rentflow/
    await dPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await dPage.waitForTimeout(600);
    const workNav = dPage.locator("nav[aria-label='Main navigation'] a[href='/#work']").first();
    await workNav.click();
    await dPage.waitForURL(/.*#work/);
    await dPage.waitForTimeout(1500);
    const workPos = await dPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Desktop: Nav Work click scrolls to #work", workPos && workPos.scrollY > 300 && Math.abs(workPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${workPos?.scrollY}`);

    // C. Nav Contact click from /work/rentflow/
    await dPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await dPage.waitForTimeout(600);
    const contactNav = dPage.locator("nav[aria-label='Main navigation'] a[href='/#contact']").first();
    await contactNav.click();
    await dPage.waitForURL(/.*#contact/);
    await dPage.waitForTimeout(2000);
    const contactPos = await dPage.evaluate(() => {
      const el = document.getElementById("contact");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Desktop: Nav Contact click scrolls to #contact", contactPos && contactPos.scrollY > 1000 && Math.abs(contactPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${contactPos?.scrollY}`);

    // D. Top "← All work" link
    await dPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await dPage.waitForTimeout(600);
    const allWorkLink = dPage.locator("a[href='/#work']:has-text('All work'):visible").first();
    await allWorkLink.click();
    await dPage.waitForURL(/.*#work/);
    await dPage.waitForTimeout(1500);
    const allWorkPos = await dPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Desktop: Top '← All work' link scrolls to #work", allWorkPos && allWorkPos.scrollY > 300 && Math.abs(allWorkPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${allWorkPos?.scrollY}`);

    // E. Bottom "Back to all work" button
    await dPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await dPage.waitForTimeout(600);
    const backBtn = dPage.locator("a[href='/#work']:has-text('Back to all work'):visible").first();
    await backBtn.scrollIntoViewIfNeeded();
    await backBtn.click();
    await dPage.waitForURL(/.*#work/);
    await dPage.waitForTimeout(1500);
    const backBtnPos = await dPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Desktop: Bottom 'Back to all work' button scrolls to #work", backBtnPos && backBtnPos.scrollY > 300 && Math.abs(backBtnPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${backBtnPos?.scrollY}`);

    // F. Browser Back from case study
    await dPage.goto(`${BASE_URL}/#work`, { waitUntil: "networkidle" });
    await dPage.waitForTimeout(1200);
    const rentflowLink = dPage.locator("a[href='/work/rentflow/'], a[href='/work/rentflow']").first();
    await rentflowLink.click();
    await dPage.waitForURL(/.*\/work\/rentflow/);
    await dPage.waitForTimeout(800);
    await dPage.goBack();
    await dPage.waitForTimeout(1800);
    const backPos = await dPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Desktop: Browser Back returns to #work section (not top)", backPos && backPos.scrollY > 300 && Math.abs(backPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${backPos?.scrollY}`);

    // G. Directly open /work/rentflow/#work
    await dPage.goto(`${BASE_URL}/work/rentflow/#work`, { waitUntil: "networkidle" });
    await dPage.waitForTimeout(1800);
    const directPos = await dPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Desktop: Direct open of /work/rentflow/#work scrolls to #work", dPage.url().includes("#work") && directPos && directPos.scrollY > 300 && Math.abs(directPos.top) < 150 ? "FIXED" : "NOT FIXED", `URL=${dPage.url()}, scrollY=${directPos?.scrollY}`);

    // ==========================================
    // 2. MOBILE NAVIGATION TESTS (390px)
    // ==========================================
    console.log("\n--- Testing Mobile Navigation (390px) ---");
    const mContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mPage = await mContext.newPage();
    mPage.on("console", (msg) => {
      consoleLogs.push({ type: msg.type(), text: msg.text(), location: mPage.url() });
    });

    // Mobile Menu Home
    await mPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(600);
    await mPage.locator("button:has-text('Menu')").click();
    await mPage.waitForTimeout(500);
    await mPage.locator("nav[aria-label='Mobile navigation'] a:has-text('Home')").click();
    await mPage.waitForURL(`${BASE_URL}/`);
    await mPage.waitForTimeout(1200);
    const mScrollHome = await mPage.evaluate(() => window.scrollY);
    record("Mobile: Mobile menu Home click returns to / top", mPage.url() === `${BASE_URL}/` && mScrollHome < 100 ? "FIXED" : "NOT FIXED", `scrollY=${mScrollHome}`);

    // Mobile Menu Work
    await mPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(600);
    await mPage.locator("button:has-text('Menu')").click();
    await mPage.waitForTimeout(500);
    await mPage.locator("nav[aria-label='Mobile navigation'] a:has-text('Work')").click();
    await mPage.waitForURL(/.*#work/);
    await mPage.waitForTimeout(1500);
    const mWorkPos = await mPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Mobile: Mobile menu Work click scrolls to #work", mWorkPos && mWorkPos.scrollY > 200 && Math.abs(mWorkPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${mWorkPos?.scrollY}`);

    // Mobile Menu Contact
    await mPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(600);
    await mPage.locator("button:has-text('Menu')").click();
    await mPage.waitForTimeout(500);
    await mPage.locator("nav[aria-label='Mobile navigation'] a:has-text('Contact')").click();
    await mPage.waitForURL(/.*#contact/);
    await mPage.waitForTimeout(2000);
    const mContactPos = await mPage.evaluate(() => {
      const el = document.getElementById("contact");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Mobile: Mobile menu Contact click scrolls to #contact", mContactPos && mContactPos.scrollY > 800 && Math.abs(mContactPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${mContactPos?.scrollY}`);

    // Mobile Top "← All work"
    await mPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(600);
    const mAllWork = mPage.locator("a[href='/#work']:has-text('All work'):visible").first();
    await mAllWork.click();
    await mPage.waitForURL(/.*#work/);
    await mPage.waitForTimeout(1500);
    const mAllWorkPos = await mPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Mobile: Top '← All work' scrolls to #work", mAllWorkPos && mAllWorkPos.scrollY > 200 && Math.abs(mAllWorkPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${mAllWorkPos?.scrollY}`);

    // Mobile Bottom "Back to all work"
    await mPage.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(600);
    const mBackBtn = mPage.locator("a[href='/#work']:has-text('Back to all work'):visible").first();
    await mBackBtn.scrollIntoViewIfNeeded();
    await mBackBtn.click();
    await mPage.waitForURL(/.*#work/);
    await mPage.waitForTimeout(1500);
    const mBackPos = await mPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Mobile: Bottom 'Back to all work' scrolls to #work", mBackPos && mBackPos.scrollY > 200 && Math.abs(mBackPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${mBackPos?.scrollY}`);

    // Mobile Browser Back
    await mPage.goto(`${BASE_URL}/#work`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(1200);
    const mRentflowCard = mPage.locator("a[href='/work/rentflow/'], a[href='/work/rentflow']").first();
    await mRentflowCard.click();
    await mPage.waitForURL(/.*\/work\/rentflow/);
    await mPage.waitForTimeout(800);
    await mPage.goBack();
    await mPage.waitForTimeout(1800);
    const mBackHistPos = await mPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    record("Mobile: Browser Back returns to #work section (not top)", mBackHistPos && mBackHistPos.scrollY > 200 && Math.abs(mBackHistPos.top) < 150 ? "FIXED" : "NOT FIXED", `scrollY=${mBackHistPos?.scrollY}`);

    // ==========================================
    // 3. CAPTURE SCREENSHOTS AT 390, 768, 1440 PX
    // ==========================================
    console.log("\n--- Capturing Screenshots at 390, 768, 1440 px ---");
    const viewports = [
      { width: 390, height: 844, name: "390" },
      { width: 768, height: 1024, name: "768" },
      { width: 1440, height: 900, name: "1440" },
    ];

    for (const vp of viewports) {
      const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const p = await ctx.newPage();

      // Home Hero
      await p.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
      await p.evaluate(() => sessionStorage.setItem("sh_portfolio_intro_seen_v2", "true"));
      await p.waitForTimeout(2500);
      const homeShot = path.join(SCREENSHOTS_DIR, `home-${vp.name}.png`);
      await p.screenshot({ path: homeShot, fullPage: false });
      console.log(`Saved screenshot: ${homeShot}`);

      // Case Study (RentFlow)
      await p.goto(`${BASE_URL}/work/rentflow/`, { waitUntil: "networkidle" });
      await p.waitForTimeout(1000);
      const caseShot = path.join(SCREENSHOTS_DIR, `case-study-${vp.name}.png`);
      await p.screenshot({ path: caseShot, fullPage: false });
      console.log(`Saved screenshot: ${caseShot}`);

      await ctx.close();
    }

    await dContext.close();
    await mContext.close();

    console.log("\n=== CONSOLE LOG AUDIT ===");
    const errors = consoleLogs.filter((l) => l.type === "error");
    const warnings = consoleLogs.filter((l) => l.type === "warning");
    console.log(`Total console entries: ${consoleLogs.length}`);
    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    if (errors.length > 0) {
      console.log("Console errors:", JSON.stringify(errors, null, 2));
    }
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((e) => {
  console.error("Test failed:", e);
  process.exit(1);
});
