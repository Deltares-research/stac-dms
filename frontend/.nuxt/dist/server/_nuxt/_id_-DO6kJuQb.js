import { _ as _sfc_main$1, a as _sfc_main$2, b as _sfc_main$3 } from "./CardTitle-Bcq778cP.js";
import { _ as _sfc_main$4 } from "./CardContent-BLyPnbSA.js";
import { _ as _sfc_main$6 } from "./CardFooter-JmfLhCSb.js";
import { _ as _sfc_main$5 } from "./Label-B22JNgLO.js";
import { c as useRoute, u as useNuxtApp, d as useApi, b as useRouter, a as _sfc_main$7, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, withAsyncContext, ref, mergeProps, withCtx, createTextVNode, createVNode, unref, toDisplayString, withModifiers, openBlock, createBlock, createCommentVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import "radix-vue";
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
import "lucide-vue-next";
import "ohash";
import "destr";
import "klona";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    const { $api } = useNuxtApp();
    let { data: item } = ([__temp, __restore] = withAsyncContext(() => useApi("/search?ids=" + route.params.id, "$C5bBM0XP0x")), __temp = await __temp, __restore(), __temp);
    const feature = item.value.features[0];
    const errors = ref("");
    ref("");
    ref("");
    async function deleteItem() {
      try {
        errors.value = "";
        const data = await $api("/collections/{collection}/items/{id}", {
          method: "DELETE",
          path: {
            id: route.params.id,
            collection: item.value.features[0].collection
          }
        });
      } catch (e) {
        errors.value = "It was not possible to delete the collection";
        return;
      }
      const router = useRouter();
      router.push("/items");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = _sfc_main$1;
      const _component_CardHeader = _sfc_main$2;
      const _component_CardTitle = _sfc_main$3;
      const _component_CardContent = _sfc_main$4;
      const _component_Label = _sfc_main$5;
      const _component_CardFooter = _sfc_main$6;
      const _component_Button = _sfc_main$7;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Card, mergeProps({ class: "w-9/10 p-10" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Are you sure you want to delete this registration?`);
                      } else {
                        return [
                          createTextVNode("Are you sure you want to delete this registration?")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("Are you sure you want to delete this registration?")
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardContent, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<form${_scopeId2}><div class="grid items-center w-full gap-4"${_scopeId2}><div class="flex flex-col space-y-1.5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Title`);
                      } else {
                        return [
                          createTextVNode("Title")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Label, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(feature).properties.title)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(feature).properties.title), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="flex flex-col space-y-1.5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Description`);
                      } else {
                        return [
                          createTextVNode("Description")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Label, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(feature).properties.description)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(feature).properties.description), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="flex flex-col space-y-1.5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Date`);
                      } else {
                        return [
                          createTextVNode("Date")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Label, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(feature).properties.datetime)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(feature).properties.datetime), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div></div></form>`);
                  if (errors.value) {
                    _push3(`<p class="text-red-500"${_scopeId2}>${ssrInterpolate(errors.value)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(deleteItem, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid items-center w-full gap-4" }, [
                        createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode("Title")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(feature).properties.title), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode("Description")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(feature).properties.description), 1)
                            ]),
                            _: 1
                          })
                        ]),
                        createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode("Date")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_Label, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(unref(feature).properties.datetime), 1)
                            ]),
                            _: 1
                          })
                        ])
                      ])
                    ], 32),
                    errors.value ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-red-500"
                    }, toDisplayString(errors.value), 1)) : createCommentVNode("", true)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(_component_CardFooter, { class: "flex justify-between px-6 pb-6" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Button, { variant: "outline" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, { to: "/items" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Cancel`);
                            } else {
                              return [
                                createTextVNode("Cancel")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, { to: "/items" }, {
                            default: withCtx(() => [
                              createTextVNode("Cancel")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_Button, { onClick: deleteItem }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Delete`);
                      } else {
                        return [
                          createTextVNode("Delete")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Button, { variant: "outline" }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, { to: "/items" }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_Button, { onClick: deleteItem }, {
                      default: withCtx(() => [
                        createTextVNode("Delete")
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
              createVNode(_component_CardHeader, null, {
                default: withCtx(() => [
                  createVNode(_component_CardTitle, null, {
                    default: withCtx(() => [
                      createTextVNode("Are you sure you want to delete this registration?")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, null, {
                default: withCtx(() => [
                  createVNode("form", {
                    onSubmit: withModifiers(deleteItem, ["prevent"])
                  }, [
                    createVNode("div", { class: "grid items-center w-full gap-4" }, [
                      createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode("Title")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(feature).properties.title), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode("Description")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(feature).properties.description), 1)
                          ]),
                          _: 1
                        })
                      ]),
                      createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode("Date")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_Label, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(unref(feature).properties.datetime), 1)
                          ]),
                          _: 1
                        })
                      ])
                    ])
                  ], 32),
                  errors.value ? (openBlock(), createBlock("p", {
                    key: 0,
                    class: "text-red-500"
                  }, toDisplayString(errors.value), 1)) : createCommentVNode("", true)
                ]),
                _: 1
              }),
              createVNode(_component_CardFooter, { class: "flex justify-between px-6 pb-6" }, {
                default: withCtx(() => [
                  createVNode(_component_Button, { variant: "outline" }, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, { to: "/items" }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_Button, { onClick: deleteItem }, {
                    default: withCtx(() => [
                      createTextVNode("Delete")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/items/delete/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-DO6kJuQb.js.map
