import { defineComponent, ref, withAsyncContext, mergeProps, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { _ as _sfc_main$1 } from './CollectionCardForm-DaUQ5x9P.mjs';
import { u as useNuxtApp, c as useRoute, b as useRouter } from './server.mjs';
import './CardTitle-Bcq778cP.mjs';
import './CardContent-BLyPnbSA.mjs';
import './CardFooter-JmfLhCSb.mjs';
import './Label-B22JNgLO.mjs';
import 'radix-vue';
import './Input-BDNolIqX.mjs';
import '@vueuse/core';
import './CustomDropDownComponent-DYQMZ1K1.mjs';
import './CommandList-CfKjBZrS.mjs';
import 'lucide-vue-next';
import './collectionTypes-BmkP0Wdt.mjs';
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
import 'clsx';
import 'tailwind-merge';

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
    selectedKeywordsFacility.value = keywordsLink !== void 0 ? keywordsLink.id : "No Keywords";
    async function updateCollection() {
      try {
        errors.value = "";
        const data2 = await $api("/collections/{id}", {
          method: "DELETE",
          path: {
            id: route.params.id
          }
        });
      } catch (e) {
        errors.value = "It was not possible to delete the collection";
        return;
      }
      const router = useRouter();
      router.push("/collections");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(_sfc_main$1, mergeProps({
        buttonTitle: "Delete",
        "card-title": "Are you sure you want to delete this collection?",
        error: errors.value,
        title: title.value,
        description: description.value,
        collectionType: selectedCollectionType.value,
        keywordFacility: selectedKeywordsFacility.value,
        readonly: "true",
        onUpdate: updateCollection
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/collections/delete/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DD8-MH_V.mjs.map
