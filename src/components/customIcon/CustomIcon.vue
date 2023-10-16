<template>
  <div>
    <!-- Định nghĩa các thành phần SVG -->
    <svg-icon name="icon-1" />
    <!-- ...Thêm các thành phần SVG khác -->
  </div>
</template>

<script>
// Import các thành phần SVG hoặc hình ảnh SVG
import { ReactComponent as Icon1 } from "@/assets/icon-1.svg";
import { ReactComponent as Icon2 } from "@/assets/icon-2.svg";

// Đăng ký các thành phần
export default {
  components: {
    'svg-icon': {
      components: {
        'icon-1': Icon1,
        'icon-2': Icon2,
        // Thêm các tên thành phần và hình ảnh SVG khác ở đây
      },
      render() {
        return this.$slots.default();
      },
    },
  },
};
</script>