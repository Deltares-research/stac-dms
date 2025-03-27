import { useSSRContext, defineComponent, withAsyncContext, unref, withCtx, createVNode, mergeProps, renderSlot, computed, createTextVNode, toDisplayString, openBlock, createBlock, Fragment, renderList } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { c as useRoute, d as useApi, u as useNuxtApp, t as toast, n as navigateTo, e as cn, a as _sfc_main$3$1 } from './server.mjs';
import { useForm, Field } from 'vee-validate';
import { Trash2, X, ChevronDown, Check, ChevronUp, CheckIcon } from 'lucide-vue-next';
import { _ as _sfc_main$3$2, b as _sfc_main$2$1, a as _sfc_main$1$1, c as _sfc_main$d } from './FormMessage-DwFGFzr-.mjs';
import { useForwardPropsEmits, SelectRoot, SelectValue, useForwardProps, SelectTrigger, SelectIcon, SelectPortal, SelectContent, SelectViewport, SelectGroup, SelectItem, SelectItemIndicator, SelectItemText, SelectScrollUpButton, SelectScrollDownButton } from 'radix-vue';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';
import { _ as _sfc_main$e } from './Input-BDNolIqX.mjs';
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
import 'clsx';
import 'tailwind-merge';
import './Label-B22JNgLO.mjs';
import '@vueuse/core';

const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "DeleteFacility",
  __ssrInlineRender: true,
  props: {
    facility_id: {}
  },
  setup(__props) {
    let { $api } = useNuxtApp();
    let deleteFacilityForm = useForm();
    deleteFacilityForm.handleSubmit(async () => {
      await $api(`/facility/{facility_id}`, {
        method: "delete",
        path: {
          facility_id: __props.facility_id
        }
      });
      toast({
        title: "Facility deleted"
      });
      await navigateTo("/keywords/facilities");
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$3$1;
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
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/DeleteFacility.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "FacilityGroupLink",
  __ssrInlineRender: true,
  props: {
    facility_id: {},
    onUnlink: { type: Function },
    group: {}
  },
  setup(__props) {
    let { $api } = useNuxtApp();
    let unlinkForm = useForm();
    unlinkForm.handleSubmit(async (values) => {
      await $api("/facility_keywordgroup_link", {
        method: "delete",
        body: {
          keyword_group_id: __props.group.id,
          facility_id: __props.facility_id
        }
      });
      toast({
        title: "Keyword group unlinked"
      });
      __props.onUnlink();
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$3$1;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "rounded bg-gray-100 flex items-center justify-between gap-3 px-4 py-0.5" }, _attrs))}>${ssrInterpolate(_ctx.group.group_name_nl)} `);
      _push(ssrRenderComponent(_component_Button, {
        variant: "link",
        size: "sm",
        type: "submit",
        class: "hover:text-red-500"
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/FacilityGroupLink.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "Select",
  __ssrInlineRender: true,
  props: {
    open: { type: Boolean },
    defaultOpen: { type: Boolean },
    defaultValue: {},
    modelValue: {},
    dir: {},
    name: {},
    autocomplete: {},
    disabled: { type: Boolean },
    required: { type: Boolean }
  },
  emits: ["update:modelValue", "update:open"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const forwarded = useForwardPropsEmits(props, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectRoot), mergeProps(unref(forwarded), _attrs), {
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
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/Select.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "SelectValue",
  __ssrInlineRender: true,
  props: {
    placeholder: {},
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectValue), mergeProps(props, _attrs), {
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
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectValue.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "SelectTrigger",
  __ssrInlineRender: true,
  props: {
    disabled: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectTrigger), mergeProps(unref(forwardedProps), {
        class: unref(cn)(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
            _push2(ssrRenderComponent(unref(SelectIcon), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 opacity-50" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(ChevronDown), { class: "w-4 h-4 opacity-50" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              renderSlot(_ctx.$slots, "default"),
              createVNode(unref(SelectIcon), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(ChevronDown), { class: "w-4 h-4 opacity-50" })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectTrigger.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  ...{
    inheritAttrs: false
  },
  __name: "SelectContent",
  __ssrInlineRender: true,
  props: {
    forceMount: { type: Boolean },
    position: { default: "popper" },
    bodyLock: { type: Boolean },
    side: {},
    sideOffset: {},
    align: {},
    alignOffset: {},
    avoidCollisions: { type: Boolean },
    collisionBoundary: {},
    collisionPadding: {},
    arrowPadding: {},
    sticky: {},
    hideWhenDetached: { type: Boolean },
    updatePositionStrategy: {},
    prioritizePosition: { type: Boolean },
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["closeAutoFocus", "escapeKeyDown", "pointerDownOutside"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectPortal), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(SelectContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
              class: unref(cn)(
                "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                _ctx.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                props.class
              )
            }), {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$4), null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(SelectViewport), {
                    class: unref(cn)("p-1", _ctx.position === "popper" && "h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]")
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        ssrRenderSlot(_ctx.$slots, "default", {}, null, _push4, _parent4, _scopeId3);
                      } else {
                        return [
                          renderSlot(_ctx.$slots, "default")
                        ];
                      }
                    }),
                    _: 3
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$3), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$4)),
                    createVNode(unref(SelectViewport), {
                      class: unref(cn)("p-1", _ctx.position === "popper" && "h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]")
                    }, {
                      default: withCtx(() => [
                        renderSlot(_ctx.$slots, "default")
                      ]),
                      _: 3
                    }, 8, ["class"]),
                    createVNode(unref(_sfc_main$3))
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(SelectContent), mergeProps({ ...unref(forwarded), ..._ctx.$attrs }, {
                class: unref(cn)(
                  "relative z-50 max-h-96 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                  _ctx.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
                  props.class
                )
              }), {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$4)),
                  createVNode(unref(SelectViewport), {
                    class: unref(cn)("p-1", _ctx.position === "popper" && "h-[--radix-select-trigger-height] w-full min-w-[--radix-select-trigger-width]")
                  }, {
                    default: withCtx(() => [
                      renderSlot(_ctx.$slots, "default")
                    ]),
                    _: 3
                  }, 8, ["class"]),
                  createVNode(unref(_sfc_main$3))
                ]),
                _: 3
              }, 16, ["class"])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectContent.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "SelectGroup",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectGroup), mergeProps({
        class: unref(cn)("p-1 w-full", props.class)
      }, delegatedProps.value, _attrs), {
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
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectGroup.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "SelectItem",
  __ssrInlineRender: true,
  props: {
    value: {},
    disabled: { type: Boolean },
    textValue: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectItem), mergeProps(unref(forwardedProps), {
        class: unref(cn)(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(SelectItemIndicator), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Check), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Check), { class: "h-4 w-4" })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</span>`);
            _push2(ssrRenderComponent(unref(SelectItemText), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default")
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode("span", { class: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center" }, [
                createVNode(unref(SelectItemIndicator), null, {
                  default: withCtx(() => [
                    createVNode(unref(Check), { class: "h-4 w-4" })
                  ]),
                  _: 1
                })
              ]),
              createVNode(unref(SelectItemText), null, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default")
                ]),
                _: 3
              })
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectItem.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "SelectScrollUpButton",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectScrollUpButton), mergeProps(unref(forwardedProps), {
        class: unref(cn)("flex cursor-default items-center justify-center py-1", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronUp), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronUp), { class: "h-4 w-4" })
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectScrollUpButton.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "SelectScrollDownButton",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwardedProps = useForwardProps(delegatedProps);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(SelectScrollDownButton), mergeProps(unref(forwardedProps), {
        class: unref(cn)("flex cursor-default items-center justify-center py-1", props.class)
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronDown), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronDown), { class: "h-4 w-4" })
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/select/SelectScrollDownButton.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "LinkKeywordGroup",
  __ssrInlineRender: true,
  props: {
    facility_id: {},
    onLink: { type: Function }
  },
  async setup(__props) {
    let __temp, __restore;
    let { data: allKeywordGroups } = ([__temp, __restore] = withAsyncContext(() => useApi("/keywordgroups", "$g0GRcBOKMh")), __temp = await __temp, __restore(), __temp);
    let { $api } = useNuxtApp();
    let linkGroupSchema = toTypedSchema(
      z.object({
        keyword_group_id: z.string()
      })
    );
    let linkGroupForm = useForm({
      validationSchema: linkGroupSchema
    });
    linkGroupForm.handleSubmit(async (values) => {
      var _a;
      await $api("/facility_keywordgroup_link", {
        method: "post",
        body: {
          ...values,
          facility_id: __props.facility_id
        }
      });
      toast({
        title: "Keyword group linked"
      });
      (_a = __props.onLink) == null ? void 0 : _a.call(__props);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormField = Field;
      const _component_FormItem = _sfc_main$3$2;
      const _component_FormLabel = _sfc_main$2$1;
      const _component_Select = _sfc_main$a;
      const _component_FormControl = _sfc_main$1$1;
      const _component_SelectTrigger = _sfc_main$8;
      const _component_SelectValue = _sfc_main$9;
      const _component_SelectContent = _sfc_main$7;
      const _component_SelectGroup = _sfc_main$6;
      const _component_SelectItem = _sfc_main$5;
      const _component_FormMessage = _sfc_main$d;
      const _component_Button = _sfc_main$3$1;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex items-end gap-1.5 w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_FormField, { name: "keyword_group_id" }, {
        default: withCtx(({ componentField }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_FormItem, { class: "w-full" }, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_FormLabel, null, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Link keyword group`);
                      } else {
                        return [
                          createTextVNode("Link keyword group")
                        ];
                      }
                    }),
                    _: 2
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Select, componentField, {
                    default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_FormControl, null, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_SelectTrigger, null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_SelectValue, { placeholder: "Select a keyword group" }, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_SelectValue, { placeholder: "Select a keyword group" })
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_SelectTrigger, null, {
                                  default: withCtx(() => [
                                    createVNode(_component_SelectValue, { placeholder: "Select a keyword group" })
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_SelectContent, null, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_SelectGroup, null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(unref(allKeywordGroups), (group) => {
                                      _push6(ssrRenderComponent(_component_SelectItem, {
                                        key: group.id,
                                        value: group.id
                                      }, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(group.group_name_nl)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(group.group_name_nl), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(unref(allKeywordGroups), (group) => {
                                        return openBlock(), createBlock(_component_SelectItem, {
                                          key: group.id,
                                          value: group.id
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(group.group_name_nl), 1)
                                          ]),
                                          _: 2
                                        }, 1032, ["value"]);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_SelectGroup, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(unref(allKeywordGroups), (group) => {
                                      return openBlock(), createBlock(_component_SelectItem, {
                                        key: group.id,
                                        value: group.id
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(group.group_name_nl), 1)
                                        ]),
                                        _: 2
                                      }, 1032, ["value"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_FormControl, null, {
                            default: withCtx(() => [
                              createVNode(_component_SelectTrigger, null, {
                                default: withCtx(() => [
                                  createVNode(_component_SelectValue, { placeholder: "Select a keyword group" })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }),
                          createVNode(_component_SelectContent, null, {
                            default: withCtx(() => [
                              createVNode(_component_SelectGroup, null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(unref(allKeywordGroups), (group) => {
                                    return openBlock(), createBlock(_component_SelectItem, {
                                      key: group.id,
                                      value: group.id
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(group.group_name_nl), 1)
                                      ]),
                                      _: 2
                                    }, 1032, ["value"]);
                                  }), 128))
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
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
                        createTextVNode("Link keyword group")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_Select, componentField, {
                      default: withCtx(() => [
                        createVNode(_component_FormControl, null, {
                          default: withCtx(() => [
                            createVNode(_component_SelectTrigger, null, {
                              default: withCtx(() => [
                                createVNode(_component_SelectValue, { placeholder: "Select a keyword group" })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }),
                        createVNode(_component_SelectContent, null, {
                          default: withCtx(() => [
                            createVNode(_component_SelectGroup, null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(allKeywordGroups), (group) => {
                                  return openBlock(), createBlock(_component_SelectItem, {
                                    key: group.id,
                                    value: group.id
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(group.group_name_nl), 1)
                                    ]),
                                    _: 2
                                  }, 1032, ["value"]);
                                }), 128))
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 2
                    }, 1040),
                    createVNode(_component_FormMessage)
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_FormItem, { class: "w-full" }, {
                default: withCtx(() => [
                  createVNode(_component_FormLabel, null, {
                    default: withCtx(() => [
                      createTextVNode("Link keyword group")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_Select, componentField, {
                    default: withCtx(() => [
                      createVNode(_component_FormControl, null, {
                        default: withCtx(() => [
                          createVNode(_component_SelectTrigger, null, {
                            default: withCtx(() => [
                              createVNode(_component_SelectValue, { placeholder: "Select a keyword group" })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(_component_SelectContent, null, {
                        default: withCtx(() => [
                          createVNode(_component_SelectGroup, null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(allKeywordGroups), (group) => {
                                return openBlock(), createBlock(_component_SelectItem, {
                                  key: group.id,
                                  value: group.id
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(group.group_name_nl), 1)
                                  ]),
                                  _: 2
                                }, 1032, ["value"]);
                              }), 128))
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 2
                  }, 1040),
                  createVNode(_component_FormMessage)
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_Button, { type: "submit" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Link`);
          } else {
            return [
              createTextVNode("Link")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/LinkKeywordGroup.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "UpdateFacility",
  __ssrInlineRender: true,
  props: {
    facility: {},
    onUpdate: { type: Function }
  },
  setup(__props) {
    var _a;
    let { $api } = useNuxtApp();
    let updateSchema = toTypedSchema(
      z.object({
        name: z.string().min(2)
      })
    );
    let form = useForm({
      validationSchema: updateSchema,
      initialValues: {
        name: (_a = __props.facility.name) != null ? _a : void 0
      }
    });
    form.handleSubmit(async (values) => {
      var _a3;
      var _a2;
      await $api(`/facility/{facility_id}`, {
        method: "put",
        body: values,
        path: {
          // TODO: Fix API spec to make id required
          facility_id: (_a3 = __props.facility.id) != null ? _a3 : ""
        }
      });
      toast({
        title: "Facility updated"
      });
      (_a2 = __props.onUpdate) == null ? void 0 : _a2.call(__props);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormField = Field;
      const _component_FormItem = _sfc_main$3$2;
      const _component_Input = _sfc_main$e;
      const _component_Button = _sfc_main$3$1;
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "flex items-center gap-1.5 w-full" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_FormField, { name: "name" }, {
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
      if (unref(form).isFieldDirty("name")) {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/UpdateFacility.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[facility_id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    let route = useRoute();
    let facility_id = route.params.facility_id;
    let { data: facility } = ([__temp, __restore] = withAsyncContext(() => useApi(`/facility/{facility_id}`, {
      path: {
        facility_id: route.params.facility_id
      }
    }, "$FREVjx8gWe")), __temp = await __temp, __restore(), __temp);
    let { data: keywordgroups, refresh } = ([__temp, __restore] = withAsyncContext(() => useApi("/keywords", {
      query: {
        facility_id: route.params.facility_id
      }
    }, "$QSZv7QaKSa")), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      if (unref(facility)) {
        _push(`<div${ssrRenderAttrs(_attrs)}><div class="uppercase text-muted-foreground text-xs font-semibold tracking-wider"> Facility </div><div class="mt-3 flex items-center justify-between gap-1.5">`);
        _push(ssrRenderComponent(_sfc_main$1, { facility: unref(facility) }, null, _parent));
        _push(ssrRenderComponent(_sfc_main$c, { facility_id: unref(facility_id) }, null, _parent));
        _push(`</div><ul class="mt-5 flex flex-col gap-1"><!--[-->`);
        ssrRenderList(unref(keywordgroups), (group) => {
          _push(`<li>`);
          _push(ssrRenderComponent(_sfc_main$b, {
            group,
            facility_id: unref(facility_id),
            onUnlink: unref(refresh)
          }, null, _parent));
          _push(`</li>`);
        });
        _push(`<!--]--></ul><hr class="my-8">`);
        _push(ssrRenderComponent(_sfc_main$2, {
          facility_id: unref(route).params.facility_id,
          onLink: unref(refresh)
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/keywords/facilities/[facility_id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_facility_id_-Njwoc2MF.mjs.map
