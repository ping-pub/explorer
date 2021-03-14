<script>
export default {
  functional: true,
  render: (h, context) => {
    return context.props.render(h, context, context.props.scope);
  },
  props: {
    scope: {
      default() {
        return {};
      }
    },
    render: {
      type: Function
    }
  }
};
</script>
