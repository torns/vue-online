<template>
  <div class="home">
    <!-- 头部 -->
    <run-header>
      <!-- 标题 -->
      <template #title>Vue Online</template>

      <!-- 操作 -->
      <template #operation>
        <Button type="text" @click="run">
          <Icon type="md-play" class="btn-icon" />
          <span>运行</span>
        </Button>
        <Button type="text" @click="reset">
          <Icon type="md-refresh" class="btn-icon" />
          <span>重置</span>
        </Button>
        <Button type="text" @click="copyhandle($event)">
          <Icon type="md-copy" class="btn-icon" />
          <span>复制</span>
        </Button>
        <Button type="text" @click="publish">
          <Icon type="md-cloud-upload" class="btn-icon" />
          <span>发布</span>
        </Button>
      </template>
    </run-header>

    <div class="demo-split">
      <Split v-model="split">
        <div slot="left" class="demo-split-pane">
          <!-- 代码 -->
          <codemirror
              class="left-box"
              ref="mycodemirror"
              v-model="code"
              :options="cmOptions"
              @ready="onCmReady"
          ></codemirror>
        </div>
        <div slot="right" class="demo-split-pane">
          <!-- 展示 -->
          <run-code
              class="right-box"
              v-if="runCodeHash"
              :code="code"
              ref="runcode"
          ></run-code>
        </div>
      </Split>
    </div>
  </div>
</template>

<script>
import runHeader from "@/components/layout/Header";
import runCode from "@/components/runCode/runCode";
import clip from "@/utils/clipboard.js";
//vue-codemirror相关
import { codemirror } from "vue-codemirror";
import "@/components/codeMirror/index.js";
import "@/components/codeMirror/myCodeMirror.css";
import qs from "qs";

export default {
  name: "VueOnline",
  components: {
    runHeader,
    runCode,
    codemirror
  },
  data() {
    return {
      split: 0.5,
      initcode: "",
      code: "",
      cmOptions: {
        mode: "htmlmixed",
        lineNumbers: true, //行号
        // scrollbarStyle: "simple",
        autoCloseBrackets: true, //自动补全括号
        matchBrackets: true, //匹配括号
        showCursorWhenSelecting: true, //select显示光标
        autoCloseTags: true,
        tabSize: 2,
        foldGutter: true, //可折叠的块
        gutters: [
          "CodeMirror-linenumbers",
          "CodeMirror-foldgutter",
          "CodeMirror-lint-markers"
        ],
        autofocus: true,
        styleActiveLine: true,
        hintOptions: {
          completeSingle: false
        },
        keyMap: "sublime",
        extraKeys: {
          "Ctrl-Q": "autocomplete"
        }
      },
      runCodeHash: true
    };
  },
  methods: {
    copyhandle(event) {
      clip(this.code, event);
    },
    run() {
      this.$refs.runcode.destroyCode();
      this.$refs.runcode.renderCode();
      this.$Message.success("已运行");
    },
    reset() {
      this.$refs.runcode.destroyCode();
      this.code = this.initcode;
      this.$nextTick(() => {
        this.$refs.runcode.renderCode();
        this.$Message.success("已重置");
      });
    },
    publish() {
      this.$axios({
        method: 'post',
        url: '/publisher/publish',
        data: qs.stringify({
          code: this.code
        })
      })
      .then(res => {
        if (res.data.success) {
          let url = window.location.origin + window.location.pathname + "?p=" + res.data.p;
          try {
            this.copyToClip(url);
            this.$Message.success("分享链接已复制到剪贴板");
          } catch (e) {
            this.$Message.success("分享链接复制失败");
            console.log(e);
          }
          setTimeout(() => {
            window.open(url, "_self");
          }, 1000);
        } else {
          this.$Message.error("发布失败，请稍后重试");
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    onCmReady(cm) {
      cm.on("keypress", () => {
        cm.showHint();
      });
    },
    copyToClip(msg) {
      var aux = document.createElement("input");
      aux.setAttribute("value", msg);
      document.body.appendChild(aux);
      aux.select();
      document.execCommand("copy");
      document.body.removeChild(aux);
    },
  },
  watch: {
    $route: {
      handler(val) {
        this.code = "";
        this.runCodeHash = false;
        this.$nextTick(() => {
          this.runCodeHash = true;
        });
      },
      immediate: true
    }
  },
  created() {
    if (!this.$route.query.p)
      return;
    this.$axios({
      method: 'post',
      url: '/publisher/get_code',
      data: qs.stringify({
        p: this.$route.query.p
      })
    })
    .then(res => {
      if (res.data.success) {
        this.code = res.data.code;
        //解决嵌套使用codemirror时，点击才会显示的问题。
        setTimeout(() => {
          this.$refs.mycodemirror.codemirror.refresh();
          this.run();
        }, 100);
      } else {
        this.$Message.error("未获取到相关信息");
        setTimeout(() => {
          this.$router.push('/');
        }, 500);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }
}
</script>

<style scoped>
.demo-split {
  position: absolute;
  top: 50px;
  height: calc(100% - 50px);
  width: 100%;
}
.demo-split-pane {
  padding: 10px;
  height: 100%;
  overflow: auto;
}
.code {
  white-space: pre-wrap;
}
.btn-icon {
  font-size: 20px;
  color: #1296db;
}
</style>