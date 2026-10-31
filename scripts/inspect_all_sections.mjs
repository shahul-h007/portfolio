import { chromium } from "playwright";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

// Simple static file server for ./out
function startStaticServer(dir, port) {
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
    let reqUrl = decodeURIComponent(req.url.split("?")[0]);
    let filePath = path.join(dir, reqUrl);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function run() {
  const port = 3456;
  const outDir = path.resolve("./out");
  const screenshotsDir = path.resolve("./screenshots");
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  console.log(`Starting static server for ${outDir} on port ${port}...`);
  const server = await startStaticServer(outDir, port);

  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:\\Users\\SHAHUL\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe",
  });
  const viewports = [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "desktop", width: 1440, height: 900 },
  ];

  const results = {
    visualIssues: [],
    overflows: [],
    headingAudits: {},
  };

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce", // Ensure instant final state for screenshot checks
    });
    const page = await context.newPage();

    // 1. Home page audit
    await page.goto(`http://localhost:${port}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);

    // Check h1 count
    const h1Count = await page.locator("h1").count();
    const h1Texts = await page.locator("h1").allInnerTexts();
    results.headingAudits[vp.name] = { h1Count, h1Texts };

    // Check horizontal overflow
    const bodyScroll = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        clientWidth: doc.clientWidth,
        scrollWidth: doc.scrollWidth,
        hasOverflow: doc.scrollWidth > doc.clientWidth,
      };
    });

    if (bodyScroll.hasOverflow) {
      results.overflows.push({
        viewport: vp.name,
        page: "home",
        diff: bodyScroll.scrollWidth - bodyScroll.clientWidth,
      });
    }

    // Capture sections
    const sections = ["hero", "work", "skills", "journey", "about", "ventures", "contact"];
    for (const secId of sections) {
      const el = page.locator(`#${secId}`);
      if (await el.count() > 0) {
        await el.scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await el.screenshot({
          path: path.join(screenshotsDir, `${vp.name}-${secId}.png`),
        });
      }
    }

    // Capture Footer
    const footer = page.locator("footer");
    if (await footer.count() > 0) {
      await footer.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await footer.screenshot({
        path: path.join(screenshotsDir, `${vp.name}-footer.png`),
      });
    }

    // 2. Case study page audit (/work/renewaldesk/)
    await page.goto(`http://localhost:${port}/work/renewaldesk/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(300);

    const caseStudyScroll = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        clientWidth: doc.clientWidth,
        scrollWidth: doc.scrollWidth,
        hasOverflow: doc.scrollWidth > doc.clientWidth,
      };
    });

    if (caseStudyScroll.hasOverflow) {
      results.overflows.push({
        viewport: vp.name,
        page: "work/renewaldesk",
        diff: caseStudyScroll.scrollWidth - caseStudyScroll.clientWidth,
      });
    }

    await page.screenshot({
      path: path.join(screenshotsDir, `${vp.name}-casestudy-renewaldesk.png`),
      fullPage: false,
    });

    // Check tiny font sizes (< 10px) or clipped text
    const textIssues = await page.evaluate(() => {
      const problems = [];
      const allTextNodes = document.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, a, button, label");
      for (const el of allTextNodes) {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        if (fontSize < 10 && el.textContent.trim().length > 0) {
          problems.push({
            tag: el.tagName,
            text: el.textContent.trim().slice(0, 30),
            fontSize: style.fontSize,
          });
        }
      }
      return problems;
    });

    if (textIssues.length > 0) {
      results.visualIssues.push({ viewport: vp.name, textIssues });
    }

    await context.close();
  }

  await browser.close();
  server.close();

  console.log("\n=== AUDIT RESULTS ===");
  console.log("Heading Audits:", JSON.stringify(results.headingAudits, null, 2));
  console.log("Overflows:", JSON.stringify(results.overflows, null, 2));
  console.log("Visual / Text Issues:", JSON.stringify(results.visualIssues, null, 2));
}

run().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
