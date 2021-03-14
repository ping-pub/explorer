<template>
<div>
  <div style="    margin-bottom: 4px;
    color: rgba(0, 0, 0, 0.45);">{{ title }}</div>
  <div style="    color: rgba(0, 0, 0, 0.85);
    font-size: 24px;">{{ value }}</div>
</div>
</template>

<script>
export default {
  props: {
    title: '',
    value: ''
  }
}
</script>