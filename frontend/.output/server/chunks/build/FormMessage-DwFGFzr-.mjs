import { defineComponent, provide, mergeProps, unref, useSSRContext, withCtx, renderSlot, toValue, inject } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent } from 'vue/server-renderer';
import { e as cn } from './server.mjs';
import { _ as _sfc_main$4 } from './Label-B22JNgLO.mjs';
import { useId, Slot } from 'radix-vue';
import { ErrorMessage, FieldContextKey, useIsFieldValid, useIsFieldDirty, useIsFieldTouched, useFieldError } from 'vee-validate';

const FORM_ITEM_INJECTION_KEY = Symbol();
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "FormItem",
  __ssrInlineRender: true,
  props: {
    class: {}
  },
  setup(__props) {
    const props = __props;
    const id = useId();
    provide(FORM_ITEM_INJECTION_KEY, id);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: unref(cn)("space-y-2", props.class)
      }, _attrs))}>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormItem.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
function useFormField() {
  const fieldContext = inject(FieldContextKey);
  const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY);
  const fieldState = {
    valid: useIsFieldValid(),
    isDirty: useIsFieldDirty(),
    isTouched: useIsFieldTouched(),
    error: useFieldError()
  };
  if (!fieldContext)
    throw new Error("useFormField should be used within <FormField>");
  const { name } = fieldContext;
  const id = fieldItemContext;
  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
}
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FormLabel",
  __ssrInlineRender: true,
  props: {
    for: {},
    asChild: { type: Boolean },
    as: {},
    class: {}
  },
  setup(__props) {
    const props = __props;
    const { error, formItemId } = useFormField();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(_sfc_main$4), mergeProps({
        class: unref(cn)(
          unref(error) && "text-destructive",
          props.class
        ),
        for: unref(formItemId)
      }, _attrs), {
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
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormLabel.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FormControl",
  __ssrInlineRender: true,
  setup(__props) {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(Slot), mergeProps({
        id: unref(formItemId),
        "aria-describedby": !unref(error) ? `${unref(formDescriptionId)}` : `${unref(formDescriptionId)} ${unref(formMessageId)}`,
        "aria-invalid": !!unref(error)
      }, _attrs), {
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
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormControl.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "FormMessage",
  __ssrInlineRender: true,
  setup(__props) {
    const { name, formMessageId } = useFormField();
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorMessage), mergeProps({
        id: unref(formMessageId),
        as: "p",
        name: toValue(unref(name)),
        class: "text-sm font-medium text-destructive"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ui/form/FormMessage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main$3 as _, _sfc_main$1 as a, _sfc_main$2 as b, _sfc_main as c };
//# sourceMappingURL=FormMessage-DwFGFzr-.mjs.map
