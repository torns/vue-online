<template>
  <div class="header" id="header">
    <div class="title">
      <img src="@/assets/avatar-zewan.jpg" width="26" height="26" alt style="border-radius: 50%" />
      <span>
        <slot name="title">Vue Online</slot>
      </span>
    </div>
    <div class="operation">
      <slot name="operation"></slot>
    </div>

    <div class="help">
      <Button
          type="text"
          to="https://github.com/ZewanHuang/vue-online"
          target="_blank"
      >
        <Icon type="logo-github" class="btn-icon" />
      </Button>
      <Button type="text" @click="blogUrl">
        <Icon type="ios-home" class="btn-icon" />
      </Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "runHeader",
  data() {},
  methods: {
    blogUrl() {
      window.open("https://blog.zewan.cc");
    }
  },
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  z-index: 1000;

  height: 50px;
  line-height: 50px;
  width: 100%;
  padding: 0 40px;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  margin-bottom: 1px;
  box-sizing: border-box;
  background: #fff;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.header .title {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-shrink: 0;
  width: 140px;
  height: 100%;
  vertical-align: middle;
  text-align: left;
  cursor: default;
}
.header .title span {
  padding-left: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header .operation {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  font-size: 14px;
}
.header .help {
  width: 104px;
  flex-shrink: 0;
}
.header .btn-icon {
  font-size: 20px;
  color: #1296db;
}
.help-icon {
  font-size: 20px;
  color: #1296db;
  margin-right: 10px;
}
.help-title {
  color: #1296db;
}
</style>
