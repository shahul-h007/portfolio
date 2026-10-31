import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const outDir = path.resolve("out-screenshots/final-sections");
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
    formValidationPassed: false,
    unconfiguredNoticePassed: false,
    emailCopiedPassed: false,
    footerTimePassed: false,
    backToTopPassed: false,
    keyboardNavPassed: false,
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

    // 1. Screenshot VENTURES
    await page.evaluate(() => {
      const el = document.getElementById("ventures");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    const venturesPath = path.join(outDir, `ventures-${vp.name}.png`);
    await page.screenshot({ path: venturesPath });
    console.log(`Saved: ${venturesPath}`);

    // 2. Screenshot CONTACT
    await page.evaluate(() => {
      const el = document.getElementById("contact");
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(600);
    const contactPath = path.join(outDir, `contact-${vp.name}.png`);
    await page.screenshot({ path: contactPath });
    console.log(`Saved: ${contactPath}`);

    // 3. Screenshot FOOTER
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(600);
    const footerPath = path.join(outDir, `footer-${vp.name}.png`);
    await page.screenshot({ path: footerPath });
    console.log(`Saved: ${footerPath}`);

    // Check overflow
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

  // 4. Interactive Behavioral Tests on Desktop
  console.log("Running functional interaction tests...");
  const testContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const testPage = await testContext.newPage();
  await testPage.goto("http://127.0.0.1:3333", { waitUntil: "networkidle" });
  await testPage.click("body").catch(() => {});
  await testPage.waitForTimeout(1000);

  // A. Test Form Validation (empty submission)
  console.log("A. Testing empty form submission validation...");
  await testPage.evaluate(() => {
    document.getElementById("contact").scrollIntoView();
  });
  await testPage.waitForTimeout(500);

  await testPage.click("button[type='submit']");
  await testPage.waitForTimeout(300);

  const nameError = await testPage.innerText("body");
  if (nameError.includes("Please provide your name")) {
    console.log("Passed empty form validation check.");
    report.formValidationPassed = true;
  }

  // B. Test Invalid Email
  console.log("B. Testing invalid email format validation...");
  await testPage.fill("#contact-name", "John Doe");
  await testPage.fill("#contact-email", "invalid-email-address");
  await testPage.fill("#contact-message", "This is a legitimate test message for portfolio.");
  await testPage.click("button[type='submit']");
  await testPage.waitForTimeout(300);

  const emailError = await testPage.innerText("body");
  if (emailError.includes("Please enter a valid email address")) {
    console.log("Passed invalid email format validation check.");
  }

  // C. Test Unconfigured Web3Forms Notification
  console.log("C. Testing unconfigured Web3Forms message...");
  await testPage.fill("#contact-email", "john@example.com");
  await testPage.click("button[type='submit']");
  await testPage.waitForTimeout(300);

  const unconfiguredNotice = await testPage.innerText("body");
  if (unconfiguredNotice.includes("Notice: Contact form transmission is not configured yet")) {
    console.log("Passed honest unconfigured Web3Forms notice check.");
    report.unconfiguredNoticePassed = true;
  }

  // D. Test Email Click Copy
  console.log("D. Testing email copy interaction...");
  const emailLink = await testPage.$("a[data-cursor='Copy']");
  if (emailLink) {
    await emailLink.click();
    await testPage.waitForTimeout(300);
    const bodyText = await testPage.innerText("body");
    if (bodyText.includes("Copied to clipboard")) {
      console.log("Passed email copy confirmation check.");
      report.emailCopiedPassed = true;
    }
  }

  // E. Test Footer Local Time
  console.log("E. Testing footer local time display...");
  const footerText = await testPage.innerText("footer");
  if (footerText.includes("Kochi, Kerala") && footerText.includes("IST")) {
    console.log("Passed footer live time check:", footerText.slice(0, 60));
    report.footerTimePassed = true;
  }

  // F. Test Back to Top Button
  console.log("F. Testing back to top smooth scroll...");
  const backToTopBtn = await testPage.$("footer button");
  if (backToTopBtn) {
    await backToTopBtn.click();
    await testPage.waitForTimeout(1600);
    const scrollY = await testPage.evaluate(() => window.scrollY);
    console.log("Scroll position after Back to Top:", scrollY);
    if (scrollY <= 50) {
      report.backToTopPassed = true;
    }
  }

  // G. Test Keyboard Accessibility (Tab Navigation)
  console.log("G. Testing keyboard tab focus accessibility...");
  await testPage.evaluate(() => {
    document.getElementById("contact-name").focus();
  });
  const initialFocused = await testPage.evaluate(() => document.activeElement.id);
  await testPage.keyboard.press("Tab");
  const secondFocused = await testPage.evaluate(() => document.activeElement.id);
  if (initialFocused === "contact-name" && secondFocused === "contact-email") {
    console.log("Passed keyboard tab accessibility check.");
    report.keyboardNavPassed = true;
  }

  await testContext.close();
  await browser.close();

  console.log("FINAL REPORT:\n" + JSON.stringify(report, null, 2));
}

verify();
