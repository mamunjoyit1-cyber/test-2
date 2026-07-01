/**
 * apply_i18n_patch.js
 * -----------------------------------------------------------------
 * Fills in the missing translation keys for languages that were only
 * partially translated in the Lago Bin menu i18n object:
 * tr, bg, sk, hr, sr, sl, ar, zh-CN, ja, ko, hi, bn, ur, fa.
 *
 * These languages already had some keys (tabs, buttons, sauces, etc.)
 * — this patch adds everything that was missing (package descriptions,
 * course/turno labels, wine-list strings, and the full 38-item
 * "dishes" glossary) without touching keys that already existed and
 * worked, EXCEPT it fully overwrites the "dishes" object for these
 * languages since it was previously absent or empty.
 *
 * USAGE (in lago_bin_menu_v2.html, right after your existing
 * `const translations = {...}` or `const i18n = {...}` block):
 *
 *   <script src="i18n_patch.json.js"></script>   // defines window.I18N_PATCH
 *   <script src="apply_i18n_patch.js"></script>
 *   <script>
 *     translations = applyI18nPatch(translations, window.I18N_PATCH);
 *   </script>
 *
 * Or, if you prefer to inline the patch directly, just paste the
 * contents of i18n_patch.json where `PATCH` is defined below and
 * drop the <script src="i18n_patch.json.js"> line.
 * -----------------------------------------------------------------
 */
function deepMerge(target, source) {
  const out = Object.assign({}, target);
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key]) &&
      target[key] &&
      typeof target[key] === "object" &&
      !Array.isArray(target[key])
    ) {
      out[key] = deepMerge(target[key], source[key]);
    } else {
      // primitives, arrays (e.g. "turno"), or keys the target didn't have
      out[key] = source[key];
    }
  }
  return out;
}

function applyI18nPatch(translations, patch) {
  const result = Object.assign({}, translations);
  for (const lang of Object.keys(patch)) {
    result[lang] = deepMerge(result[lang] || {}, patch[lang]);
  }
  return result;
}

// If loaded directly in a browser, expose globally.
if (typeof window !== "undefined") {
  window.deepMerge = deepMerge;
  window.applyI18nPatch = applyI18nPatch;
}
// If used in Node/build tooling.
if (typeof module !== "undefined") {
  module.exports = { deepMerge, applyI18nPatch };
}
