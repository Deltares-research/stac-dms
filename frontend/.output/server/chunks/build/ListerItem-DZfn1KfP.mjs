import { useSSRContext, mergeProps, defineComponent, withCtx, renderSlot } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import { _ as __nuxt_component_0 } from './server.mjs';

const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<ul${ssrRenderAttrs(mergeProps({ class: "flex flex-col gap-1.5 bg-gray-100 p-1.5 rounded h-fit" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</ul>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/lister/Lister.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const Lister = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ListerItem",
  __ssrInlineRender: true,
  props: {
    to: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<li${ssrRenderAttrs(mergeProps({ class: "w-full block" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: _ctx.to,
        "active-class": "bg-white shadow-sm",
        class: "rounded px-3 py-1.5 text-sm font-medium w-full block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default")
            ];
          }
        }),
        _: 3
      }, _parent));
      _push(`</li>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/lister/ListerItem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { Lister as L, _sfc_main as _ };
//# sourceMappingURL=ListerItem-DZfn1KfP.mjs.map
