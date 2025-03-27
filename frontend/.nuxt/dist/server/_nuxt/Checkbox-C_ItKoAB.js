import { defineComponent, computed, unref, mergeProps, withCtx, renderSlot, createVNode, useSSRContext } from "vue";
import { ssrRenderComponent, ssrRenderSlot } from "vue/server-renderer";
import { useForwardPropsEmits, CheckboxRoot, CheckboxIndicator } from "radix-vue";
import { Check } from "lucide-vue-next";
import { e as cn } from "../server.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Checkbox",
  __ssrInlineRender: true,
  props: {
    defaultChecked: { type: Boolean },
    checked: { type: [Boolean, String] },
    disabled: { type: Boolean },
    required: { type: Boolean },
    name: {},
    value: {},
    id: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  emits: ["update:checked"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emits = __emit;
    const delegatedProps = computed(() => {
      const { class: _, ...delegated } = props;
      return delegated;
    });
    const forwarded = useForwardPropsEmits(delegatedProps, emits);
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(CheckboxRoot), mergeProps(unref(forwarded), {
        class: unref(cn)(
          "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
          props.class
        )
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(CheckboxIndicator), { class: "flex h-full w-full items-center justify-center text-current" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
                    _push3(ssrRenderComponent(unref(Check), { class: "h-4 w-4" }, null, _parent3, _scopeId2));
                  }, _push3, _parent3, _scopeId2);
                } else {
                  return [
                    renderSlot(_ctx.$slots, "default", {}, () => [
                      createVNode(unref(Check), { class: "h-4 w-4" })
                    ])
                  ];
                }
              }),
              _: 3
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(CheckboxIndicator), { class: "flex h-full w-full items-center justify-center text-current" }, {
                default: withCtx(() => [
                  renderSlot(_ctx.$slots, "default", {}, () => [
                    createVNode(unref(Check), { class: "h-4 w-4" })
                  ])
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
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/checkbox/Checkbox.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=Checkbox-C_ItKoAB.js.map
