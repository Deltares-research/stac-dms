import { useForm, Field } from "vee-validate";
import { _ as _sfc_main$7, b as _sfc_main$9, a as _sfc_main$a, c as _sfc_main$b } from "./FormMessage-DwFGFzr-.js";
import { _ as _sfc_main$8 } from "./Input-BDNolIqX.js";
import { u as useNuxtApp, t as toast, n as navigateTo, a as _sfc_main$6, c as useRoute, d as useApi } from "../server.mjs";
import { defineComponent, withCtx, unref, createVNode, useSSRContext, mergeProps, withAsyncContext, computed, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { Trash2, X, CheckIcon } from "lucide-vue-next";
import "./Label-B22JNgLO.js";
import "radix-vue";
import "@vueuse/core";
import "ofetch";
import "#internal/nuxt/paths";
import "hookable";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "radix3";
import "defu";
import "ufo";
import "class-variance-authority";
import "ohash";
import "destr";
import "klona";
import "clsx";
import "tailwind-merge";
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "DeleteKeywordGroup",
  __ssrInlineRender: true,
  props: {
    keywordgroup_id: {}
  },
  setup(__props) {
    let { $api } = useNuxtApp();
    let deleteForm = useForm();
    deleteForm.handleSubmit(async () => {
      await $api(`/keywordgroup/{keywordgroup_id}`, {
        method: "delete",
        path: {
          keywordgroup_id: __props.keywordgroup_id
        }
      });
      toast({
        title: "Keywordgroup deleted"
      });
      await navigateTo("/keywords/groups");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$6;
      _push(`<form${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_Button, {
        variant: "outline",
        size: "icon",
        type: "submit",
        class: "w-8 h-8"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Trash2), { class: "w-4 h-4" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Trash2), { class: "w-4 h-4" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/DeleteKeywordGroup.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "DeleteKeyword",
  __ssrInlineRender: true,
  props: {
    keyword: {},
    onDelete: { type: Function }
  },
  setup(__props) {
    let { $api } = useNuxtApp();
    let deleteForm = useForm();
    deleteForm.handleSubmit(async () => {
      var _a;
      await $api("/keyword/{keyword_id}", {
        method: "delete",
        path: {
          keyword_id: __props.keyword.id
        }
      });
      toast({
        title: "Keyword deleted"
      });
      (_a = __props.onDelete) == null ? void 0 : _a.call(__props);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$6;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "opacity-0 group-hover:opacity-100" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_Button, {
        variant: "destructive",
        size: "icon",
        type: "submit",
        class: "w-8 h-8"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(X), { class: "w-4 h-4" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/DeleteKeyword.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "UpdateKeyword",
  __ssrInlineRender: true,
  props: {
    keyword: {},
    onUpdate: { type: Function }
  },
  setup(__props) {
    let { $api } = useNuxtApp();
    let updateSchema = toTypedSchema(
      z.object({
        nl_keyword: z.string().min(2)
      })
    );
    let form = useForm({
      validationSchema: updateSchema,
      initialValues: {
        nl_keyword: __props.keyword.nl_keyword ?? void 0
      }
    });
    form.handleSubmit(async (values) => {
      var _a;
      await $api(`/keyword/{keyword_id}`, {
        method: "put",
        body: values,
        path: {
          keyword_id: __props.keyword.id
        }
      });
      toast({
        title: "Keyword updated"
      });
      (_a = __props.onUpdate) == null ? void 0 : _a.call(__props);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormField = Field;
      const _component_FormItem = _sfc_main$7;
      const _component_Input = _sfc_main$8;
      const _component_Button = _sfc_main$6;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1.5 w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_FormField, { name: "nl_keyword" }, {
        default: withCtx(({ componentField }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_FormItem, { class: "w-full" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Input, mergeProps(componentField, { class: "border-0 -ml-3 h-8 !ring-0 rounded-none outline-none" }), null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Input, mergeProps(componentField, { class: "border-0 -ml-3 h-8 !ring-0 rounded-none outline-none" }), null, 16)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_FormItem, { class: "w-full" }, {
                default: withCtx(() => [
                  createVNode(_component_Input, mergeProps(componentField, { class: "border-0 -ml-3 h-8 !ring-0 rounded-none outline-none" }), null, 16)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(form).isFieldDirty("nl_keyword")) {
        _push(ssrRenderComponent(_component_Button, {
          type: "submit",
          variant: "outline",
          size: "icon",
          class: "flex-shrink-0 w-8 h-8"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-4 h-4 text-emerald-500" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(CheckIcon), { class: "w-4 h-4 text-emerald-500" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/UpdateKeyword.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Keyword",
  __ssrInlineRender: true,
  props: {
    keyword: {},
    onDelete: { type: Function },
    onUpdate: { type: Function }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1.5 group" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        keyword: _ctx.keyword,
        onUpdate: _ctx.onUpdate
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$4, {
        keyword: _ctx.keyword,
        onDelete: _ctx.onDelete
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/Keyword.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UpdateKeywordGroup",
  __ssrInlineRender: true,
  props: {
    group: {},
    onUpdate: { type: Function }
  },
  setup(__props) {
    let { $api } = useNuxtApp();
    let updateSchema = toTypedSchema(
      z.object({
        group_name_nl: z.string().min(2)
      })
    );
    let form = useForm({
      validationSchema: updateSchema,
      initialValues: {
        group_name_nl: __props.group.group_name_nl ?? void 0
      }
    });
    form.handleSubmit(async (values) => {
      var _a;
      await $api(`/keywordgroup/{keywordgroup_id}`, {
        method: "put",
        body: values,
        path: {
          keywordgroup_id: __props.group.id
        }
      });
      toast({
        title: "Keyword group updated"
      });
      (_a = __props.onUpdate) == null ? void 0 : _a.call(__props);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormField = Field;
      const _component_FormItem = _sfc_main$7;
      const _component_Input = _sfc_main$8;
      const _component_Button = _sfc_main$6;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1.5 w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_FormField, { name: "group_name_nl" }, {
        default: withCtx(({ componentField }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_FormItem, { class: "w-full" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Input, mergeProps(componentField, { class: "border-0 -ml-3 h-8 !ring-0 rounded-none outline-none text-2xl font-bold" }), null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Input, mergeProps(componentField, { class: "border-0 -ml-3 h-8 !ring-0 rounded-none outline-none text-2xl font-bold" }), null, 16)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_FormItem, { class: "w-full" }, {
                default: withCtx(() => [
                  createVNode(_component_Input, mergeProps(componentField, { class: "border-0 -ml-3 h-8 !ring-0 rounded-none outline-none text-2xl font-bold" }), null, 16)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(form).isFieldDirty("group_name_nl")) {
        _push(ssrRenderComponent(_component_Button, {
          type: "submit",
          variant: "outline",
          size: "icon",
          class: "flex-shrink-0 w-8 h-8"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(CheckIcon), { class: "w-4 h-4 text-emerald-500" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(CheckIcon), { class: "w-4 h-4 text-emerald-500" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/UpdateKeywordGroup.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[group_id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    let route = useRoute();
    let { $api } = useNuxtApp();
    let { data, refresh } = ([__temp, __restore] = withAsyncContext(() => useApi("/keywords", {
      query: {
        keyword_group_id: route.params.group_id
      }
    }, "$zJE1s1Ojuk")), __temp = await __temp, __restore(), __temp);
    let keywordsgroup = computed(() => {
      var _a;
      return (_a = data.value) == null ? void 0 : _a[0];
    });
    let createKeywordFormSchema = toTypedSchema(
      z.object({
        nl_keyword: z.string().min(2),
        en_keyword: z.string().min(2),
        external_id: z.string().min(2).optional()
      })
    );
    let createKeywordForm = useForm({
      validationSchema: createKeywordFormSchema
    });
    createKeywordForm.handleSubmit(
      async (values) => {
        await $api("/keyword", {
          method: "post",
          body: {
            ...values,
            group_id: route.params.group_id
          }
        });
        toast({
          title: "Keyword created"
        });
        await refresh();
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_FormField = Field;
      const _component_FormItem = _sfc_main$7;
      const _component_FormLabel = _sfc_main$9;
      const _component_FormControl = _sfc_main$a;
      const _component_Input = _sfc_main$8;
      const _component_FormMessage = _sfc_main$b;
      const _component_Button = _sfc_main$6;
      if (unref(keywordsgroup)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"> Keyword Group </div><div class="mt-3 flex items-center justify-between mb-4 gap-1.5">`);
        _push(ssrRenderComponent(_sfc_main$1, { group: unref(keywordsgroup) }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$5, {
          keywordgroup_id: unref(keywordsgroup).id
        }, null, _parent));
        _push(`</div><ul class="flex flex-col"><!--[-->`);
        ssrRenderList((_a = unref(keywordsgroup)) == null ? void 0 : _a.keywords, (keyword) => {
          _push(`<li class="border-b last:border-0 py-1.5">`);
          _push(ssrRenderComponent(_sfc_main$2, {
            keyword,
            onDelete: unref(refresh),
            onUpdate: unref(refresh)
          }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul><hr class="my-8"><h2 class="font-medium mb-4">Create keyword</h2><form>`);
        _push(ssrRenderComponent(_component_FormField, { name: "nl_keyword" }, {
          default: withCtx(({ componentField }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_FormItem, null, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_FormLabel, null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Keyword NL`);
                        } else {
                          return [
                            createTextVNode("Keyword NL")
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
                          createTextVNode("Keyword NL")
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
                        createTextVNode("Keyword NL")
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
        _push(ssrRenderComponent(_component_FormField, { name: "en_keyword" }, {
          default: withCtx(({ componentField }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_FormItem, null, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_FormLabel, null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Keyword EN`);
                        } else {
                          return [
                            createTextVNode("Keyword EN")
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
                          createTextVNode("Keyword EN")
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
                        createTextVNode("Keyword EN")
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
        _push(ssrRenderComponent(_component_Button, {
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
        _push(`</form></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/keywords/groups/[group_id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_group_id_-Bpld7hLP.js.map
