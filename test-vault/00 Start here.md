# Backgammon XGID review vault

This vault is for checking the plugin by eye. Every entry has an **Expect:** line that says what
correct looks like. Read it, look at the board, and note anything that doesn't match.

## Setup

1. In the repo, run `npm run vault`. This builds the plugin and copies it into this vault.
2. In Obsidian: **Open another vault → Open folder as vault**, and pick the `test-vault` folder.
3. The first time, Obsidian may ask you to trust the vault / turn off Restricted mode so community
   plugins can run. The plugin is already enabled in this vault.
4. Use **Reading view** for review. Also check Live Preview, and on iPhone if you can.

After changing the code, run `npm run vault` again and reload Obsidian (Ctrl/Cmd+R).

## Notes

- [[01 Board positions]]: checkers, bar, bear-off, stacks, whose turn
- [[02 Cube and match]]: doubling cube, Crawford, match scores
- [[03 Move analysis]]: XG move analysis below the board
- [[04 Cube analysis]]: XG cube analysis below the board
- [[05 Invalid input]]: bad input should show the red error box, not a broken board
- [[06 Dark theme]]: switch Obsidian between light and dark; boards should follow
- [[10 Regressions]]: one entry per bug we've fixed, so it stays fixed
- [[Inbox]]: drop new problem positions here (not checked by `npm test`)

Entries marked **Known bug** describe the *correct* behaviour; they will look wrong until the bug
in `docs/BACKLOG.md` is fixed.

## Conventions

- Black (X) is the bottom player and moves toward the bottom-right home board (points 1–6).
- White (O) is the top player.
- The same notes are run by `npm test` (`tests/vault.test.ts`): every block must render without an
  error (or *with* one, in [[05 Invalid input]]), and every block needs an **Expect:** line.
