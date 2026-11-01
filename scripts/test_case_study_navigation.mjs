import { chromium } from "playwright";

const BASE_URL = "http://localhost:3000";
const CHROME_PATH = "C:\\Users\\SHAHUL\\AppData\\Local\\ms-playwright\\chromium-1248\\chrome-win64\\chrome.exe";

async function runTests() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: CHROME_PATH,
  });

  const testResults = [];

  function record(name, status, details = "") {
    console.log(`[${status}] ${name} ${details ? "- " + details : ""}`);
    testResults.push({ name, status, details });
  }

  try {
    // ==========================================
    // DESKTOP TESTS (1440px)
    // ==========================================
    console.log("\n=== RUNNING DESKTOP TESTS (1440px) ===");
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
    });
    const page = await desktopContext.newPage();

    // 1. Check Active Nav Item on /work/rentflow
    await page.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    const activeNavWork = await page.evaluate(() => {
      const workLink = Array.from(document.querySelectorAll("nav[aria-label='Main navigation'] a")).find(
        (a) => a.textContent.includes("Work")
      );
      if (!workLink) return false;
      const dot = workLink.querySelector(".bg-gold");
      return !!dot && workLink.classList.contains("text-ink");
    });
    record("Desktop: 'Work' nav item is active on /work/rentflow", activeNavWork ? "FIXED" : "NOT FIXED");

    // 2. Click Logo "SH" from /work/rentflow -> should go to / and scroll at top
    await page.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const logo = page.locator("header a[data-cursor='Home']").first();
    await logo.click();
    await page.waitForURL(`${BASE_URL}/`);
    await page.waitForTimeout(1200);
    const scrollYAfterLogo = await page.evaluate(() => window.scrollY);
    record(
      "Desktop: Logo 'SH' navigates to home page top",
      page.url() === `${BASE_URL}/` && scrollYAfterLogo < 100 ? "FIXED" : "NOT FIXED",
      `URL=${page.url()}, scrollY=${scrollYAfterLogo}`
    );

    // 3. Click "Work" in desktop nav from /work/rentflow -> lands on /#work and scrolls to #work
    await page.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const workNavLink = page.locator("nav[aria-label='Main navigation'] a[href='/#work']").first();
    await workNavLink.click();
    await page.waitForURL(/.*#work/);
    await page.waitForTimeout(1500);
    const workSectionPos = await page.evaluate(() => {
      const el = document.getElementById("work");
      if (!el) return { found: false, top: 0, scrollY: 0 };
      const rect = el.getBoundingClientRect();
      return { found: true, top: rect.top, scrollY: window.scrollY };
    });
    const workScrolled = workSectionPos.found && workSectionPos.scrollY > 300 && Math.abs(workSectionPos.top) < 150;
    record(
      "Desktop: Nav 'Work' link navigates and scrolls to #work section",
      workScrolled ? "FIXED" : "NOT FIXED",
      `scrollY=${workSectionPos.scrollY}, sectionTop=${workSectionPos.top}`
    );

    // 4. Click "Contact" in desktop nav from /work/rentflow -> lands on /#contact and scrolls to #contact
    await page.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const contactNavLink = page.locator("nav[aria-label='Main navigation'] a[href='/#contact']").first();
    await contactNavLink.click();
    await page.waitForURL(/.*#contact/);
    await page.waitForTimeout(2000);
    const contactSectionPos = await page.evaluate(() => {
      const el = document.getElementById("contact");
      if (!el) return { found: false, top: 0, scrollY: 0 };
      const rect = el.getBoundingClientRect();
      return { found: true, top: rect.top, scrollY: window.scrollY };
    });
    const contactScrolled = contactSectionPos.found && contactSectionPos.scrollY > 1000 && Math.abs(contactSectionPos.top) < 150;
    record(
      "Desktop: Nav 'Contact' link navigates and scrolls to #contact section",
      contactScrolled ? "FIXED" : "NOT FIXED",
      `scrollY=${contactSectionPos.scrollY}, sectionTop=${contactSectionPos.top}`
    );

    // 5. Click "← All work" link at the top of /work/rentflow -> lands on /#work and scrolls to #work
    await page.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const allWorkLink = page.locator("a[href='/#work']:has-text('All work')").first();
    await allWorkLink.click();
    await page.waitForURL(/.*#work/);
    await page.waitForTimeout(1500);
    const allWorkScrollPos = await page.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const allWorkSuccess = allWorkScrollPos && allWorkScrollPos.scrollY > 300 && Math.abs(allWorkScrollPos.top) < 150;
    record(
      "Desktop: '← All work' top link navigates and scrolls to #work section",
      allWorkSuccess ? "FIXED" : "NOT FIXED",
      `scrollY=${allWorkScrollPos?.scrollY}, sectionTop=${allWorkScrollPos?.top}`
    );

    // 6. Click "Back to all work" button at the bottom of /work/rentflow -> lands on /#work and scrolls to #work
    await page.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const backToWorkBtn = page.locator("a[href='/#work']:has-text('Back to all work')").first();
    await backToWorkBtn.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await backToWorkBtn.click();
    await page.waitForURL(/.*#work/);
    await page.waitForTimeout(1500);
    const backToWorkScrollPos = await page.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const backToWorkSuccess = backToWorkScrollPos && backToWorkScrollPos.scrollY > 300 && Math.abs(backToWorkScrollPos.top) < 150;
    record(
      "Desktop: 'Back to all work' bottom button navigates and scrolls to #work section",
      backToWorkSuccess ? "FIXED" : "NOT FIXED",
      `scrollY=${backToWorkScrollPos?.scrollY}, sectionTop=${backToWorkScrollPos?.top}`
    );

    // 7. Directly open /work/rentflow/#work -> should redirect to /#work and scroll to #work
    await page.goto(`${BASE_URL}/work/rentflow/#work`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1800);
    const directUrl = page.url();
    const directScrollPos = await page.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const directSuccess = directUrl.includes("#work") && directScrollPos && directScrollPos.scrollY > 300 && Math.abs(directScrollPos.top) < 150;
    record(
      "Desktop: Direct open of /work/rentflow/#work lands and scrolls to #work",
      directSuccess ? "FIXED" : "NOT FIXED",
      `URL=${directUrl}, scrollY=${directScrollPos?.scrollY}, sectionTop=${directScrollPos?.top}`
    );

    // 8. Browser Back from a case study returns to #work section (not top)
    // First, start on home page at #work
    await page.goto(`${BASE_URL}/#work`, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);
    // Find and click on RentFlow project card/link
    const rentflowLink = page.locator("a[href='/work/rentflow']").first();
    await rentflowLink.click();
    await page.waitForURL(/.*\/work\/rentflow/);
    await page.waitForTimeout(1000);
    // Now trigger browser Back
    await page.goBack();
    await page.waitForTimeout(1800);
    const backUrl = page.url();
    const backPos = await page.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const browserBackSuccess = backPos && backPos.scrollY > 300 && Math.abs(backPos.top) < 150;
    record(
      "Desktop: Browser Back returns to #work section of home page (not top)",
      browserBackSuccess ? "FIXED" : "NOT FIXED",
      `URL=${backUrl}, scrollY=${backPos?.scrollY}, sectionTop=${backPos?.top}`
    );

    // 9. Bidirectional Navigation (Previous & Next Case Study)
    await page.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const nextLink = page.locator("a:has-text('Next Case Study')").first();
    await nextLink.scrollIntoViewIfNeeded();
    const nextHref = await nextLink.getAttribute("href");
    await nextLink.click();
    await page.waitForURL(new RegExp(nextHref));
    await page.waitForTimeout(800);

    const prevLink = page.locator("a:has-text('Previous Case Study')").first();
    await prevLink.scrollIntoViewIfNeeded();
    await prevLink.click();
    await page.waitForURL(/.*\/work\/rentflow/);
    record(
      "Desktop: Bidirectional case study navigation (Next -> Prev)",
      page.url().includes("/work/rentflow") ? "FIXED" : "NOT FIXED",
      `Returned to ${page.url()}`
    );

    // 10. Breadcrumb check
    await page.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const breadcrumb = await page.evaluate(() => {
      const nav = document.querySelector("nav[aria-label='Breadcrumb']");
      return nav ? nav.textContent.trim() : null;
    });
    record(
      "Desktop: Breadcrumb 'Home / Work / <project>' exists",
      breadcrumb && breadcrumb.includes("Home") && breadcrumb.includes("Work") && breadcrumb.includes("RentFlow") ? "FIXED" : "NOT FIXED",
      `Breadcrumb text: "${breadcrumb}"`
    );

    await desktopContext.close();

    // ==========================================
    // MOBILE TESTS (390px)
    // ==========================================
    console.log("\n=== RUNNING MOBILE TESTS (390px) ===");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    });
    const mPage = await mobileContext.newPage();

    // 11. Mobile Menu: Open & Check Links
    await mPage.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(500);
    const menuBtn = mPage.locator("button:has-text('Menu')").first();
    await menuBtn.click();
    await mPage.waitForTimeout(500);

    // Check that "Work" is highlighted active in mobile menu
    const isMobileWorkActive = await mPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll("nav[aria-label='Mobile navigation'] a"));
      const workLink = links.find((a) => a.textContent.includes("Work"));
      return workLink && workLink.classList.contains("text-gold");
    });
    record(
      "Mobile: 'Work' is highlighted active in mobile menu on /work/rentflow",
      isMobileWorkActive ? "FIXED" : "NOT FIXED"
    );

    // 12. Mobile Menu: Click "Home" -> navigates to / and lands at top
    const homeMobileLink = mPage.locator("nav[aria-label='Mobile navigation'] a:has-text('Home')").first();
    await homeMobileLink.click();
    await mPage.waitForURL(`${BASE_URL}/`);
    await mPage.waitForTimeout(1200);
    const mScrollAfterHome = await mPage.evaluate(() => window.scrollY);
    record(
      "Mobile: Mobile menu 'Home' link navigates to / top",
      mPage.url() === `${BASE_URL}/` && mScrollAfterHome < 100 ? "FIXED" : "NOT FIXED",
      `URL=${mPage.url()}, scrollY=${mScrollAfterHome}`
    );

    // 13. Mobile Menu: Click "Work" -> navigates to /#work and scrolls to #work
    await mPage.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(500);
    const mMenuBtn2 = mPage.locator("button:has-text('Menu')").first();
    await mMenuBtn2.click();
    await mPage.waitForTimeout(500);
    const workMobileLink = mPage.locator("nav[aria-label='Mobile navigation'] a:has-text('Work')").first();
    await workMobileLink.click();
    await mPage.waitForURL(/.*#work/);
    await mPage.waitForTimeout(1500);
    const mWorkPos = await mPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const mWorkSuccess = mWorkPos && mWorkPos.scrollY > 200 && Math.abs(mWorkPos.top) < 150;
    record(
      "Mobile: Mobile menu 'Work' link navigates and scrolls to #work section",
      mWorkSuccess ? "FIXED" : "NOT FIXED",
      `scrollY=${mWorkPos?.scrollY}, sectionTop=${mWorkPos?.top}`
    );

    // 14. Mobile Menu: Click "Contact" -> navigates to /#contact and scrolls to #contact
    await mPage.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(500);
    const mMenuBtn3 = mPage.locator("button:has-text('Menu')").first();
    await mMenuBtn3.click();
    await mPage.waitForTimeout(500);
    const contactMobileLink = mPage.locator("nav[aria-label='Mobile navigation'] a:has-text('Contact')").first();
    await contactMobileLink.click();
    await mPage.waitForURL(/.*#contact/);
    await mPage.waitForTimeout(2000);
    const mContactPos = await mPage.evaluate(() => {
      const el = document.getElementById("contact");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const mContactSuccess = mContactPos && mContactPos.scrollY > 800 && Math.abs(mContactPos.top) < 150;
    record(
      "Mobile: Mobile menu 'Contact' link navigates and scrolls to #contact section",
      mContactSuccess ? "FIXED" : "NOT FIXED",
      `scrollY=${mContactPos?.scrollY}, sectionTop=${mContactPos?.top}`
    );

    // 15. Mobile: Click "← All work"
    await mPage.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(500);
    const mAllWorkLink = mPage.locator("a[href='/#work']:has-text('All work'):visible").first();
    await mAllWorkLink.click();
    await mPage.waitForURL(/.*#work/);
    await mPage.waitForTimeout(1800);
    const mAllWorkPos = await mPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const mAllWorkSuccess = mAllWorkPos && mAllWorkPos.scrollY > 200 && Math.abs(mAllWorkPos.top) < 150;
    record(
      "Mobile: '← All work' link navigates and scrolls to #work section",
      mAllWorkSuccess ? "FIXED" : "NOT FIXED",
      `scrollY=${mAllWorkPos?.scrollY}, sectionTop=${mAllWorkPos?.top}`
    );

    // 16. Mobile: Click "Back to all work" button at bottom
    await mPage.goto(`${BASE_URL}/work/rentflow`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(500);
    const mBackToWorkBtn = mPage.locator("a[href='/#work']:has-text('Back to all work'):visible").first();
    await mBackToWorkBtn.scrollIntoViewIfNeeded();
    await mPage.waitForTimeout(300);
    await mBackToWorkBtn.click();
    await mPage.waitForURL(/.*#work/);
    await mPage.waitForTimeout(1800);
    const mBackBtnPos = await mPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const mBackBtnSuccess = mBackBtnPos && mBackBtnPos.scrollY > 200 && Math.abs(mBackBtnPos.top) < 150;
    record(
      "Mobile: 'Back to all work' button navigates and scrolls to #work section",
      mBackBtnSuccess ? "FIXED" : "NOT FIXED",
      `scrollY=${mBackBtnPos?.scrollY}, sectionTop=${mBackBtnPos?.top}`
    );

    // 17. Mobile: Browser Back from case study returns to #work section
    await mPage.goto(`${BASE_URL}/#work`, { waitUntil: "networkidle" });
    await mPage.waitForTimeout(1200);
    const mRentflowCard = mPage.locator("a[href='/work/rentflow']").first();
    await mRentflowCard.click();
    await mPage.waitForURL(/.*\/work\/rentflow/);
    await mPage.waitForTimeout(1000);
    await mPage.goBack();
    await mPage.waitForTimeout(1800);
    const mBackUrl = mPage.url();
    const mBackHistoryPos = await mPage.evaluate(() => {
      const el = document.getElementById("work");
      return el ? { scrollY: window.scrollY, top: el.getBoundingClientRect().top } : null;
    });
    const mHistoryBackSuccess = mBackHistoryPos && mBackHistoryPos.scrollY > 200 && Math.abs(mBackHistoryPos.top) < 150;
    record(
      "Mobile: Browser Back returns to #work section of home page (not top)",
      mHistoryBackSuccess ? "FIXED" : "NOT FIXED",
      `URL=${mBackUrl}, scrollY=${mBackHistoryPos?.scrollY}, sectionTop=${mBackHistoryPos?.top}`
    );

    await mobileContext.close();

    console.log("\n=== TEST SUMMARY ===");
    console.table(testResults);
  } finally {
    await browser.close();
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
