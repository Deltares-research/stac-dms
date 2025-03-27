import { defineComponent, ref, withAsyncContext, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./CollectionCardForm-DaUQ5x9P.js";
import { u as useNuxtApp, c as useRoute, b as useRouter } from "../server.mjs";
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
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { $api } = useNuxtApp();
    const errors = ref("");
    const title = ref("");
    const description = ref("");
    const selectedCollectionType = ref("");
    const selectedKeywordsFacility = ref("");
    const route = useRoute();
    const data = ([__temp, __restore] = withAsyncContext(() => $api("/collections/{collection_id}", {
      path: {
        collection_id: route.params.id
      }
    })), __temp = await __temp, __restore(), __temp);
    title.value = data.title;
    description.value = data.description;
    selectedCollectionType.value = data.keywords[0];
    const keywordsLink = data.links.find((item) => item.rel == "keywords");
    selectedKeywordsFacility.value = keywordsLink !== void 0 ? keywordsLink.id : "No keywords";
    async function updateCollection(emitedCollection) {
      const updatedCollection = {
        type: "Collection",
        stac_version: "1.0.0",
        id: data.id,
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
        updatedCollection.links.push({
          rel: "keywords",
          href: "/facilities/" + emitedCollection.keywordsFacility,
          type: "application/json",
          id: emitedCollection.keywordsFacility
        });
      }
      try {
        errors.value = "";
        const data2 = await $api("/collections/{id}", {
          method: "PUT",
          path: {
            id: route.params.id
          },
          body: updatedCollection
        });
      } catch (e) {
        errors.value = "It was not possible to update the collection";
        return;
      }
      const router = useRouter();
      router.push("/collections");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "justify-end" }, _attrs))}>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        "card-title": "Edit collection",
        "button-title": "update",
        errors: errors.value,
        onUpdate: updateCollection,
        title: title.value,
        description: description.value,
        collectionType: selectedCollectionType.value,
        keywordFacility: selectedKeywordsFacility.value
      }, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collections/update/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-DdC4RSnB.js.map
