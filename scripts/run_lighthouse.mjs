import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { exec } from "node:child_process";

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

async function runLighthouse() {
  const port = 3459;
  const outDir = path.resolve("./out");
  const reportPath = path.resolve("./lighthouse-report.json");

  console.log(`Starting static server on port ${port}...`);
  const server = await startStaticServer(outDir, port);

  const chromePath = "C:\\Users\\SHAHUL\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";
  process.env.CHROME_PATH = chromePath;

  const url = `http://localhost:${port}`;
  console.log(`Running mobile Lighthouse audit against ${url} using Chrome at ${chromePath}...`);

  const cmd = `npx lighthouse "${url}" --output json --output-path "${reportPath}" --chrome-flags="--headless" --form-factor=mobile --screenEmulation.mobile=true --only-categories=performance,accessibility,best-practices,seo`;

  exec(cmd, { env: { ...process.env, CHROME_PATH: chromePath } }, (error, stdout, stderr) => {
    if (error) {
      console.error("Lighthouse error:", error.message);
    }
    server.close();

    if (fs.existsSync(reportPath)) {
      const data = JSON.parse(fs.readFileSync(reportPath, "utf8"));
      const categories = data.categories;
      const audits = data.audits;

      const scores = {
        Performance: Math.round((categories.performance?.score || 0) * 100),
        Accessibility: Math.round((categories.accessibility?.score || 0) * 100),
        BestPractices: Math.round((categories["best-practices"]?.score || 0) * 100),
        SEO: Math.round((categories.seo?.score || 0) * 100),
        CLS: audits["cumulative-layout-shift"]?.displayValue || audits["cumulative-layout-shift"]?.numericValue,
        FCP: audits["first-contentful-paint"]?.displayValue,
        LCP: audits["largest-contentful-paint"]?.displayValue,
        TBT: audits["total-blocking-time"]?.displayValue,
      };

      console.log("\n==============================");
      console.log("  LIGHTHOUSE MOBILE AUDIT RESULTS ");
      console.log("==============================");
      console.log(`Performance:    ${scores.Performance} / 100`);
      console.log(`Accessibility:  ${scores.Accessibility} / 100`);
      console.log(`Best Practices: ${scores.BestPractices} / 100`);
      console.log(`SEO:            ${scores.SEO} / 100`);
      console.log(`CLS:            ${scores.CLS}`);
      console.log(`FCP:            ${scores.FCP}`);
      console.log(`LCP:            ${scores.LCP}`);
      console.log(`TBT:            ${scores.TBT}`);
      console.log("==============================\n");

      // Print any issues / recommendations
      const opportunities = Object.values(audits).filter(
        (a) => a.details && a.details.type === "opportunity" && (a.numericValue || 0) > 100
      );
      if (opportunities.length > 0) {
        console.log("Opportunities:");
        opportunities.forEach((o) => console.log(`- ${o.title}: ${o.displayValue || ""}`));
      }

      const failedA11y = Object.values(audits).filter(
        (a) => categories.accessibility?.auditRefs?.some((r) => r.id === a.id) && a.score === 0
      );
      if (failedA11y.length > 0) {
        console.log("\nAccessibility warnings:");
        failedA11y.forEach((a) => console.log(`- ${a.title}: ${a.description}`));
      }

      const failedSEO = Object.values(audits).filter(
        (a) => categories.seo?.auditRefs?.some((r) => r.id === a.id) && a.score === 0
      );
      if (failedSEO.length > 0) {
        console.log("\nSEO warnings:");
        failedSEO.forEach((a) => console.log(`- ${a.title}: ${a.description}`));
      }
    } else {
      console.error("Report file not generated.");
    }
  });
}

runLighthouse().catch(console.error);
