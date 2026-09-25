// The two lead paths both end in a wa.me link, so the numbers and the message
// must be right. External navigation is blocked; the link is read, never opened.

export default async function order({ base, browser, ok }) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.route(/wa\.me/, (route) => route.abort());
  await page.addInitScript(() => {
    window.__opened = [];
    window.open = (url) => {
      window.__opened.push(String(url));
      return null;
    };
  });
  await page.goto(base, { waitUntil: "networkidle" });

  const total = () => page.locator("#build p.text-4xl").innerText();
  ok("build total starts at the base price", (await total()) === "$4", await total());

  await page
    .locator("#menu article")
    .filter({ has: page.getByRole("heading", { name: "THE ESPRESSO", exact: true }) })
    .getByRole("button", { name: "+ ADD TO ORDER" }).click();
  await page.waitForTimeout(1800);
  ok("menu hands the drink to the build panel", (await page.locator("#build").getByText("SELECTED DRINK").count()) === 1);
  ok("total switches to the drink's price", (await total()) === "$3", await total());

  await page.locator("#build button", { hasText: "LARGE CUP" }).click();
  await page.locator("#build button", { hasText: "EXTRA SHOT" }).click();
  await page.waitForTimeout(1200);
  ok("large cup and extra shot add up", (await total()) === "$6", await total());

  const href = decodeURIComponent(await page.locator("#build a[href*='wa.me']").getAttribute("href"));
  ok("order message lists the drink, extra and total", /THE ESPRESSO/.test(href) && /EXTRA SHOT/.test(href) && /Total: \$6/.test(href));

  const submit = page.locator("#visit button[type=submit]");
  ok("booking stays disabled until complete", await submit.isDisabled());
  await page.locator("#visit button[aria-label='Next month']").click();
  await page.locator("#visit button[aria-label^='15 ']").click();
  await page.locator("#visit button", { hasText: "18:30" }).click();
  await page.locator("#visit-name").fill("Test Guest");
  await page.locator("#visit-phone").fill("0300 0000000");
  await submit.click();
  const opened = await page.evaluate(() => window.__opened.map(decodeURIComponent));
  ok(
    "booking opens one WhatsApp message with every detail",
    opened.length === 1 && /Test Guest/.test(opened[0]) && /18:30/.test(opened[0]) && /Guests: 2/.test(opened[0]),
    opened[0]?.slice(0, 80),
  );
  ok("confirmation screen shows", (await page.getByText("YOUR MESSAGE IS READY").count()) === 1);
  await context.close();
}
