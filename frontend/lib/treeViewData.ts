export interface TreeViewData {
  id: string
  name: string
  visible: boolean
  checked: boolean
  nodes: TreeViewNode[]
  children: TreeViewData[]
}

interface TreeViewNode {
  id: string
  name: string
  checked: boolean
}
