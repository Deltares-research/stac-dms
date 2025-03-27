import { defineComponent, ref, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./CollectionCardForm-DaUQ5x9P.js";
import { u as useNuxtApp, b as useRouter } from "../server.mjs";
import "destr";
import "klona";
import "defu";
import "#internal/nuxt/paths";
import "./CardTitle-Bcq778cP.js";
import "./CardContent-BLyPnbSA.js";
import "./CardFooter-JmfLhCSb.js";
import "./Label-B22JNgLO.js";
import "radix-vue";
import "./Input-BDNolIqX.js";
import "@vueuse/core";
import "./CustomDropDownComponent-DYQMZ1K1.js";
import "./CommandList-CfKjBZrS.js";
import "lucide-vue-next";
import "./collectionTypes-BmkP0Wdt.js";
import "ofetch";
import "hookable";
import "unctx";
import "h3";
import "unhead";
import "@unhead/shared";
import "vue-router";
import "radix3";
import "ufo";
import "class-variance-authority";
import "ohash";
import "clsx";
import "tailwind-merge";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "create",
  __ssrInlineRender: true,
  setup(__props) {
    const errors = ref("");
    const { $api } = useNuxtApp();
    ref("");
    ref("");
    async function createCollection(emitedCollection) {
      const newCollection = {
        type: "Collection",
        stac_version: "1.0.0",
        id: emitedCollection.title,
        title: emitedCollection.title,
        description: emitedCollection.description,
        keywords: [emitedCollection.collectionType],
        license: "proprietary",
        extent: {
          spatial: {
            bbox: [[-180, -56, 180, 83]]
          },
          temporal: {
            interval: [[]]
          }
        },
        links: []
      };
      if (emitedCollection.keywordsFacility !== "No keywords") {
        newCollection.links.push({
          rel: "keywords",
          href: "/facilities/" + emitedCollection.keywordsFacility,
          type: "application/json",
          id: emitedCollection.keywordsFacility
        });
      }
      try {
        errors.value = "";
        const data = await $api("/collections", {
          method: "POST",
          body: newCollection
        });
      } catch (e) {
        errors.value = "It was not possible to create the collection";
        return;
      }
      const router = useRouter();
      router.push("/collections");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "justify-end" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        "button-title": "Create",
        "card-title": "Create a new collection",
        onUpdate: createCollection,
        errors: errors.value,
        collectionType: "experimentalFacility",
        keywordFacility: "No keywords"
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collections/create.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=create-CSeTrxMo.js.map
