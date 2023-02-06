import type { PropType, VNode } from 'vue'

export const VNodeRenderer = defineComponent({
  name: 'VNodeRenderer',
  props: {
    nodes: {
      type: [Array, Object] as PropType<VNode | VNode[]>,
      required: true,
    },
  },
  setup(props) {
    return () => props.nodes
  },
})

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type VNodeRenderer = InstanceType<typeof VNodeRenderer>
