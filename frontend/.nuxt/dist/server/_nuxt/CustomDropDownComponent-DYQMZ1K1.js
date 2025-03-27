import { defineComponent, mergeProps, unref, useSSRContext, ref, watch, withCtx, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, Fragment, renderList } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { useVModel } from "@vueuse/core";
import { e as cn, a as _sfc_main$4 } from "../server.mjs";
import { _ as _sfc_main$2, a as _sfc_main$3, b as _sfc_main$5, c as _sfc_main$6, d as _sfc_main$7, e as _sfc_main$8, f as _sfc_main$9, g as _sfc_main$a, h as _sfc_main$b } from "./CommandList-CfKjBZrS.js";
import { ChevronsUpDown, Check } from "lucide-vue-next";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Textarea",
  __ssrInlineRender: true,
  props: {
    class: {},
    defaultValue: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const modelValue = useVModel(props, "modelValue", emits, {
      passive: true,
      defaultValue: props.defaultValue
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<textarea${ssrRenderAttrs(mergeProps({
        class: unref(cn)("flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", props.class)
      }, _attrs), "textarea")}>${ssrInterpolate(unref(modelValue))}</textarea>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/textarea/Textarea.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CustomDropDownComponent",
  __ssrInlineRender: true,
  props: {
    options: {},
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const open = ref(false);
    const value = ref(props.modelValue);
    watch(value, (newValue) => {
      emit("update:modelValue", newValue);
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Popover = _sfc_main$2;
      const _component_PopoverTrigger = _sfc_main$3;
      const _component_Button = _sfc_main$4;
      const _component_PopoverContent = _sfc_main$5;
      const _component_Command = _sfc_main$6;
      const _component_CommandInput = _sfc_main$7;
      const _component_CommandEmpty = _sfc_main$8;
      const _component_CommandList = _sfc_main$9;
      const _component_CommandGroup = _sfc_main$a;
      const _component_CommandItem = _sfc_main$b;
      _push(ssrRenderComponent(_component_Popover, mergeProps({
        id: "language",
        open: open.value,
        "onUpdate:open": ($event) => open.value = $event
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_PopoverTrigger, { "as-child": "" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Button, {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": open.value,
                    class: "w-[200px] justify-between"
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      var _a, _b;
                      if (_push4) {
                        _push4(`${ssrInterpolate(value.value ? (_a = _ctx.options.find((option) => option.value === value.value)) == null ? void 0 : _a.label : "Select ...")} `);
                        _push4(ssrRenderComponent(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" }, null, _parent4, _scopeId3));
                      } else {
                        return [
                          createTextVNode(toDisplayString(value.value ? (_b = _ctx.options.find((option) => option.value === value.value)) == null ? void 0 : _b.label : "Select ...") + " ", 1),
                          createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Button, {
                      variant: "outline",
                      role: "combobox",
                      "aria-expanded": open.value,
                      class: "w-[200px] justify-between"
                    }, {
                      default: withCtx(() => {
                        var _a;
                        return [
                          createTextVNode(toDisplayString(value.value ? (_a = _ctx.options.find((option) => option.value === value.value)) == null ? void 0 : _a.label : "Select ...") + " ", 1),
                          createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                        ];
                      }),
                      _: 1
                    }, 8, ["aria-expanded"])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_PopoverContent, { class: "w-[200px] p-0" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Command, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CommandInput, {
                          class: "h-9",
                          placeholder: "Search ..."
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CommandEmpty, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`No items found`);
                            } else {
                              return [
                                createTextVNode("No items found")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CommandList, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_CommandGroup, null, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`<!--[-->`);
                                    ssrRenderList(_ctx.options, (option) => {
                                      _push6(ssrRenderComponent(_component_CommandItem, {
                                        key: option.value,
                                        value: option.value,
                                        onSelect: (ev) => {
                                          if (typeof ev.detail.value === "string") {
                                            value.value = ev.detail.value;
                                          }
                                          open.value = false;
                                        }
                                      }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`${ssrInterpolate(option.label)} `);
                                            _push7(ssrRenderComponent(unref(Check), {
                                              class: unref(cn)(
                                                "ml-auto h-4 w-4",
                                                value.value === option.value ? "opacity-100" : "opacity-0"
                                              )
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString(option.label) + " ", 1),
                                              createVNode(unref(Check), {
                                                class: unref(cn)(
                                                  "ml-auto h-4 w-4",
                                                  value.value === option.value ? "opacity-100" : "opacity-0"
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
                                      (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                        return openBlock(), createBlock(_component_CommandItem, {
                                          key: option.value,
                                          value: option.value,
                                          onSelect: (ev) => {
                                            if (typeof ev.detail.value === "string") {
                                              value.value = ev.detail.value;
                                            }
                                            open.value = false;
                                          }
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(option.label) + " ", 1),
                                            createVNode(unref(Check), {
                                              class: unref(cn)(
                                                "ml-auto h-4 w-4",
                                                value.value === option.value ? "opacity-100" : "opacity-0"
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
                                createVNode(_component_CommandGroup, null, {
                                  default: withCtx(() => [
                                    (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                      return openBlock(), createBlock(_component_CommandItem, {
                                        key: option.value,
                                        value: option.value,
                                        onSelect: (ev) => {
                                          if (typeof ev.detail.value === "string") {
                                            value.value = ev.detail.value;
                                          }
                                          open.value = false;
                                        }
                                      }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(option.label) + " ", 1),
                                          createVNode(unref(Check), {
                                            class: unref(cn)(
                                              "ml-auto h-4 w-4",
                                              value.value === option.value ? "opacity-100" : "opacity-0"
                                            )
                                          }, null, 8, ["class"])
                                        ]),
                                        _: 2
                                      }, 1032, ["value", "onSelect"]);
                                    }), 128))
                                  ]),
                                  _: 1
                                })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CommandInput, {
                            class: "h-9",
                            placeholder: "Search ..."
                          }),
                          createVNode(_component_CommandEmpty, null, {
                            default: withCtx(() => [
                              createTextVNode("No items found")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CommandList, null, {
                            default: withCtx(() => [
                              createVNode(_component_CommandGroup, null, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                    return openBlock(), createBlock(_component_CommandItem, {
                                      key: option.value,
                                      value: option.value,
                                      onSelect: (ev) => {
                                        if (typeof ev.detail.value === "string") {
                                          value.value = ev.detail.value;
                                        }
                                        open.value = false;
                                      }
                                    }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(option.label) + " ", 1),
                                        createVNode(unref(Check), {
                                          class: unref(cn)(
                                            "ml-auto h-4 w-4",
                                            value.value === option.value ? "opacity-100" : "opacity-0"
                                          )
                                        }, null, 8, ["class"])
                                      ]),
                                      _: 2
                                    }, 1032, ["value", "onSelect"]);
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
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Command, null, {
                      default: withCtx(() => [
                        createVNode(_component_CommandInput, {
                          class: "h-9",
                          placeholder: "Search ..."
                        }),
                        createVNode(_component_CommandEmpty, null, {
                          default: withCtx(() => [
                            createTextVNode("No items found")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CommandList, null, {
                          default: withCtx(() => [
                            createVNode(_component_CommandGroup, null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                  return openBlock(), createBlock(_component_CommandItem, {
                                    key: option.value,
                                    value: option.value,
                                    onSelect: (ev) => {
                                      if (typeof ev.detail.value === "string") {
                                        value.value = ev.detail.value;
                                      }
                                      open.value = false;
                                    }
                                  }, {
                                    default: withCtx(() => [
                                      createTextVNode(toDisplayString(option.label) + " ", 1),
                                      createVNode(unref(Check), {
                                        class: unref(cn)(
                                          "ml-auto h-4 w-4",
                                          value.value === option.value ? "opacity-100" : "opacity-0"
                                        )
                                      }, null, 8, ["class"])
                                    ]),
                                    _: 2
                                  }, 1032, ["value", "onSelect"]);
                                }), 128))
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
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_PopoverTrigger, { "as-child": "" }, {
                default: withCtx(() => [
                  createVNode(_component_Button, {
                    variant: "outline",
                    role: "combobox",
                    "aria-expanded": open.value,
                    class: "w-[200px] justify-between"
                  }, {
                    default: withCtx(() => {
                      var _a;
                      return [
                        createTextVNode(toDisplayString(value.value ? (_a = _ctx.options.find((option) => option.value === value.value)) == null ? void 0 : _a.label : "Select ...") + " ", 1),
                        createVNode(unref(ChevronsUpDown), { class: "ml-2 h-4 w-4 shrink-0 opacity-50" })
                      ];
                    }),
                    _: 1
                  }, 8, ["aria-expanded"])
                ]),
                _: 1
              }),
              createVNode(_component_PopoverContent, { class: "w-[200px] p-0" }, {
                default: withCtx(() => [
                  createVNode(_component_Command, null, {
                    default: withCtx(() => [
                      createVNode(_component_CommandInput, {
                        class: "h-9",
                        placeholder: "Search ..."
                      }),
                      createVNode(_component_CommandEmpty, null, {
                        default: withCtx(() => [
                          createTextVNode("No items found")
                        ]),
                        _: 1
                      }),
                      createVNode(_component_CommandList, null, {
                        default: withCtx(() => [
                          createVNode(_component_CommandGroup, null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(_ctx.options, (option) => {
                                return openBlock(), createBlock(_component_CommandItem, {
                                  key: option.value,
                                  value: option.value,
                                  onSelect: (ev) => {
                                    if (typeof ev.detail.value === "string") {
                                      value.value = ev.detail.value;
                                    }
                                    open.value = false;
                                  }
                                }, {
                                  default: withCtx(() => [
                                    createTextVNode(toDisplayString(option.label) + " ", 1),
                                    createVNode(unref(Check), {
                                      class: unref(cn)(
                                        "ml-auto h-4 w-4",
                                        value.value === option.value ? "opacity-100" : "opacity-0"
                                      )
                                    }, null, 8, ["class"])
                                  ]),
                                  _: 2
                                }, 1032, ["value", "onSelect"]);
                              }), 128))
                            ]),
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
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomDropDownComponent.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main$1 as _,
  _sfc_main as a
};
//# sourceMappingURL=CustomDropDownComponent-DYQMZ1K1.js.map
