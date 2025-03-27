import { _ as _sfc_main$2, a as _sfc_main$3, b as _sfc_main$4 } from "./CardTitle-Bcq778cP.js";
import { _ as _sfc_main$5 } from "./CardDescription-5Vd1PiTP.js";
import { _ as _sfc_main$6 } from "./CardFooter-JmfLhCSb.js";
import { a as _sfc_main$7, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, withCtx, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./Container-BRheHEbx.js";
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
import "radix-vue";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = _sfc_main$2;
      const _component_CardHeader = _sfc_main$3;
      const _component_CardTitle = _sfc_main$4;
      const _component_CardDescription = _sfc_main$5;
      const _component_CardFooter = _sfc_main$6;
      const _component_Button = _sfc_main$7;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_sfc_main$1, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight"${_scopeId}> Admin </h3><p class="text-sm text-muted-foreground"${_scopeId}> Administration of collections and permissions. </p><div class="grid grid-cols-2 gap-4 pt-8"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Card, { class: "flex flex-col" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardHeader, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Collections`);
                            } else {
                              return [
                                createTextVNode("Collections")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardDescription, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Administration of collections`);
                            } else {
                              return [
                                createTextVNode("Administration of collections")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Collections")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardDescription, null, {
                            default: withCtx(() => [
                              createTextVNode("Administration of collections")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardFooter, { class: "mt-auto" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Button, { "as-child": "" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(_component_NuxtLink, { to: "/collections" }, {
                                default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(`Collections`);
                                  } else {
                                    return [
                                      createTextVNode("Collections")
                                    ];
                                  }
                                }),
                                _: 1
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(_component_NuxtLink, { to: "/collections" }, {
                                  default: withCtx(() => [
                                    createTextVNode("Collections")
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
                          createVNode(_component_Button, { "as-child": "" }, {
                            default: withCtx(() => [
                              createVNode(_component_NuxtLink, { to: "/collections" }, {
                                default: withCtx(() => [
                                  createTextVNode("Collections")
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
                    createVNode(_component_CardHeader, null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Collections")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardDescription, null, {
                          default: withCtx(() => [
                            createTextVNode("Administration of collections")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardFooter, { class: "mt-auto" }, {
                      default: withCtx(() => [
                        createVNode(_component_Button, { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, { to: "/collections" }, {
                              default: withCtx(() => [
                                createTextVNode("Collections")
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
            _push2(ssrRenderComponent(_component_Card, { class: "flex flex-col" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardHeader, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Permissions`);
                            } else {
                              return [
                                createTextVNode("Permissions")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(_component_CardDescription, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Administration of user permissions`);
                            } else {
                              return [
                                createTextVNode("Administration of user permissions")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Permissions")
                            ]),
                            _: 1
                          }),
                          createVNode(_component_CardDescription, null, {
                            default: withCtx(() => [
                              createTextVNode("Administration of user permissions")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardFooter, { class: "mt-auto" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_Button, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Admin permissions`);
                            } else {
                              return [
                                createTextVNode("Admin permissions")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_Button, null, {
                            default: withCtx(() => [
                              createTextVNode("Admin permissions")
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
                    createVNode(_component_CardHeader, null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Permissions")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardDescription, null, {
                          default: withCtx(() => [
                            createTextVNode("Administration of user permissions")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardFooter, { class: "mt-auto" }, {
                      default: withCtx(() => [
                        createVNode(_component_Button, null, {
                          default: withCtx(() => [
                            createTextVNode("Admin permissions")
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
            _push2(`</div>`);
          } else {
            return [
              createVNode("h3", { class: "mt-8 scroll-m-20 text-2xl font-semibold tracking-tight" }, " Admin "),
              createVNode("p", { class: "text-sm text-muted-foreground" }, " Administration of collections and permissions. "),
              createVNode("div", { class: "grid grid-cols-2 gap-4 pt-8" }, [
                createVNode(_component_Card, { class: "flex flex-col" }, {
                  default: withCtx(() => [
                    createVNode(_component_CardHeader, null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Collections")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardDescription, null, {
                          default: withCtx(() => [
                            createTextVNode("Administration of collections")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardFooter, { class: "mt-auto" }, {
                      default: withCtx(() => [
                        createVNode(_component_Button, { "as-child": "" }, {
                          default: withCtx(() => [
                            createVNode(_component_NuxtLink, { to: "/collections" }, {
                              default: withCtx(() => [
                                createTextVNode("Collections")
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
                }),
                createVNode(_component_Card, { class: "flex flex-col" }, {
                  default: withCtx(() => [
                    createVNode(_component_CardHeader, null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Permissions")
                          ]),
                          _: 1
                        }),
                        createVNode(_component_CardDescription, null, {
                          default: withCtx(() => [
                            createTextVNode("Administration of user permissions")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardFooter, { class: "mt-auto" }, {
                      default: withCtx(() => [
                        createVNode(_component_Button, null, {
                          default: withCtx(() => [
                            createTextVNode("Admin permissions")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                })
              ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=admin-Cvz44yTL.js.map
