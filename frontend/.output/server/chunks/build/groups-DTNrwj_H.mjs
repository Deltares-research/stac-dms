import { L as Lister, _ as _sfc_main$1 } from './ListerItem-DZfn1KfP.mjs';
import { useForm, Field } from 'vee-validate';
import { _ as _sfc_main$3$1, b as _sfc_main$2, a as _sfc_main$1$1, c as _sfc_main$5 } from './FormMessage-DwFGFzr-.mjs';
import { _ as _sfc_main$4 } from './Input-BDNolIqX.mjs';
import { u as useNuxtApp, d as useApi, t as toast, a as _sfc_main$3, h as __nuxt_component_7 } from './server.mjs';
import { defineComponent, withAsyncContext, mergeProps, withCtx, unref, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { onBeforeRouteUpdate } from 'vue-router';
import './_plugin-vue_export-helper-1tPrXgE0.mjs';
import './Label-B22JNgLO.mjs';
import 'radix-vue';
import '@vueuse/core';
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
import 'class-variance-authority';
import 'lucide-vue-next';
import 'clsx';
import 'tailwind-merge';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "groups",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    let { $api } = useNuxtApp();
    let { data: keywordgroups, refresh } = ([__temp, __restore] = withAsyncContext(() => useApi("/keywordgroups", "$9XJJxAJl5X")), __temp = await __temp, __restore(), __temp);
    let createKeywordgroupFormSchema = toTypedSchema(
      z.object({
        group_name_nl: z.string().min(2),
        group_name_en: z.string().min(2)
      })
    );
    let createKeywordgroupForm = useForm({
      validationSchema: createKeywordgroupFormSchema
    });
    createKeywordgroupForm.handleSubmit(
      async (values) => {
        await $api("/keywordgroup", {
          method: "post",
          body: values,
          headers: {
            "Content-Type": "application/json"
          }
        });
        toast({
          title: "Keyword group created"
        });
        refresh();
      }
    );
    onBeforeRouteUpdate((guard) => {
      if (!guard.params.group_id) {
        refresh();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ListerItem = _sfc_main$1;
      const _component_FormField = Field;
      const _component_FormItem = _sfc_main$3$1;
      const _component_FormLabel = _sfc_main$2;
      const _component_FormControl = _sfc_main$1$1;
      const _component_Input = _sfc_main$4;
      const _component_FormMessage = _sfc_main$5;
      const _component_NuxtPage = __nuxt_component_7;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-2 gap-12" }, _attrs))}><div><div class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"> Keyword Groups </div><div class="mt-3">`);
      _push(ssrRenderComponent(Lister, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<!--[-->`);
            ssrRenderList(unref(keywordgroups), (keywordgroup) => {
              _push2(ssrRenderComponent(_component_ListerItem, {
                key: keywordgroup.id,
                to: `/keywords/groups/${keywordgroup.id}`
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(keywordgroup.group_name_nl)}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(keywordgroup.group_name_nl), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]-->`);
          } else {
            return [
              (openBlock(true), createBlock(Fragment, null, renderList(unref(keywordgroups), (keywordgroup) => {
                return openBlock(), createBlock(_component_ListerItem, {
                  key: keywordgroup.id,
                  to: `/keywords/groups/${keywordgroup.id}`
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(keywordgroup.group_name_nl), 1)
                  ]),
                  _: 2
                }, 1032, ["to"]);
              }), 128))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<hr class="my-8"><h2 class="text font-medium">Create keyword group</h2><form class="mt-3">`);
      _push(ssrRenderComponent(_component_FormField, { name: "group_name_nl" }, {
        default: withCtx(({ componentField }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_FormItem, null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_FormLabel, null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Group name NL`);
                      } else {
                        return [
                          createTextVNode("Group name NL")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormControl, null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Input, mergeProps({ type: "text" }, componentField), null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_Input, mergeProps({ type: "text" }, componentField), null, 16)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormMessage, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_FormLabel, null, {
                      default: withCtx(() => [
                        createTextVNode("Group name NL")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_FormControl, null, {
                      default: withCtx(() => [
                        createVNode(_component_Input, mergeProps({ type: "text" }, componentField), null, 16)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_component_FormMessage)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_FormItem, null, {
                default: withCtx(() => [
                  createVNode(_component_FormLabel, null, {
                    default: withCtx(() => [
                      createTextVNode("Group name NL")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_FormControl, null, {
                    default: withCtx(() => [
                      createVNode(_component_Input, mergeProps({ type: "text" }, componentField), null, 16)
                    ]),
                    _: 2
                  }, 1024),
                  createVNode(_component_FormMessage)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_FormField, { name: "group_name_en" }, {
        default: withCtx(({ componentField }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_FormItem, null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_FormLabel, null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Group name EN`);
                      } else {
                        return [
                          createTextVNode("Group name EN")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormControl, null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Input, mergeProps({ type: "text" }, componentField), null, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_Input, mergeProps({ type: "text" }, componentField), null, 16)
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_FormMessage, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_FormLabel, null, {
                      default: withCtx(() => [
                        createTextVNode("Group name EN")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_FormControl, null, {
                      default: withCtx(() => [
                        createVNode(_component_Input, mergeProps({ type: "text" }, componentField), null, 16)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(_component_FormMessage)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_FormItem, null, {
                default: withCtx(() => [
                  createVNode(_component_FormLabel, null, {
                    default: withCtx(() => [
                      createTextVNode("Group name EN")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_FormControl, null, {
                    default: withCtx(() => [
                      createVNode(_component_Input, mergeProps({ type: "text" }, componentField), null, 16)
                    ]),
                    _: 2
                  }, 1024),
                  createVNode(_component_FormMessage)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(_sfc_main$3), {
        type: "submit",
        class: "mt-5"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Create`);
          } else {
            return [
              createTextVNode("Create")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form></div></div><div>`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/keywords/groups.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=groups-DTNrwj_H.mjs.map
