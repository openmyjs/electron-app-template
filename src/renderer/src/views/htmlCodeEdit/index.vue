<template>
  <div class="VAceEditor">
<!--    <a-button @click="formatCode">格式化</a-button>-->
    <VAceEditor
      v-model:value="code"
      :lang="language"
      :theme="theme"
      :options="editorOptions"
      style="height: 90%; width: 100%;"
      @change="formatCode"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VAceEditor } from 'vue3-ace-editor';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import beautify from 'js-beautify';
// import prettier from 'prettier'
// import parserVue from 'prettier-plugin-vue';
// import parserHtml from 'prettier/parser-html';
const code = ref(``);
const language = ref('javascript');
const theme = ref('monokai');
const editorOptions = ref({
  fontSize: '14px',
  showPrintMargin: false,
  wrap: true,  // 启用自动换行
});
const formatCode = async ()=>{

  // 使用 js-beautify 格式化html代码
  setTimeout(()=>{
    code.value = beautify.html(code.value, {
      indent_size: 2,
      space_in_empty_paren: true,
      space_in_paren: true,
    });
  },1000)


  // 使用 js-beautify 格式化JSON代码
  // code.value = beautify(code.value, {
  //   indent_size: 2,
  //   space_in_empty_paren: true,
  //   space_in_paren: true,
  // });
  // code.value = await prettier.format(code.value, {
  //   parser: 'html', // 指定解析器为 'html'
  //   plugins: [parserHtml], // 传入 HTML 解析器插件
  //   printWidth: 80, // 设置每行的最大字符数
  //   // 其他 Prettier 配置选项...
  // });


}
</script>
<style lang="scss" scoped>
.VAceEditor {
  width: 100%;
  height: 100%;
}
</style>