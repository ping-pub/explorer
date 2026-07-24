// @ping-pub/widget bundles its own Tailwind + daisyUI build and injects it into
// the document at runtime. That stylesheet re-declares [data-theme=light] and
// [data-theme=dark], and because it lands after the app's stylesheet it wins on
// equal specificity - so a project that customises `daisyui.themes` silently
// gets the widget's values back in the browser.
//
// This duplicates each daisyUI theme rule with an `html` prefix, raising it from
// specificity (0,1,0) to (0,1,1) so the app's own theme wins. Values are copied
// verbatim, so there is no visual change wherever the two already agree. The
// original rule is kept, which preserves daisyUI's element-level theming
// (`<div data-theme="...">`).
const raiseThemeSpecificity = () => ({
  postcssPlugin: 'raise-theme-specificity',
  OnceExit(root) {
    const clones = [];
    root.walkRules((rule) => {
      if (rule.__themeSpecificityRaised) return;
      const targets = rule.selectors.filter((s) => /^\[data-theme=/.test(s.trim()));
      if (!targets.length) return;
      const clone = rule.clone({ selectors: targets.map((s) => `html${s.trim()}`) });
      clone.__themeSpecificityRaised = true;
      clones.push([rule, clone]);
    });
    clones.forEach(([rule, clone]) => rule.after(clone));
  },
});
raiseThemeSpecificity.postcss = true;

module.exports = {
  plugins: [require('tailwindcss'), raiseThemeSpecificity(), require('autoprefixer')],
};
