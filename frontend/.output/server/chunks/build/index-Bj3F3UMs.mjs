import { _ as _sfc_main$2, a as _sfc_main$1$1, b as _sfc_main$4 } from './CardTitle-Bcq778cP.mjs';
import { _ as _sfc_main$5 } from './CardDescription-5Vd1PiTP.mjs';
import { _ as _sfc_main$6 } from './CardContent-BLyPnbSA.mjs';
import { b as useRouter, u as useNuxtApp, d as useApi, a as _sfc_main$3, _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, ref, withAsyncContext, withCtx, createTextVNode, createVNode, unref, useSSRContext, h } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './DataTable-wjuY5lu7.mjs';
import { ArrowUpDown, Pencil, Trash2 } from 'lucide-vue-next';
import { c as collectionTypes } from './collectionTypes-BmkP0Wdt.mjs';
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
import 'radix-vue';
import 'clsx';
import 'tailwind-merge';
import './Input-BDNolIqX.mjs';
import '@vueuse/core';
import '@tanstack/vue-table';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const router = useRouter();
    useNuxtApp();
    const collections = ref([]);
    let { data: keywords } = ([__temp, __restore] = withAsyncContext(() => useApi("/facilities", "$oQZmD9LkdM")), __temp = await __temp, __restore(), __temp);
    async function updateCollection(id) {
      router.push("/collections/update/" + id);
    }
    async function deleteCollection(id) {
      router.push("/collections/delete/" + id);
    }
    const collectionColumns = [
      {
        accessorKey: "title",
        header: ({ column }) => {
          return h(
            _sfc_main$3,
            {
              variant: "ghost",
              onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
            },
            () => ["Title", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => row.getValue("title")
      },
      {
        accessorKey: "description",
        header: ({ column }) => {
          return h(
            _sfc_main$3,
            {
              variant: "ghost",
              onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
            },
            () => ["Description", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => {
          return row.getValue("description");
        }
      },
      {
        accessorKey: "keywords",
        header: ({ column }) => {
          return h(
            _sfc_main$3,
            {
              variant: "ghost",
              onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
            },
            () => ["Collection type", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => {
          const key = row.getValue("keywords")[0];
          const selectedItem = collectionTypes.find((item) => item.value == key);
          return selectedItem.label;
        }
      },
      {
        accessorKey: "links",
        header: ({ column }) => {
          return h(
            _sfc_main$3,
            {
              variant: "ghost",
              onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
            },
            () => ["Keywords", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })]
          );
        },
        cell: ({ row }) => {
          const links = row.original.links.find((item) => item.rel == "keywords");
          if (links === void 0)
            return "No keywords";
          const keywordDescription = keywords.value.find(
            (item) => item.id == links.id
          );
          if (keywordDescription === void 0)
            return "No keywords";
          return keywordDescription.name;
        }
      },
      {
        id: "edit",
        cell: ({ row }) => {
          return h(
            _sfc_main$3,
            {
              variant: "ghost",
              onClick: () => {
                updateCollection(row.original.id);
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
            _sfc_main$3,
            {
              variant: "ghost",
              onClick: () => {
                deleteCollection(row.original.id);
              }
            },
            () => ["Delete", h(Trash2, { class: "ml-2 h-4 w-4" })]
          );
        }
      }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = _sfc_main$2;
      const _component_CardHeader = _sfc_main$1$1;
      const _component_CardTitle = _sfc_main$4;
      const _component_CardDescription = _sfc_main$5;
      const _component_CardContent = _sfc_main$6;
      const _component_NuxtLink = __nuxt_component_0;
      _push(ssrRenderComponent(_component_Card, _attrs, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_CardHeader, null, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_CardTitle, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Collections`);
                      } else {
                        return [
                          createTextVNode("Collections")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_CardDescription, null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`List of data sets collections, which you are allowed to edit `);
                      } else {
                        return [
                          createTextVNode("List of data sets collections, which you are allowed to edit ")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
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
                        createTextVNode("List of data sets collections, which you are allowed to edit ")
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
                  _push3(ssrRenderComponent(unref(_sfc_main$3), null, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(ssrRenderComponent(_component_NuxtLink, { to: "/collections/create" }, {
                          default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                            if (_push5) {
                              _push5(`Add collection`);
                            } else {
                              return [
                                createTextVNode("Add collection")
                              ];
                            }
                          }),
                          _: 1
                        }, _parent4, _scopeId3));
                      } else {
                        return [
                          createVNode(_component_NuxtLink, { to: "/collections/create" }, {
                            default: withCtx(() => [
                              createTextVNode("Add collection")
                            ]),
                            _: 1
                          })
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                  _push3(ssrRenderComponent(_sfc_main$1, {
                    columns: collectionColumns,
                    data: collections.value
                  }, null, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end" }, [
                      createVNode(unref(_sfc_main$3), null, {
                        default: withCtx(() => [
                          createVNode(_component_NuxtLink, { to: "/collections/create" }, {
                            default: withCtx(() => [
                              createTextVNode("Add collection")
                            ]),
                            _: 1
                          })
                        ]),
                        _: 1
                      })
                    ]),
                    createVNode(_sfc_main$1, {
                      columns: collectionColumns,
                      data: collections.value
                    }, null, 8, ["data"])
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
                      createTextVNode("Collections")
                    ]),
                    _: 1
                  }),
                  createVNode(_component_CardDescription, null, {
                    default: withCtx(() => [
                      createTextVNode("List of data sets collections, which you are allowed to edit ")
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, null, {
                default: withCtx(() => [
                  createVNode("div", { class: "flex justify-end" }, [
                    createVNode(unref(_sfc_main$3), null, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, { to: "/collections/create" }, {
                          default: withCtx(() => [
                            createTextVNode("Add collection")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    })
                  ]),
                  createVNode(_sfc_main$1, {
                    columns: collectionColumns,
                    data: collections.value
                  }, null, 8, ["data"])
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collections/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-Bj3F3UMs.mjs.map
