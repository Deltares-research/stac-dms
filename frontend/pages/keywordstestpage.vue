<template>
  <Container class="py-8">
    <CustomTreeView :data="testData" @update="emitChange"></CustomTreeView>
  </Container>
</template>

<script setup lang="ts">
import CustomTreeView from "@/components/treeview/CustomTreeView.vue"
import type { TreeViewData } from "#build/lib/treeViewData"

function updateTree(id: string, checked: boolean, data) {
  if (data.id == id) {
    console.log(data.id)
    data.checked = checked
  }
  let node = data.nodes.find((node) => node.id == id)
  if (node) {
    node.checked = checked
  }
  if (data.children) {
    data.children.forEach((child) => updateTree(id, checked, child))
  }
}

function emitChange(e) {
  updateTree(e.id, e.checked, testData)
}

const testData: TreeViewData = {
  name: "root",
  id: "root",
  visible: true,
  checked: true,
  nodes: [
    {
      id: "nodeA",
      checked: false,
      name: "nodeA",
    },
    {
      id: "nodeA1",
      checked: false,
      name: "nodeA1",
    },
  ],
  children: [
    {
      id: "nodeA2",
      name: "nodeA2",
      visible: true,
      checked: false,
      nodes: [
        {
          id: "nodeA21",
          checked: false,
          name: "nodeA21",
        },
        {
          id: "nodeA22",
          checked: false,
          name: "nodeA22",
        },
      ],
      children: [
        {
          id: "nodeA23",
          checked: false,
          name: "nodeA23",
          visible: true,
          nodes: [
            {
              id: "nodeA231",
              checked: false,
              name: "nodeA231",
            },
            {
              id: "nodeA232",
              checked: true,
              name: "nodeA232",
            },
          ],
          children: [],
        },
        {
          id: "nodeA232B",
          checked: false,
          name: "nodeA232B",
          visible: true,
          nodes: [
            {
              id: "nodeA232B",
              checked: false,
              name: "nodeA232B",
            },
            {
              id: "nodeA234B",
              checked: true,
              name: "nodeA234B  ",
            },
          ],
          children: [],
        },
      ],
    },
  ],
}
</script>

<style scoped></style>
