import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5 } from "./CardTitle-Bcq778cP.js";
import { _ as _sfc_main$6 } from "./CardDescription-5Vd1PiTP.js";
import { _ as _sfc_main$7 } from "./CardContent-BLyPnbSA.js";
import { d as useApi, b as useRouter, a as _sfc_main$1, _ as __nuxt_component_0 } from "../server.mjs";
import { defineComponent, withAsyncContext, mergeProps, withCtx, createTextVNode, createVNode, unref, openBlock, createBlock, createCommentVNode, h, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { PlusIcon, ArrowUpDown, Pencil, Trash2 } from "lucide-vue-next";
import { _ as _sfc_main$2 } from "./DataTable-wjuY5lu7.js";
import dateFormat from "dateformat";
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
import "radix-vue";
import "clsx";
import "tailwind-merge";
import "./Input-BDNolIqX.js";
import "@vueuse/core";
import "@tanstack/vue-table";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    let { data: items, refresh } = ([__temp, __restore] = withAsyncContext(() => useApi("/search?limit=1000", "$3ZrXKrDchp")), __temp = await __temp, __restore(), __temp);
    const router = useRouter();
    const collectionColumns = [
      {
        accessorKey: "properties.title",
        id: "properties.title",
        header: ({ column }) => {
          return h(
            _sfc_main$1,
            {
              variant: "ghost",
              onClick: () => {
                column.toggleSorting(column.getIsSorted() === "asc");
              }
            },
            () => ["Title", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => {
          return h("div", { class: "lowercase" }, row.original.properties.title) ?? "";
        }
      },
      {
        accessorKey: "properties.description",
        header: ({ column }) => {
          return h(
            _sfc_main$1,
            {
              variant: "ghost",
              onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
            },
            () => ["Description", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => {
          return h(
            "div",
            { class: "lowercase" },
            row.original.properties.description ?? ""
          );
        }
      },
      {
        accessorKey: "collection",
        header: ({ column }) => {
          return h(
            _sfc_main$1,
            {
              variant: "ghost",
              onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
            },
            () => ["Collection", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => {
          return h("div", { class: "lowercase" }, row.original.collection);
        }
      },
      {
        accessorKey: "properties.storagelocation",
        header: ({ column }) => {
          return h(
            _sfc_main$1,
            {
              variant: "ghost",
              onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
            },
            () => ["Storage location", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => {
          return h(
            "div",
            { class: "lowercase" },
            row.original.properties.storagelocation
          );
        }
      },
      {
        accessorKey: "properties.datetime",
        header: ({ column }) => {
          return h(
            _sfc_main$1,
            {
              variant: "ghost",
              onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
            },
            () => ["Date", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => {
          const date = dateFormat(
            row.original.properties.datetime,
            "dd-mm-yyyy hh:MM:ss"
          );
          return h("div", { class: "lowercase" }, date);
        }
      },
      {
        id: "edit",
        cell: ({ row }) => {
          return h(
            _sfc_main$1,
            {
              variant: "ghost",
              onClick: () => {
                router.push("/items/" + row.original.id);
              }
            },
            () => ["Edit", h(Pencil, { class: "ml-2 h-4 w-4" })]
          );
        }
      },
      {
        id: "delete",
        cell: ({ row }) => {
          return h(
            _sfc_main$1,
            {
              variant: "ghost",
              onClick: () => {
                router.push("/items/delete/" + row.original.id);
              }
            },
            () => ["Delete", h(Trash2, { class: "ml-2 h-4 w-4" })]
          );
        }
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = _sfc_main$3;
      const _component_CardHeader = _sfc_main$4;
      const _component_CardTitle = _sfc_main$5;
      const _component_CardDescription = _sfc_main$6;
      const _component_CardContent = _sfc_main$7;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Card, mergeProps({ class: "mt-5" }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Registered data`);
                      } else {
                        return [
                          createTextVNode("Registered data")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`List of data sets registrations, which you are allowed to edit `);
                      } else {
                        return [
                          createTextVNode("List of data sets registrations, which you are allowed to edit ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode("Registered data")
                      ]),
                      _: 1
                    }),
                    createVNode(_component_CardDescription, null, {
                      default: withCtx(() => [
                        createTextVNode("List of data sets registrations, which you are allowed to edit ")
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
                  _push3(`<div class="flex justify-end"${_scopeId2}>`);
                  _push3(ssrRenderComponent(unref(_sfc_main$1), { "as-child": "" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, {
                          to: "/items/create",
                          class: "flex items-center gap-1"
                        }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(ssrRenderComponent(unref(PlusIcon), { class: "w-4 h-4 mr-2" }, null, _parent5, _scopeId4));
                              _push5(` Register new dataset `);
                            } else {
                              return [
                                createVNode(unref(PlusIcon), { class: "w-4 h-4 mr-2" }),
                                createTextVNode(" Register new dataset ")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, {
                            to: "/items/create",
                            class: "flex items-center gap-1"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(PlusIcon), { class: "w-4 h-4 mr-2" }),
                              createTextVNode(" Register new dataset ")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div><div class="flex justify-end"${_scopeId2}></div>`);
                  if (unref(items).features) {
                    _push3(ssrRenderComponent(_sfc_main$2, {
                      columns: collectionColumns,
                      data: unref(items).features,
                      filterId: "properties.title"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end" }, [
                      createVNode(unref(_sfc_main$1), { "as-child": "" }, {
                        default: withCtx(() => [
                          createVNode(_component_NuxtLink, {
                            to: "/items/create",
                            class: "flex items-center gap-1"
                          }, {
                            default: withCtx(() => [
                              createVNode(unref(PlusIcon), { class: "w-4 h-4 mr-2" }),
                              createTextVNode(" Register new dataset ")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode("div", { class: "flex justify-end" }),
                    unref(items).features ? (openBlock(), createBlock(_sfc_main$2, {
                      key: 0,
                      columns: collectionColumns,
                      data: unref(items).features,
                      filterId: "properties.title"
                    }, null, 8, ["data"])) : createCommentVNode("", true)
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
                      createTextVNode("Registered data")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("List of data sets registrations, which you are allowed to edit ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex justify-end" }, [
                    createVNode(unref(_sfc_main$1), { "as-child": "" }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, {
                          to: "/items/create",
                          class: "flex items-center gap-1"
                        }, {
                          default: withCtx(() => [
                            createVNode(unref(PlusIcon), { class: "w-4 h-4 mr-2" }),
                            createTextVNode(" Register new dataset ")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode("div", { class: "flex justify-end" }),
                  unref(items).features ? (openBlock(), createBlock(_sfc_main$2, {
                    key: 0,
                    columns: collectionColumns,
                    data: unref(items).features,
                    filterId: "properties.title"
                  }, null, 8, ["data"])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/items/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-BiFWa9Ui.js.map
