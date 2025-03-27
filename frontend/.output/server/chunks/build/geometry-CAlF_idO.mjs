import { _ as __nuxt_component_10 } from './client-only-D4CG9A2g.mjs';
import { defineComponent, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "geometry",
  __ssrInlineRender: true,
  setup(__props) {
    let value = ref({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-2629065199942168e-9, 5294768771676265e-9],
                [5317816899121739e-9, 5351088490832003e-9],
                [5317816899121739e-9, -834604.6000602674],
                [-6897722107977686e-9, -1.0761536177726556e6],
                [-2629065199942168e-9, 5294768771676265e-9]
              ]
            ]
          },
          properties: null
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-11455697705430442e-9, 6953071613484104e-9]
          },
          properties: null
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [948783025153137e-8, 4.5611820805778755e6]
          },
          properties: null
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`<pre class="mt-12">${ssrInterpolate(JSON.stringify(unref(value), null, 2))}</pre></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/geometry.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=geometry-CAlF_idO.mjs.map
