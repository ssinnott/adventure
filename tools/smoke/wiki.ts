// The smoke's wiki (wiki.html, src/app/wiki/): the page opened beside the game's, in the same browser
// and a context of its own, drawn with no page error, an entry to every people, class and monster the
// tables have, every portrait and every monster painted, a monster's idle played under the pointer and
// the finder narrowing the cards. The game's page is left as it was, so the parts after it go on.
import { CLASSES, RACES } from '../../src/game/party.ts';
import { MONSTERS } from '../../src/content/index.ts';
import type { Run } from './boot.ts';

export async function wiki({ page, ok }: Run): Promise<void> {
  const wiki = await page.context().browser()!.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  const errors: string[] = [];
  wiki.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  wiki.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await wiki.route('**/favicon.ico', (r) => r.fulfill({ status: 204 }));
  try {
    await wiki.goto(new URL('/wiki.html', page.url()).href, { waitUntil: 'load' });
    await wiki.waitForSelector('body[data-ready]', { timeout: 30000 });
    const seen = await wiki.evaluate(() => {
      const count = (sel: string): number => document.querySelectorAll(sel).length;
      // A picture is painted where some of its pixels are not see-through.
      const blank = Array.from(document.querySelectorAll<HTMLCanvasElement>('canvas[data-picture]')).filter((c) => {
        const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
        let n = 0;
        for (let i = 3; i < d.length; i += 4) if (d[i] > 0) n++;
        return n < c.width * c.height * 0.02;
      }).map((c) => c.closest('[data-monster]')?.getAttribute('data-monster') ?? c.title);
      return {
        races: count('[data-table="races"] tbody tr'), classes: count('article[data-class]'), pairings: count('[data-table="pairings"] figure'),
        monsters: count('[data-monster]'), pictures: count('canvas[data-picture]'), blank,
      };
    });
    const races = Object.keys(RACES).length, classes = Object.keys(CLASSES).length, monsters = Object.keys(MONSTERS).length;
    ok(seen.races === races && seen.classes === classes && seen.pairings === races * classes && seen.monsters === monsters,
      `the wiki holds the ${races} races, ${classes} classes, ${races * classes} pairings and ${monsters} monsters (${seen.races}, ${seen.classes}, ${seen.pairings}, ${seen.monsters})`);
    ok(seen.pictures > monsters + races * classes && !seen.blank.length, `the wiki's ${seen.pictures} pictures each paint${seen.blank.length ? '; blank: ' + seen.blank.join(', ') : ''}`);

    // The idle: a card under the pointer moves, and stills when it leaves.
    const first = Object.keys(MONSTERS).find((id) => MONSTERS[id].sprite === 'wolf') ?? Object.keys(MONSTERS)[0];
    const pixels = (): Promise<string> => wiki.evaluate((id) => document.querySelector<HTMLCanvasElement>(`[data-monster="${id}"] canvas`)!.toDataURL(), first);
    const still = await pixels();
    const picture = wiki.locator(`[data-monster="${first}"] canvas`);
    await picture.scrollIntoViewIfNeeded();
    await picture.hover();
    await wiki.waitForTimeout(400);
    const moving = await pixels();
    await wiki.mouse.move(0, 0);
    await wiki.waitForTimeout(100);
    ok(moving !== still && (await pixels()) === still, `a monster's card (${first}) plays its idle under the pointer and stills when it leaves`);

    // The finder: a name narrows the cards to those that hold it.
    await wiki.fill('input[type="search"]', 'rat');
    const shown = await wiki.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>('[data-monster]')).filter((c) => !c.hidden).map((c) => c.dataset.name!));
    ok(shown.length > 0 && shown.length < monsters && shown.every((n) => n.includes('rat')), `the finder narrows the cards to a name: ${shown.length} hold 'rat'`);
    ok(!errors.length, `the wiki draws with no page error${errors.length ? ': ' + errors.join(' | ') : ''}`);
  } finally {
    await wiki.close();
  }
}
