import fs from "fs";
import path from "path";

function checkFile(relPath) {
  console.log(`\n=== Checking: ${relPath} ===`);
  const fullPath = path.join(process.cwd(), "out", relPath);
  const html = fs.readFileSync(fullPath, "utf8");

  // Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1] : null;
  console.log(`Title (${title ? title.length : 0} chars): ${title}`);

  // Meta description
  const descMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const desc = descMatch ? descMatch[1] : null;
  console.log(`Meta description (${desc ? desc.length : 0} chars): ${desc}`);

  // Canonical
  const canonMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
  console.log(`Canonical: ${canonMatch ? canonMatch[1] : "MISSING"}`);

  // OG tags
  const ogTitle = html.match(/<meta property="og:title" content="([^"]+)"/);
  const ogDesc = html.match(/<meta property="og:description" content="([^"]+)"/);
  const ogUrl = html.match(/<meta property="og:url" content="([^"]+)"/);
  const ogImage = html.match(/<meta property="og:image" content="([^"]+)"/);
  console.log(`OG title: ${ogTitle ? ogTitle[1] : "MISSING"}`);
  console.log(`OG description: ${ogDesc ? ogDesc[1] : "MISSING"}`);
  console.log(`OG url: ${ogUrl ? ogUrl[1] : "MISSING"}`);
  console.log(`OG image: ${ogImage ? ogImage[1] : "MISSING"}`);

  // Twitter tags
  const twCard = html.match(/<meta name="twitter:card" content="([^"]+)"/);
  const twImage = html.match(/<meta name="twitter:image" content="([^"]+)"/);
  console.log(`Twitter card: ${twCard ? twCard[1] : "MISSING"}`);
  console.log(`Twitter image: ${twImage ? twImage[1] : "MISSING"}`);

  // H1 tags
  const h1Matches = html.match(/<h1[^>]*>[\s\S]*?<\/h1>/gi) || [];
  console.log(`H1 count: ${h1Matches.length}`);
  h1Matches.forEach((h1, i) => {
    const text = h1.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    console.log(`  H1 #${i + 1}: ${text}`);
  });

  // JSON-LD
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi;
  let match;
  let jsonLdCount = 0;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    jsonLdCount++;
    try {
      const parsed = JSON.parse(match[1]);
      console.log(`JSON-LD #${jsonLdCount} [VALID JSON] @type: ${parsed["@type"] || (parsed["@graph"] ? "@graph" : "unknown")}`);
      console.log(`  Preview: ${JSON.stringify(parsed)}`);
    } catch (err) {
      console.error(`JSON-LD #${jsonLdCount} [INVALID JSON]:`, err.message);
    }
  }
  if (jsonLdCount === 0) console.log("JSON-LD: NONE FOUND");
}

checkFile("index.html");
checkFile("work/renewaldesk/index.html");
checkFile("work/rentflow/index.html");
checkFile("work/shefeer-portfolio/index.html");
checkFile("work/devverse/index.html");
checkFile("work/borrowbox/index.html");
