import { _ as _sfc_main$2, a as _sfc_main$1, b as _sfc_main$3 } from './CardTitle-Bcq778cP.mjs';
import { _ as _sfc_main$4 } from './CardContent-BLyPnbSA.mjs';
import { _ as _sfc_main$8 } from './CardFooter-JmfLhCSb.mjs';
import { _ as _sfc_main$5 } from './Label-B22JNgLO.mjs';
import { _ as _sfc_main$6 } from './Input-BDNolIqX.mjs';
import { _ as _sfc_main$1$1, a as _sfc_main$7 } from './CustomDropDownComponent-DYQMZ1K1.mjs';
import { d as useApi, a as _sfc_main$3$1, _ as __nuxt_component_0 } from './server.mjs';
import { defineComponent, withAsyncContext, ref, mergeProps, withCtx, createTextVNode, toDisplayString, createVNode, unref, withModifiers, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { c as collectionTypes } from './collectionTypes-BmkP0Wdt.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CollectionCardForm",
  __ssrInlineRender: true,
  props: {
    cardTitle: String,
    title: String,
    description: String,
    collectionType: String,
    keywordFacility: String,
    buttonTitle: String,
    errors: String,
    readonly: Boolean
  },
  emits: ["update"],
  async setup(__props, { emit: __emit }) {
    var _a2, _b2, _c;
    var _a, _b;
    let __temp, __restore;
    const emit = __emit;
    let { data: keywords } = ([__temp, __restore] = withAsyncContext(() => useApi("/facilities", "$WQJB0smkc5")), __temp = await __temp, __restore(), __temp);
    console.log({ keywords });
    let keywordsFacilities = (_a2 = (_a = keywords.value) == null ? void 0 : _a.map((item) => {
      return { value: item.id, label: item.name };
    })) != null ? _a2 : [];
    keywordsFacilities.unshift({ value: "No keywords", label: "No keywords" });
    const props = __props;
    const name = ref((_b2 = props.title) != null ? _b2 : "");
    const description = ref((_c = props.description) != null ? _c : "");
    const selectedCollectionTypeId = ref(props.collectionType);
    const selectedKeywordFacility = (_b = keywords.value) == null ? void 0 : _b.find(
      (item) => item.id == props.keywordFacility
    );
    const selectedCollectionType = collectionTypes.find(
      (item) => item.value == props.collectionType
    );
    const selectedKeywordsFacilityId = ref(props.keywordFacility);
    const collectionType = collectionTypes;
    function emitChange() {
      const newCollection = {
        title: name.value,
        description: description.value,
        collectionType: selectedCollectionTypeId.value,
        keywordsFacility: selectedKeywordsFacilityId.value
      };
      emit("update", newCollection);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = _sfc_main$2;
      const _component_CardHeader = _sfc_main$1;
      const _component_CardTitle = _sfc_main$3;
      const _component_CardContent = _sfc_main$4;
      const _component_Label = _sfc_main$5;
      const _component_Input = _sfc_main$6;
      const _component_Textarea = _sfc_main$1$1;
      const _component_CustomDropDownComponent = _sfc_main$7;
      const _component_CardFooter = _sfc_main$8;
      const _component_Button = _sfc_main$3$1;
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
                        _push4(`${ssrInterpolate(__props.cardTitle)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(__props.cardTitle), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_CardTitle, null, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.cardTitle), 1)
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
                var _a22, _b22;
                if (_push3) {
                  _push3(`<form${_scopeId2}><div class="grid items-center w-full gap-4"${_scopeId2}><div class="flex flex-col space-y-1.5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, { for: "name" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Name`);
                      } else {
                        return [
                          createTextVNode("Name")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (__props.readonly) {
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "name",
                      modelValue: name.value,
                      "onUpdate:modelValue": ($event) => name.value = $event,
                      placeholder: "Name of your collection",
                      readonly: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (!__props.readonly) {
                    _push3(ssrRenderComponent(_component_Input, {
                      id: "name",
                      modelValue: name.value,
                      "onUpdate:modelValue": ($event) => name.value = $event,
                      placeholder: "Name of your collection"
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col space-y-1.5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, { for: "description" }, {
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
                  if (__props.readonly) {
                    _push3(ssrRenderComponent(_component_Textarea, {
                      id: "description",
                      modelValue: description.value,
                      "onUpdate:modelValue": ($event) => description.value = $event,
                      readonly: ""
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (!__props.readonly) {
                    _push3(ssrRenderComponent(_component_Textarea, {
                      id: "description",
                      modelValue: description.value,
                      "onUpdate:modelValue": ($event) => description.value = $event
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`<div class="flex flex-col space-y-1.5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, { for: "collectionType" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Collection type`);
                      } else {
                        return [
                          createTextVNode("Collection type")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (!__props.readonly) {
                    _push3(ssrRenderComponent(_component_CustomDropDownComponent, {
                      id: "collectionType",
                      options: unref(collectionType),
                      modelValue: selectedCollectionTypeId.value,
                      "onUpdate:modelValue": ($event) => selectedCollectionTypeId.value = $event
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.readonly) {
                    _push3(ssrRenderComponent(_component_Input, {
                      readonly: "",
                      placeholder: unref(selectedCollectionType).label
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div><div class="flex flex-col space-y-1.5"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_Label, { for: "keywordsFacility" }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`Keywords`);
                      } else {
                        return [
                          createTextVNode("Keywords")
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  if (!__props.readonly) {
                    _push3(ssrRenderComponent(_component_CustomDropDownComponent, {
                      id: "keywordsFacility",
                      options: unref(keywordsFacilities),
                      modelValue: selectedKeywordsFacilityId.value,
                      "onUpdate:modelValue": ($event) => selectedKeywordsFacilityId.value = $event
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  if (__props.readonly) {
                    _push3(ssrRenderComponent(_component_Input, {
                      readonly: "",
                      placeholder: (_a22 = unref(selectedKeywordFacility)) == null ? void 0 : _a22.name
                    }, null, _parent3, _scopeId2));
                  } else {
                    _push3(`<!---->`);
                  }
                  _push3(`</div></div></div></form>`);
                  if (__props.errors) {
                    _push3(`<p class="text-red-500"${_scopeId2}>${ssrInterpolate(__props.errors)}</p>`);
                  } else {
                    _push3(`<!---->`);
                  }
                } else {
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(emitChange, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid items-center w-full gap-4" }, [
                        createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                          createVNode(_component_Label, { for: "name" }, {
                            default: withCtx(() => [
                              createTextVNode("Name")
                            ]),
                            _: 1
                          }),
                          __props.readonly ? (openBlock(), createBlock(_component_Input, {
                            key: 0,
                            id: "name",
                            modelValue: name.value,
                            "onUpdate:modelValue": ($event) => name.value = $event,
                            placeholder: "Name of your collection",
                            readonly: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          !__props.readonly ? (openBlock(), createBlock(_component_Input, {
                            key: 1,
                            id: "name",
                            modelValue: name.value,
                            "onUpdate:modelValue": ($event) => name.value = $event,
                            placeholder: "Name of your collection"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                          createVNode(_component_Label, { for: "description" }, {
                            default: withCtx(() => [
                              createTextVNode("Description")
                            ]),
                            _: 1
                          }),
                          __props.readonly ? (openBlock(), createBlock(_component_Textarea, {
                            key: 0,
                            id: "description",
                            modelValue: description.value,
                            "onUpdate:modelValue": ($event) => description.value = $event,
                            readonly: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          !__props.readonly ? (openBlock(), createBlock(_component_Textarea, {
                            key: 1,
                            id: "description",
                            modelValue: description.value,
                            "onUpdate:modelValue": ($event) => description.value = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                            createVNode(_component_Label, { for: "collectionType" }, {
                              default: withCtx(() => [
                                createTextVNode("Collection type")
                              ]),
                              _: 1
                            }),
                            !__props.readonly ? (openBlock(), createBlock(_component_CustomDropDownComponent, {
                              key: 0,
                              id: "collectionType",
                              options: unref(collectionType),
                              modelValue: selectedCollectionTypeId.value,
                              "onUpdate:modelValue": ($event) => selectedCollectionTypeId.value = $event
                            }, null, 8, ["options", "modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                            __props.readonly ? (openBlock(), createBlock(_component_Input, {
                              key: 1,
                              readonly: "",
                              placeholder: unref(selectedCollectionType).label
                            }, null, 8, ["placeholder"])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                            createVNode(_component_Label, { for: "keywordsFacility" }, {
                              default: withCtx(() => [
                                createTextVNode("Keywords")
                              ]),
                              _: 1
                            }),
                            !__props.readonly ? (openBlock(), createBlock(_component_CustomDropDownComponent, {
                              key: 0,
                              id: "keywordsFacility",
                              options: unref(keywordsFacilities),
                              modelValue: selectedKeywordsFacilityId.value,
                              "onUpdate:modelValue": ($event) => selectedKeywordsFacilityId.value = $event
                            }, null, 8, ["options", "modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                            __props.readonly ? (openBlock(), createBlock(_component_Input, {
                              key: 1,
                              readonly: "",
                              placeholder: (_b22 = unref(selectedKeywordFacility)) == null ? void 0 : _b22.name
                            }, null, 8, ["placeholder"])) : createCommentVNode("", true)
                          ])
                        ])
                      ])
                    ], 32),
                    __props.errors ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-red-500"
                    }, toDisplayString(__props.errors), 1)) : createCommentVNode("", true)
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
                        _push4(ssrRenderComponent(_component_NuxtLink, { to: "/collections" }, {
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
                          createVNode(_component_NuxtLink, { to: "/collections" }, {
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
                  _push3(ssrRenderComponent(_component_Button, { onClick: emitChange }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(__props.buttonTitle)}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(__props.buttonTitle), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                } else {
                  return [
                    createVNode(_component_Button, { variant: "outline" }, {
                      default: withCtx(() => [
                        createVNode(_component_NuxtLink, { to: "/collections" }, {
                          default: withCtx(() => [
                            createTextVNode("Cancel")
                          ]),
                          _: 1
                        })
                      ]),
                      _: 1
                    }),
                    createVNode(_component_Button, { onClick: emitChange }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(__props.buttonTitle), 1)
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
                      createTextVNode(toDisplayString(__props.cardTitle), 1)
                    ]),
                    _: 1
                  })
                ]),
                _: 1
              }),
              createVNode(_component_CardContent, null, {
                default: withCtx(() => {
                  var _a22;
                  return [
                    createVNode("form", {
                      onSubmit: withModifiers(emitChange, ["prevent"])
                    }, [
                      createVNode("div", { class: "grid items-center w-full gap-4" }, [
                        createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                          createVNode(_component_Label, { for: "name" }, {
                            default: withCtx(() => [
                              createTextVNode("Name")
                            ]),
                            _: 1
                          }),
                          __props.readonly ? (openBlock(), createBlock(_component_Input, {
                            key: 0,
                            id: "name",
                            modelValue: name.value,
                            "onUpdate:modelValue": ($event) => name.value = $event,
                            placeholder: "Name of your collection",
                            readonly: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          !__props.readonly ? (openBlock(), createBlock(_component_Input, {
                            key: 1,
                            id: "name",
                            modelValue: name.value,
                            "onUpdate:modelValue": ($event) => name.value = $event,
                            placeholder: "Name of your collection"
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true)
                        ]),
                        createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                          createVNode(_component_Label, { for: "description" }, {
                            default: withCtx(() => [
                              createTextVNode("Description")
                            ]),
                            _: 1
                          }),
                          __props.readonly ? (openBlock(), createBlock(_component_Textarea, {
                            key: 0,
                            id: "description",
                            modelValue: description.value,
                            "onUpdate:modelValue": ($event) => description.value = $event,
                            readonly: ""
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          !__props.readonly ? (openBlock(), createBlock(_component_Textarea, {
                            key: 1,
                            id: "description",
                            modelValue: description.value,
                            "onUpdate:modelValue": ($event) => description.value = $event
                          }, null, 8, ["modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                          createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                            createVNode(_component_Label, { for: "collectionType" }, {
                              default: withCtx(() => [
                                createTextVNode("Collection type")
                              ]),
                              _: 1
                            }),
                            !__props.readonly ? (openBlock(), createBlock(_component_CustomDropDownComponent, {
                              key: 0,
                              id: "collectionType",
                              options: unref(collectionType),
                              modelValue: selectedCollectionTypeId.value,
                              "onUpdate:modelValue": ($event) => selectedCollectionTypeId.value = $event
                            }, null, 8, ["options", "modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                            __props.readonly ? (openBlock(), createBlock(_component_Input, {
                              key: 1,
                              readonly: "",
                              placeholder: unref(selectedCollectionType).label
                            }, null, 8, ["placeholder"])) : createCommentVNode("", true)
                          ]),
                          createVNode("div", { class: "flex flex-col space-y-1.5" }, [
                            createVNode(_component_Label, { for: "keywordsFacility" }, {
                              default: withCtx(() => [
                                createTextVNode("Keywords")
                              ]),
                              _: 1
                            }),
                            !__props.readonly ? (openBlock(), createBlock(_component_CustomDropDownComponent, {
                              key: 0,
                              id: "keywordsFacility",
                              options: unref(keywordsFacilities),
                              modelValue: selectedKeywordsFacilityId.value,
                              "onUpdate:modelValue": ($event) => selectedKeywordsFacilityId.value = $event
                            }, null, 8, ["options", "modelValue", "onUpdate:modelValue"])) : createCommentVNode("", true),
                            __props.readonly ? (openBlock(), createBlock(_component_Input, {
                              key: 1,
                              readonly: "",
                              placeholder: (_a22 = unref(selectedKeywordFacility)) == null ? void 0 : _a22.name
                            }, null, 8, ["placeholder"])) : createCommentVNode("", true)
                          ])
                        ])
                      ])
                    ], 32),
                    __props.errors ? (openBlock(), createBlock("p", {
                      key: 0,
                      class: "text-red-500"
                    }, toDisplayString(__props.errors), 1)) : createCommentVNode("", true)
                  ];
                }),
                _: 1
              }),
              createVNode(_component_CardFooter, { class: "flex justify-between px-6 pb-6" }, {
                default: withCtx(() => [
                  createVNode(_component_Button, { variant: "outline" }, {
                    default: withCtx(() => [
                      createVNode(_component_NuxtLink, { to: "/collections" }, {
                        default: withCtx(() => [
                          createTextVNode("Cancel")
                        ]),
                        _: 1
                      })
                    ]),
                    _: 1
                  }),
                  createVNode(_component_Button, { onClick: emitChange }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(__props.buttonTitle), 1)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/collections/CollectionCardForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=CollectionCardForm-DaUQ5x9P.mjs.map
