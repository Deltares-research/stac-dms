import { _ as _sfc_main$r } from "./Checkbox-C_ItKoAB.js";
import { e as cn, f as buttonVariants, a as _sfc_main$d, d as useApi, c as useRoute, _ as __nuxt_component_0 } from "../server.mjs";
import { _ as __nuxt_component_10 } from "./client-only-D4CG9A2g.js";
import { defineComponent, computed, unref, mergeProps, withCtx, renderSlot, useSSRContext, ref, watch, createVNode, openBlock, createBlock, Fragment, createTextVNode, toDisplayString, renderList, mergeModels, useModel, withAsyncContext, isRef, resolveComponent, createCommentVNode } from "vue";
import { ssrRenderComponent, ssrRenderSlot, ssrInterpolate, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrRenderAttrs } from "vue/server-renderer";
import { _ as _sfc_main$m, a as _sfc_main$n, b as _sfc_main$o } from "./CardTitle-Bcq778cP.js";
import { _ as _sfc_main$p } from "./CardDescription-5Vd1PiTP.js";
import { _ as _sfc_main$q } from "./CardContent-BLyPnbSA.js";
import dateFormat from "dateformat";
import { Calendar, ChevronLeft, ChevronRight, X, ChevronsUpDown, Check } from "lucide-vue-next";
import { CalendarDate, isEqualMonth } from "@internationalized/date";
import { useForwardProps, RangeCalendarCell, RangeCalendarCellTrigger, RangeCalendarGrid, RangeCalendarGridBody, RangeCalendarGridHead, RangeCalendarGridRow, RangeCalendarHeadCell, useDateFormatter, RangeCalendarRoot } from "radix-vue";
import { createMonth, toDate } from "radix-vue/date";
import { _ as _sfc_main$b, a as _sfc_main$c, b as _sfc_main$e, c as _sfc_main$f, d as _sfc_main$g, e as _sfc_main$h, f as _sfc_main$i, g as _sfc_main$j, h as _sfc_main$k } from "./CommandList-CfKjBZrS.js";
import { _ as _sfc_main$l } from "./Input-BDNolIqX.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import { bboxPolygon } from "@turf/turf";
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
import "@vueuse/core";
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarCell",
  __ssrInlineRender: true,
  props: {
    date: {},
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
      _push(ssrRenderComponent(unref(RangeCalendarCell), mergeProps({
        class: unref(cn)("relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-accent first:[&:has([data-selected])]:rounded-l-md last:[&:has([data-selected])]:rounded-r-md [&:has([data-selected][data-outside-month])]:bg-accent/50 [&:has([data-selected][data-selection-end])]:rounded-r-md [&:has([data-selected][data-selection-start])]:rounded-l-md", props.class)
      }, unref(forwardedProps), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/range-calendar/RangeCalendarCell.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarCellTrigger",
  __ssrInlineRender: true,
  props: {
    day: {},
    month: {},
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
      _push(ssrRenderComponent(unref(RangeCalendarCellTrigger), mergeProps({
        class: unref(cn)(
          unref(buttonVariants)({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal data-[selected]:opacity-100",
          "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
          // Selection Start
          "data-[selection-start]:bg-primary data-[selection-start]:text-primary-foreground data-[selection-start]:hover:bg-primary data-[selection-start]:hover:text-primary-foreground data-[selection-start]:focus:bg-primary data-[selection-start]:focus:text-primary-foreground",
          // Selection End
          "data-[selection-end]:bg-primary data-[selection-end]:text-primary-foreground data-[selection-end]:hover:bg-primary data-[selection-end]:hover:text-primary-foreground data-[selection-end]:focus:bg-primary data-[selection-end]:focus:text-primary-foreground",
          // Outside months
          "data-[outside-month]:pointer-events-none data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:bg-accent/50 [&[data-outside-month][data-selected]]:text-muted-foreground [&[data-outside-month][data-selected]]:opacity-30",
          // Disabled
          "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          // Unavailable
          "data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/range-calendar/RangeCalendarCellTrigger.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarGrid",
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
      _push(ssrRenderComponent(unref(RangeCalendarGrid), mergeProps({
        class: unref(cn)("w-full border-collapse space-y-1", props.class)
      }, unref(forwardedProps), _attrs), {
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
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/range-calendar/RangeCalendarGrid.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarGridBody",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(RangeCalendarGridBody), mergeProps(props, _attrs), {
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
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/range-calendar/RangeCalendarGridBody.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarGridHead",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(RangeCalendarGridHead), mergeProps(props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/range-calendar/RangeCalendarGridHead.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarGridRow",
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
      _push(ssrRenderComponent(unref(RangeCalendarGridRow), mergeProps({
        class: unref(cn)("flex mt-2 w-full", props.class)
      }, unref(forwardedProps), _attrs), {
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
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/range-calendar/RangeCalendarGridRow.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "RangeCalendarHeadCell",
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
      _push(ssrRenderComponent(unref(RangeCalendarHeadCell), mergeProps({
        class: unref(cn)("w-8 rounded-md text-[0.8rem] font-normal text-muted-foreground", props.class)
      }, unref(forwardedProps), _attrs), {
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
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/range-calendar/RangeCalendarHeadCell.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DateRangePicker",
  __ssrInlineRender: true,
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const value = ref({
      start: new CalendarDate(2019, 1, 1),
      end: new CalendarDate(2024, 1, 20)
    });
    watch(value, (newValue) => {
      emit("update:modelValue", newValue);
    });
    const locale = ref("en-US");
    const formatter = useDateFormatter(locale.value);
    const placeholder = ref(value.value.start);
    const secondMonthPlaceholder = ref(value.value.end);
    const firstMonth = ref(
      createMonth({
        dateObj: placeholder.value,
        locale: locale.value,
        fixedWeeks: true,
        weekStartsOn: 0
      })
    );
    const secondMonth = ref(
      createMonth({
        dateObj: secondMonthPlaceholder.value,
        locale: locale.value,
        fixedWeeks: true,
        weekStartsOn: 0
      })
    );
    function updateMonth(reference, months) {
      if (reference === "first") {
        placeholder.value = placeholder.value.add({ months });
      } else {
        secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
          months
        });
      }
    }
    watch(placeholder, (_placeholder) => {
      firstMonth.value = createMonth({
        dateObj: _placeholder,
        weekStartsOn: 0,
        fixedWeeks: false,
        locale: locale.value
      });
      if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
        secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
          months: 1
        });
      }
    });
    watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
      secondMonth.value = createMonth({
        dateObj: _secondMonthPlaceholder,
        weekStartsOn: 0,
        fixedWeeks: false,
        locale: locale.value
      });
      if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
        placeholder.value = placeholder.value.subtract({ months: 1 });
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$b), _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$c), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$d), {
                    variant: "outline",
                    class: unref(cn)(
                      "justify-start text-left font-normal",
                      !value.value && "text-muted-foreground"
                    )
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Calendar), { class: "mr-2 h-4 w-4" }, null, _parent4, _scopeId3));
                        if (value.value.start) {
                          _push4(`<!--[-->`);
                          if (value.value.end) {
                            _push4(`<!--[-->${ssrInterpolate(unref(formatter).custom(unref(toDate)(value.value.start), {
                              dateStyle: "medium"
                            }))} - ${ssrInterpolate(unref(formatter).custom(unref(toDate)(value.value.end), {
                              dateStyle: "medium"
                            }))}<!--]-->`);
                          } else {
                            _push4(`<!--[-->${ssrInterpolate(unref(formatter).custom(unref(toDate)(value.value.start), {
                              dateStyle: "medium"
                            }))}<!--]-->`);
                          }
                          _push4(`<!--]-->`);
                        } else {
                          _push4(`<!--[--> Pick a date <!--]-->`);
                        }
                      } else {
                        return [
                          createVNode(unref(Calendar), { class: "mr-2 h-4 w-4" }),
                          value.value.start ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            value.value.end ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                              createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(value.value.start), {
                                dateStyle: "medium"
                              })) + " - " + toDisplayString(unref(formatter).custom(unref(toDate)(value.value.end), {
                                dateStyle: "medium"
                              })), 1)
                            ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                              createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(value.value.start), {
                                dateStyle: "medium"
                              })), 1)
                            ], 64))
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createTextVNode(" Pick a date ")
                          ], 64))
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$d), {
                      variant: "outline",
                      class: unref(cn)(
                        "justify-start text-left font-normal",
                        !value.value && "text-muted-foreground"
                      )
                    }, {
                      default: withCtx(() => [
                        createVNode(unref(Calendar), { class: "mr-2 h-4 w-4" }),
                        value.value.start ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          value.value.end ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                            createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(value.value.start), {
                              dateStyle: "medium"
                            })) + " - " + toDisplayString(unref(formatter).custom(unref(toDate)(value.value.end), {
                              dateStyle: "medium"
                            })), 1)
                          ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                            createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(value.value.start), {
                              dateStyle: "medium"
                            })), 1)
                          ], 64))
                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createTextVNode(" Pick a date ")
                        ], 64))
                      ]),
                      _: 1
                    }, 8, ["class"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$e), { class: "w-auto p-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(RangeCalendarRoot), {
                    modelValue: value.value,
                    "onUpdate:modelValue": ($event) => value.value = $event,
                    placeholder: placeholder.value,
                    "onUpdate:placeholder": ($event) => placeholder.value = $event,
                    class: "p-3"
                  }, {
                    default: withCtx(({ weekDays }, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"${_scopeId3}><div class="flex flex-col gap-4"${_scopeId3}><div class="flex items-center justify-between"${_scopeId3}><button class="${ssrRenderClass(
                          unref(cn)(
                            unref(buttonVariants)({ variant: "outline" }),
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                          )
                        )}"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(`</button><div class="${ssrRenderClass(unref(cn)("text-sm font-medium"))}"${_scopeId3}>${ssrInterpolate(unref(formatter).fullMonthAndYear(unref(toDate)(firstMonth.value.value)))}</div><button class="${ssrRenderClass(
                          unref(cn)(
                            unref(buttonVariants)({ variant: "outline" }),
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                          )
                        )}"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(`</button></div>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$6), null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$5), null, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(weekDays, (day) => {
                                            _push7(ssrRenderComponent(unref(_sfc_main$4), {
                                              key: day,
                                              class: "w-full"
                                            }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(day)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(day), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                        } else {
                                          return [
                                            (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                              return openBlock(), createBlock(unref(_sfc_main$4), {
                                                key: day,
                                                class: "w-full"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(day), 1)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128))
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$5), null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                            return openBlock(), createBlock(unref(_sfc_main$4), {
                                              key: day,
                                              class: "w-full"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(day), 1)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$7), null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(firstMonth.value.rows, (weekDates, index) => {
                                      _push6(ssrRenderComponent(unref(_sfc_main$5), {
                                        key: `weekDate-${index}`,
                                        class: "mt-2 w-full"
                                      }, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<!--[-->`);
                                            ssrRenderList(weekDates, (weekDate) => {
                                              _push7(ssrRenderComponent(unref(_sfc_main$a), {
                                                key: weekDate.toString(),
                                                date: weekDate
                                              }, {
                                                default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(_sfc_main$9), {
                                                      day: weekDate,
                                                      month: firstMonth.value.value
                                                    }, null, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(_sfc_main$9), {
                                                        day: weekDate,
                                                        month: firstMonth.value.value
                                                      }, null, 8, ["day", "month"])
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            });
                                            _push7(`<!--]-->`);
                                          } else {
                                            return [
                                              (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                return openBlock(), createBlock(unref(_sfc_main$a), {
                                                  key: weekDate.toString(),
                                                  date: weekDate
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(_sfc_main$9), {
                                                      day: weekDate,
                                                      month: firstMonth.value.value
                                                    }, null, 8, ["day", "month"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["date"]);
                                              }), 128))
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(firstMonth.value.rows, (weekDates, index) => {
                                        return openBlock(), createBlock(unref(_sfc_main$5), {
                                          key: `weekDate-${index}`,
                                          class: "mt-2 w-full"
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                              return openBlock(), createBlock(unref(_sfc_main$a), {
                                                key: weekDate.toString(),
                                                date: weekDate
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(_sfc_main$9), {
                                                    day: weekDate,
                                                    month: firstMonth.value.value
                                                  }, null, 8, ["day", "month"])
                                                ]),
                                                _: 2
                                              }, 1032, ["date"]);
                                            }), 128))
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$6), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$5), null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                          return openBlock(), createBlock(unref(_sfc_main$4), {
                                            key: day,
                                            class: "w-full"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(day), 1)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$7), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(firstMonth.value.rows, (weekDates, index) => {
                                      return openBlock(), createBlock(unref(_sfc_main$5), {
                                        key: `weekDate-${index}`,
                                        class: "mt-2 w-full"
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                            return openBlock(), createBlock(unref(_sfc_main$a), {
                                              key: weekDate.toString(),
                                              date: weekDate
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$9), {
                                                  day: weekDate,
                                                  month: firstMonth.value.value
                                                }, null, 8, ["day", "month"])
                                              ]),
                                              _: 2
                                            }, 1032, ["date"]);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        _push4(`</div><div class="flex flex-col gap-4"${_scopeId3}><div class="flex items-center justify-between"${_scopeId3}><button class="${ssrRenderClass(
                          unref(cn)(
                            unref(buttonVariants)({ variant: "outline" }),
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                          )
                        )}"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(`</button><div class="${ssrRenderClass(unref(cn)("text-sm font-medium"))}"${_scopeId3}>${ssrInterpolate(unref(formatter).fullMonthAndYear(unref(toDate)(secondMonth.value.value)))}</div><button class="${ssrRenderClass(
                          unref(cn)(
                            unref(buttonVariants)({ variant: "outline" }),
                            "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                          )
                        )}"${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent4, _scopeId3));
                        _push4(`</button></div>`);
                        _push4(ssrRenderComponent(unref(_sfc_main$8), null, {
                          default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$6), null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(unref(_sfc_main$5), null, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`<!--[-->`);
                                          ssrRenderList(weekDays, (day) => {
                                            _push7(ssrRenderComponent(unref(_sfc_main$4), {
                                              key: day,
                                              class: "w-full"
                                            }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`${ssrInterpolate(day)}`);
                                                } else {
                                                  return [
                                                    createTextVNode(toDisplayString(day), 1)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          });
                                          _push7(`<!--]-->`);
                                        } else {
                                          return [
                                            (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                              return openBlock(), createBlock(unref(_sfc_main$4), {
                                                key: day,
                                                class: "w-full"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode(toDisplayString(day), 1)
                                                ]),
                                                _: 2
                                              }, 1024);
                                            }), 128))
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(unref(_sfc_main$5), null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                            return openBlock(), createBlock(unref(_sfc_main$4), {
                                              key: day,
                                              class: "w-full"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(day), 1)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                              _push5(ssrRenderComponent(unref(_sfc_main$7), null, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(secondMonth.value.rows, (weekDates, index) => {
                                      _push6(ssrRenderComponent(unref(_sfc_main$5), {
                                        key: `weekDate-${index}`,
                                        class: "mt-2 w-full"
                                      }, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<!--[-->`);
                                            ssrRenderList(weekDates, (weekDate) => {
                                              _push7(ssrRenderComponent(unref(_sfc_main$a), {
                                                key: weekDate.toString(),
                                                date: weekDate
                                              }, {
                                                default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                  if (_push8) {
                                                    _push8(ssrRenderComponent(unref(_sfc_main$9), {
                                                      day: weekDate,
                                                      month: secondMonth.value.value
                                                    }, null, _parent8, _scopeId7));
                                                  } else {
                                                    return [
                                                      createVNode(unref(_sfc_main$9), {
                                                        day: weekDate,
                                                        month: secondMonth.value.value
                                                      }, null, 8, ["day", "month"])
                                                    ];
                                                  }
                                                }),
                                                _: 2
                                              }, _parent7, _scopeId6));
                                            });
                                            _push7(`<!--]-->`);
                                          } else {
                                            return [
                                              (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                                return openBlock(), createBlock(unref(_sfc_main$a), {
                                                  key: weekDate.toString(),
                                                  date: weekDate
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode(unref(_sfc_main$9), {
                                                      day: weekDate,
                                                      month: secondMonth.value.value
                                                    }, null, 8, ["day", "month"])
                                                  ]),
                                                  _: 2
                                                }, 1032, ["date"]);
                                              }), 128))
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList(secondMonth.value.rows, (weekDates, index) => {
                                        return openBlock(), createBlock(unref(_sfc_main$5), {
                                          key: `weekDate-${index}`,
                                          class: "mt-2 w-full"
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                              return openBlock(), createBlock(unref(_sfc_main$a), {
                                                key: weekDate.toString(),
                                                date: weekDate
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(_sfc_main$9), {
                                                    day: weekDate,
                                                    month: secondMonth.value.value
                                                  }, null, 8, ["day", "month"])
                                                ]),
                                                _: 2
                                              }, 1032, ["date"]);
                                            }), 128))
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$6), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$5), null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                          return openBlock(), createBlock(unref(_sfc_main$4), {
                                            key: day,
                                            class: "w-full"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(day), 1)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$7), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(secondMonth.value.rows, (weekDates, index) => {
                                      return openBlock(), createBlock(unref(_sfc_main$5), {
                                        key: `weekDate-${index}`,
                                        class: "mt-2 w-full"
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                            return openBlock(), createBlock(unref(_sfc_main$a), {
                                              key: weekDate.toString(),
                                              date: weekDate
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$9), {
                                                  day: weekDate,
                                                  month: secondMonth.value.value
                                                }, null, 8, ["day", "month"])
                                              ]),
                                              _: 2
                                            }, 1032, ["date"]);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 2
                        }, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0" }, [
                            createVNode("div", { class: "flex flex-col gap-4" }, [
                              createVNode("div", { class: "flex items-center justify-between" }, [
                                createVNode("button", {
                                  class: unref(cn)(
                                    unref(buttonVariants)({ variant: "outline" }),
                                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                  ),
                                  onClick: ($event) => updateMonth("first", -1)
                                }, [
                                  createVNode(unref(ChevronLeft), { class: "h-4 w-4" })
                                ], 10, ["onClick"]),
                                createVNode("div", {
                                  class: unref(cn)("text-sm font-medium")
                                }, toDisplayString(unref(formatter).fullMonthAndYear(unref(toDate)(firstMonth.value.value))), 3),
                                createVNode("button", {
                                  class: unref(cn)(
                                    unref(buttonVariants)({ variant: "outline" }),
                                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                  ),
                                  onClick: ($event) => updateMonth("first", 1)
                                }, [
                                  createVNode(unref(ChevronRight), { class: "h-4 w-4" })
                                ], 10, ["onClick"])
                              ]),
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$6), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$5), null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                            return openBlock(), createBlock(unref(_sfc_main$4), {
                                              key: day,
                                              class: "w-full"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(day), 1)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$7), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(firstMonth.value.rows, (weekDates, index) => {
                                        return openBlock(), createBlock(unref(_sfc_main$5), {
                                          key: `weekDate-${index}`,
                                          class: "mt-2 w-full"
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                              return openBlock(), createBlock(unref(_sfc_main$a), {
                                                key: weekDate.toString(),
                                                date: weekDate
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(_sfc_main$9), {
                                                    day: weekDate,
                                                    month: firstMonth.value.value
                                                  }, null, 8, ["day", "month"])
                                                ]),
                                                _: 2
                                              }, 1032, ["date"]);
                                            }), 128))
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            createVNode("div", { class: "flex flex-col gap-4" }, [
                              createVNode("div", { class: "flex items-center justify-between" }, [
                                createVNode("button", {
                                  class: unref(cn)(
                                    unref(buttonVariants)({ variant: "outline" }),
                                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                  ),
                                  onClick: ($event) => updateMonth("second", -1)
                                }, [
                                  createVNode(unref(ChevronLeft), { class: "h-4 w-4" })
                                ], 10, ["onClick"]),
                                createVNode("div", {
                                  class: unref(cn)("text-sm font-medium")
                                }, toDisplayString(unref(formatter).fullMonthAndYear(unref(toDate)(secondMonth.value.value))), 3),
                                createVNode("button", {
                                  class: unref(cn)(
                                    unref(buttonVariants)({ variant: "outline" }),
                                    "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                  ),
                                  onClick: ($event) => updateMonth("second", 1)
                                }, [
                                  createVNode(unref(ChevronRight), { class: "h-4 w-4" })
                                ], 10, ["onClick"])
                              ]),
                              createVNode(unref(_sfc_main$8), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$6), null, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$5), null, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                            return openBlock(), createBlock(unref(_sfc_main$4), {
                                              key: day,
                                              class: "w-full"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode(toDisplayString(day), 1)
                                              ]),
                                              _: 2
                                            }, 1024);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1024),
                                  createVNode(unref(_sfc_main$7), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(secondMonth.value.rows, (weekDates, index) => {
                                        return openBlock(), createBlock(unref(_sfc_main$5), {
                                          key: `weekDate-${index}`,
                                          class: "mt-2 w-full"
                                        }, {
                                          default: withCtx(() => [
                                            (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                              return openBlock(), createBlock(unref(_sfc_main$a), {
                                                key: weekDate.toString(),
                                                date: weekDate
                                              }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(_sfc_main$9), {
                                                    day: weekDate,
                                                    month: secondMonth.value.value
                                                  }, null, 8, ["day", "month"])
                                                ]),
                                                _: 2
                                              }, 1032, ["date"]);
                                            }), 128))
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024)
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(RangeCalendarRoot), {
                      modelValue: value.value,
                      "onUpdate:modelValue": ($event) => value.value = $event,
                      placeholder: placeholder.value,
                      "onUpdate:placeholder": ($event) => placeholder.value = $event,
                      class: "p-3"
                    }, {
                      default: withCtx(({ weekDays }) => [
                        createVNode("div", { class: "flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0" }, [
                          createVNode("div", { class: "flex flex-col gap-4" }, [
                            createVNode("div", { class: "flex items-center justify-between" }, [
                              createVNode("button", {
                                class: unref(cn)(
                                  unref(buttonVariants)({ variant: "outline" }),
                                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                ),
                                onClick: ($event) => updateMonth("first", -1)
                              }, [
                                createVNode(unref(ChevronLeft), { class: "h-4 w-4" })
                              ], 10, ["onClick"]),
                              createVNode("div", {
                                class: unref(cn)("text-sm font-medium")
                              }, toDisplayString(unref(formatter).fullMonthAndYear(unref(toDate)(firstMonth.value.value))), 3),
                              createVNode("button", {
                                class: unref(cn)(
                                  unref(buttonVariants)({ variant: "outline" }),
                                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                ),
                                onClick: ($event) => updateMonth("first", 1)
                              }, [
                                createVNode(unref(ChevronRight), { class: "h-4 w-4" })
                              ], 10, ["onClick"])
                            ]),
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$6), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$5), null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                          return openBlock(), createBlock(unref(_sfc_main$4), {
                                            key: day,
                                            class: "w-full"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(day), 1)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$7), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(firstMonth.value.rows, (weekDates, index) => {
                                      return openBlock(), createBlock(unref(_sfc_main$5), {
                                        key: `weekDate-${index}`,
                                        class: "mt-2 w-full"
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                            return openBlock(), createBlock(unref(_sfc_main$a), {
                                              key: weekDate.toString(),
                                              date: weekDate
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$9), {
                                                  day: weekDate,
                                                  month: firstMonth.value.value
                                                }, null, 8, ["day", "month"])
                                              ]),
                                              _: 2
                                            }, 1032, ["date"]);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ]),
                          createVNode("div", { class: "flex flex-col gap-4" }, [
                            createVNode("div", { class: "flex items-center justify-between" }, [
                              createVNode("button", {
                                class: unref(cn)(
                                  unref(buttonVariants)({ variant: "outline" }),
                                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                ),
                                onClick: ($event) => updateMonth("second", -1)
                              }, [
                                createVNode(unref(ChevronLeft), { class: "h-4 w-4" })
                              ], 10, ["onClick"]),
                              createVNode("div", {
                                class: unref(cn)("text-sm font-medium")
                              }, toDisplayString(unref(formatter).fullMonthAndYear(unref(toDate)(secondMonth.value.value))), 3),
                              createVNode("button", {
                                class: unref(cn)(
                                  unref(buttonVariants)({ variant: "outline" }),
                                  "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                                ),
                                onClick: ($event) => updateMonth("second", 1)
                              }, [
                                createVNode(unref(ChevronRight), { class: "h-4 w-4" })
                              ], 10, ["onClick"])
                            ]),
                            createVNode(unref(_sfc_main$8), null, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$6), null, {
                                  default: withCtx(() => [
                                    createVNode(unref(_sfc_main$5), null, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                          return openBlock(), createBlock(unref(_sfc_main$4), {
                                            key: day,
                                            class: "w-full"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(day), 1)
                                            ]),
                                            _: 2
                                          }, 1024);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1024),
                                createVNode(unref(_sfc_main$7), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(secondMonth.value.rows, (weekDates, index) => {
                                      return openBlock(), createBlock(unref(_sfc_main$5), {
                                        key: `weekDate-${index}`,
                                        class: "mt-2 w-full"
                                      }, {
                                        default: withCtx(() => [
                                          (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                            return openBlock(), createBlock(unref(_sfc_main$a), {
                                              key: weekDate.toString(),
                                              date: weekDate
                                            }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$9), {
                                                  day: weekDate,
                                                  month: secondMonth.value.value
                                                }, null, 8, ["day", "month"])
                                              ]),
                                              _: 2
                                            }, 1032, ["date"]);
                                          }), 128))
                                        ]),
                                        _: 2
                                      }, 1024);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024)
                          ])
                        ])
                      ]),
                      _: 2
                    }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder", "onUpdate:placeholder"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$c), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$d), {
                    variant: "outline",
                    class: unref(cn)(
                      "justify-start text-left font-normal",
                      !value.value && "text-muted-foreground"
                    )
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Calendar), { class: "mr-2 h-4 w-4" }),
                      value.value.start ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                        value.value.end ? (openBlock(), createBlock(Fragment, { key: 0 }, [
                          createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(value.value.start), {
                            dateStyle: "medium"
                          })) + " - " + toDisplayString(unref(formatter).custom(unref(toDate)(value.value.end), {
                            dateStyle: "medium"
                          })), 1)
                        ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                          createTextVNode(toDisplayString(unref(formatter).custom(unref(toDate)(value.value.start), {
                            dateStyle: "medium"
                          })), 1)
                        ], 64))
                      ], 64)) : (openBlock(), createBlock(Fragment, { key: 1 }, [
                        createTextVNode(" Pick a date ")
                      ], 64))
                    ]),
                    _: 1
                  }, 8, ["class"])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$e), { class: "w-auto p-0" }, {
                default: withCtx(() => [
                  createVNode(unref(RangeCalendarRoot), {
                    modelValue: value.value,
                    "onUpdate:modelValue": ($event) => value.value = $event,
                    placeholder: placeholder.value,
                    "onUpdate:placeholder": ($event) => placeholder.value = $event,
                    class: "p-3"
                  }, {
                    default: withCtx(({ weekDays }) => [
                      createVNode("div", { class: "flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0" }, [
                        createVNode("div", { class: "flex flex-col gap-4" }, [
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("button", {
                              class: unref(cn)(
                                unref(buttonVariants)({ variant: "outline" }),
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                              ),
                              onClick: ($event) => updateMonth("first", -1)
                            }, [
                              createVNode(unref(ChevronLeft), { class: "h-4 w-4" })
                            ], 10, ["onClick"]),
                            createVNode("div", {
                              class: unref(cn)("text-sm font-medium")
                            }, toDisplayString(unref(formatter).fullMonthAndYear(unref(toDate)(firstMonth.value.value))), 3),
                            createVNode("button", {
                              class: unref(cn)(
                                unref(buttonVariants)({ variant: "outline" }),
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                              ),
                              onClick: ($event) => updateMonth("first", 1)
                            }, [
                              createVNode(unref(ChevronRight), { class: "h-4 w-4" })
                            ], 10, ["onClick"])
                          ]),
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$5), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                        return openBlock(), createBlock(unref(_sfc_main$4), {
                                          key: day,
                                          class: "w-full"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(day), 1)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$7), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(firstMonth.value.rows, (weekDates, index) => {
                                    return openBlock(), createBlock(unref(_sfc_main$5), {
                                      key: `weekDate-${index}`,
                                      class: "mt-2 w-full"
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                          return openBlock(), createBlock(unref(_sfc_main$a), {
                                            key: weekDate.toString(),
                                            date: weekDate
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$9), {
                                                day: weekDate,
                                                month: firstMonth.value.value
                                              }, null, 8, ["day", "month"])
                                            ]),
                                            _: 2
                                          }, 1032, ["date"]);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        createVNode("div", { class: "flex flex-col gap-4" }, [
                          createVNode("div", { class: "flex items-center justify-between" }, [
                            createVNode("button", {
                              class: unref(cn)(
                                unref(buttonVariants)({ variant: "outline" }),
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                              ),
                              onClick: ($event) => updateMonth("second", -1)
                            }, [
                              createVNode(unref(ChevronLeft), { class: "h-4 w-4" })
                            ], 10, ["onClick"]),
                            createVNode("div", {
                              class: unref(cn)("text-sm font-medium")
                            }, toDisplayString(unref(formatter).fullMonthAndYear(unref(toDate)(secondMonth.value.value))), 3),
                            createVNode("button", {
                              class: unref(cn)(
                                unref(buttonVariants)({ variant: "outline" }),
                                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
                              ),
                              onClick: ($event) => updateMonth("second", 1)
                            }, [
                              createVNode(unref(ChevronRight), { class: "h-4 w-4" })
                            ], 10, ["onClick"])
                          ]),
                          createVNode(unref(_sfc_main$8), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$6), null, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$5), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                        return openBlock(), createBlock(unref(_sfc_main$4), {
                                          key: day,
                                          class: "w-full"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(day), 1)
                                          ]),
                                          _: 2
                                        }, 1024);
                                      }), 128))
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(_sfc_main$7), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(secondMonth.value.rows, (weekDates, index) => {
                                    return openBlock(), createBlock(unref(_sfc_main$5), {
                                      key: `weekDate-${index}`,
                                      class: "mt-2 w-full"
                                    }, {
                                      default: withCtx(() => [
                                        (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                          return openBlock(), createBlock(unref(_sfc_main$a), {
                                            key: weekDate.toString(),
                                            date: weekDate
                                          }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$9), {
                                                day: weekDate,
                                                month: secondMonth.value.value
                                              }, null, 8, ["day", "month"])
                                            ]),
                                            _: 2
                                          }, 1032, ["date"]);
                                        }), 128))
                                      ]),
                                      _: 2
                                    }, 1024);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024)
                        ])
                      ])
                    ]),
                    _: 2
                  }, 1032, ["modelValue", "onUpdate:modelValue", "placeholder", "onUpdate:placeholder"])
                ]),
                _: 2
              }, 1024)
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DateRangePicker.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "KeywordsCombobox",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    name: {}
  }, {
    "modelValue": {
      default: []
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:modelValue"], ["update:modelValue"]),
  async setup(__props) {
    let __temp, __restore;
    let value = useModel(__props, "modelValue");
    let open = ref(false);
    function toggleKeyword(keyword) {
      if (value.value.includes(keyword)) {
        value.value = value.value.filter((k) => k !== keyword);
      } else {
        value.value = [...value.value, keyword];
      }
    }
    let { data: keywordGroups } = ([__temp, __restore] = withAsyncContext(() => useApi("/keywords", "$uGstrnMdfz")), __temp = await __temp, __restore(), __temp);
    let keywordsById = computed(
      () => {
        var _a;
        return (_a = keywordGroups.value) == null ? void 0 : _a.reduce(
          (acc, group) => {
            group.keywords.forEach((keyword) => {
              acc[keyword.id] = keyword;
            });
            return acc;
          },
          {}
        );
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><!--[-->`);
      ssrRenderList(unref(value), (val) => {
        _push(`<input type="hidden"${ssrRenderAttr("name", _ctx.name)}${ssrRenderAttr("value", val)} data-v-2a18e2b8>`);
      });
      _push(`<!--]--><div class="relative w-full flex flex-col gap-1.5" data-v-2a18e2b8>`);
      if (unref(value).length) {
        _push(`<div class="flex gap-1.5" data-v-2a18e2b8><!--[-->`);
        ssrRenderList(unref(value), (keyword) => {
          var _a, _b;
          _push(`<button class="inline-flex items-center bg-gray-200 rounded text-primary-background px-2 py-1 text-xs" data-v-2a18e2b8>${ssrInterpolate((_b = (_a = unref(keywordsById)) == null ? void 0 : _a[keyword]) == null ? void 0 : _b.nl_keyword)} `);
          _push(ssrRenderComponent(unref(X), { class: "size-4 ml-1" }, null, _parent));
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(_sfc_main$b), {
        open: unref(open),
        "onUpdate:open": ($event) => isRef(open) ? open.value = $event : open = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$c), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$d), {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": unref(open),
                    class: "justify-between w-full"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Add keyword `);
                        _push4(ssrRenderComponent(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createTextVNode(" Add keyword "),
                          createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$d), {
                      variant: "outline",
                      role: "combobox",
                      "aria-expanded": unref(open),
                      class: "justify-between w-full"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Add keyword "),
                        createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                      ]),
                      _: 1
                    }, 8, ["aria-expanded"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$e), { class: "p-0 PopoverContent" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$f), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$g), {
                          class: "h-9",
                          placeholder: "Search framework..."
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$h), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`No framework found.`);
                            } else {
                              return [
                                createTextVNode("No framework found.")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$i), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`<!--[-->`);
                              ssrRenderList(unref(keywordGroups), (group) => {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<!--[-->`);
                                      ssrRenderList(group.keywords, (keyword) => {
                                        _push6(ssrRenderComponent(unref(_sfc_main$k), {
                                          key: keyword.id,
                                          value: keyword.id,
                                          onSelect: (ev) => {
                                            if (typeof ev.detail.value === "string") {
                                              toggleKeyword(ev.detail.value);
                                            }
                                            isRef(open) ? open.value = false : open = false;
                                          }
                                        }, {
                                          default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`<div class="" data-v-2a18e2b8${_scopeId6}><div class="text-[10px] text-muted-foreground" data-v-2a18e2b8${_scopeId6}>${ssrInterpolate(group.group_name_nl)}</div> ${ssrInterpolate(keyword.nl_keyword)}</div>`);
                                              _push7(ssrRenderComponent(unref(Check), {
                                                class: unref(cn)(
                                                  "ml-auto h-4 w-4",
                                                  unref(value).includes(keyword.id) ? "opacity-100" : "opacity-0"
                                                )
                                              }, null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode("div", { class: "" }, [
                                                  createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(group.group_name_nl), 1),
                                                  createTextVNode(" " + toDisplayString(keyword.nl_keyword), 1)
                                                ]),
                                                createVNode(unref(Check), {
                                                  class: unref(cn)(
                                                    "ml-auto h-4 w-4",
                                                    unref(value).includes(keyword.id) ? "opacity-100" : "opacity-0"
                                                  )
                                                }, null, 8, ["class"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                      });
                                      _push6(`<!--]-->`);
                                    } else {
                                      return [
                                        (openBlock(true), createBlock(Fragment, null, renderList(group.keywords, (keyword) => {
                                          return openBlock(), createBlock(unref(_sfc_main$k), {
                                            key: keyword.id,
                                            value: keyword.id,
                                            onSelect: (ev) => {
                                              if (typeof ev.detail.value === "string") {
                                                toggleKeyword(ev.detail.value);
                                              }
                                              isRef(open) ? open.value = false : open = false;
                                            }
                                          }, {
                                            default: withCtx(() => [
                                              createVNode("div", { class: "" }, [
                                                createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(group.group_name_nl), 1),
                                                createTextVNode(" " + toDisplayString(keyword.nl_keyword), 1)
                                              ]),
                                              createVNode(unref(Check), {
                                                class: unref(cn)(
                                                  "ml-auto h-4 w-4",
                                                  unref(value).includes(keyword.id) ? "opacity-100" : "opacity-0"
                                                )
                                              }, null, 8, ["class"])
                                            ]),
                                            _: 2
                                          }, 1032, ["value", "onSelect"]);
                                        }), 128))
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              });
                              _push5(`<!--]-->`);
                            } else {
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList(unref(keywordGroups), (group) => {
                                  return openBlock(), createBlock(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      (openBlock(true), createBlock(Fragment, null, renderList(group.keywords, (keyword) => {
                                        return openBlock(), createBlock(unref(_sfc_main$k), {
                                          key: keyword.id,
                                          value: keyword.id,
                                          onSelect: (ev) => {
                                            if (typeof ev.detail.value === "string") {
                                              toggleKeyword(ev.detail.value);
                                            }
                                            isRef(open) ? open.value = false : open = false;
                                          }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "" }, [
                                              createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(group.group_name_nl), 1),
                                              createTextVNode(" " + toDisplayString(keyword.nl_keyword), 1)
                                            ]),
                                            createVNode(unref(Check), {
                                              class: unref(cn)(
                                                "ml-auto h-4 w-4",
                                                unref(value).includes(keyword.id) ? "opacity-100" : "opacity-0"
                                              )
                                            }, null, 8, ["class"])
                                          ]),
                                          _: 2
                                        }, 1032, ["value", "onSelect"]);
                                      }), 128))
                                    ]),
                                    _: 2
                                  }, 1024);
                                }), 256))
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$g), {
                            class: "h-9",
                            placeholder: "Search framework..."
                          }),
                          createVNode(unref(_sfc_main$h), null, {
                            default: withCtx(() => [
                              createTextVNode("No framework found.")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(keywordGroups), (group) => {
                                return openBlock(), createBlock(unref(_sfc_main$j), null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(group.keywords, (keyword) => {
                                      return openBlock(), createBlock(unref(_sfc_main$k), {
                                        key: keyword.id,
                                        value: keyword.id,
                                        onSelect: (ev) => {
                                          if (typeof ev.detail.value === "string") {
                                            toggleKeyword(ev.detail.value);
                                          }
                                          isRef(open) ? open.value = false : open = false;
                                        }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "" }, [
                                            createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(group.group_name_nl), 1),
                                            createTextVNode(" " + toDisplayString(keyword.nl_keyword), 1)
                                          ]),
                                          createVNode(unref(Check), {
                                            class: unref(cn)(
                                              "ml-auto h-4 w-4",
                                              unref(value).includes(keyword.id) ? "opacity-100" : "opacity-0"
                                            )
                                          }, null, 8, ["class"])
                                        ]),
                                        _: 2
                                      }, 1032, ["value", "onSelect"]);
                                    }), 128))
                                  ]),
                                  _: 2
                                }, 1024);
                              }), 256))
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$f), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$g), {
                          class: "h-9",
                          placeholder: "Search framework..."
                        }),
                        createVNode(unref(_sfc_main$h), null, {
                          default: withCtx(() => [
                            createTextVNode("No framework found.")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$i), null, {
                          default: withCtx(() => [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(keywordGroups), (group) => {
                              return openBlock(), createBlock(unref(_sfc_main$j), null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(group.keywords, (keyword) => {
                                    return openBlock(), createBlock(unref(_sfc_main$k), {
                                      key: keyword.id,
                                      value: keyword.id,
                                      onSelect: (ev) => {
                                        if (typeof ev.detail.value === "string") {
                                          toggleKeyword(ev.detail.value);
                                        }
                                        isRef(open) ? open.value = false : open = false;
                                      }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "" }, [
                                          createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(group.group_name_nl), 1),
                                          createTextVNode(" " + toDisplayString(keyword.nl_keyword), 1)
                                        ]),
                                        createVNode(unref(Check), {
                                          class: unref(cn)(
                                            "ml-auto h-4 w-4",
                                            unref(value).includes(keyword.id) ? "opacity-100" : "opacity-0"
                                          )
                                        }, null, 8, ["class"])
                                      ]),
                                      _: 2
                                    }, 1032, ["value", "onSelect"]);
                                  }), 128))
                                ]),
                                _: 2
                              }, 1024);
                            }), 256))
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$c), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$d), {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": unref(open),
                    class: "justify-between w-full"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Add keyword "),
                      createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                    ]),
                    _: 1
                  }, 8, ["aria-expanded"])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$e), { class: "p-0 PopoverContent" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$f), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$g), {
                        class: "h-9",
                        placeholder: "Search framework..."
                      }),
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createTextVNode("No framework found.")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(unref(keywordGroups), (group) => {
                            return openBlock(), createBlock(unref(_sfc_main$j), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(group.keywords, (keyword) => {
                                  return openBlock(), createBlock(unref(_sfc_main$k), {
                                    key: keyword.id,
                                    value: keyword.id,
                                    onSelect: (ev) => {
                                      if (typeof ev.detail.value === "string") {
                                        toggleKeyword(ev.detail.value);
                                      }
                                      isRef(open) ? open.value = false : open = false;
                                    }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "" }, [
                                        createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(group.group_name_nl), 1),
                                        createTextVNode(" " + toDisplayString(keyword.nl_keyword), 1)
                                      ]),
                                      createVNode(unref(Check), {
                                        class: unref(cn)(
                                          "ml-auto h-4 w-4",
                                          unref(value).includes(keyword.id) ? "opacity-100" : "opacity-0"
                                        )
                                      }, null, 8, ["class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["value", "onSelect"]);
                                }), 128))
                              ]),
                              _: 2
                            }, 1024);
                          }), 256))
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/keywords/KeywordsCombobox.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const KeywordsCombobox = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-2a18e2b8"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CollectionCombobox",
  __ssrInlineRender: true,
  props: /* @__PURE__ */ mergeModels({
    name: {}
  }, {
    "modelValue": {
      default: []
    },
    "modelModifiers": {}
  }),
  emits: /* @__PURE__ */ mergeModels(["update:modelValue"], ["update:modelValue"]),
  async setup(__props) {
    let __temp, __restore;
    let value = useModel(__props, "modelValue");
    let open = ref(false);
    function toggleCollection(keyword) {
      if (value.value.includes(keyword)) {
        value.value = value.value.filter((k) => k !== keyword);
      } else {
        value.value = [...value.value, keyword];
      }
    }
    let { data: collections } = ([__temp, __restore] = withAsyncContext(() => useApi("/collections", "$PK0ECD2Qo2")), __temp = await __temp, __restore(), __temp);
    let collectionsById = computed(
      () => {
        var _a;
        return (_a = collections.value) == null ? void 0 : _a.collections.reduce(
          (acc, collection) => {
            acc[collection.id] = collection;
            return acc;
          },
          {}
        );
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><!--[-->`);
      ssrRenderList(unref(value), (val) => {
        _push(`<input type="hidden"${ssrRenderAttr("name", _ctx.name)}${ssrRenderAttr("value", val)} data-v-2b256aa1>`);
      });
      _push(`<!--]--><div class="relative w-full flex flex-col gap-1.5" data-v-2b256aa1>`);
      if (unref(value).length) {
        _push(`<div class="flex gap-1.5" data-v-2b256aa1><!--[-->`);
        ssrRenderList(unref(value), (collectionId) => {
          var _a, _b;
          _push(`<button class="inline-flex items-center bg-gray-200 rounded text-primary-background px-2 py-1 text-xs" data-v-2b256aa1>${ssrInterpolate((_b = (_a = unref(collectionsById)) == null ? void 0 : _a[collectionId]) == null ? void 0 : _b.title)} `);
          _push(ssrRenderComponent(unref(X), { class: "size-4 ml-1" }, null, _parent));
          _push(`</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(_sfc_main$b), {
        open: unref(open),
        "onUpdate:open": ($event) => isRef(open) ? open.value = $event : open = $event
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$c), { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$d), {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": unref(open),
                    class: "justify-between w-full"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(` Add collection `);
                        _push4(ssrRenderComponent(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createTextVNode(" Add collection "),
                          createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$d), {
                      variant: "outline",
                      role: "combobox",
                      "aria-expanded": unref(open),
                      class: "justify-between w-full"
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Add collection "),
                        createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                      ]),
                      _: 1
                    }, 8, ["aria-expanded"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$e), { class: "p-0 PopoverContent" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$f), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(_sfc_main$g), {
                          class: "h-9",
                          placeholder: "Search collection..."
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$h), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`No collections found.`);
                            } else {
                              return [
                                createTextVNode("No collections found.")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(_sfc_main$i), null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  var _a, _b;
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList((_a = unref(collections)) == null ? void 0 : _a.collections, (collection) => {
                                      _push6(ssrRenderComponent(unref(_sfc_main$k), {
                                        key: collection.id,
                                        value: collection.id,
                                        onSelect: (ev) => {
                                          if (typeof ev.detail.value === "string") {
                                            toggleCollection(ev.detail.value);
                                          }
                                          isRef(open) ? open.value = false : open = false;
                                        }
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`<div class="" data-v-2b256aa1${_scopeId6}><div class="text-[10px] text-muted-foreground" data-v-2b256aa1${_scopeId6}>${ssrInterpolate(collection.description)}</div> ${ssrInterpolate(collection.title)}</div>`);
                                            _push7(ssrRenderComponent(unref(Check), {
                                              class: unref(cn)(
                                                "ml-auto h-4 w-4",
                                                unref(value).includes(collection.id) ? "opacity-100" : "opacity-0"
                                              )
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode("div", { class: "" }, [
                                                createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(collection.description), 1),
                                                createTextVNode(" " + toDisplayString(collection.title), 1)
                                              ]),
                                              createVNode(unref(Check), {
                                                class: unref(cn)(
                                                  "ml-auto h-4 w-4",
                                                  unref(value).includes(collection.id) ? "opacity-100" : "opacity-0"
                                                )
                                              }, null, 8, ["class"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    });
                                    _push6(`<!--]-->`);
                                  } else {
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList((_b = unref(collections)) == null ? void 0 : _b.collections, (collection) => {
                                        return openBlock(), createBlock(unref(_sfc_main$k), {
                                          key: collection.id,
                                          value: collection.id,
                                          onSelect: (ev) => {
                                            if (typeof ev.detail.value === "string") {
                                              toggleCollection(ev.detail.value);
                                            }
                                            isRef(open) ? open.value = false : open = false;
                                          }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "" }, [
                                              createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(collection.description), 1),
                                              createTextVNode(" " + toDisplayString(collection.title), 1)
                                            ]),
                                            createVNode(unref(Check), {
                                              class: unref(cn)(
                                                "ml-auto h-4 w-4",
                                                unref(value).includes(collection.id) ? "opacity-100" : "opacity-0"
                                              )
                                            }, null, 8, ["class"])
                                          ]),
                                          _: 2
                                        }, 1032, ["value", "onSelect"]);
                                      }), 128))
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$j), null, {
                                  default: withCtx(() => {
                                    var _a;
                                    return [
                                      (openBlock(true), createBlock(Fragment, null, renderList((_a = unref(collections)) == null ? void 0 : _a.collections, (collection) => {
                                        return openBlock(), createBlock(unref(_sfc_main$k), {
                                          key: collection.id,
                                          value: collection.id,
                                          onSelect: (ev) => {
                                            if (typeof ev.detail.value === "string") {
                                              toggleCollection(ev.detail.value);
                                            }
                                            isRef(open) ? open.value = false : open = false;
                                          }
                                        }, {
                                          default: withCtx(() => [
                                            createVNode("div", { class: "" }, [
                                              createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(collection.description), 1),
                                              createTextVNode(" " + toDisplayString(collection.title), 1)
                                            ]),
                                            createVNode(unref(Check), {
                                              class: unref(cn)(
                                                "ml-auto h-4 w-4",
                                                unref(value).includes(collection.id) ? "opacity-100" : "opacity-0"
                                              )
                                            }, null, 8, ["class"])
                                          ]),
                                          _: 2
                                        }, 1032, ["value", "onSelect"]);
                                      }), 128))
                                    ];
                                  }),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(_sfc_main$g), {
                            class: "h-9",
                            placeholder: "Search collection..."
                          }),
                          createVNode(unref(_sfc_main$h), null, {
                            default: withCtx(() => [
                              createTextVNode("No collections found.")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createVNode(unref(_sfc_main$j), null, {
                                default: withCtx(() => {
                                  var _a;
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList((_a = unref(collections)) == null ? void 0 : _a.collections, (collection) => {
                                      return openBlock(), createBlock(unref(_sfc_main$k), {
                                        key: collection.id,
                                        value: collection.id,
                                        onSelect: (ev) => {
                                          if (typeof ev.detail.value === "string") {
                                            toggleCollection(ev.detail.value);
                                          }
                                          isRef(open) ? open.value = false : open = false;
                                        }
                                      }, {
                                        default: withCtx(() => [
                                          createVNode("div", { class: "" }, [
                                            createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(collection.description), 1),
                                            createTextVNode(" " + toDisplayString(collection.title), 1)
                                          ]),
                                          createVNode(unref(Check), {
                                            class: unref(cn)(
                                              "ml-auto h-4 w-4",
                                              unref(value).includes(collection.id) ? "opacity-100" : "opacity-0"
                                            )
                                          }, null, 8, ["class"])
                                        ]),
                                        _: 2
                                      }, 1032, ["value", "onSelect"]);
                                    }), 128))
                                  ];
                                }),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$f), null, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$g), {
                          class: "h-9",
                          placeholder: "Search collection..."
                        }),
                        createVNode(unref(_sfc_main$h), null, {
                          default: withCtx(() => [
                            createTextVNode("No collections found.")
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$i), null, {
                          default: withCtx(() => [
                            createVNode(unref(_sfc_main$j), null, {
                              default: withCtx(() => {
                                var _a;
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList((_a = unref(collections)) == null ? void 0 : _a.collections, (collection) => {
                                    return openBlock(), createBlock(unref(_sfc_main$k), {
                                      key: collection.id,
                                      value: collection.id,
                                      onSelect: (ev) => {
                                        if (typeof ev.detail.value === "string") {
                                          toggleCollection(ev.detail.value);
                                        }
                                        isRef(open) ? open.value = false : open = false;
                                      }
                                    }, {
                                      default: withCtx(() => [
                                        createVNode("div", { class: "" }, [
                                          createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(collection.description), 1),
                                          createTextVNode(" " + toDisplayString(collection.title), 1)
                                        ]),
                                        createVNode(unref(Check), {
                                          class: unref(cn)(
                                            "ml-auto h-4 w-4",
                                            unref(value).includes(collection.id) ? "opacity-100" : "opacity-0"
                                          )
                                        }, null, 8, ["class"])
                                      ]),
                                      _: 2
                                    }, 1032, ["value", "onSelect"]);
                                  }), 128))
                                ];
                              }),
                              _: 1
                            })
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(_sfc_main$c), { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$d), {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": unref(open),
                    class: "justify-between w-full"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(" Add collection "),
                      createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                    ]),
                    _: 1
                  }, 8, ["aria-expanded"])
                ]),
                _: 1
              }),
              createVNode(unref(_sfc_main$e), { class: "p-0 PopoverContent" }, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$f), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$g), {
                        class: "h-9",
                        placeholder: "Search collection..."
                      }),
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createTextVNode("No collections found.")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$j), null, {
                            default: withCtx(() => {
                              var _a;
                              return [
                                (openBlock(true), createBlock(Fragment, null, renderList((_a = unref(collections)) == null ? void 0 : _a.collections, (collection) => {
                                  return openBlock(), createBlock(unref(_sfc_main$k), {
                                    key: collection.id,
                                    value: collection.id,
                                    onSelect: (ev) => {
                                      if (typeof ev.detail.value === "string") {
                                        toggleCollection(ev.detail.value);
                                      }
                                      isRef(open) ? open.value = false : open = false;
                                    }
                                  }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "" }, [
                                        createVNode("div", { class: "text-[10px] text-muted-foreground" }, toDisplayString(collection.description), 1),
                                        createTextVNode(" " + toDisplayString(collection.title), 1)
                                      ]),
                                      createVNode(unref(Check), {
                                        class: unref(cn)(
                                          "ml-auto h-4 w-4",
                                          unref(value).includes(collection.id) ? "opacity-100" : "opacity-0"
                                        )
                                      }, null, 8, ["class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["value", "onSelect"]);
                                }), 128))
                              ];
                            }),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><!--]-->`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/CollectionCombobox.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CollectionCombobox = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2b256aa1"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    let selectedItemId = ref();
    let daterange = ref();
    let bbox = ref([180, 90, -180, -90]);
    let datetime = computed(() => {
      if (!route || !route.query) return void 0;
      let { start, end } = route.query;
      if (start && end) {
        return `${dateFormat(new Date(start), "isoUtcDateTime")}/${dateFormat(new Date(end), "isoUtcDateTime")}`;
      }
    });
    let keywordIds = computed(() => {
      if (!route || !route.query || !route.query.keywords) return [];
      const keywords = route.query.keywords;
      return (Array.isArray(keywords) ? keywords : [keywords]).map((id) => id == null ? void 0 : id.toString()).filter(Boolean);
    });
    let collectionIds = computed(() => {
      if (!route || !route.query || !route.query.collections) return [];
      const collections = route.query.collections;
      return (Array.isArray(collections) ? collections : [collections]).map((id) => id == null ? void 0 : id.toString()).filter(Boolean);
    });
    let filter = computed(() => {
      var _a, _b, _c;
      let geometry = bbox.value ? bboxPolygon(bbox.value).geometry : void 0;
      return {
        op: "and",
        args: [
          {
            op: "or",
            args: [
              geometry ? {
                op: "s_intersects",
                args: [
                  {
                    property: "geometry"
                  },
                  geometry
                ]
              } : void 0,
              // The isNull operator does not work. The below is a workaround. It includes items that have no geometry by intersecting with a Polygon that covers the entire world.
              ((_a = route.query) == null ? void 0 : _a.includeEmptyGeometry) === "on" ? {
                op: "not",
                args: [
                  {
                    op: "s_intersects",
                    args: [
                      {
                        property: "geometry"
                      },
                      {
                        type: "Polygon",
                        coordinates: [
                          [
                            [-180, -90],
                            [180, -90],
                            [180, 90],
                            [-180, 90],
                            [-180, -90]
                          ]
                        ]
                      }
                    ]
                  }
                ]
              } : void 0
            ].filter(Boolean)
          },
          {
            op: "or",
            args: [
              {
                op: "like",
                args: [
                  {
                    property: "properties.title"
                  },
                  `%${((_b = route.query) == null ? void 0 : _b.q) ?? ""}%`
                ]
              },
              {
                op: "like",
                args: [
                  {
                    property: "properties.description"
                  },
                  `%${((_c = route.query) == null ? void 0 : _c.q) ?? ""}%`
                ]
              }
            ]
          },
          keywordIds.value.length > 0 ? {
            op: "in",
            args: [
              {
                property: "properties.keywords.id"
              },
              keywordIds.value
            ]
          } : void 0
        ].filter(Boolean)
      };
    });
    let { data: searchResults, status } = useApi("/search", {
      method: "post",
      body: {
        collections: collectionIds.value,
        datetime: datetime.value,
        filter: filter.value,
        "filter-lang": "cql2-json"
      }
    }, "$pqtWcjQkdb");
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_Loader2 = resolveComponent("Loader2");
      const _component_Checkbox = _sfc_main$r;
      const _component_Button = _sfc_main$d;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_ClientOnly = __nuxt_component_10;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-2 justify-center h-[calc(100vh-57px)]" }, _attrs))}><div class="relative h-full overflow-hidden">`);
      if (unref(status) === "pending") {
        _push(`<div class="z-10 absolute inset-0 flex items-center justify-center bg-white/80">`);
        _push(ssrRenderComponent(_component_Loader2, { class: "w-4 h-4 animate-spin" }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="p-5 h-full overflow-y-auto"><form class="flex flex-col gap-1.5" method="get">`);
      _push(ssrRenderComponent(_sfc_main$l, {
        name: "q",
        placeholder: "Search title or description...",
        "model-value": ((_a = unref(route).query) == null ? void 0 : _a.q) || ""
      }, null, _parent));
      _push(`<input name="start" type="hidden"${ssrRenderAttr("value", (_b = unref(daterange)) == null ? void 0 : _b.start)}><input name="end" type="hidden"${ssrRenderAttr("value", (_c = unref(daterange)) == null ? void 0 : _c.end)}>`);
      _push(ssrRenderComponent(_sfc_main$3, {
        modelValue: unref(daterange),
        "onUpdate:modelValue": ($event) => isRef(daterange) ? daterange.value = $event : daterange = $event
      }, null, _parent));
      _push(ssrRenderComponent(KeywordsCombobox, {
        name: "keywords",
        placeholder: "Keywords",
        "model-value": unref(keywordIds)
      }, null, _parent));
      _push(ssrRenderComponent(CollectionCombobox, {
        name: "collections",
        placeholder: "Collections",
        "model-value": unref(collectionIds)
      }, null, _parent));
      _push(`<div class="flex items-center space-x-2 py-2">`);
      _push(ssrRenderComponent(_component_Checkbox, {
        id: "includeEmptyGeometry",
        name: "includeEmptyGeometry",
        "default-checked": ((_d = unref(route).query) == null ? void 0 : _d.includeEmptyGeometry) === "on"
      }, null, _parent));
      _push(`<label for="includeEmptyGeometry" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"> Include empty geometries </label></div>`);
      _push(ssrRenderComponent(_component_Button, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Search`);
          } else {
            return [
              createTextVNode("Search")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</form><!--[-->`);
      ssrRenderList((_e = unref(searchResults)) == null ? void 0 : _e.features, (item) => {
        _push(ssrRenderComponent(unref(_sfc_main$m), {
          key: item.id,
          class: unref(selectedItemId) === item.id ? "border-emerald-500" : ""
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(_sfc_main$n), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$o), { class: "text-xl" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.properties.title ?? item.id)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.properties.title ?? item.id), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$p), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`${ssrInterpolate(item.properties.description)}`);
                        } else {
                          return [
                            createTextVNode(toDisplayString(item.properties.description), 1)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$o), { class: "text-xl" }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.properties.title ?? item.id), 1)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(_sfc_main$p), null, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(item.properties.description), 1)
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              if (item.properties.datetime) {
                _push2(ssrRenderComponent(unref(_sfc_main$q), null, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(ssrRenderComponent(_component_NuxtLink, {
                        to: "/items/" + item.id + "?readonly=true"
                      }, {
                        default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                          if (_push4) {
                            _push4(`View details`);
                          } else {
                            return [
                              createTextVNode("View details")
                            ];
                          }
                        }),
                        _: 2
                      }, _parent3, _scopeId2));
                      _push3(`<div class="text-xs text-muted-foreground"${_scopeId2}>${ssrInterpolate(unref(dateFormat)(new Date(item.properties.datetime), "mmmm dS, yyyy"))}</div>`);
                    } else {
                      return [
                        createVNode(_component_NuxtLink, {
                          to: "/items/" + item.id + "?readonly=true"
                        }, {
                          default: withCtx(() => [
                            createTextVNode("View details")
                          ]),
                          _: 2
                        }, 1032, ["to"]),
                        createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(dateFormat)(new Date(item.properties.datetime), "mmmm dS, yyyy")), 1)
                      ];
                    }
                  }),
                  _: 2
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
            } else {
              return [
                createVNode(unref(_sfc_main$n), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$o), { class: "text-xl" }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.properties.title ?? item.id), 1)
                      ]),
                      _: 2
                    }, 1024),
                    createVNode(unref(_sfc_main$p), null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(item.properties.description), 1)
                      ]),
                      _: 2
                    }, 1024)
                  ]),
                  _: 2
                }, 1024),
                item.properties.datetime ? (openBlock(), createBlock(unref(_sfc_main$q), { key: 0 }, {
                  default: withCtx(() => [
                    createVNode(_component_NuxtLink, {
                      to: "/items/" + item.id + "?readonly=true"
                    }, {
                      default: withCtx(() => [
                        createTextVNode("View details")
                      ]),
                      _: 2
                    }, 1032, ["to"]),
                    createVNode("div", { class: "text-xs text-muted-foreground" }, toDisplayString(unref(dateFormat)(new Date(item.properties.datetime), "mmmm dS, yyyy")), 1)
                  ]),
                  _: 2
                }, 1024)) : createCommentVNode("", true)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></div><div class="relative h-full">`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-DZwlCMii.js.map
