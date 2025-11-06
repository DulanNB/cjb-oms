<!--<template>-->
<!--  <div>-->
<!--    <vue-editor v-model="editorValue" :editorOptions="editorOptions" />-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import { VueEditor } from 'vue2-editor';-->
<!--import { Editor, EditorContent } from '@tiptap/vue-2';-->
<!--import StarterKit from '@tiptap/starter-kit';-->
<!--import Bold from '@tiptap/extension-bold';-->
<!--import Italic from '@tiptap/extension-italic';-->

<!--export default {-->
<!--  components: {-->
<!--    VueEditor,-->
<!--  },-->
<!--  props: {-->
<!--    value: {-->
<!--      type: String,-->
<!--      required: true,-->
<!--    },-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      editorValue: this.value,-->
<!--      content: '',-->
<!--      editorOptions: {-->
<!--        extensions: [-->
<!--          StarterKit,-->
<!--          Bold,-->
<!--          Italic,-->
<!--        ],-->
<!--        content: '<p>Hello, World!</p>',-->
<!--      },-->
<!--    };-->
<!--  },-->
<!--  watch: {-->
<!--    value(newVal) {-->
<!--      // Update the local editorValue when the prop value changes-->
<!--      this.editorValue = newVal;-->
<!--    },-->
<!--    editorValue(newVal) {-->
<!--      // Emit the updated editor value to the parent component-->
<!--      this.$emit('input', newVal);-->
<!--    },-->
<!--  },-->
<!--};-->
<!--</script>-->
