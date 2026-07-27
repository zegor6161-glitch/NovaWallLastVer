import type { Plugin } from 'vite';

const COMPONENT_ID = '\0terenval:cws-disabled-component';
const MODULE_ID = '\0terenval:cws-disabled-module';

const disabledFeaturePaths = [
  '/ui/action/views/swap/',
  '/ui/onboard/hardware-wallet/',
];

export default function disabledFeatureStubPlugin(): Plugin {
  return {
    name: 'terenval:cws-disabled-feature-stub',
    enforce: 'pre',
    resolveId(source) {
      const normalized = source.replaceAll('\\', '/');
      if (!disabledFeaturePaths.some(path => normalized.includes(path))) {
        return null;
      }
      return normalized.includes('.vue') ? COMPONENT_ID : MODULE_ID;
    },
    load(id) {
      if (id === COMPONENT_ID) {
        return "export default { name: 'CwsDisabledFeature', render() { return null; } };";
      }
      if (id === MODULE_ID) {
        return 'export default {};';
      }
      return null;
    },
  };
}
