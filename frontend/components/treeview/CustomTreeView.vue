<template>
  <ul v-if="items.visible">
    <li v-for="node in items.nodes" class="node fa fa-angle-down">
      <TreeViewNode
        :id="node.id"
        :name="node.name"
        :checked="node.checked"
        @update="emitChange"
      ></TreeViewNode>
    </li>
    <li v-for="child in items.children" class="node">
      <div class="flex items-center space-x-2">
        <Checkbox
          id="checkbox"
          :checked="child.checked"
          @update:checked="emitChangeGroupNode(child)"
        />
        <label
          for="checkbox"
          class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {{ child.name }}
        </label>
        <Button variant="ghost" size="small" class="mt-0">
          <ChevronDown
            v-if="child.visible"
            class="w-4 h-4"
            @click="child.visible = !child.visible"
          />
          <ChevronRight
            v-if="!child.visible"
            class="w-4 h-4"
            @click="child.visible = !child.visible"
          />
        </Button>
      </div>
      <CustomTreeView
        class="node"
        :data="child"
        @update="emitChange"
      ></CustomTreeView>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronRight } from "lucide-vue-next"
import type { TreeViewData } from "../../lib/treeViewData"
import TreeViewNode from "@/components/treeview/TreeViewNode.vue"
import { toRef } from "vue"

const emit = defineEmits(["update"])

const props = defineProps({
  data: Array,
})
function emitChangeGroupNode(child) {
  child.checked = !child.checked
  emit("update", { checked: child.checked, id: child.id })
}

function emitChange(e) {
  emit("update", e)
}

const items = toRef(props.data)
</script>

<style>
.node {
  position: relative;
  left: 20px;
}
</style>
