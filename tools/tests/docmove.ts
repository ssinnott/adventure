// The move's proof (tools/kit/docmove.ts, #1011) held to a fixture: a small doc moved whole into three
// files passes, and the same move with a line dropped, a line reworded, a line kept once that stood
// twice and a paragraph split or reordered each fails, by the old line's number.
import { atRef, kept, move, paragraphs, report, type Doc } from '../kit/docmove.ts';
import { ok } from './lib.ts';

/** The fixture: a doc of the area docs' kind, a heading, prose, a list, a table, a rule and a line that stands twice. */
const OLD: Doc = { path: 'old.md', text: [
  '# The Place: a fixture', '', 'It is a place. This line', 'goes on here.', '', '---', '',
  '## 1. Where it is', '', '- **North:** the rim,', '  about nine squares.', '- **South:** the sea.', '',
  '## 4. What is still to build', '', '| Box | Band |', '|---|---|', '| F2 | 2–3 |', '', 'Built.', '',
  '## 9. Decisions', '', '1. **One.** Built.', '', '```', 'a fence', '', 'kept whole', '```', '',
].join('\n') };

/** The move: the state keeps the title and §1; decisions takes §9; the plan takes §4 and, under its heading, the prose. */
const state = (...over: string[]): Doc => ({ path: 'state.md', text: (over.length ? over : [
  '# The Place: a fixture', '', '§4 is in plan.md, §9 in decisions.md.', '', '## 1. Where it is', '',
  '- **North:** the rim,', '  about nine squares.', '- **South:** the sea.', '',
]).join('\n') });
const decisions: Doc = { path: 'decisions.md', text: ['# Decisions', '', '## 9. Decisions', '', '1. **One.** Built.', '', '```', 'a fence', '', 'kept whole', '```', ''].join('\n') };
const plan = (...over: string[]): Doc => ({ path: 'plan.md', text: (over.length ? over : [
  '# Plan', '', '## 4. What is still to build', '', '| Box | Band |', '|---|---|', '| F2 | 2–3 |', '', 'Built.', '',
  '## Moved from the state', '', 'It is a place. This line', 'goes on here.', '',
]).join('\n') });

export function docmove(): void {
  const whole = move(OLD, [state(), decisions, plan()]);
  ok(kept(whole) && whole.lines === 18 && whole.paragraphs === 13 && whole.missing.length === 0,
    `a doc moved whole is kept: ${whole.lines} lines and ${whole.paragraphs} paragraphs found, the rule left out, the fence one paragraph`);
  ok(whole.held.get('state.md') === 5 && whole.held.get('decisions.md') === 6 && whole.held.get('plan.md') === 7,
    'each new file is counted the old lines it holds (5, 6 and 7)');
  ok(whole.added.map((l) => `${l.path}:${l.n}`).join() === 'state.md:3,decisions.md:1,plan.md:1,plan.md:11',
    'the lines the new files add are listed, each by its file and line: the index, two titles and a heading');

  // A line dropped: the plan without the table's last row.
  const dropped = move(OLD, [state(), decisions, plan('# Plan', '', '## 4. What is still to build', '', '| Box | Band |', '|---|---|', '', 'Built.', '', '## Moved from the state', '', 'It is a place. This line', 'goes on here.')]);
  ok(!kept(dropped) && dropped.missing.map((l) => l.n).join() === '18' && dropped.broken.map((l) => l.n).join() === '18',
    'a line dropped fails, the line named by its old number (18), and its paragraph with it');
  ok(report(dropped, 'base').includes('Missing, 1:\n  old.md:18  | F2 | 2–3 |'), 'the report names the missing line with its old file and number');

  // A line reworded: missing as it was, added as it is.
  const reworded = move(OLD, [state(), decisions, plan('# Plan', '', '## 4. What is still to build', '', '| Box | Band |', '|---|---|', '| F2 | 2–3 |', '', 'Built at last.', '', '## Moved from the state', '', 'It is a place. This line', 'goes on here.')]);
  ok(!kept(reworded) && reworded.missing.map((l) => l.n).join() === '20' && reworded.added.some((l) => l.text === 'Built at last.'),
    'a line reworded fails: the old words are missing and the new are added');

  // A line that stood twice ('Built.' in §4 and §9's '1. **One.** Built.' are not the same line; this one is).
  const twice: Doc = { path: 'old.md', text: 'A.\n\nB.\n\nA.\n' };
  const once = move(twice, [{ path: 'new.md', text: 'A.\n\nB.\n' }]);
  ok(!kept(once) && once.missing.map((l) => l.n).join() === '5', 'a line that stood twice is looked for twice: kept once, its second is missing');
  const copied = move({ path: 'old.md', text: 'A.\n\nB.\n' }, [{ path: 'new.md', text: 'A.\n\nB.\n\nA.\n' }]);
  ok(kept(copied) && report(copied, 'base').includes('  new.md:5  A.  (old line 1 again)'), 'a line the new files add that is an old line again is marked with its old number');

  // A paragraph split across files, and one with its lines reordered: every line found, the paragraph not whole.
  const split = move(OLD, [state(), decisions, plan('# Plan', '', '## 4. What is still to build', '', '| Box | Band |', '|---|---|', '| F2 | 2–3 |', '', 'Built.', '', '## Moved from the state', '', 'goes on here.', 'It is a place. This line')]);
  ok(!kept(split) && !split.missing.length && split.broken.map((l) => l.n).join() === '3',
    'a paragraph whose lines are all found but out of order fails, named by its first line (3)');
  const item = paragraphs(OLD).find((p) => p[0].text.startsWith('- **North'));
  ok(item?.length === 2 && paragraphs(OLD).filter((p) => p[0].text.startsWith('|')).length === 3,
    'a list item is a paragraph with its own lines, and each table row one of its own');

  // Two paragraphs of one section swapped, and one split by a blank line: every line is found and
  // every paragraph's lines stand together, yet neither move is kept.
  const swapped = move(OLD, [state('# The Place: a fixture', '', '§4 is in plan.md, §9 in decisions.md.', '', '## 1. Where it is', '',
    '- **South:** the sea.', '- **North:** the rim,', '  about nine squares.', ''), decisions, plan()]);
  ok(!kept(swapped) && !swapped.missing.length && !swapped.broken.length && swapped.unordered.map((l) => l.n).join() === '12',
    'two paragraphs of one section swapped fail, the one now first named by its old number (12)');
  const parted = move(OLD, [state(), decisions, plan('# Plan', '', '## 4. What is still to build', '', '| Box | Band |', '|---|---|', '| F2 | 2–3 |', '', 'Built.', '', '## Moved from the state', '', 'It is a place. This line', '', 'goes on here.')]);
  ok(!kept(parted) && !parted.missing.length && parted.broken.map((l) => l.n).join() === '3',
    'a paragraph split by a blank line fails, named by its first line (3)');

  // The git read: a ref that is not there is a fault in git's words.
  let said = '';
  try { atRef('no-such-ref-for-docmove', 'README.md'); } catch (e) { said = String(e); }
  ok(said.includes('git show no-such-ref-for-docmove:README.md failed'), 'a file at a ref git cannot read is a fault that says so');
}
