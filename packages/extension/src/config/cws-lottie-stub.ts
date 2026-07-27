import { defineComponent, h } from 'vue';

/**
 * CWS release replacement for vue3-lottie/lottie-web.
 * The original dependency contains dynamic-code fallbacks. Animations are
 * decorative, so the review build renders a static, accessible placeholder.
 */
export const Vue3Lottie = defineComponent({
  name: 'CwsStaticAnimation',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h('div', {
        ...attrs,
        role: attrs.role ?? 'presentation',
        'aria-hidden': attrs['aria-label'] ? undefined : 'true',
      });
  },
});

export default Vue3Lottie;
