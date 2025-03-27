import { L as Lister, _ as _sfc_main$1 } from './ListerItem-DZfn1KfP.mjs';
import { h as __nuxt_component_7 } from './server.mjs';
import { mergeProps, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
import '../runtime.mjs';
import 'node:http';
import 'node:https';
import 'node:fs';
import 'node:path';
import 'node:url';
import 'ipx';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'class-variance-authority';
import 'lucide-vue-next';
import 'radix-vue';
import 'clsx';
import 'tailwind-merge';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_Lister = Lister;
  const _component_ListerItem = _sfc_main$1;
  const _component_NuxtPage = __nuxt_component_7;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "py-8 container mx-auto" }, _attrs))}><h1 class="font-semibold text-3xl border-b pb-3">Keywords management</h1><div class="mt-8 mx-auto grid grid-cols-4 gap-12"><div><div class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"> Section </div>`);
  _push(ssrRenderComponent(_component_Lister, { class: "mt-3" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_ListerItem, { to: "/keywords/facilities" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Facilities`);
            } else {
              return [
                createTextVNode("Facilities")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_ListerItem, { to: "/keywords/groups" }, {
          default: withCtx((_2, _push3, _parent3, _scopeId2) => {
            if (_push3) {
              _push3(`Keyword groups`);
            } else {
              return [
                createTextVNode("Keyword groups")
              ];
            }
          }),
          _: 1
        }, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_ListerItem, { to: "/keywords/facilities" }, {
            default: withCtx(() => [
              createTextVNode("Facilities")
            ]),
            _: 1
          }),
          createVNode(_component_ListerItem, { to: "/keywords/groups" }, {
            default: withCtx(() => [
              createTextVNode("Keyword groups")
            ]),
            _: 1
          })
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div><div class="col-span-3">`);
  _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
  _push(`</div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/keywords.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const keywords = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { keywords as default };
//# sourceMappingURL=keywords-DyA04rkd.mjs.map
