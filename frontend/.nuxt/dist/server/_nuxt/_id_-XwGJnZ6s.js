import { useForm, Field } from "vee-validate";
import { _ as _sfc_main$j, a as _sfc_main$m, b as _sfc_main$o, c as _sfc_main$p } from "./FormMessage-DwFGFzr-.js";
import { _ as _sfc_main$g, a as _sfc_main$h, b as _sfc_main$n } from "./CardTitle-Bcq778cP.js";
import { _ as _sfc_main$i } from "./CardContent-BLyPnbSA.js";
import { _ as _sfc_main$q } from "./Input-BDNolIqX.js";
import { a as _sfc_main$e, e as cn, f as buttonVariants, c as useRoute, b as useRouter, d as useApi, u as useNuxtApp, g as useToast, n as navigateTo, _ as __nuxt_component_0 } from "../server.mjs";
import { _ as _sfc_main$r, a as _sfc_main$s, b as _sfc_main$u } from "./CommandList-CfKjBZrS.js";
import { _ as _sfc_main$t } from "./Label-B22JNgLO.js";
import { _ as __nuxt_component_10 } from "./client-only-D4CG9A2g.js";
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext, computed, createTextVNode, toDisplayString, Fragment, renderList, renderSlot, withAsyncContext, watch, isRef, withModifiers } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderSlot } from "vue/server-renderer";
import { Map, Layers, Sources, Interactions, Styles } from "vue3-openlayers";
import { GeoJSON } from "ol/format.js";
import { MapPin, Spline, Trash2, ChevronRight, ChevronLeft, Calendar, XIcon } from "lucide-vue-next";
import { _ as _sfc_main$v } from "./Checkbox-C_ItKoAB.js";
import { nanoid } from "nanoid";
/* empty css                   */
import { DateFormatter, parseDate } from "@internationalized/date";
import dateFormat from "dateformat";
import { useForwardPropsEmits, CalendarRoot, useForwardProps, CalendarCell, CalendarCellTrigger, CalendarGrid, CalendarGridBody, CalendarGridHead, CalendarGridRow, CalendarHeadCell, CalendarHeader, CalendarHeading, CalendarNext, CalendarPrev } from "radix-vue";
import { PlusIcon } from "@radix-icons/vue";
import { a as _sfc_main$k, _ as _sfc_main$l } from "./CustomDropDownComponent-DYQMZ1K1.js";
import { _ as _sfc_main$f } from "./Container-BRheHEbx.js";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { zu } from "@infra-blocks/zod-utils";
import { computedAsync } from "@vueuse/core";
import { bbox } from "@turf/turf";
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
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "GeometryDraw",
  __ssrInlineRender: true,
  props: {
    onValueChange: { type: Function },
    initialValue: {},
    readOnly: {}
  },
  setup(__props) {
    let geoJson = new GeoJSON();
    let projection = ref("EPSG:4326");
    let initialFeatures = geoJson.readFeatures(__props.initialValue, {
      featureProjection: "EPSG:4326",
      dataProjection: "EPSG:4326"
    });
    let center = ref([0, 0]);
    let zoom = ref(1);
    let vectorRef = ref();
    let drawEnable = ref(false);
    let drawType = ref("Polygon");
    let drawend = (event) => {
      let map = vectorRef.value.source;
      let allFeatures = map.getFeatures();
      allFeatures.forEach((feature) => {
        if (feature === event.feature) return;
        map.removeFeature(feature);
      });
      drawEnable.value = false;
    };
    let selectedFeature = ref();
    function featureSelected(event) {
      selectedFeature.value = event.selected[0];
    }
    function onChange(event) {
      var _a;
      let features = event.target.getFeatures();
      let featureCollection = geoJson.writeFeaturesObject(features, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326"
      });
      (_a = __props.onValueChange) == null ? void 0 : _a.call(__props, featureCollection);
    }
    (void 0).addEventListener("keydown", (event) => {
      if (event.key === "Delete" || event.key === "Backspace") {
        removeSelectedFeature();
      }
    });
    function removeSelectedFeature() {
      let map = vectorRef.value.source;
      if (selectedFeature.value) {
        map.removeFeature(selectedFeature.value);
      }
    }
    function selectDrawType(type) {
      drawType.value = type;
      drawEnable.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Button = _sfc_main$e;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative" }, _attrs))}><div class="absolute top-0 right-0 z-10 p-3 flex flex-col gap-2"><div class="flex flex-col">`);
      if (!_ctx.readOnly) {
        _push(ssrRenderComponent(_component_Button, {
          variant: "outline",
          size: "icon",
          type: "button",
          onClick: () => selectDrawType("Point"),
          class: {
            "bg-gray-100": unref(drawType) === "Point" && unref(drawEnable),
            "rounded-b-none": true
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(MapPin), { class: "w-4 h-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!_ctx.readOnly) {
        _push(ssrRenderComponent(_component_Button, {
          variant: "outline",
          size: "icon",
          type: "button",
          onClick: () => selectDrawType("Polygon"),
          class: {
            "bg-gray-100": unref(drawType) === "Polygon" && unref(drawEnable),
            "rounded-t-none": true
          }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Spline), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Spline), { class: "w-4 h-4" })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(selectedFeature)) {
        _push(ssrRenderComponent(_component_Button, {
          variant: "outline",
          size: "icon",
          type: "button",
          onClick: removeSelectedFeature
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
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(unref(Map).OlMap, {
        class: "rounded overflow-hidden aspect-[16/9] w-full",
        loadTilesWhileAnimating: true,
        loadTilesWhileInteracting: true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Map).OlView, {
              projection: unref(projection),
              rotation: 0,
              ref: "view",
              center: unref(center),
              zoom: unref(zoom)
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Layers).OlTileLayer, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Sources).OlSourceOsm, null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(Sources).OlSourceOsm)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            if (!unref(drawEnable)) {
              _push2(ssrRenderComponent(unref(Interactions).OlInteractionSelect, { onSelect: featureSelected }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(Styles).OlStyle, null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(Styles).OlStyleStroke, {
                            color: "blue",
                            width: 10
                          }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 255, 0.4)" }, null, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Styles).OlStyleIcon, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<span class="w-5 h-5 bg-black/40 border-blue-500 border-[10px]"${_scopeId4}></span>`);
                              } else {
                                return [
                                  createVNode("span", { class: "w-5 h-5 bg-black/40 border-blue-500 border-[10px]" })
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(Styles).OlStyleStroke, {
                              color: "blue",
                              width: 10
                            }),
                            createVNode(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 255, 0.4)" }),
                            createVNode(unref(Styles).OlStyleIcon, null, {
                              default: withCtx(() => [
                                createVNode("span", { class: "w-5 h-5 bg-black/40 border-blue-500 border-[10px]" })
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
                      createVNode(unref(Styles).OlStyle, null, {
                        default: withCtx(() => [
                          createVNode(unref(Styles).OlStyleStroke, {
                            color: "blue",
                            width: 10
                          }),
                          createVNode(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 255, 0.4)" }),
                          createVNode(unref(Styles).OlStyleIcon, null, {
                            default: withCtx(() => [
                              createVNode("span", { class: "w-5 h-5 bg-black/40 border-blue-500 border-[10px]" })
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
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Layers).OlVectorLayer, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(Sources).OlSourceVector, {
                    ref_key: "vectorRef",
                    ref: vectorRef,
                    onChange,
                    features: unref(initialFeatures),
                    format: unref(geoJson)
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        if (unref(drawEnable)) {
                          _push4(ssrRenderComponent(unref(Interactions).OlInteractionDraw, {
                            type: unref(drawType),
                            stopClick: true,
                            onDrawend: unref(drawend)
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Styles).OlStyle, null, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(Styles).OlStyleStroke, {
                                        color: "blue",
                                        width: 2
                                      }, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 0, 0.4)" }, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(unref(Styles).OlStyleCircle, { radius: 5 }, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(unref(Styles).OlStyleFill, { color: "#00dd11" }, null, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(unref(Styles).OlStyleStroke, {
                                              color: "blue",
                                              width: 2
                                            }, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(unref(Styles).OlStyleFill, { color: "#00dd11" }),
                                              createVNode(unref(Styles).OlStyleStroke, {
                                                color: "blue",
                                                width: 2
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(Styles).OlStyleStroke, {
                                          color: "blue",
                                          width: 2
                                        }),
                                        createVNode(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 0, 0.4)" }),
                                        createVNode(unref(Styles).OlStyleCircle, { radius: 5 }, {
                                          default: withCtx(() => [
                                            createVNode(unref(Styles).OlStyleFill, { color: "#00dd11" }),
                                            createVNode(unref(Styles).OlStyleStroke, {
                                              color: "blue",
                                              width: 2
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(Styles).OlStyle, null, {
                                    default: withCtx(() => [
                                      createVNode(unref(Styles).OlStyleStroke, {
                                        color: "blue",
                                        width: 2
                                      }),
                                      createVNode(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 0, 0.4)" }),
                                      createVNode(unref(Styles).OlStyleCircle, { radius: 5 }, {
                                        default: withCtx(() => [
                                          createVNode(unref(Styles).OlStyleFill, { color: "#00dd11" }),
                                          createVNode(unref(Styles).OlStyleStroke, {
                                            color: "blue",
                                            width: 2
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
                          }, _parent4, _scopeId3));
                        } else {
                          _push4(`<!---->`);
                        }
                      } else {
                        return [
                          unref(drawEnable) ? (openBlock(), createBlock(unref(Interactions).OlInteractionDraw, {
                            key: 0,
                            type: unref(drawType),
                            stopClick: true,
                            onDrawend: unref(drawend)
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(Styles).OlStyle, null, {
                                default: withCtx(() => [
                                  createVNode(unref(Styles).OlStyleStroke, {
                                    color: "blue",
                                    width: 2
                                  }),
                                  createVNode(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 0, 0.4)" }),
                                  createVNode(unref(Styles).OlStyleCircle, { radius: 5 }, {
                                    default: withCtx(() => [
                                      createVNode(unref(Styles).OlStyleFill, { color: "#00dd11" }),
                                      createVNode(unref(Styles).OlStyleStroke, {
                                        color: "blue",
                                        width: 2
                                      })
                                    ]),
                                    _: 1
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          }, 8, ["type", "onDrawend"])) : createCommentVNode("", true)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(Styles).OlStyle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Styles).OlStyleStroke, {
                          color: "red",
                          width: 2
                        }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Styles).OlStyleFill, { color: "rgba(255,255,255,0.1)" }, null, _parent4, _scopeId3));
                        _push4(ssrRenderComponent(unref(Styles).OlStyleCircle, { radius: 7 }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(Styles).OlStyleFill, { color: "red" }, null, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(Styles).OlStyleFill, { color: "red" })
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Styles).OlStyleStroke, {
                            color: "red",
                            width: 2
                          }),
                          createVNode(unref(Styles).OlStyleFill, { color: "rgba(255,255,255,0.1)" }),
                          createVNode(unref(Styles).OlStyleCircle, { radius: 7 }, {
                            default: withCtx(() => [
                              createVNode(unref(Styles).OlStyleFill, { color: "red" })
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
                    createVNode(unref(Sources).OlSourceVector, {
                      ref_key: "vectorRef",
                      ref: vectorRef,
                      onChange,
                      features: unref(initialFeatures),
                      format: unref(geoJson)
                    }, {
                      default: withCtx(() => [
                        unref(drawEnable) ? (openBlock(), createBlock(unref(Interactions).OlInteractionDraw, {
                          key: 0,
                          type: unref(drawType),
                          stopClick: true,
                          onDrawend: unref(drawend)
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(Styles).OlStyle, null, {
                              default: withCtx(() => [
                                createVNode(unref(Styles).OlStyleStroke, {
                                  color: "blue",
                                  width: 2
                                }),
                                createVNode(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 0, 0.4)" }),
                                createVNode(unref(Styles).OlStyleCircle, { radius: 5 }, {
                                  default: withCtx(() => [
                                    createVNode(unref(Styles).OlStyleFill, { color: "#00dd11" }),
                                    createVNode(unref(Styles).OlStyleStroke, {
                                      color: "blue",
                                      width: 2
                                    })
                                  ]),
                                  _: 1
                                })
                              ]),
                              _: 1
                            })
                          ]),
                          _: 1
                        }, 8, ["type", "onDrawend"])) : createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["features", "format"]),
                    createVNode(unref(Styles).OlStyle, null, {
                      default: withCtx(() => [
                        createVNode(unref(Styles).OlStyleStroke, {
                          color: "red",
                          width: 2
                        }),
                        createVNode(unref(Styles).OlStyleFill, { color: "rgba(255,255,255,0.1)" }),
                        createVNode(unref(Styles).OlStyleCircle, { radius: 7 }, {
                          default: withCtx(() => [
                            createVNode(unref(Styles).OlStyleFill, { color: "red" })
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
              createVNode(unref(Map).OlView, {
                projection: unref(projection),
                rotation: 0,
                ref: "view",
                center: unref(center),
                zoom: unref(zoom)
              }, null, 8, ["projection", "center", "zoom"]),
              createVNode(unref(Layers).OlTileLayer, null, {
                default: withCtx(() => [
                  createVNode(unref(Sources).OlSourceOsm)
                ]),
                _: 1
              }),
              !unref(drawEnable) ? (openBlock(), createBlock(unref(Interactions).OlInteractionSelect, {
                key: 0,
                onSelect: featureSelected
              }, {
                default: withCtx(() => [
                  createVNode(unref(Styles).OlStyle, null, {
                    default: withCtx(() => [
                      createVNode(unref(Styles).OlStyleStroke, {
                        color: "blue",
                        width: 10
                      }),
                      createVNode(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 255, 0.4)" }),
                      createVNode(unref(Styles).OlStyleIcon, null, {
                        default: withCtx(() => [
                          createVNode("span", { class: "w-5 h-5 bg-black/40 border-blue-500 border-[10px]" })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              })) : createCommentVNode("", true),
              createVNode(unref(Layers).OlVectorLayer, null, {
                default: withCtx(() => [
                  createVNode(unref(Sources).OlSourceVector, {
                    ref_key: "vectorRef",
                    ref: vectorRef,
                    onChange,
                    features: unref(initialFeatures),
                    format: unref(geoJson)
                  }, {
                    default: withCtx(() => [
                      unref(drawEnable) ? (openBlock(), createBlock(unref(Interactions).OlInteractionDraw, {
                        key: 0,
                        type: unref(drawType),
                        stopClick: true,
                        onDrawend: unref(drawend)
                      }, {
                        default: withCtx(() => [
                          createVNode(unref(Styles).OlStyle, null, {
                            default: withCtx(() => [
                              createVNode(unref(Styles).OlStyleStroke, {
                                color: "blue",
                                width: 2
                              }),
                              createVNode(unref(Styles).OlStyleFill, { color: "rgba(255, 255, 0, 0.4)" }),
                              createVNode(unref(Styles).OlStyleCircle, { radius: 5 }, {
                                default: withCtx(() => [
                                  createVNode(unref(Styles).OlStyleFill, { color: "#00dd11" }),
                                  createVNode(unref(Styles).OlStyleStroke, {
                                    color: "blue",
                                    width: 2
                                  })
                                ]),
                                _: 1
                              })
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }, 8, ["type", "onDrawend"])) : createCommentVNode("", true)
                    ]),
                    _: 1
                  }, 8, ["features", "format"]),
                  createVNode(unref(Styles).OlStyle, null, {
                    default: withCtx(() => [
                      createVNode(unref(Styles).OlStyleStroke, {
                        color: "red",
                        width: 2
                      }),
                      createVNode(unref(Styles).OlStyleFill, { color: "rgba(255,255,255,0.1)" }),
                      createVNode(unref(Styles).OlStyleCircle, { radius: 7 }, {
                        default: withCtx(() => [
                          createVNode(unref(Styles).OlStyleFill, { color: "red" })
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/GeometryDraw.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "Calendar",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    multiple: { type: Boolean },
    defaultValue: {},
    defaultPlaceholder: {},
    placeholder: {},
    pagedNavigation: { type: Boolean },
    preventDeselect: { type: Boolean },
    weekStartsOn: {},
    weekdayFormat: {},
    calendarLabel: {},
    fixedWeeks: { type: Boolean },
    maxValue: {},
    minValue: {},
    locale: {},
    numberOfMonths: {},
    disabled: { type: Boolean },
    readonly: { type: Boolean },
    initialFocus: { type: Boolean },
    isDateDisabled: { type: Function },
    isDateUnavailable: { type: Function },
    dir: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["update:modelValue", "update:placeholder"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarRoot), mergeProps({
        class: unref(cn)("p-3", props.class)
      }, unref(forwarded), _attrs), {
        default: withCtx(({ grid, weekDays }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(_sfc_main$4), null, {
              default: withCtx((_, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$1), null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$3), null, null, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$2), null, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(unref(_sfc_main$1)),
                    createVNode(unref(_sfc_main$3)),
                    createVNode(unref(_sfc_main$2))
                  ];
                }
              }),
              _: 2
            }, _parent2, _scopeId));
            _push2(`<div class="flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0"${_scopeId}><!--[-->`);
            ssrRenderList(grid, (month) => {
              _push2(ssrRenderComponent(unref(_sfc_main$9), {
                key: month.value.toString()
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$7), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(unref(_sfc_main$6), null, {
                            default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`<!--[-->`);
                                ssrRenderList(weekDays, (day) => {
                                  _push5(ssrRenderComponent(unref(_sfc_main$5), { key: day }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(`${ssrInterpolate(day)}`);
                                      } else {
                                        return [
                                          createTextVNode(toDisplayString(day), 1)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                });
                                _push5(`<!--]-->`);
                              } else {
                                return [
                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                    return openBlock(), createBlock(unref(_sfc_main$5), { key: day }, {
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
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(unref(_sfc_main$6), null, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                  return openBlock(), createBlock(unref(_sfc_main$5), { key: day }, {
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
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$8), null, {
                      default: withCtx((_2, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(month.rows, (weekDates, index) => {
                            _push4(ssrRenderComponent(unref(_sfc_main$6), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx((_3, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(`<!--[-->`);
                                  ssrRenderList(weekDates, (weekDate) => {
                                    _push5(ssrRenderComponent(unref(_sfc_main$b), {
                                      key: weekDate.toString(),
                                      date: weekDate
                                    }, {
                                      default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                        if (_push6) {
                                          _push6(ssrRenderComponent(unref(_sfc_main$a), {
                                            day: weekDate,
                                            month: month.value
                                          }, null, _parent6, _scopeId5));
                                        } else {
                                          return [
                                            createVNode(unref(_sfc_main$a), {
                                              day: weekDate,
                                              month: month.value
                                            }, null, 8, ["day", "month"])
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent5, _scopeId4));
                                  });
                                  _push5(`<!--]-->`);
                                } else {
                                  return [
                                    (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                      return openBlock(), createBlock(unref(_sfc_main$b), {
                                        key: weekDate.toString(),
                                        date: weekDate
                                      }, {
                                        default: withCtx(() => [
                                          createVNode(unref(_sfc_main$a), {
                                            day: weekDate,
                                            month: month.value
                                          }, null, 8, ["day", "month"])
                                        ]),
                                        _: 2
                                      }, 1032, ["date"]);
                                    }), 128))
                                  ];
                                }
                              }),
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                              return openBlock(), createBlock(unref(_sfc_main$6), {
                                key: `weekDate-${index}`,
                                class: "mt-2 w-full"
                              }, {
                                default: withCtx(() => [
                                  (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                    return openBlock(), createBlock(unref(_sfc_main$b), {
                                      key: weekDate.toString(),
                                      date: weekDate
                                    }, {
                                      default: withCtx(() => [
                                        createVNode(unref(_sfc_main$a), {
                                          day: weekDate,
                                          month: month.value
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
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$7), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                return openBlock(), createBlock(unref(_sfc_main$5), { key: day }, {
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
                      createVNode(unref(_sfc_main$8), null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                            return openBlock(), createBlock(unref(_sfc_main$6), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                  return openBlock(), createBlock(unref(_sfc_main$b), {
                                    key: weekDate.toString(),
                                    date: weekDate
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$a), {
                                        day: weekDate,
                                        month: month.value
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
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div>`);
          } else {
            return [
              createVNode(unref(_sfc_main$4), null, {
                default: withCtx(() => [
                  createVNode(unref(_sfc_main$1)),
                  createVNode(unref(_sfc_main$3)),
                  createVNode(unref(_sfc_main$2))
                ]),
                _: 1
              }),
              createVNode("div", { class: "flex flex-col gap-y-4 mt-4 sm:flex-row sm:gap-x-4 sm:gap-y-0" }, [
                (openBlock(true), createBlock(Fragment, null, renderList(grid, (month) => {
                  return openBlock(), createBlock(unref(_sfc_main$9), {
                    key: month.value.toString()
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$7), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$6), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(weekDays, (day) => {
                                return openBlock(), createBlock(unref(_sfc_main$5), { key: day }, {
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
                      createVNode(unref(_sfc_main$8), null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(month.rows, (weekDates, index) => {
                            return openBlock(), createBlock(unref(_sfc_main$6), {
                              key: `weekDate-${index}`,
                              class: "mt-2 w-full"
                            }, {
                              default: withCtx(() => [
                                (openBlock(true), createBlock(Fragment, null, renderList(weekDates, (weekDate) => {
                                  return openBlock(), createBlock(unref(_sfc_main$b), {
                                    key: weekDate.toString(),
                                    date: weekDate
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(_sfc_main$a), {
                                        day: weekDate,
                                        month: month.value
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
                  }, 1024);
                }), 128))
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/Calendar.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "CalendarCell",
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
      _push(ssrRenderComponent(unref(CalendarCell), mergeProps({
        class: unref(cn)("relative h-9 w-9 p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:rounded-md [&:has([data-selected])]:bg-accent [&:has([data-selected][data-outside-month])]:bg-accent/50", props.class)
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
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarCell.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "CalendarCellTrigger",
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
      _push(ssrRenderComponent(unref(CalendarCellTrigger), mergeProps({
        class: unref(cn)(
          unref(buttonVariants)({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal",
          "[&[data-today]:not([data-selected])]:bg-accent [&[data-today]:not([data-selected])]:text-accent-foreground",
          // Selected
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100 data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground",
          // Disabled
          "data-[disabled]:text-muted-foreground data-[disabled]:opacity-50",
          // Unavailable
          "data-[unavailable]:text-destructive-foreground data-[unavailable]:line-through",
          // Outside months
          "data-[outside-month]:pointer-events-none data-[outside-month]:text-muted-foreground data-[outside-month]:opacity-50 [&[data-outside-month][data-selected]]:bg-accent/50 [&[data-outside-month][data-selected]]:text-muted-foreground [&[data-outside-month][data-selected]]:opacity-30",
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
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarCellTrigger.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "CalendarGrid",
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
      _push(ssrRenderComponent(unref(CalendarGrid), mergeProps({
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
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGrid.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridBody",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarGridBody), mergeProps(props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridBody.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridHead",
  __ssrInlineRender: true,
  props: {
    asChild: { type: Boolean },
    as: {}
  },
  setup(__props) {
    const props = __props;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CalendarGridHead), mergeProps(props, _attrs), {
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridHead.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "CalendarGridRow",
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
      _push(ssrRenderComponent(unref(CalendarGridRow), mergeProps({
        class: unref(cn)("flex", props.class)
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
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarGridRow.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeadCell",
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
      _push(ssrRenderComponent(unref(CalendarHeadCell), mergeProps({
        class: unref(cn)("w-9 rounded-md text-[0.8rem] font-normal text-muted-foreground", props.class)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeadCell.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeader",
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
      _push(ssrRenderComponent(unref(CalendarHeader), mergeProps({
        class: unref(cn)("relative flex w-full items-center justify-between pt-1", props.class)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeader.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "CalendarHeading",
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
      _push(ssrRenderComponent(unref(CalendarHeading), mergeProps({
        class: unref(cn)("text-sm font-medium", props.class)
      }, unref(forwardedProps), _attrs), {
        default: withCtx(({ headingValue }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", { headingValue }, () => {
              _push2(`${ssrInterpolate(headingValue)}`);
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", { headingValue }, () => [
                createTextVNode(toDisplayString(headingValue), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarHeading.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "CalendarNextButton",
  __ssrInlineRender: true,
  props: {
    step: {},
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
      _push(ssrRenderComponent(unref(CalendarNext), mergeProps({
        class: unref(cn)(
          unref(buttonVariants)({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronRight), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronRight), { class: "h-4 w-4" })
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarNextButton.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CalendarPrevButton",
  __ssrInlineRender: true,
  props: {
    step: {},
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
      _push(ssrRenderComponent(unref(CalendarPrev), mergeProps({
        class: unref(cn)(
          unref(buttonVariants)({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
          props.class
        )
      }, unref(forwardedProps), _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, () => {
              _push2(ssrRenderComponent(unref(ChevronLeft), { class: "h-4 w-4" }, null, _parent2, _scopeId));
            }, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, () => [
                createVNode(unref(ChevronLeft), { class: "h-4 w-4" })
              ])
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/calendar/CalendarPrevButton.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const spatialReferenceSystemRaw = "EPSG:28992\nEPSG:4326\nEPSG:3857\nEPSG:25831\nEPSG:25832\nEPSG:3035\nEPSG:3812\nEPSG:5243\nEPSG:4839";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a;
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const id = route.params.id;
    const readOnly = route.query.readonly ? "readonly" : "";
    const readOnlyTag = readOnly ? "readOnly" : void 0;
    let crsArray = spatialReferenceSystemRaw.split("\n");
    let spatialReferenceSystem = crsArray.sort().map((item) => {
      return { label: item, value: item };
    });
    spatialReferenceSystem.unshift({
      label: "not applicable",
      value: "not applicable"
    });
    let keywords = ref([]);
    let assets = ref({
      [nanoid()]: {}
    });
    function addAsset() {
      assets.value[nanoid()] = {};
    }
    function removeAsset(id2) {
      delete assets.value[id2];
    }
    function handleChange(e) {
      if (readOnly) return;
      const index = keywords.value.findIndex((item) => item.id == e.id);
      if (index == -1) {
        keywords.value.push(e);
      } else {
        keywords.value.splice(index, 1);
      }
    }
    let updatedGeometry = ref();
    let geometry = ref({
      type: "FeatureCollection",
      features: []
    });
    function setValue(updateGeometry) {
      updatedGeometry.value = updateGeometry;
    }
    function isSelected(e) {
      return keywords.value.find((item) => item.id == e.id) !== void 0;
    }
    new DateFormatter("en-US", {
      dateStyle: "long"
    });
    let { data: collectionsResponse, error } = ([__temp, __restore] = withAsyncContext(() => useApi("/collections", {
      server: true
    }, "$FRYjk9Ro18")), __temp = await __temp, __restore(), __temp);
    const update = id !== "create";
    let feature = null;
    if (update) {
      let { data: item } = ([__temp, __restore] = withAsyncContext(() => useApi("/search", {
        query: { ids: id }
      }, "$UNCvPTTOyy")), __temp = await __temp, __restore(), __temp);
      feature = item.value.features[0];
      keywords.value = feature.properties.keywords;
      if (feature.geometry) {
        geometry.value.features.push(feature.geometry);
        updatedGeometry.value = geometry.value;
      }
      assets.value = feature.assets;
    }
    let { data: userData } = ([__temp, __restore] = withAsyncContext(() => useApi("/api/auth/me", "$SqtZKeOylM")), __temp = await __temp, __restore(), __temp);
    const createOrUpdateTitle = update ? "Update an existing registration" : "Register a new item";
    const title = readOnly ? "View registration" : createOrUpdateTitle;
    let collections = ((_a = collectionsResponse.value) == null ? void 0 : _a.collections) ?? [];
    const selectedCollection = update ? collections.find((item) => item.id == feature.collection) : null;
    const collectionOptions = collections.map((collection) => ({
      value: collection.id,
      label: collection.description
    }));
    const languages = [
      { value: "eng", label: "English" },
      { value: "dut", label: "Dutch" },
      { value: "ger", label: "German" },
      { value: "fre", label: "French" }
    ];
    const legalRestrictionsOptions = [
      { value: "copyright", label: "copyright" },
      { value: "patent", label: "patent" },
      { value: "patentPending", label: "patent pending" },
      { value: "trademark ", label: "trademark" },
      { value: "license", label: "license" },
      {
        value: "intellectualPropertyRights ",
        label: "intellectual property rights"
      },
      { value: "restricted ", label: "Prohibition of distribution and use" }
    ];
    let { $api } = useNuxtApp();
    let formSchema = toTypedSchema(
      z.object({
        collectionId: z.string().default(feature == null ? void 0 : feature.collection),
        requestBody: z.object({
          bbox: z.union([
            z.tuple([z.number(), z.number(), z.number(), z.number()]),
            z.tuple([
              z.number(),
              z.number(),
              z.number(),
              z.number(),
              z.number(),
              z.number()
            ])
          ]).nullable().optional(),
          type: z.literal("Feature").default("Feature"),
          // TODO: Fix any type to the complicated geometry type. Perhaps using turf.js or something
          geometry: z.union([
            zu.geojson.point(),
            zu.geojson.multiPoint(),
            zu.geojson.lineString(),
            zu.geojson.multiLineString(),
            zu.geojson.polygon(),
            zu.geojson.multiPolygon(),
            zu.geojson.geometryCollection()
          ]).nullable().default(null),
          properties: z.object({
            title: z.string().default(feature == null ? void 0 : feature.properties.title),
            projectNumber: z.string().default(feature == null ? void 0 : feature.properties.projectNumber),
            description: z.string().default(feature == null ? void 0 : feature.properties.description),
            datetime: z.string().default(feature == null ? void 0 : feature.properties.datetime).transform((v) => {
              return new Date(v).toISOString();
            }),
            spatialReferenceSystem: z.string().default(feature == null ? void 0 : feature.properties.spatialReferenceSystem),
            dataQualityInfoStatement: z.string().default(feature == null ? void 0 : feature.properties.dataQualityInfoStatement),
            dataQualityInfoScore: z.string().default("dataSet"),
            dateType: z.string().optional().default("publication"),
            legalRestrictions: z.string().default(
              feature ? feature.properties.legalRestrictions : "license"
            ),
            restrictionsOfUse: z.string().default(feature == null ? void 0 : feature.properties.restrictionsOfUse),
            metadataStandardName: z.string().default("ISO 19115"),
            metadataStandardVersion: z.string().default("2.1.0"),
            progressCode: z.string().default("completed"),
            language: z.string().default(feature ? feature.properties.language : "eng"),
            hierarchyLevel: z.string().default("dataSet"),
            originatorDataEmail: z.string().default(feature == null ? void 0 : feature.properties.originatorDataEmail),
            originatorDataRoleCode: z.string().default("originator"),
            originatorDataOrganisation: z.string().default("Deltares"),
            originatorMetaDataOrganisation: z.string().default("Deltares"),
            originatorMetaDataEmail: z.string().default(userData.value.email),
            originatorMetaDataRoleCode: z.string().default("originator"),
            metaDataLanguage: z.string().default("eng"),
            metaDataDateTime: z.date().default(/* @__PURE__ */ new Date()),
            created: z.string().nullable().optional(),
            updated: z.string().nullable().optional(),
            start_datetime: z.string().nullable().optional(),
            end_datetime: z.string().nullable().optional(),
            license: z.string().nullable().optional(),
            providers: z.array(
              z.object({
                name: z.string(),
                description: z.string().nullable().optional(),
                role: z.array(z.string()).nullable().optional(),
                url: z.string().nullable().optional()
              })
            ).nullable().optional(),
            constellation: z.string().nullable().optional(),
            mission: z.string().nullable().optional(),
            gsd: z.number().nullable().optional()
          }).passthrough(),
          id: z.string().default(nanoid()),
          stac_version: z.string().default("1.0.0"),
          stac_extensions: z.array(z.string()).nullable().optional().default([]),
          assets: z.record(
            z.object({
              href: z.string(),
              type: z.string().nullable().optional(),
              title: z.string().nullable().optional(),
              description: z.string().nullable().optional(),
              roles: z.array(z.string()).nullable().optional()
            })
          ).default(assets.value),
          links: z.record(
            z.object({
              href: z.string(),
              rel: z.string(),
              type: z.union([
                z.literal("image/tiff; application=geotiff"),
                z.literal(
                  "image/tiff; application=geotiff; profile=cloud-optimized"
                ),
                z.literal("image/jp2"),
                z.literal("image/png"),
                z.literal("image/jpeg"),
                z.literal("application/geo+json"),
                z.literal("application/geopackage+sqlite3"),
                z.literal("application/vnd.google-earth.kml+xml"),
                z.literal("application/vnd.google-earth.kmz"),
                z.literal("application/x-hdf"),
                z.literal("application/x-hdf5"),
                z.literal("application/xml"),
                z.literal("application/json"),
                z.literal("text/html"),
                z.literal("text/plain"),
                z.literal("application/vnd.oai.openapi+json;version=3.0"),
                z.literal("application/schema+json")
              ]).nullable().optional(),
              title: z.string().nullable().optional(),
              "label:assets": z.string().nullable().optional()
            })
          ).default({}).transform((val) => Object.values(val))
        })
        // TODO: extract type
      })
    );
    let { toast } = useToast();
    let form = useForm({
      validationSchema: formSchema
    });
    const keywordsGroups = computedAsync(async () => {
      const collectionId = update ? feature.collection : form.values.collectionId;
      const collection = await $api("/collections/{collection_id}", {
        path: {
          collection_id: collectionId
        }
      });
      const keywordsLink = collection.links.find(
        (item) => item.rel = item.id
      );
      const facilityId = keywordsLink.id;
      return await $api("/api/keywords", {
        query: {
          facility_id: facilityId
        }
      });
    }, []);
    let onSubmit = form.handleSubmit(async (values) => {
      var _a2, _b, _c;
      try {
        let url = "/collections/{collection_id}/items";
        if (update) url = url + "/" + feature.id;
        const newItem = {
          ...values.requestBody,
          collection: update ? feature.collection : values.collectionId
        };
        newItem.properties.keywords = keywords.value;
        if ((_a2 = updatedGeometry.value) == null ? void 0 : _a2.features[0]) {
          newItem.geometry = ((_b = updatedGeometry.value) == null ? void 0 : _b.features[0].geometry) ? (_c = updatedGeometry.value) == null ? void 0 : _c.features[0].geometry : feature == null ? void 0 : feature.geometry;
          newItem.bbox = newItem.geometry ? bbox(newItem.geometry) : void 0;
        }
        let data = await $api(url, {
          method: update ? "put" : "post",
          body: newItem,
          headers: {
            "Content-Type": "application/json"
          },
          path: {
            collection_id: values.collectionId
          }
        });
        toast({
          title: "Data registered successfully"
        });
        await navigateTo(`/items`);
      } catch (error2) {
        console.log(error2);
        toast({
          title: "Something went wrong!",
          variant: "destructive"
        });
      }
    });
    watch(form.errors, () => {
    });
    let datetimeValue = computed({
      get: () => {
        var _a2, _b, _c, _d;
        return ((_b = (_a2 = form.values.requestBody) == null ? void 0 : _a2.properties) == null ? void 0 : _b.datetime) ? parseDate((_d = (_c = form.values.requestBody) == null ? void 0 : _c.properties) == null ? void 0 : _d.datetime) : void 0;
      },
      set: (val) => val
    });
    function getDisplayTime() {
      if (!datetimeValue.value && update) {
        return dateFormat(new Date(feature.properties.datetime), "yyyy-mm-dd");
      }
      return datetimeValue.value ? datetimeValue.value : "Pick a date";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FormControl = _sfc_main$m;
      const _component_CardTitle = _sfc_main$n;
      const _component_FormLabel = _sfc_main$o;
      const _component_FormMessage = _sfc_main$p;
      const _component_Input = _sfc_main$q;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Popover = _sfc_main$r;
      const _component_PopoverTrigger = _sfc_main$s;
      const _component_Label = _sfc_main$t;
      const _component_PopoverContent = _sfc_main$u;
      const _component_ClientOnly = __nuxt_component_10;
      const _component_GeometryDraw = _sfc_main$d;
      const _component_Checkbox = _sfc_main$v;
      _push(ssrRenderComponent(_sfc_main$f, mergeProps({ class: "py-8" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h1 class="text-3xl flex font-semibold"${_scopeId}>${ssrInterpolate(unref(title))}</h1><form${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Field), { name: "requestBody.type" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_FormControl, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`<input type="hidden" name="requestBody.type" value="Feature"${_scopeId3}>`);
                      } else {
                        return [
                          createVNode("input", {
                            type: "hidden",
                            name: "requestBody.type",
                            value: "Feature"
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_FormControl, null, {
                      default: withCtx(() => [
                        createVNode("input", {
                          type: "hidden",
                          name: "requestBody.type",
                          value: "Feature"
                        })
                      ]),
                      _: 1
                    })
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`<div class="mt-8 grid grid-flow-row gap-5"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_CardTitle, { class: "text-lg" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Data set collection`);
                            } else {
                              return [
                                createTextVNode("Data set collection")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Data set collection")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(unref(_sfc_main$i), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(unref(Field), { name: "collectionId" }, {
                          default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                  if (_push6) {
                                    _push6(ssrRenderComponent(_component_FormLabel, null, {
                                      default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                        if (_push7) {
                                          _push7(`Collection`);
                                        } else {
                                          return [
                                            createTextVNode("Collection")
                                          ];
                                        }
                                      }),
                                      _: 2
                                    }, _parent6, _scopeId5));
                                    if (update) {
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          var _a2, _b;
                                          if (_push7) {
                                            _push7(`${ssrInterpolate((_a2 = unref(selectedCollection)) == null ? void 0 : _a2.description)}`);
                                          } else {
                                            return [
                                              createTextVNode(toDisplayString((_b = unref(selectedCollection)) == null ? void 0 : _b.description), 1)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    if (!update) {
                                      _push6(ssrRenderComponent(_component_FormControl, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_sfc_main$k, mergeProps({ options: unref(collectionOptions) }, componentField), null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_sfc_main$k, mergeProps({ options: unref(collectionOptions) }, componentField), null, 16, ["options"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      _push6(`<!---->`);
                                    }
                                    _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                  } else {
                                    return [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Collection")
                                        ]),
                                        _: 1
                                      }),
                                      update ? (openBlock(), createBlock(_component_FormLabel, { key: 0 }, {
                                        default: withCtx(() => {
                                          var _a2;
                                          return [
                                            createTextVNode(toDisplayString((_a2 = unref(selectedCollection)) == null ? void 0 : _a2.description), 1)
                                          ];
                                        }),
                                        _: 1
                                      })) : createCommentVNode("", true),
                                      !update ? (openBlock(), createBlock(_component_FormControl, { key: 1 }, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$k, mergeProps({ options: unref(collectionOptions) }, componentField), null, 16, ["options"])
                                        ]),
                                        _: 2
                                      }, 1024)) : createCommentVNode("", true),
                                      createVNode(_component_FormMessage)
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent5, _scopeId4));
                            } else {
                              return [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Collection")
                                      ]),
                                      _: 1
                                    }),
                                    update ? (openBlock(), createBlock(_component_FormLabel, { key: 0 }, {
                                      default: withCtx(() => {
                                        var _a2;
                                        return [
                                          createTextVNode(toDisplayString((_a2 = unref(selectedCollection)) == null ? void 0 : _a2.description), 1)
                                        ];
                                      }),
                                      _: 1
                                    })) : createCommentVNode("", true),
                                    !update ? (openBlock(), createBlock(_component_FormControl, { key: 1 }, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$k, mergeProps({ options: unref(collectionOptions) }, componentField), null, 16, ["options"])
                                      ]),
                                      _: 2
                                    }, 1024)) : createCommentVNode("", true),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(unref(Field), { name: "collectionId" }, {
                            default: withCtx(({ componentField }) => [
                              createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                default: withCtx(() => [
                                  createVNode(_component_FormLabel, null, {
                                    default: withCtx(() => [
                                      createTextVNode("Collection")
                                    ]),
                                    _: 1
                                  }),
                                  update ? (openBlock(), createBlock(_component_FormLabel, { key: 0 }, {
                                    default: withCtx(() => {
                                      var _a2;
                                      return [
                                        createTextVNode(toDisplayString((_a2 = unref(selectedCollection)) == null ? void 0 : _a2.description), 1)
                                      ];
                                    }),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  !update ? (openBlock(), createBlock(_component_FormControl, { key: 1 }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$k, mergeProps({ options: unref(collectionOptions) }, componentField), null, 16, ["options"])
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true),
                                  createVNode(_component_FormMessage)
                                ]),
                                _: 2
                              }, 1024)
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
                    createVNode(unref(_sfc_main$h), null, {
                      default: withCtx(() => [
                        createVNode(_component_CardTitle, { class: "text-lg" }, {
                          default: withCtx(() => [
                            createTextVNode("Data set collection")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(unref(_sfc_main$i), null, {
                      default: withCtx(() => [
                        createVNode(unref(Field), { name: "collectionId" }, {
                          default: withCtx(({ componentField }) => [
                            createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                              default: withCtx(() => [
                                createVNode(_component_FormLabel, null, {
                                  default: withCtx(() => [
                                    createTextVNode("Collection")
                                  ]),
                                  _: 1
                                }),
                                update ? (openBlock(), createBlock(_component_FormLabel, { key: 0 }, {
                                  default: withCtx(() => {
                                    var _a2;
                                    return [
                                      createTextVNode(toDisplayString((_a2 = unref(selectedCollection)) == null ? void 0 : _a2.description), 1)
                                    ];
                                  }),
                                  _: 1
                                })) : createCommentVNode("", true),
                                !update ? (openBlock(), createBlock(_component_FormControl, { key: 1 }, {
                                  default: withCtx(() => [
                                    createVNode(_sfc_main$k, mergeProps({ options: unref(collectionOptions) }, componentField), null, 16, ["options"])
                                  ]),
                                  _: 2
                                }, 1024)) : createCommentVNode("", true),
                                createVNode(_component_FormMessage)
                              ]),
                              _: 2
                            }, 1024)
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
            if (update || unref(form).values.collectionId) {
              _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_CardTitle, { class: "text-lg" }, {
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
                            createVNode(_component_CardTitle, { class: "text-lg" }, {
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
                    _push3(ssrRenderComponent(unref(_sfc_main$i), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="max-w-196 flex flex-col gap-5"${_scopeId3}>`);
                          _push4(ssrRenderComponent(unref(Field), { name: "requestBody.properties.projectNumber" }, {
                            default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Project number`);
                                          } else {
                                            return [
                                              createTextVNode("Project number")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormControl, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_Input, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_Input, mergeProps({
                                                readonly: unref(readOnlyTag),
                                                type: "text"
                                              }, componentField), null, 16, ["readonly"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Project number")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, 16, ["readonly"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Project number")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
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
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Field), { name: "requestBody.properties.title" }, {
                            default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Project title`);
                                          } else {
                                            return [
                                              createTextVNode("Project title")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormControl, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_Input, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_Input, mergeProps({
                                                readonly: unref(readOnlyTag),
                                                type: "text"
                                              }, componentField), null, 16, ["readonly"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Project title")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, 16, ["readonly"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Project title")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
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
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Field), { name: "requestBody.properties.datetime" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                  default: withCtx((_5, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#datum-type-van-de-bron"
                                            }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Publication date`);
                                                } else {
                                                  return [
                                                    createTextVNode("Publication date")
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_NuxtLink, {
                                                target: "_blank",
                                                external: "",
                                                to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#datum-type-van-de-bron"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Publication date")
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_Popover, null, {
                                        default: withCtx((_6, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_PopoverTrigger, { "as-child": "" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_FormControl, null, {
                                                    default: withCtx((_8, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        if (!unref(readOnly)) {
                                                          _push9(ssrRenderComponent(unref(_sfc_main$e), {
                                                            variant: "outline",
                                                            class: unref(cn)(
                                                              "w-[240px] ps-3 text-start font-normal",
                                                              !unref(datetimeValue) && "text-muted-foreground"
                                                            )
                                                          }, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(`<span${_scopeId9}>${ssrInterpolate(getDisplayTime())}</span>`);
                                                                _push10(ssrRenderComponent(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" }, null, _parent10, _scopeId9));
                                                              } else {
                                                                return [
                                                                  createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                                  createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                                ];
                                                              }
                                                            }),
                                                            _: 1
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          _push9(`<!---->`);
                                                        }
                                                        if (unref(readOnly)) {
                                                          _push9(ssrRenderComponent(_component_Label, null, {
                                                            default: withCtx((_9, _push10, _parent10, _scopeId9) => {
                                                              if (_push10) {
                                                                _push10(`${ssrInterpolate(getDisplayTime())}`);
                                                              } else {
                                                                return [
                                                                  createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                                ];
                                                              }
                                                            }),
                                                            _: 1
                                                          }, _parent9, _scopeId8));
                                                        } else {
                                                          _push9(`<!---->`);
                                                        }
                                                        _push9(`<input hidden${_scopeId8}>`);
                                                      } else {
                                                        return [
                                                          !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                            key: 0,
                                                            variant: "outline",
                                                            class: unref(cn)(
                                                              "w-[240px] ps-3 text-start font-normal",
                                                              !unref(datetimeValue) && "text-muted-foreground"
                                                            )
                                                          }, {
                                                            default: withCtx(() => [
                                                              createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                              createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                            ]),
                                                            _: 1
                                                          }, 8, ["class"])) : createCommentVNode("", true),
                                                          unref(readOnly) ? (openBlock(), createBlock(_component_Label, { key: 1 }, {
                                                            default: withCtx(() => [
                                                              createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                            ]),
                                                            _: 1
                                                          })) : createCommentVNode("", true),
                                                          createVNode("input", { hidden: "" })
                                                        ];
                                                      }
                                                    }),
                                                    _: 1
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_FormControl, null, {
                                                      default: withCtx(() => [
                                                        !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                          key: 0,
                                                          variant: "outline",
                                                          class: unref(cn)(
                                                            "w-[240px] ps-3 text-start font-normal",
                                                            !unref(datetimeValue) && "text-muted-foreground"
                                                          )
                                                        }, {
                                                          default: withCtx(() => [
                                                            createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                            createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                          ]),
                                                          _: 1
                                                        }, 8, ["class"])) : createCommentVNode("", true),
                                                        unref(readOnly) ? (openBlock(), createBlock(_component_Label, { key: 1 }, {
                                                          default: withCtx(() => [
                                                            createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                          ]),
                                                          _: 1
                                                        })) : createCommentVNode("", true),
                                                        createVNode("input", { hidden: "" })
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_PopoverContent, { class: "w-auto p-0" }, {
                                              default: withCtx((_7, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(unref(_sfc_main$c), {
                                                    modelValue: unref(datetimeValue),
                                                    "onUpdate:modelValue": [
                                                      ($event) => isRef(datetimeValue) ? datetimeValue.value = $event : datetimeValue = $event,
                                                      (v) => {
                                                        if (v) {
                                                          unref(form).setFieldValue(
                                                            "requestBody.properties.datetime",
                                                            v.toString()
                                                          );
                                                        } else {
                                                          unref(form).setFieldValue(
                                                            "requestBody.properties.datetime",
                                                            void 0
                                                          );
                                                        }
                                                      }
                                                    ],
                                                    "calendar-label": "Date",
                                                    "initial-focus": ""
                                                  }, null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(unref(_sfc_main$c), {
                                                      modelValue: unref(datetimeValue),
                                                      "onUpdate:modelValue": [
                                                        ($event) => isRef(datetimeValue) ? datetimeValue.value = $event : datetimeValue = $event,
                                                        (v) => {
                                                          if (v) {
                                                            unref(form).setFieldValue(
                                                              "requestBody.properties.datetime",
                                                              v.toString()
                                                            );
                                                          } else {
                                                            unref(form).setFieldValue(
                                                              "requestBody.properties.datetime",
                                                              void 0
                                                            );
                                                          }
                                                        }
                                                      ],
                                                      "calendar-label": "Date",
                                                      "initial-focus": ""
                                                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                  ];
                                                }
                                              }),
                                              _: 1
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_PopoverTrigger, { "as-child": "" }, {
                                                default: withCtx(() => [
                                                  createVNode(_component_FormControl, null, {
                                                    default: withCtx(() => [
                                                      !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                        key: 0,
                                                        variant: "outline",
                                                        class: unref(cn)(
                                                          "w-[240px] ps-3 text-start font-normal",
                                                          !unref(datetimeValue) && "text-muted-foreground"
                                                        )
                                                      }, {
                                                        default: withCtx(() => [
                                                          createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                          createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                        ]),
                                                        _: 1
                                                      }, 8, ["class"])) : createCommentVNode("", true),
                                                      unref(readOnly) ? (openBlock(), createBlock(_component_Label, { key: 1 }, {
                                                        default: withCtx(() => [
                                                          createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                        ]),
                                                        _: 1
                                                      })) : createCommentVNode("", true),
                                                      createVNode("input", { hidden: "" })
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_PopoverContent, { class: "w-auto p-0" }, {
                                                default: withCtx(() => [
                                                  createVNode(unref(_sfc_main$c), {
                                                    modelValue: unref(datetimeValue),
                                                    "onUpdate:modelValue": [
                                                      ($event) => isRef(datetimeValue) ? datetimeValue.value = $event : datetimeValue = $event,
                                                      (v) => {
                                                        if (v) {
                                                          unref(form).setFieldValue(
                                                            "requestBody.properties.datetime",
                                                            v.toString()
                                                          );
                                                        } else {
                                                          unref(form).setFieldValue(
                                                            "requestBody.properties.datetime",
                                                            void 0
                                                          );
                                                        }
                                                      }
                                                    ],
                                                    "calendar-label": "Date",
                                                    "initial-focus": ""
                                                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                                ]),
                                                _: 2
                                              }, 1024)
                                            ];
                                          }
                                        }),
                                        _: 1
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#datum-type-van-de-bron"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Publication date")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_Popover, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_PopoverTrigger, { "as-child": "" }, {
                                              default: withCtx(() => [
                                                createVNode(_component_FormControl, null, {
                                                  default: withCtx(() => [
                                                    !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                      key: 0,
                                                      variant: "outline",
                                                      class: unref(cn)(
                                                        "w-[240px] ps-3 text-start font-normal",
                                                        !unref(datetimeValue) && "text-muted-foreground"
                                                      )
                                                    }, {
                                                      default: withCtx(() => [
                                                        createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                        createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                      ]),
                                                      _: 1
                                                    }, 8, ["class"])) : createCommentVNode("", true),
                                                    unref(readOnly) ? (openBlock(), createBlock(_component_Label, { key: 1 }, {
                                                      default: withCtx(() => [
                                                        createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                      ]),
                                                      _: 1
                                                    })) : createCommentVNode("", true),
                                                    createVNode("input", { hidden: "" })
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_PopoverContent, { class: "w-auto p-0" }, {
                                              default: withCtx(() => [
                                                createVNode(unref(_sfc_main$c), {
                                                  modelValue: unref(datetimeValue),
                                                  "onUpdate:modelValue": [
                                                    ($event) => isRef(datetimeValue) ? datetimeValue.value = $event : datetimeValue = $event,
                                                    (v) => {
                                                      if (v) {
                                                        unref(form).setFieldValue(
                                                          "requestBody.properties.datetime",
                                                          v.toString()
                                                        );
                                                      } else {
                                                        unref(form).setFieldValue(
                                                          "requestBody.properties.datetime",
                                                          void 0
                                                        );
                                                      }
                                                    }
                                                  ],
                                                  "calendar-label": "Date",
                                                  "initial-focus": ""
                                                }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                              ]),
                                              _: 2
                                            }, 1024)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ];
                                    }
                                  }),
                                  _: 1
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_NuxtLink, {
                                            target: "_blank",
                                            external: "",
                                            to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#datum-type-van-de-bron"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Publication date")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_Popover, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_PopoverTrigger, { "as-child": "" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_FormControl, null, {
                                                default: withCtx(() => [
                                                  !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                    key: 0,
                                                    variant: "outline",
                                                    class: unref(cn)(
                                                      "w-[240px] ps-3 text-start font-normal",
                                                      !unref(datetimeValue) && "text-muted-foreground"
                                                    )
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                      createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                    ]),
                                                    _: 1
                                                  }, 8, ["class"])) : createCommentVNode("", true),
                                                  unref(readOnly) ? (openBlock(), createBlock(_component_Label, { key: 1 }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                    ]),
                                                    _: 1
                                                  })) : createCommentVNode("", true),
                                                  createVNode("input", { hidden: "" })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_PopoverContent, { class: "w-auto p-0" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$c), {
                                                modelValue: unref(datetimeValue),
                                                "onUpdate:modelValue": [
                                                  ($event) => isRef(datetimeValue) ? datetimeValue.value = $event : datetimeValue = $event,
                                                  (v) => {
                                                    if (v) {
                                                      unref(form).setFieldValue(
                                                        "requestBody.properties.datetime",
                                                        v.toString()
                                                      );
                                                    } else {
                                                      unref(form).setFieldValue(
                                                        "requestBody.properties.datetime",
                                                        void 0
                                                      );
                                                    }
                                                  }
                                                ],
                                                "calendar-label": "Date",
                                                "initial-focus": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 2
                                          }, 1024)
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
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Field), { name: "requestBody.properties.description" }, {
                            default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Description`);
                                          } else {
                                            return [
                                              createTextVNode("Description")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormControl, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_sfc_main$l, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_sfc_main$l, mergeProps({
                                                readonly: unref(readOnlyTag),
                                                type: "text"
                                              }, componentField), null, 16, ["readonly"])
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Description")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_sfc_main$l, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, 16, ["readonly"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Description")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$l, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
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
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Field), { name: "requestBody.properties.language" }, {
                            default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Language`);
                                          } else {
                                            return [
                                              createTextVNode("Language")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      if (!unref(readOnly)) {
                                        _push6(ssrRenderComponent(_sfc_main$k, mergeProps({ options: languages }, componentField), null, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(ssrRenderComponent(_component_FormControl, null, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Language")
                                          ]),
                                          _: 1
                                        }),
                                        !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                          key: 0,
                                          options: languages
                                        }, componentField), null, 16)) : createCommentVNode("", true),
                                        createVNode(_component_FormControl),
                                        createVNode(_component_FormMessage)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Language")
                                        ]),
                                        _: 1
                                      }),
                                      !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                        key: 0,
                                        options: languages
                                      }, componentField), null, 16)) : createCommentVNode("", true),
                                      createVNode(_component_FormControl),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Field), { name: "requestBody.properties.legalRestrictions" }, {
                            default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div${_scopeId5}>`);
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#juridische-toegangsrestricties"
                                            }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Legal restrictions`);
                                                } else {
                                                  return [
                                                    createTextVNode("Legal restrictions")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_NuxtLink, {
                                                target: "_blank",
                                                external: "",
                                                to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#juridische-toegangsrestricties"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Legal restrictions")
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(`</div>`);
                                      if (!unref(readOnly)) {
                                        _push6(ssrRenderComponent(_sfc_main$k, mergeProps({ options: legalRestrictionsOptions }, componentField), null, _parent6, _scopeId5));
                                      } else {
                                        _push6(`<!---->`);
                                      }
                                      _push6(ssrRenderComponent(_component_FormControl, null, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode("div", null, [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_NuxtLink, {
                                                target: "_blank",
                                                external: "",
                                                to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#juridische-toegangsrestricties"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Legal restrictions")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                          key: 0,
                                          options: legalRestrictionsOptions
                                        }, componentField), null, 16)) : createCommentVNode("", true),
                                        createVNode(_component_FormControl),
                                        createVNode(_component_FormMessage)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#juridische-toegangsrestricties"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Legal restrictions")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                        key: 0,
                                        options: legalRestrictionsOptions
                                      }, componentField), null, 16)) : createCommentVNode("", true),
                                      createVNode(_component_FormControl),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Field), { name: "requestBody.properties.restrictionsOfUse" }, {
                            default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(`<div class="flex items-start"${_scopeId5}>`);
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#gebruiksbeperkingen"
                                            }, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Applications for which this data set is not suitable`);
                                                } else {
                                                  return [
                                                    createTextVNode("Applications for which this data set is not suitable")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_NuxtLink, {
                                                target: "_blank",
                                                external: "",
                                                to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#gebruiksbeperkingen"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Applications for which this data set is not suitable")
                                                ]),
                                                _: 1
                                              })
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(`</div>`);
                                      _push6(ssrRenderComponent(_sfc_main$l, mergeProps({
                                        readonly: unref(readOnlyTag),
                                        type: "text"
                                      }, componentField), null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormControl, null, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode("div", { class: "flex items-start" }, [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_NuxtLink, {
                                                target: "_blank",
                                                external: "",
                                                to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#gebruiksbeperkingen"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Applications for which this data set is not suitable")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        createVNode(_sfc_main$l, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"]),
                                        createVNode(_component_FormControl),
                                        createVNode(_component_FormMessage)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "flex items-start" }, [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#gebruiksbeperkingen"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Applications for which this data set is not suitable")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      createVNode(_sfc_main$l, mergeProps({
                                        readonly: unref(readOnlyTag),
                                        type: "text"
                                      }, componentField), null, 16, ["readonly"]),
                                      createVNode(_component_FormControl),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(Field), { name: "requestBody.properties.spatialReferenceSystem" }, {
                            default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(_component_FormLabel, null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(`Spatial reference system (choose one from the list or define a custom one)`);
                                          } else {
                                            return [
                                              createTextVNode("Spatial reference system (choose one from the list or define a custom one)")
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                      _push6(`<div class="flex flex-row space-x-4"${_scopeId5}>`);
                                      _push6(ssrRenderComponent(_sfc_main$k, mergeProps({ options: unref(spatialReferenceSystem) }, componentField), null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_Input, mergeProps({
                                        readonly: unref(readOnlyTag),
                                        type: "text"
                                      }, componentField), null, _parent6, _scopeId5));
                                      _push6(`</div>`);
                                      _push6(ssrRenderComponent(_component_FormControl, null, null, _parent6, _scopeId5));
                                      _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Spatial reference system (choose one from the list or define a custom one)")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode("div", { class: "flex flex-row space-x-4" }, [
                                          createVNode(_sfc_main$k, mergeProps({ options: unref(spatialReferenceSystem) }, componentField), null, 16, ["options"]),
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        createVNode(_component_FormControl),
                                        createVNode(_component_FormMessage)
                                      ];
                                    }
                                  }),
                                  _: 2
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Spatial reference system (choose one from the list or define a custom one)")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "flex flex-row space-x-4" }, [
                                        createVNode(_sfc_main$k, mergeProps({ options: unref(spatialReferenceSystem) }, componentField), null, 16, ["options"]),
                                        createVNode(_component_Input, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"])
                                      ]),
                                      createVNode(_component_FormControl),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "max-w-196 flex flex-col gap-5" }, [
                              createVNode(unref(Field), { name: "requestBody.properties.projectNumber" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Project number")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.title" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Project title")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.datetime" }, {
                                default: withCtx(() => [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_NuxtLink, {
                                            target: "_blank",
                                            external: "",
                                            to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#datum-type-van-de-bron"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Publication date")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_Popover, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_PopoverTrigger, { "as-child": "" }, {
                                            default: withCtx(() => [
                                              createVNode(_component_FormControl, null, {
                                                default: withCtx(() => [
                                                  !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                    key: 0,
                                                    variant: "outline",
                                                    class: unref(cn)(
                                                      "w-[240px] ps-3 text-start font-normal",
                                                      !unref(datetimeValue) && "text-muted-foreground"
                                                    )
                                                  }, {
                                                    default: withCtx(() => [
                                                      createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                      createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                    ]),
                                                    _: 1
                                                  }, 8, ["class"])) : createCommentVNode("", true),
                                                  unref(readOnly) ? (openBlock(), createBlock(_component_Label, { key: 1 }, {
                                                    default: withCtx(() => [
                                                      createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                    ]),
                                                    _: 1
                                                  })) : createCommentVNode("", true),
                                                  createVNode("input", { hidden: "" })
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_PopoverContent, { class: "w-auto p-0" }, {
                                            default: withCtx(() => [
                                              createVNode(unref(_sfc_main$c), {
                                                modelValue: unref(datetimeValue),
                                                "onUpdate:modelValue": [
                                                  ($event) => isRef(datetimeValue) ? datetimeValue.value = $event : datetimeValue = $event,
                                                  (v) => {
                                                    if (v) {
                                                      unref(form).setFieldValue(
                                                        "requestBody.properties.datetime",
                                                        v.toString()
                                                      );
                                                    } else {
                                                      unref(form).setFieldValue(
                                                        "requestBody.properties.datetime",
                                                        void 0
                                                      );
                                                    }
                                                  }
                                                ],
                                                "calendar-label": "Date",
                                                "initial-focus": ""
                                              }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                            ]),
                                            _: 2
                                          }, 1024)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1024),
                              createVNode(unref(Field), { name: "requestBody.properties.description" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Description")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$l, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.language" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Language")
                                        ]),
                                        _: 1
                                      }),
                                      !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                        key: 0,
                                        options: languages
                                      }, componentField), null, 16)) : createCommentVNode("", true),
                                      createVNode(_component_FormControl),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.legalRestrictions" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                    default: withCtx(() => [
                                      createVNode("div", null, [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#juridische-toegangsrestricties"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Legal restrictions")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                        key: 0,
                                        options: legalRestrictionsOptions
                                      }, componentField), null, 16)) : createCommentVNode("", true),
                                      createVNode(_component_FormControl),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.restrictionsOfUse" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                    default: withCtx(() => [
                                      createVNode("div", { class: "flex items-start" }, [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#gebruiksbeperkingen"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Applications for which this data set is not suitable")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      createVNode(_sfc_main$l, mergeProps({
                                        readonly: unref(readOnlyTag),
                                        type: "text"
                                      }, componentField), null, 16, ["readonly"]),
                                      createVNode(_component_FormControl),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.spatialReferenceSystem" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Spatial reference system (choose one from the list or define a custom one)")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode("div", { class: "flex flex-row space-x-4" }, [
                                        createVNode(_sfc_main$k, mergeProps({ options: unref(spatialReferenceSystem) }, componentField), null, 16, ["options"]),
                                        createVNode(_component_Input, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"])
                                      ]),
                                      createVNode(_component_FormControl),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              })
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("General information")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "max-w-196 flex flex-col gap-5" }, [
                            createVNode(unref(Field), { name: "requestBody.properties.projectNumber" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), null, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Project number")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_FormControl, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_Input, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.title" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), null, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Project title")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_FormControl, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_Input, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.datetime" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_NuxtLink, {
                                          target: "_blank",
                                          external: "",
                                          to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#datum-type-van-de-bron"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Publication date")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Popover, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_PopoverTrigger, { "as-child": "" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_FormControl, null, {
                                              default: withCtx(() => [
                                                !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                  key: 0,
                                                  variant: "outline",
                                                  class: unref(cn)(
                                                    "w-[240px] ps-3 text-start font-normal",
                                                    !unref(datetimeValue) && "text-muted-foreground"
                                                  )
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                    createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                  ]),
                                                  _: 1
                                                }, 8, ["class"])) : createCommentVNode("", true),
                                                unref(readOnly) ? (openBlock(), createBlock(_component_Label, { key: 1 }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                  ]),
                                                  _: 1
                                                })) : createCommentVNode("", true),
                                                createVNode("input", { hidden: "" })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_PopoverContent, { class: "w-auto p-0" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$c), {
                                              modelValue: unref(datetimeValue),
                                              "onUpdate:modelValue": [
                                                ($event) => isRef(datetimeValue) ? datetimeValue.value = $event : datetimeValue = $event,
                                                (v) => {
                                                  if (v) {
                                                    unref(form).setFieldValue(
                                                      "requestBody.properties.datetime",
                                                      v.toString()
                                                    );
                                                  } else {
                                                    unref(form).setFieldValue(
                                                      "requestBody.properties.datetime",
                                                      void 0
                                                    );
                                                  }
                                                }
                                              ],
                                              "calendar-label": "Date",
                                              "initial-focus": ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(Field), { name: "requestBody.properties.description" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), null, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Description")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_FormControl, null, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$l, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.language" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Language")
                                      ]),
                                      _: 1
                                    }),
                                    !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                      key: 0,
                                      options: languages
                                    }, componentField), null, 16)) : createCommentVNode("", true),
                                    createVNode(_component_FormControl),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.legalRestrictions" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_NuxtLink, {
                                            target: "_blank",
                                            external: "",
                                            to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#juridische-toegangsrestricties"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Legal restrictions")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                      key: 0,
                                      options: legalRestrictionsOptions
                                    }, componentField), null, 16)) : createCommentVNode("", true),
                                    createVNode(_component_FormControl),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.restrictionsOfUse" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "flex items-start" }, [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_NuxtLink, {
                                            target: "_blank",
                                            external: "",
                                            to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#gebruiksbeperkingen"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Applications for which this data set is not suitable")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    createVNode(_sfc_main$l, mergeProps({
                                      readonly: unref(readOnlyTag),
                                      type: "text"
                                    }, componentField), null, 16, ["readonly"]),
                                    createVNode(_component_FormControl),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.spatialReferenceSystem" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Spatial reference system (choose one from the list or define a custom one)")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "flex flex-row space-x-4" }, [
                                      createVNode(_sfc_main$k, mergeProps({ options: unref(spatialReferenceSystem) }, componentField), null, 16, ["options"]),
                                      createVNode(_component_Input, mergeProps({
                                        readonly: unref(readOnlyTag),
                                        type: "text"
                                      }, componentField), null, 16, ["readonly"])
                                    ]),
                                    createVNode(_component_FormControl),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (update || unref(form).values.collectionId) {
              _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Data quality`);
                              } else {
                                return [
                                  createTextVNode("Data quality")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$i), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Field), { name: "requestBody.properties.dataQualityInfoStatement" }, {
                                  default: withCtx(({ componentField }, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$j), null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_FormLabel, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_NuxtLink, {
                                                    target: "_blank",
                                                    external: "",
                                                    to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                                                  }, {
                                                    default: withCtx((_7, _push9, _parent9, _scopeId8) => {
                                                      if (_push9) {
                                                        _push9(`Description of the origin of this data set`);
                                                      } else {
                                                        return [
                                                          createTextVNode("Description of the origin of this data set")
                                                        ];
                                                      }
                                                    }),
                                                    _: 2
                                                  }, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_NuxtLink, {
                                                      target: "_blank",
                                                      external: "",
                                                      to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                                                    }, {
                                                      default: withCtx(() => [
                                                        createTextVNode("Description of the origin of this data set")
                                                      ]),
                                                      _: 1
                                                    })
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormControl, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_sfc_main$l, mergeProps({
                                                    readonly: unref(readOnlyTag),
                                                    type: "text"
                                                  }, componentField), null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_sfc_main$l, mergeProps({
                                                      readonly: unref(readOnlyTag),
                                                      type: "text"
                                                    }, componentField), null, 16, ["readonly"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormMessage, null, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_FormLabel, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_NuxtLink, {
                                                    target: "_blank",
                                                    external: "",
                                                    to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                                                  }, {
                                                    default: withCtx(() => [
                                                      createTextVNode("Description of the origin of this data set")
                                                    ]),
                                                    _: 1
                                                  })
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_FormControl, null, {
                                                default: withCtx(() => [
                                                  createVNode(_sfc_main$l, mergeProps({
                                                    readonly: unref(readOnlyTag),
                                                    type: "text"
                                                  }, componentField), null, 16, ["readonly"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_FormMessage)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$j), null, {
                                          default: withCtx(() => [
                                            createVNode(_component_FormLabel, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_NuxtLink, {
                                                  target: "_blank",
                                                  external: "",
                                                  to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                                                }, {
                                                  default: withCtx(() => [
                                                    createTextVNode("Description of the origin of this data set")
                                                  ]),
                                                  _: 1
                                                })
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_FormControl, null, {
                                              default: withCtx(() => [
                                                createVNode(_sfc_main$l, mergeProps({
                                                  readonly: unref(readOnlyTag),
                                                  type: "text"
                                                }, componentField), null, 16, ["readonly"])
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
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(Field), { name: "requestBody.properties.dataQualityInfoStatement" }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_NuxtLink, {
                                                target: "_blank",
                                                external: "",
                                                to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                                              }, {
                                                default: withCtx(() => [
                                                  createTextVNode("Description of the origin of this data set")
                                                ]),
                                                _: 1
                                              })
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_sfc_main$l, mergeProps({
                                                readonly: unref(readOnlyTag),
                                                type: "text"
                                              }, componentField), null, 16, ["readonly"])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
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
                            createVNode(_component_CardTitle, { class: "text-lg" }, {
                              default: withCtx(() => [
                                createTextVNode("Data quality")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$i), null, {
                              default: withCtx(() => [
                                createVNode(unref(Field), { name: "requestBody.properties.dataQualityInfoStatement" }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_NuxtLink, {
                                              target: "_blank",
                                              external: "",
                                              to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                                            }, {
                                              default: withCtx(() => [
                                                createTextVNode("Description of the origin of this data set")
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_sfc_main$l, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, 16, ["readonly"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
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
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Data quality")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createVNode(unref(Field), { name: "requestBody.properties.dataQualityInfoStatement" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_NuxtLink, {
                                            target: "_blank",
                                            external: "",
                                            to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Description of the origin of this data set")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$l, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
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
              _push2(`<!---->`);
            }
            if (update || unref(form).values.collectionId) {
              _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Originator data set`);
                              } else {
                                return [
                                  createTextVNode("Originator data set")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$i), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Field), { name: "requestBody.properties.originatorDataOrganisation" }, {
                                  default: withCtx(({ componentField }, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$j), null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_FormLabel, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Organisation`);
                                                } else {
                                                  return [
                                                    createTextVNode("Organisation")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormControl, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_Input, mergeProps({
                                                    readonly: unref(readOnlyTag),
                                                    type: "text"
                                                  }, componentField), null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_Input, mergeProps({
                                                      readonly: unref(readOnlyTag),
                                                      type: "text"
                                                    }, componentField), null, 16, ["readonly"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormMessage, null, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_FormLabel, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Organisation")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_FormControl, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_Input, mergeProps({
                                                    readonly: unref(readOnlyTag),
                                                    type: "text"
                                                  }, componentField), null, 16, ["readonly"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_FormMessage)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$j), null, {
                                          default: withCtx(() => [
                                            createVNode(_component_FormLabel, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Organisation")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_FormControl, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_Input, mergeProps({
                                                  readonly: unref(readOnlyTag),
                                                  type: "text"
                                                }, componentField), null, 16, ["readonly"])
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
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(Field), { name: "requestBody.properties.originatorDataEmail" }, {
                                  default: withCtx(({ componentField }, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$j), null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_FormLabel, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`E-mail`);
                                                } else {
                                                  return [
                                                    createTextVNode("E-mail")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormControl, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_Input, mergeProps({
                                                    readonly: unref(readOnlyTag),
                                                    type: "text"
                                                  }, componentField), null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_Input, mergeProps({
                                                      readonly: unref(readOnlyTag),
                                                      type: "text"
                                                    }, componentField), null, 16, ["readonly"])
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormMessage, null, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_FormLabel, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("E-mail")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_FormControl, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_Input, mergeProps({
                                                    readonly: unref(readOnlyTag),
                                                    type: "text"
                                                  }, componentField), null, 16, ["readonly"])
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_FormMessage)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$j), null, {
                                          default: withCtx(() => [
                                            createVNode(_component_FormLabel, null, {
                                              default: withCtx(() => [
                                                createTextVNode("E-mail")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_FormControl, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_Input, mergeProps({
                                                  readonly: unref(readOnlyTag),
                                                  type: "text"
                                                }, componentField), null, 16, ["readonly"])
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
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(Field), { name: "requestBody.properties.originatorDataOrganisation" }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Organisation")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                readonly: unref(readOnlyTag),
                                                type: "text"
                                              }, componentField), null, 16, ["readonly"])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(Field), { name: "requestBody.properties.originatorDataEmail" }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("E-mail")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                readonly: unref(readOnlyTag),
                                                type: "text"
                                              }, componentField), null, 16, ["readonly"])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
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
                            createVNode(_component_CardTitle, { class: "text-lg" }, {
                              default: withCtx(() => [
                                createTextVNode("Originator data set")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$i), null, {
                              default: withCtx(() => [
                                createVNode(unref(Field), { name: "requestBody.properties.originatorDataOrganisation" }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Organisation")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, 16, ["readonly"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Field), { name: "requestBody.properties.originatorDataEmail" }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("E-mail")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              readonly: unref(readOnlyTag),
                                              type: "text"
                                            }, componentField), null, 16, ["readonly"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
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
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Originator data set")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createVNode(unref(Field), { name: "requestBody.properties.originatorDataOrganisation" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Organisation")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.originatorDataEmail" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("E-mail")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
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
              _push2(`<!---->`);
            }
            if (update || unref(form).values.collectionId) {
              _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Originator meta data`);
                              } else {
                                return [
                                  createTextVNode("Originator meta data")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(ssrRenderComponent(unref(_sfc_main$i), null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(ssrRenderComponent(unref(Field), { name: "requestBody.properties.originatorMetaDataOrganisation" }, {
                                  default: withCtx(({ componentField }, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$j), null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_FormLabel, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`Organisation`);
                                                } else {
                                                  return [
                                                    createTextVNode("Organisation")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormControl, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_Input, mergeProps({
                                                    readonly: "",
                                                    type: "text"
                                                  }, componentField), null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_Input, mergeProps({
                                                      readonly: "",
                                                      type: "text"
                                                    }, componentField), null, 16)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormMessage, null, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_FormLabel, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("Organisation")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_FormControl, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_Input, mergeProps({
                                                    readonly: "",
                                                    type: "text"
                                                  }, componentField), null, 16)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_FormMessage)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$j), null, {
                                          default: withCtx(() => [
                                            createVNode(_component_FormLabel, null, {
                                              default: withCtx(() => [
                                                createTextVNode("Organisation")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_FormControl, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_Input, mergeProps({
                                                  readonly: "",
                                                  type: "text"
                                                }, componentField), null, 16)
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
                                }, _parent5, _scopeId4));
                                _push5(ssrRenderComponent(unref(Field), { name: "requestBody.properties.originatorMetaDataEmail" }, {
                                  default: withCtx(({ componentField }, _push6, _parent6, _scopeId5) => {
                                    if (_push6) {
                                      _push6(ssrRenderComponent(unref(_sfc_main$j), null, {
                                        default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                          if (_push7) {
                                            _push7(ssrRenderComponent(_component_FormLabel, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(`E-mail`);
                                                } else {
                                                  return [
                                                    createTextVNode("E-mail")
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormControl, null, {
                                              default: withCtx((_6, _push8, _parent8, _scopeId7) => {
                                                if (_push8) {
                                                  _push8(ssrRenderComponent(_component_Input, mergeProps({
                                                    readonly: "",
                                                    type: "text"
                                                  }, componentField), null, _parent8, _scopeId7));
                                                } else {
                                                  return [
                                                    createVNode(_component_Input, mergeProps({
                                                      readonly: "",
                                                      type: "text"
                                                    }, componentField), null, 16)
                                                  ];
                                                }
                                              }),
                                              _: 2
                                            }, _parent7, _scopeId6));
                                            _push7(ssrRenderComponent(_component_FormMessage, null, null, _parent7, _scopeId6));
                                          } else {
                                            return [
                                              createVNode(_component_FormLabel, null, {
                                                default: withCtx(() => [
                                                  createTextVNode("E-mail")
                                                ]),
                                                _: 1
                                              }),
                                              createVNode(_component_FormControl, null, {
                                                default: withCtx(() => [
                                                  createVNode(_component_Input, mergeProps({
                                                    readonly: "",
                                                    type: "text"
                                                  }, componentField), null, 16)
                                                ]),
                                                _: 2
                                              }, 1024),
                                              createVNode(_component_FormMessage)
                                            ];
                                          }
                                        }),
                                        _: 2
                                      }, _parent6, _scopeId5));
                                    } else {
                                      return [
                                        createVNode(unref(_sfc_main$j), null, {
                                          default: withCtx(() => [
                                            createVNode(_component_FormLabel, null, {
                                              default: withCtx(() => [
                                                createTextVNode("E-mail")
                                              ]),
                                              _: 1
                                            }),
                                            createVNode(_component_FormControl, null, {
                                              default: withCtx(() => [
                                                createVNode(_component_Input, mergeProps({
                                                  readonly: "",
                                                  type: "text"
                                                }, componentField), null, 16)
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
                                }, _parent5, _scopeId4));
                              } else {
                                return [
                                  createVNode(unref(Field), { name: "requestBody.properties.originatorMetaDataOrganisation" }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Organisation")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                readonly: "",
                                                type: "text"
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 1
                                  }),
                                  createVNode(unref(Field), { name: "requestBody.properties.originatorMetaDataEmail" }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("E-mail")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                readonly: "",
                                                type: "text"
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
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
                            createVNode(_component_CardTitle, { class: "text-lg" }, {
                              default: withCtx(() => [
                                createTextVNode("Originator meta data")
                              ]),
                              _: 1
                            }),
                            createVNode(unref(_sfc_main$i), null, {
                              default: withCtx(() => [
                                createVNode(unref(Field), { name: "requestBody.properties.originatorMetaDataOrganisation" }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Organisation")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              readonly: "",
                                              type: "text"
                                            }, componentField), null, 16)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 1
                                }),
                                createVNode(unref(Field), { name: "requestBody.properties.originatorMetaDataEmail" }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("E-mail")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              readonly: "",
                                              type: "text"
                                            }, componentField), null, 16)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
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
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Originator meta data")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createVNode(unref(Field), { name: "requestBody.properties.originatorMetaDataOrganisation" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Organisation")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: "",
                                            type: "text"
                                          }, componentField), null, 16)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.originatorMetaDataEmail" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("E-mail")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: "",
                                            type: "text"
                                          }, componentField), null, 16)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
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
              _push2(`<!---->`);
            }
            if (update || unref(form).values.collectionId) {
              _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Geometry`);
                        } else {
                          return [
                            createTextVNode("Geometry")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$i), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="container mx-auto"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_ClientOnly, null, {}, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "container mx-auto" }, [
                              createVNode(_component_ClientOnly, null, {
                                default: withCtx(() => [
                                  createVNode(_component_GeometryDraw, {
                                    "read-only": unref(readOnly) != "",
                                    initialValue: unref(geometry),
                                    onValueChange: setValue
                                  }, null, 8, ["read-only", "initialValue"])
                                ]),
                                _: 1
                              })
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createTextVNode("Geometry")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "container mx-auto" }, [
                            createVNode(_component_ClientOnly, null, {
                              default: withCtx(() => [
                                createVNode(_component_GeometryDraw, {
                                  "read-only": unref(readOnly) != "",
                                  initialValue: unref(geometry),
                                  onValueChange: setValue
                                }, null, 8, ["read-only", "initialValue"])
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`<div class="grid grid-cols-3 gap-1"${_scopeId}><!--[-->`);
            ssrRenderList(unref(keywordsGroups), (group) => {
              _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(group.group_name_en)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(group.group_name_en), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            createVNode(_component_CardTitle, { class: "text-lg" }, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(group.group_name_en), 1)
                              ]),
                              _: 2
                            }, 1024)
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$i), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<!--[-->`);
                          ssrRenderList(group.keywords, (item) => {
                            _push4(ssrRenderComponent(unref(Field), {
                              key: item,
                              type: "checkbox",
                              value: item.nl_keyword,
                              ch: _ctx.ch,
                              "unchecked-value": false,
                              name: "items"
                            }, {
                              default: withCtx(({ value }, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$j), { class: "flex flex-row items-start space-x-3 space-y-0" }, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_FormControl, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_Checkbox, {
                                                "onUpdate:checked": ($event) => handleChange(item),
                                                checked: isSelected(item)
                                              }, null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_Checkbox, {
                                                  "onUpdate:checked": ($event) => handleChange(item),
                                                  checked: isSelected(item)
                                                }, null, 8, ["onUpdate:checked", "checked"])
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormLabel, { class: "font-normal" }, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`${ssrInterpolate(item.nl_keyword)}`);
                                            } else {
                                              return [
                                                createTextVNode(toDisplayString(item.nl_keyword), 1)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Checkbox, {
                                                "onUpdate:checked": ($event) => handleChange(item),
                                                checked: isSelected(item)
                                              }, null, 8, ["onUpdate:checked", "checked"])
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormLabel, { class: "font-normal" }, {
                                            default: withCtx(() => [
                                              createTextVNode(toDisplayString(item.nl_keyword), 1)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$j), { class: "flex flex-row items-start space-x-3 space-y-0" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Checkbox, {
                                              "onUpdate:checked": ($event) => handleChange(item),
                                              checked: isSelected(item)
                                            }, null, 8, ["onUpdate:checked", "checked"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormLabel, { class: "font-normal" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.nl_keyword), 1)
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
                              _: 2
                            }, _parent4, _scopeId3));
                          });
                          _push4(`<!--]-->`);
                        } else {
                          return [
                            (openBlock(true), createBlock(Fragment, null, renderList(group.keywords, (item) => {
                              return openBlock(), createBlock(unref(Field), {
                                key: item,
                                type: "checkbox",
                                value: item.nl_keyword,
                                ch: _ctx.ch,
                                "unchecked-value": false,
                                name: "items"
                              }, {
                                default: withCtx(({ value }) => [
                                  createVNode(unref(_sfc_main$j), { class: "flex flex-row items-start space-x-3 space-y-0" }, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Checkbox, {
                                            "onUpdate:checked": ($event) => handleChange(item),
                                            checked: isSelected(item)
                                          }, null, 8, ["onUpdate:checked", "checked"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormLabel, { class: "font-normal" }, {
                                        default: withCtx(() => [
                                          createTextVNode(toDisplayString(item.nl_keyword), 1)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 2
                              }, 1032, ["value", "ch"]);
                            }), 128))
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(group.group_name_en), 1)
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          (openBlock(true), createBlock(Fragment, null, renderList(group.keywords, (item) => {
                            return openBlock(), createBlock(unref(Field), {
                              key: item,
                              type: "checkbox",
                              value: item.nl_keyword,
                              ch: _ctx.ch,
                              "unchecked-value": false,
                              name: "items"
                            }, {
                              default: withCtx(({ value }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-row items-start space-x-3 space-y-0" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormControl, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_Checkbox, {
                                          "onUpdate:checked": ($event) => handleChange(item),
                                          checked: isSelected(item)
                                        }, null, 8, ["onUpdate:checked", "checked"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormLabel, { class: "font-normal" }, {
                                      default: withCtx(() => [
                                        createTextVNode(toDisplayString(item.nl_keyword), 1)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1032, ["value", "ch"]);
                          }), 128))
                        ]),
                        _: 2
                      }, 1024)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            });
            _push2(`<!--]--></div><div${_scopeId}>`);
            if (update || unref(form).values.collectionId) {
              _push2(ssrRenderComponent(unref(_sfc_main$g), null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(unref(_sfc_main$h), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex items-center justify-between space-x-4 px-4"${_scopeId3}>`);
                          _push4(ssrRenderComponent(_component_CardTitle, null, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`Storage location data set`);
                              } else {
                                return [
                                  createTextVNode("Storage location data set")
                                ];
                              }
                            }),
                            _: 1
                          }, _parent4, _scopeId3));
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "flex items-center justify-between space-x-4 px-4" }, [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("Storage location data set")
                                ]),
                                _: 1
                              })
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                    _push3(ssrRenderComponent(unref(_sfc_main$i), null, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`<div class="flex flex-col"${_scopeId3}><!--[-->`);
                          ssrRenderList(unref(assets), (_asset, id2) => {
                            _push4(`<div class="border-b border-border last:border-none flex flex-col gap-3 pb-8 pt-6"${_scopeId3}>`);
                            _push4(ssrRenderComponent(unref(Field), {
                              name: `requestBody.assets.${id2}.title`
                            }, {
                              default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_FormLabel, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`Title`);
                                            } else {
                                              return [
                                                createTextVNode("Title")
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormControl, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_Input, mergeProps({
                                                  type: "text",
                                                  ref_for: true
                                                }, componentField), null, 16)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Title")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Title")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              type: "text",
                                              ref_for: true
                                            }, componentField), null, 16)
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
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(Field), {
                              name: `requestBody.assets.${id2}.description`
                            }, {
                              default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_FormLabel, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`Description`);
                                            } else {
                                              return [
                                                createTextVNode("Description")
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormControl, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_Input, mergeProps({
                                                  type: "text",
                                                  ref_for: true
                                                }, componentField), null, 16)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Description")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Description")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              type: "text",
                                              ref_for: true
                                            }, componentField), null, 16)
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
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(Field), {
                              name: `requestBody.assets.${id2}.href`
                            }, {
                              default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_FormLabel, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`Link`);
                                            } else {
                                              return [
                                                createTextVNode("Link")
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormControl, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_Input, mergeProps({
                                                  type: "text",
                                                  ref_for: true
                                                }, componentField), null, 16)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Link")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Link")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              type: "text",
                                              ref_for: true
                                            }, componentField), null, 16)
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
                              _: 2
                            }, _parent4, _scopeId3));
                            _push4(ssrRenderComponent(unref(Field), {
                              name: `requestBody.assets.${id2}.type`
                            }, {
                              default: withCtx(({ componentField }, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(_sfc_main$j), null, {
                                    default: withCtx((_4, _push6, _parent6, _scopeId5) => {
                                      if (_push6) {
                                        _push6(ssrRenderComponent(_component_FormLabel, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(`Type`);
                                            } else {
                                              return [
                                                createTextVNode("Type")
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormControl, null, {
                                          default: withCtx((_5, _push7, _parent7, _scopeId6) => {
                                            if (_push7) {
                                              _push7(ssrRenderComponent(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, _parent7, _scopeId6));
                                            } else {
                                              return [
                                                createVNode(_component_Input, mergeProps({
                                                  type: "text",
                                                  ref_for: true
                                                }, componentField), null, 16)
                                              ];
                                            }
                                          }),
                                          _: 2
                                        }, _parent6, _scopeId5));
                                        _push6(ssrRenderComponent(_component_FormMessage, null, null, _parent6, _scopeId5));
                                      } else {
                                        return [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Type")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ];
                                      }
                                    }),
                                    _: 2
                                  }, _parent5, _scopeId4));
                                } else {
                                  return [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Type")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              type: "text",
                                              ref_for: true
                                            }, componentField), null, 16)
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
                              _: 2
                            }, _parent4, _scopeId3));
                            if (!unref(readOnly)) {
                              _push4(ssrRenderComponent(unref(_sfc_main$e), {
                                type: "button",
                                onClick: ($event) => removeAsset(id2),
                                variant: "outline"
                              }, {
                                default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                  if (_push5) {
                                    _push5(ssrRenderComponent(unref(XIcon), { class: "w-4 h-4 mr-2" }, null, _parent5, _scopeId4));
                                    _push5(` Remove `);
                                  } else {
                                    return [
                                      createVNode(unref(XIcon), { class: "w-4 h-4 mr-2" }),
                                      createTextVNode(" Remove ")
                                    ];
                                  }
                                }),
                                _: 2
                              }, _parent4, _scopeId3));
                            } else {
                              _push4(`<!---->`);
                            }
                            _push4(`</div>`);
                          });
                          _push4(`<!--]--></div><div${_scopeId3}>`);
                          if (!unref(readOnly)) {
                            _push4(ssrRenderComponent(unref(_sfc_main$e), {
                              onClick: addAsset,
                              variant: "outline",
                              class: "mt-5",
                              type: "button"
                            }, {
                              default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                                if (_push5) {
                                  _push5(ssrRenderComponent(unref(PlusIcon), { class: "w-4 h-4 mr-2" }, null, _parent5, _scopeId4));
                                  _push5(` Add `);
                                } else {
                                  return [
                                    createVNode(unref(PlusIcon), { class: "w-4 h-4 mr-2" }),
                                    createTextVNode(" Add ")
                                  ];
                                }
                              }),
                              _: 1
                            }, _parent4, _scopeId3));
                          } else {
                            _push4(`<!---->`);
                          }
                          _push4(`</div>`);
                        } else {
                          return [
                            createVNode("div", { class: "flex flex-col" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(assets), (_asset, id2) => {
                                return openBlock(), createBlock("div", { class: "border-b border-border last:border-none flex flex-col gap-3 pb-8 pt-6" }, [
                                  createVNode(unref(Field), {
                                    name: `requestBody.assets.${id2}.title`
                                  }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Title")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]),
                                  createVNode(unref(Field), {
                                    name: `requestBody.assets.${id2}.description`
                                  }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Description")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]),
                                  createVNode(unref(Field), {
                                    name: `requestBody.assets.${id2}.href`
                                  }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Link")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]),
                                  createVNode(unref(Field), {
                                    name: `requestBody.assets.${id2}.type`
                                  }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Type")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]),
                                  !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                    key: 0,
                                    type: "button",
                                    onClick: ($event) => removeAsset(id2),
                                    variant: "outline"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(XIcon), { class: "w-4 h-4 mr-2" }),
                                      createTextVNode(" Remove ")
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"])) : createCommentVNode("", true)
                                ]);
                              }), 256))
                            ]),
                            createVNode("div", null, [
                              !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                key: 0,
                                onClick: addAsset,
                                variant: "outline",
                                class: "mt-5",
                                type: "button"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(PlusIcon), { class: "w-4 h-4 mr-2" }),
                                  createTextVNode(" Add ")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ])
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
                  } else {
                    return [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex items-center justify-between space-x-4 px-4" }, [
                            createVNode(_component_CardTitle, null, {
                              default: withCtx(() => [
                                createTextVNode("Storage location data set")
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "flex flex-col" }, [
                            (openBlock(true), createBlock(Fragment, null, renderList(unref(assets), (_asset, id2) => {
                              return openBlock(), createBlock("div", { class: "border-b border-border last:border-none flex flex-col gap-3 pb-8 pt-6" }, [
                                createVNode(unref(Field), {
                                  name: `requestBody.assets.${id2}.title`
                                }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Title")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              type: "text",
                                              ref_for: true
                                            }, componentField), null, 16)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1032, ["name"]),
                                createVNode(unref(Field), {
                                  name: `requestBody.assets.${id2}.description`
                                }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Description")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              type: "text",
                                              ref_for: true
                                            }, componentField), null, 16)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1032, ["name"]),
                                createVNode(unref(Field), {
                                  name: `requestBody.assets.${id2}.href`
                                }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Link")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              type: "text",
                                              ref_for: true
                                            }, componentField), null, 16)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1032, ["name"]),
                                createVNode(unref(Field), {
                                  name: `requestBody.assets.${id2}.type`
                                }, {
                                  default: withCtx(({ componentField }) => [
                                    createVNode(unref(_sfc_main$j), null, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormLabel, null, {
                                          default: withCtx(() => [
                                            createTextVNode("Type")
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Input, mergeProps({
                                              type: "text",
                                              ref_for: true
                                            }, componentField), null, 16)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1032, ["name"]),
                                !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                  key: 0,
                                  type: "button",
                                  onClick: ($event) => removeAsset(id2),
                                  variant: "outline"
                                }, {
                                  default: withCtx(() => [
                                    createVNode(unref(XIcon), { class: "w-4 h-4 mr-2" }),
                                    createTextVNode(" Remove ")
                                  ]),
                                  _: 2
                                }, 1032, ["onClick"])) : createCommentVNode("", true)
                              ]);
                            }), 256))
                          ]),
                          createVNode("div", null, [
                            !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                              key: 0,
                              onClick: addAsset,
                              variant: "outline",
                              class: "mt-5",
                              type: "button"
                            }, {
                              default: withCtx(() => [
                                createVNode(unref(PlusIcon), { class: "w-4 h-4 mr-2" }),
                                createTextVNode(" Add ")
                              ]),
                              _: 1
                            })) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></div><div class="flex justify-between px-6 pb-6 mt-4"${_scopeId}>`);
            if (!unref(readOnly)) {
              _push2(ssrRenderComponent(unref(_sfc_main$e), {
                "as-child": "",
                variant: "outline"
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(ssrRenderComponent(_component_NuxtLink, { to: "/items" }, {
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(`Cancel`);
                        } else {
                          return [
                            createTextVNode("Cancel")
                          ];
                        }
                      }),
                      _: 1
                    }, _parent3, _scopeId2));
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
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (unref(readOnly)) {
              _push2(ssrRenderComponent(unref(_sfc_main$e), {
                variant: "outline",
                onClick: ($event) => _ctx.$router.back()
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Back to search `);
                  } else {
                    return [
                      createTextVNode("Back to search ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            if (!unref(readOnly) && (update || unref(form).values.collectionId)) {
              _push2(ssrRenderComponent(unref(_sfc_main$e), { type: "submit" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Publish project data `);
                  } else {
                    return [
                      createTextVNode("Publish project data ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(`</div></form>`);
          } else {
            return [
              createVNode("h1", { class: "text-3xl flex font-semibold" }, toDisplayString(unref(title)), 1),
              createVNode("form", { onSubmit: unref(onSubmit) }, [
                createVNode(unref(Field), { name: "requestBody.type" }, {
                  default: withCtx(() => [
                    createVNode(_component_FormControl, null, {
                      default: withCtx(() => [
                        createVNode("input", {
                          type: "hidden",
                          name: "requestBody.type",
                          value: "Feature"
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                createVNode("div", { class: "mt-8 grid grid-flow-row gap-5" }, [
                  createVNode(unref(_sfc_main$g), null, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Data set collection")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createVNode(unref(Field), { name: "collectionId" }, {
                            default: withCtx(({ componentField }) => [
                              createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                default: withCtx(() => [
                                  createVNode(_component_FormLabel, null, {
                                    default: withCtx(() => [
                                      createTextVNode("Collection")
                                    ]),
                                    _: 1
                                  }),
                                  update ? (openBlock(), createBlock(_component_FormLabel, { key: 0 }, {
                                    default: withCtx(() => {
                                      var _a2;
                                      return [
                                        createTextVNode(toDisplayString((_a2 = unref(selectedCollection)) == null ? void 0 : _a2.description), 1)
                                      ];
                                    }),
                                    _: 1
                                  })) : createCommentVNode("", true),
                                  !update ? (openBlock(), createBlock(_component_FormControl, { key: 1 }, {
                                    default: withCtx(() => [
                                      createVNode(_sfc_main$k, mergeProps({ options: unref(collectionOptions) }, componentField), null, 16, ["options"])
                                    ]),
                                    _: 2
                                  }, 1024)) : createCommentVNode("", true),
                                  createVNode(_component_FormMessage)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  update || unref(form).values.collectionId ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 0 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("General information")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "max-w-196 flex flex-col gap-5" }, [
                            createVNode(unref(Field), { name: "requestBody.properties.projectNumber" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), null, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Project number")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_FormControl, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_Input, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.title" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), null, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Project title")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_FormControl, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_Input, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.datetime" }, {
                              default: withCtx(() => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_NuxtLink, {
                                          target: "_blank",
                                          external: "",
                                          to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#datum-type-van-de-bron"
                                        }, {
                                          default: withCtx(() => [
                                            createTextVNode("Publication date")
                                          ]),
                                          _: 1
                                        })
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_Popover, null, {
                                      default: withCtx(() => [
                                        createVNode(_component_PopoverTrigger, { "as-child": "" }, {
                                          default: withCtx(() => [
                                            createVNode(_component_FormControl, null, {
                                              default: withCtx(() => [
                                                !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                                  key: 0,
                                                  variant: "outline",
                                                  class: unref(cn)(
                                                    "w-[240px] ps-3 text-start font-normal",
                                                    !unref(datetimeValue) && "text-muted-foreground"
                                                  )
                                                }, {
                                                  default: withCtx(() => [
                                                    createVNode("span", null, toDisplayString(getDisplayTime()), 1),
                                                    createVNode(unref(Calendar), { class: "ms-auto h-4 w-4 opacity-50" })
                                                  ]),
                                                  _: 1
                                                }, 8, ["class"])) : createCommentVNode("", true),
                                                unref(readOnly) ? (openBlock(), createBlock(_component_Label, { key: 1 }, {
                                                  default: withCtx(() => [
                                                    createTextVNode(toDisplayString(getDisplayTime()), 1)
                                                  ]),
                                                  _: 1
                                                })) : createCommentVNode("", true),
                                                createVNode("input", { hidden: "" })
                                              ]),
                                              _: 1
                                            })
                                          ]),
                                          _: 1
                                        }),
                                        createVNode(_component_PopoverContent, { class: "w-auto p-0" }, {
                                          default: withCtx(() => [
                                            createVNode(unref(_sfc_main$c), {
                                              modelValue: unref(datetimeValue),
                                              "onUpdate:modelValue": [
                                                ($event) => isRef(datetimeValue) ? datetimeValue.value = $event : datetimeValue = $event,
                                                (v) => {
                                                  if (v) {
                                                    unref(form).setFieldValue(
                                                      "requestBody.properties.datetime",
                                                      v.toString()
                                                    );
                                                  } else {
                                                    unref(form).setFieldValue(
                                                      "requestBody.properties.datetime",
                                                      void 0
                                                    );
                                                  }
                                                }
                                              ],
                                              "calendar-label": "Date",
                                              "initial-focus": ""
                                            }, null, 8, ["modelValue", "onUpdate:modelValue"])
                                          ]),
                                          _: 2
                                        }, 1024)
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 2
                            }, 1024),
                            createVNode(unref(Field), { name: "requestBody.properties.description" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), null, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Description")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode(_component_FormControl, null, {
                                      default: withCtx(() => [
                                        createVNode(_sfc_main$l, mergeProps({
                                          readonly: unref(readOnlyTag),
                                          type: "text"
                                        }, componentField), null, 16, ["readonly"])
                                      ]),
                                      _: 2
                                    }, 1024),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.language" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Language")
                                      ]),
                                      _: 1
                                    }),
                                    !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                      key: 0,
                                      options: languages
                                    }, componentField), null, 16)) : createCommentVNode("", true),
                                    createVNode(_component_FormControl),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.legalRestrictions" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx(() => [
                                    createVNode("div", null, [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_NuxtLink, {
                                            target: "_blank",
                                            external: "",
                                            to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#juridische-toegangsrestricties"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Legal restrictions")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    !unref(readOnly) ? (openBlock(), createBlock(_sfc_main$k, mergeProps({
                                      key: 0,
                                      options: legalRestrictionsOptions
                                    }, componentField), null, 16)) : createCommentVNode("", true),
                                    createVNode(_component_FormControl),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.restrictionsOfUse" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col" }, {
                                  default: withCtx(() => [
                                    createVNode("div", { class: "flex items-start" }, [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_NuxtLink, {
                                            target: "_blank",
                                            external: "",
                                            to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#gebruiksbeperkingen"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Applications for which this data set is not suitable")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      })
                                    ]),
                                    createVNode(_sfc_main$l, mergeProps({
                                      readonly: unref(readOnlyTag),
                                      type: "text"
                                    }, componentField), null, 16, ["readonly"]),
                                    createVNode(_component_FormControl),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            }),
                            createVNode(unref(Field), { name: "requestBody.properties.spatialReferenceSystem" }, {
                              default: withCtx(({ componentField }) => [
                                createVNode(unref(_sfc_main$j), { class: "flex flex-col gap-1" }, {
                                  default: withCtx(() => [
                                    createVNode(_component_FormLabel, null, {
                                      default: withCtx(() => [
                                        createTextVNode("Spatial reference system (choose one from the list or define a custom one)")
                                      ]),
                                      _: 1
                                    }),
                                    createVNode("div", { class: "flex flex-row space-x-4" }, [
                                      createVNode(_sfc_main$k, mergeProps({ options: unref(spatialReferenceSystem) }, componentField), null, 16, ["options"]),
                                      createVNode(_component_Input, mergeProps({
                                        readonly: unref(readOnlyTag),
                                        type: "text"
                                      }, componentField), null, 16, ["readonly"])
                                    ]),
                                    createVNode(_component_FormControl),
                                    createVNode(_component_FormMessage)
                                  ]),
                                  _: 2
                                }, 1024)
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 2
                  }, 1024)) : createCommentVNode("", true),
                  update || unref(form).values.collectionId ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 1 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Data quality")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createVNode(unref(Field), { name: "requestBody.properties.dataQualityInfoStatement" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_NuxtLink, {
                                            target: "_blank",
                                            external: "",
                                            to: "https://docs.geostandaarden.nl/md/mdprofiel-iso19115/#algemene-beschrijving-herkomst"
                                          }, {
                                            default: withCtx(() => [
                                              createTextVNode("Description of the origin of this data set")
                                            ]),
                                            _: 1
                                          })
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_sfc_main$l, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
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
                  })) : createCommentVNode("", true),
                  update || unref(form).values.collectionId ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 2 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Originator data set")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createVNode(unref(Field), { name: "requestBody.properties.originatorDataOrganisation" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Organisation")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.originatorDataEmail" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("E-mail")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: unref(readOnlyTag),
                                            type: "text"
                                          }, componentField), null, 16, ["readonly"])
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
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
                  })) : createCommentVNode("", true),
                  update || unref(form).values.collectionId ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 3 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createVNode(_component_CardTitle, { class: "text-lg" }, {
                            default: withCtx(() => [
                              createTextVNode("Originator meta data")
                            ]),
                            _: 1
                          }),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              createVNode(unref(Field), { name: "requestBody.properties.originatorMetaDataOrganisation" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("Organisation")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: "",
                                            type: "text"
                                          }, componentField), null, 16)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
                                ]),
                                _: 1
                              }),
                              createVNode(unref(Field), { name: "requestBody.properties.originatorMetaDataEmail" }, {
                                default: withCtx(({ componentField }) => [
                                  createVNode(unref(_sfc_main$j), null, {
                                    default: withCtx(() => [
                                      createVNode(_component_FormLabel, null, {
                                        default: withCtx(() => [
                                          createTextVNode("E-mail")
                                        ]),
                                        _: 1
                                      }),
                                      createVNode(_component_FormControl, null, {
                                        default: withCtx(() => [
                                          createVNode(_component_Input, mergeProps({
                                            readonly: "",
                                            type: "text"
                                          }, componentField), null, 16)
                                        ]),
                                        _: 2
                                      }, 1024),
                                      createVNode(_component_FormMessage)
                                    ]),
                                    _: 2
                                  }, 1024)
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
                  })) : createCommentVNode("", true),
                  update || unref(form).values.collectionId ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 4 }, {
                    default: withCtx(() => [
                      createVNode(unref(_sfc_main$h), null, {
                        default: withCtx(() => [
                          createTextVNode("Geometry")
                        ]),
                        _: 1
                      }),
                      createVNode(unref(_sfc_main$i), null, {
                        default: withCtx(() => [
                          createVNode("div", { class: "container mx-auto" }, [
                            createVNode(_component_ClientOnly, null, {
                              default: withCtx(() => [
                                createVNode(_component_GeometryDraw, {
                                  "read-only": unref(readOnly) != "",
                                  initialValue: unref(geometry),
                                  onValueChange: setValue
                                }, null, 8, ["read-only", "initialValue"])
                              ]),
                              _: 1
                            })
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  createVNode("div", { class: "grid grid-cols-3 gap-1" }, [
                    (openBlock(true), createBlock(Fragment, null, renderList(unref(keywordsGroups), (group) => {
                      return openBlock(), createBlock(unref(_sfc_main$g), null, {
                        default: withCtx(() => [
                          createVNode(unref(_sfc_main$h), null, {
                            default: withCtx(() => [
                              createVNode(_component_CardTitle, { class: "text-lg" }, {
                                default: withCtx(() => [
                                  createTextVNode(toDisplayString(group.group_name_en), 1)
                                ]),
                                _: 2
                              }, 1024)
                            ]),
                            _: 2
                          }, 1024),
                          createVNode(unref(_sfc_main$i), null, {
                            default: withCtx(() => [
                              (openBlock(true), createBlock(Fragment, null, renderList(group.keywords, (item) => {
                                return openBlock(), createBlock(unref(Field), {
                                  key: item,
                                  type: "checkbox",
                                  value: item.nl_keyword,
                                  ch: _ctx.ch,
                                  "unchecked-value": false,
                                  name: "items"
                                }, {
                                  default: withCtx(({ value }) => [
                                    createVNode(unref(_sfc_main$j), { class: "flex flex-row items-start space-x-3 space-y-0" }, {
                                      default: withCtx(() => [
                                        createVNode(_component_FormControl, null, {
                                          default: withCtx(() => [
                                            createVNode(_component_Checkbox, {
                                              "onUpdate:checked": ($event) => handleChange(item),
                                              checked: isSelected(item)
                                            }, null, 8, ["onUpdate:checked", "checked"])
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormLabel, { class: "font-normal" }, {
                                          default: withCtx(() => [
                                            createTextVNode(toDisplayString(item.nl_keyword), 1)
                                          ]),
                                          _: 2
                                        }, 1024),
                                        createVNode(_component_FormMessage)
                                      ]),
                                      _: 2
                                    }, 1024)
                                  ]),
                                  _: 2
                                }, 1032, ["value", "ch"]);
                              }), 128))
                            ]),
                            _: 2
                          }, 1024)
                        ]),
                        _: 2
                      }, 1024);
                    }), 256))
                  ]),
                  createVNode("div", null, [
                    update || unref(form).values.collectionId ? (openBlock(), createBlock(unref(_sfc_main$g), { key: 0 }, {
                      default: withCtx(() => [
                        createVNode(unref(_sfc_main$h), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex items-center justify-between space-x-4 px-4" }, [
                              createVNode(_component_CardTitle, null, {
                                default: withCtx(() => [
                                  createTextVNode("Storage location data set")
                                ]),
                                _: 1
                              })
                            ])
                          ]),
                          _: 1
                        }),
                        createVNode(unref(_sfc_main$i), null, {
                          default: withCtx(() => [
                            createVNode("div", { class: "flex flex-col" }, [
                              (openBlock(true), createBlock(Fragment, null, renderList(unref(assets), (_asset, id2) => {
                                return openBlock(), createBlock("div", { class: "border-b border-border last:border-none flex flex-col gap-3 pb-8 pt-6" }, [
                                  createVNode(unref(Field), {
                                    name: `requestBody.assets.${id2}.title`
                                  }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Title")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]),
                                  createVNode(unref(Field), {
                                    name: `requestBody.assets.${id2}.description`
                                  }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Description")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]),
                                  createVNode(unref(Field), {
                                    name: `requestBody.assets.${id2}.href`
                                  }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Link")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]),
                                  createVNode(unref(Field), {
                                    name: `requestBody.assets.${id2}.type`
                                  }, {
                                    default: withCtx(({ componentField }) => [
                                      createVNode(unref(_sfc_main$j), null, {
                                        default: withCtx(() => [
                                          createVNode(_component_FormLabel, null, {
                                            default: withCtx(() => [
                                              createTextVNode("Type")
                                            ]),
                                            _: 1
                                          }),
                                          createVNode(_component_FormControl, null, {
                                            default: withCtx(() => [
                                              createVNode(_component_Input, mergeProps({
                                                type: "text",
                                                ref_for: true
                                              }, componentField), null, 16)
                                            ]),
                                            _: 2
                                          }, 1024),
                                          createVNode(_component_FormMessage)
                                        ]),
                                        _: 2
                                      }, 1024)
                                    ]),
                                    _: 2
                                  }, 1032, ["name"]),
                                  !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                    key: 0,
                                    type: "button",
                                    onClick: ($event) => removeAsset(id2),
                                    variant: "outline"
                                  }, {
                                    default: withCtx(() => [
                                      createVNode(unref(XIcon), { class: "w-4 h-4 mr-2" }),
                                      createTextVNode(" Remove ")
                                    ]),
                                    _: 2
                                  }, 1032, ["onClick"])) : createCommentVNode("", true)
                                ]);
                              }), 256))
                            ]),
                            createVNode("div", null, [
                              !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                                key: 0,
                                onClick: addAsset,
                                variant: "outline",
                                class: "mt-5",
                                type: "button"
                              }, {
                                default: withCtx(() => [
                                  createVNode(unref(PlusIcon), { class: "w-4 h-4 mr-2" }),
                                  createTextVNode(" Add ")
                                ]),
                                _: 1
                              })) : createCommentVNode("", true)
                            ])
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })) : createCommentVNode("", true)
                  ])
                ]),
                createVNode("div", { class: "flex justify-between px-6 pb-6 mt-4" }, [
                  !unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                    key: 0,
                    "as-child": "",
                    variant: "outline"
                  }, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, { to: "/items" }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  unref(readOnly) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                    key: 1,
                    variant: "outline",
                    onClick: withModifiers(($event) => _ctx.$router.back(), ["stop", "prevent"])
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Back to search ")
                    ]),
                    _: 1
                  }, 8, ["onClick"])) : createCommentVNode("", true),
                  !unref(readOnly) && (update || unref(form).values.collectionId) ? (openBlock(), createBlock(unref(_sfc_main$e), {
                    key: 2,
                    type: "submit"
                  }, {
                    default: withCtx(() => [
                      createTextVNode("Publish project data ")
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ])
              ], 40, ["onSubmit"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/items/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-XwGJnZ6s.js.map
