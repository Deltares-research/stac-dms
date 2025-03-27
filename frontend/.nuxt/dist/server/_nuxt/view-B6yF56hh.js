import { _ as _sfc_main$2, a as _sfc_main$3, b as _sfc_main$5 } from "./CardTitle-Bcq778cP.js";
import { _ as _sfc_main$4 } from "./CardContent-BLyPnbSA.js";
import { defineComponent, ref, mergeProps, withCtx, unref, createTextVNode, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { MapboxMap } from "@studiometa/vue-mapbox-gl";
import { _ as _sfc_main$1 } from "./Container-BRheHEbx.js";
/* empty css                   */
import "../server.mjs";
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
const accesToken = "pk.eyJ1IjoicGlldGVyZ3JpanplMTIzIiwiYSI6ImNreGc2emtjcjNtYmkycm81czF3M3Zpa3YifQ.ZJEb13EmlPZwXY5PCp80sw";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "view",
  __ssrInlineRender: true,
  setup(__props) {
    const mapCenter = ref([0, 0]);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_CardTitle = _sfc_main$5;
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({ class: "py-8" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="text-3xl font-semibold"${_scopeId}>Details data set</h1><p class="text-muted-foreground"${_scopeId}>GeoCentrifuge</p><div class="grid grid-flow-row gap-5 mt-8"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`General information`);
                            } else {
                              return [
                                createTextVNode("General information")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("General information")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3 text-sm"${_scopeId3}><strong class="font-semibold"${_scopeId3}>Project number</strong><div${_scopeId3}>11206575-019</div><strong class="font-semibold"${_scopeId3}>Project title</strong><div${_scopeId3}>MIDAS I extra tests</div><strong class="font-semibold"${_scopeId3}>Date data set</strong><div${_scopeId3}>13-03-2023</div><strong class="font-semibold"${_scopeId3}>Status</strong><div${_scopeId3}>Completed</div><strong class="font-semibold"${_scopeId3}>Language</strong><div${_scopeId3}>English</div><strong class="font-semibold"${_scopeId3}>Description</strong><div${_scopeId3}> Additional tests for MIDAS I. Research on lateral loading on monopiles </div><strong${_scopeId3}>Storage location</strong><div${_scopeId3}>P:\\geocentrifuge\\11203259-014 - MIDAS Extra tests 2023</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3 text-sm" }, [
                            createVNode("strong", { class: "font-semibold" }, "Project number"),
                            createVNode("div", null, "11206575-019"),
                            createVNode("strong", { class: "font-semibold" }, "Project title"),
                            createVNode("div", null, "MIDAS I extra tests"),
                            createVNode("strong", { class: "font-semibold" }, "Date data set"),
                            createVNode("div", null, "13-03-2023"),
                            createVNode("strong", { class: "font-semibold" }, "Status"),
                            createVNode("div", null, "Completed"),
                            createVNode("strong", { class: "font-semibold" }, "Language"),
                            createVNode("div", null, "English"),
                            createVNode("strong", { class: "font-semibold" }, "Description"),
                            createVNode("div", null, " Additional tests for MIDAS I. Research on lateral loading on monopiles "),
                            createVNode("strong", null, "Storage location"),
                            createVNode("div", null, "P:\\geocentrifuge\\11203259-014 - MIDAS Extra tests 2023")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("General information")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3 text-sm" }, [
                          createVNode("strong", { class: "font-semibold" }, "Project number"),
                          createVNode("div", null, "11206575-019"),
                          createVNode("strong", { class: "font-semibold" }, "Project title"),
                          createVNode("div", null, "MIDAS I extra tests"),
                          createVNode("strong", { class: "font-semibold" }, "Date data set"),
                          createVNode("div", null, "13-03-2023"),
                          createVNode("strong", { class: "font-semibold" }, "Status"),
                          createVNode("div", null, "Completed"),
                          createVNode("strong", { class: "font-semibold" }, "Language"),
                          createVNode("div", null, "English"),
                          createVNode("strong", { class: "font-semibold" }, "Description"),
                          createVNode("div", null, " Additional tests for MIDAS I. Research on lateral loading on monopiles "),
                          createVNode("strong", null, "Storage location"),
                          createVNode("div", null, "P:\\geocentrifuge\\11203259-014 - MIDAS Extra tests 2023")
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Keywords`);
                            } else {
                              return [
                                createTextVNode("Keywords")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Keywords")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3"${_scopeId3}><strong class="font-semibold"${_scopeId3}>Keywords</strong><div${_scopeId3}>No keywords defined</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                            createVNode("strong", { class: "font-semibold" }, "Keywords"),
                            createVNode("div", null, "No keywords defined")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Keywords")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                          createVNode("strong", { class: "font-semibold" }, "Keywords"),
                          createVNode("div", null, "No keywords defined")
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Restrictions`);
                            } else {
                              return [
                                createTextVNode("Restrictions")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Restrictions")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3"${_scopeId3}><strong class="font-semibold"${_scopeId3}>Access constraints</strong><div${_scopeId3}>Trademark</div><strong class="font-semibold"${_scopeId3}>Usage limits</strong><div${_scopeId3}>No limits defined</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                            createVNode("strong", { class: "font-semibold" }, "Access constraints"),
                            createVNode("div", null, "Trademark"),
                            createVNode("strong", { class: "font-semibold" }, "Usage limits"),
                            createVNode("div", null, "No limits defined")
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Restrictions")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                          createVNode("strong", { class: "font-semibold" }, "Access constraints"),
                          createVNode("div", null, "Trademark"),
                          createVNode("strong", { class: "font-semibold" }, "Usage limits"),
                          createVNode("div", null, "No limits defined")
                        ])
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(_sfc_main$2), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$3), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardTitle, null, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Spatial information`);
                            } else {
                              return [
                                createTextVNode("Spatial information")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardTitle, null, {
                            default: withCtx(() => [
                              createTextVNode("Spatial information")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$4), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<div class="grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3"${_scopeId3}><strong class="font-semibold"${_scopeId3}>Spatial reference system</strong><div${_scopeId3}>WGS 84</div><strong class="font-semibold"${_scopeId3}>Geometry</strong><div${_scopeId3}>`);
                        _push4(ssrRenderComponent(unref(MapboxMap), {
                          id: "map",
                          style: { "height": "400px", "width": "600px" },
                          "access-token": accesToken,
                          "map-style": "mapbox://styles/mapbox/streets-v11",
                          center: mapCenter.value,
                          zoom: 1
                        }, null, _parent4, _scopeId3));
                        _push4(`</div></div>`);
                      } else {
                        return [
                          createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                            createVNode("strong", { class: "font-semibold" }, "Spatial reference system"),
                            createVNode("div", null, "WGS 84"),
                            createVNode("strong", { class: "font-semibold" }, "Geometry"),
                            createVNode("div", null, [
                              createVNode(unref(MapboxMap), {
                                id: "map",
                                style: { "height": "400px", "width": "600px" },
                                "access-token": accesToken,
                                "map-style": "mapbox://styles/mapbox/streets-v11",
                                center: mapCenter.value,
                                zoom: 1
                              }, null, 8, ["center"])
                            ])
                          ])
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Spatial information")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                          createVNode("strong", { class: "font-semibold" }, "Spatial reference system"),
                          createVNode("div", null, "WGS 84"),
                          createVNode("strong", { class: "font-semibold" }, "Geometry"),
                          createVNode("div", null, [
                            createVNode(unref(MapboxMap), {
                              id: "map",
                              style: { "height": "400px", "width": "600px" },
                              "access-token": accesToken,
                              "map-style": "mapbox://styles/mapbox/streets-v11",
                              center: mapCenter.value,
                              zoom: 1
                            }, null, 8, ["center"])
                          ])
                        ])
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
              createVNode("h1", { class: "text-3xl font-semibold" }, "Details data set"),
              createVNode("p", { class: "text-muted-foreground" }, "GeoCentrifuge"),
              createVNode("div", { class: "grid grid-flow-row gap-5 mt-8" }, [
                createVNode(unref(_sfc_main$2), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("General information")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3 text-sm" }, [
                          createVNode("strong", { class: "font-semibold" }, "Project number"),
                          createVNode("div", null, "11206575-019"),
                          createVNode("strong", { class: "font-semibold" }, "Project title"),
                          createVNode("div", null, "MIDAS I extra tests"),
                          createVNode("strong", { class: "font-semibold" }, "Date data set"),
                          createVNode("div", null, "13-03-2023"),
                          createVNode("strong", { class: "font-semibold" }, "Status"),
                          createVNode("div", null, "Completed"),
                          createVNode("strong", { class: "font-semibold" }, "Language"),
                          createVNode("div", null, "English"),
                          createVNode("strong", { class: "font-semibold" }, "Description"),
                          createVNode("div", null, " Additional tests for MIDAS I. Research on lateral loading on monopiles "),
                          createVNode("strong", null, "Storage location"),
                          createVNode("div", null, "P:\\geocentrifuge\\11203259-014 - MIDAS Extra tests 2023")
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$2), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Keywords")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                          createVNode("strong", { class: "font-semibold" }, "Keywords"),
                          createVNode("div", null, "No keywords defined")
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$2), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Restrictions")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                          createVNode("strong", { class: "font-semibold" }, "Access constraints"),
                          createVNode("div", null, "Trademark"),
                          createVNode("strong", { class: "font-semibold" }, "Usage limits"),
                          createVNode("div", null, "No limits defined")
                        ])
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode(unref(_sfc_main$2), null, {
                  default: withCtx(() => [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, null, {
                          default: withCtx(() => [
                            createTextVNode("Spatial information")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$4), null, {
                      default: withCtx(() => [
                        createVNode("div", { class: "grid grid-cols-[max-content_1fr] gap-x-5 gap-y-3" }, [
                          createVNode("strong", { class: "font-semibold" }, "Spatial reference system"),
                          createVNode("div", null, "WGS 84"),
                          createVNode("strong", { class: "font-semibold" }, "Geometry"),
                          createVNode("div", null, [
                            createVNode(unref(MapboxMap), {
                              id: "map",
                              style: { "height": "400px", "width": "600px" },
                              "access-token": accesToken,
                              "map-style": "mapbox://styles/mapbox/streets-v11",
                              center: mapCenter.value,
                              zoom: 1
                            }, null, 8, ["center"])
                          ])
                        ])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/view.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=view-B6yF56hh.js.map
