import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const targetDir = path.resolve("public/images/work");
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const targets = [
  { slug: "renewaldesk", url: "https://renewaldesk-dun.vercel.app" },
  { slug: "rentflow", url: "https://rentflow-sooty.vercel.app" },
];

async function capture() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Users\\SHAHUL\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe",
  });
  const results = [];

  for (const target of targets) {
    console.log(`Checking ${target.slug} at ${target.url}...`);
    try {
      // 1. Desktop context
      const desktopContext = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      });
      const pageDesktop = await desktopContext.newPage();
      const response = await pageDesktop.goto(target.url, { waitUntil: "networkidle", timeout: 25000 });
      const status = response ? response.status() : null;
      const currentUrl = pageDesktop.url();
      const title = await pageDesktop.title();
      const text = await pageDesktop.innerText("body");
      console.log(`[${target.slug}] Desktop URL: ${currentUrl}, HTTP Status: ${status}`);

      // Check if page redirected to login or needs auth
      const isLogin = currentUrl.includes("/login") || /sign in|log in|login|password/i.test(text.slice(0, 500));
      console.log(`[${target.slug}] Requires login: ${isLogin}`);

      const desktopPath = path.join(targetDir, `${target.slug}-desktop.png`);
      await pageDesktop.screenshot({ path: desktopPath });
      console.log(`[${target.slug}] Desktop screenshot saved to ${desktopPath}`);
      await desktopContext.close();

      // 2. Mobile context
      const mobileContext = await browser.newContext({
        viewport: { width: 390, height: 844 },
        userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        isMobile: true,
        hasTouch: true,
      });
      const pageMobile = await mobileContext.newPage();
      await pageMobile.goto(target.url, { waitUntil: "networkidle", timeout: 25000 });
      const mobilePath = path.join(targetDir, `${target.slug}-mobile.png`);
      await pageMobile.screenshot({ path: mobilePath });
      console.log(`[${target.slug}] Mobile screenshot saved to ${mobilePath}`);
      await mobileContext.close();

      results.push({
        slug: target.slug,
        status,
        currentUrl,
        isLogin,
        title,
        textSnippet: text.slice(0, 300).replace(/\s+/g, " "),
        success: true,
      });
    } catch (err) {
      console.error(`[${target.slug}] FAILED: ${err.message}`);
      results.push({
        slug: target.slug,
        error: err.message,
        success: false,
      });
    }
  }

  await browser.close();
  console.log("RESULTS:\n" + JSON.stringify(results, null, 2));
}

capture();
