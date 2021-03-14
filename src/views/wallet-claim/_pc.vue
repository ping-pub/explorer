<template>
  <div style="background: #fff;">
    <div style="max-width: 600px;margin: 0 auto;padding: 20px;">
      <div style="font-size: 20px;">Send</div>
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item label="支付地址">
          <a-input
            v-decorator="['note', { rules: [{ required: true, message: 'Please input!' }] }]"
          />
        </a-form-item>
        <a-form-item label="收款地址">
          <a-input
            v-decorator="['note', { rules: [{ required: true, message: 'Please input!' }] }]"
          />
        </a-form-item>
        <a-form-item>
          <a-button style="width: 100%;" type="primary" html-type="submit">提交</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" })
    };
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
    handleSelectChange(value) {
      this.form.setFieldsValue({
        note: `Hi, ${value === "male" ? "man" : "lady"}!`
      });
    }
  }
};
</script>

<style scoped>
.logo {
  width: 50px;
  height: 31px;
  line-height: 31px;
  font-size: 24px;
  font-weight: 700;
  color: #2e3338;
  margin: 16px 24px 16px 0;
  float: left;
}
</style>