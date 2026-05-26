/* MacSentinel landing page — dynamically fetch latest GitHub Release */
(function () {
  'use strict';

  const REPO = 'cenxialiu7-cloud/MacSentinel';
  const RELEASES_PAGE = `https://github.com/${REPO}/releases/latest`;
  const API = `https://api.github.com/repos/${REPO}/releases/latest`;

  const els = {
    mac:    document.getElementById('dl-mac'),
    macSub: document.getElementById('dl-mac-sub'),
    note:   document.getElementById('version-note'),
  };

  // Safe default: every download link goes to the latest releases page,
  // works even if the API is rate-limited / offline.
  if (els.mac) els.mac.href = RELEASES_PAGE;

  fetch(API, { headers: { Accept: 'application/vnd.github+json' } })
    .then((r) => {
      if (!r.ok) throw new Error(`GitHub API ${r.status}`);
      return r.json();
    })
    .then((release) => {
      const version = release.tag_name || release.name || '';
      const assets  = release.assets || [];

      // Find the .dmg asset (MacSentinel ships a Universal DMG)
      const dmg = assets.find((a) => a.name.toLowerCase().endsWith('.dmg'));
      if (dmg && els.mac) {
        els.mac.href = dmg.browser_download_url;
        if (els.macSub) {
          const sizeMB = (dmg.size / (1024 * 1024)).toFixed(1);
          els.macSub.textContent = `Universal · ${sizeMB} MB`;
        }
      }

      if (els.note) {
        els.note.textContent = version
          ? `最新版本 Latest: ${version} · macOS 14.0 Sonoma+`
          : '';
      }
    })
    .catch(() => {
      // API failed (rate-limit / offline) — the safe default href is already set.
      if (els.note) {
        els.note.innerHTML = `前往 <a href="${RELEASES_PAGE}" rel="noopener">GitHub Releases</a> 取得最新版本`;
      }
    });
})();
