<template>
  <div class="rich-text-editor">
    <!--    Toolbar -->
    <div ref="toolbarContainer" class="toolbar-container">
      <div class="toolbar">
        <span>
<!--          Default Toolbar Items -->
          <div id="default_toolbar_items" class="row">
            <button v-for="button in toolbarButtons" v-if="!button.select" :key="button.class" :class="button.class"
                    :value="button.value"></button>
            <select ref="headerSelect" class="ql-header" style="width: 110px">
              <option value="1"></option>
              <option value="2"></option>
              <option value="3"></option>
              <option value=""></option>
            </select>
            <select class="ql-size" style="width: 90px">
              <option value="small"></option>
              <option value="large"></option>
              <option value="huge"></option>
            </select>
          </div>
          <!--          Custom Toolbar Items-->
          <div class="row">
<!--            Letter Template Custom Toolbar Items-->
            <button v-for="item in placeholderItems" v-if="showLetterTemplateCustomToolbarItems"
                    id="custom_toolbar_items" :key="item.type" class="ql-test" style="width: max-content"
                    @click="handleLetterTemplateCustomButtonClick(item.type)">
            {{ item.label }}
          </button>
            <!--            Letter Custom Toolbar Items -->
            <div class="col-md-4">
              <Select
                v-if="showLetterCustomToolbarItems"
                :attributes="letter_template_attributes"
                :customDropdownBackground="customDropdownBackground"
                placeholder="Select Letter Template"
                @queryUpdates="getLetterTemplateList"
                @selectUpdates="selectLetterTemplate"
              />
            </div>
          </div>
        </span>
      </div>
    </div>
    <!--    Editor Container -->
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script>
import Quill from 'quill';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

export default {
  props: {
    value: {
      type: String,
      required: true,
    },
    showLetterTemplateCustomToolbarItems: {
      type: Boolean,
      default: false,
    },
    showLetterCustomToolbarItems: {
      type: Boolean,
      default: false,
    },
    patient: {
      type: Object,
      default: null,
    },
    clinic: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      // default toolbar items
      toolbarButtons: [
        {class: 'ql-bold'},
        {class: 'ql-italic'},
        {class: 'ql-underline'},
        {class: 'ql-strike'},
        {class: 'ql-align', value: ''},
        {class: 'ql-align', value: 'center'},
        {class: 'ql-align', value: 'right'},
        {class: 'ql-align', value: 'justify'},
        {class: 'ql-link'},
        {class: 'ql-image'},
        {class: 'ql-list', value: 'ordered'},
        {class: 'ql-list', value: 'bullet'},
        {class: 'ql-blockquote'},
        {class: 'ql-indent', value: '-1'},
        {class: 'ql-indent', value: '+1'},
      ],
      // custom toolbar items -> letter templates
      placeholderItems: [
        {type: 'patient', label: 'Insert Patient Placeholder'},
        {type: 'patient_address', label: 'Insert Patient Address Placeholder'},
        {type: 'patient_phone_number', label: 'Insert Patient Phone Number Placeholder'},
        {type: 'clinic', label: 'Insert Clinic Placeholder'},
      ],
      letter_template_attributes: {
        data: [],
        selected: {},
      },
      customDropdownBackground: `#f2f2f2` // change select component background color to match toolbar background color
    };
  },

  watch: {
    value(newValue) {
      // Update the Quill editor only if the value is updated externally
      if (this.quill && this.quill.root.innerHTML !== newValue) {
        this.quill.root.innerHTML = newValue;
      }
    },
  },

  methods: {
    initializeEditor() {
      // Create a new Quill instance and set it up with the provided containers and options
      this.quill = new Quill(this.$refs.editorContainer, {
        theme: 'snow',
        modules: {
          toolbar: {
            container: this.$refs.toolbarContainer,
            handlers: {
              test: this.handleLetterTemplateCustomButtonClick,
            },
          },
        },
      });

      // Set the initial value of the Quill editor
      this.quill.root.innerHTML = this.value;

      // Listen for the 'text-change' event to capture changes in the editor content
      this.quill.on('text-change', () => {
        const content = this.quill.root.innerHTML; // Retrieve the updated content from the Quill editor
        this.$emit('input', content); // Emit an 'input' event with the updated content, allowing two-way binding with the parent component
      });
    },

    handleLetterTemplateCustomButtonClick(type) {
      // Check if the Quill instance exists
      if (this.quill) {
        let placeholder = '';

        switch (type) { // Determine the placeholder based on the button type
          case 'patient':
            placeholder = '<patient_name>';
            break;
          case 'patient_address':
            placeholder = '<patient_address>';
            break;
          case 'patient_phone_number':
            placeholder = '<patient_phone_number>';
            break;
          case 'clinic':
            placeholder = '<clinic_name>';
            break;
        }

        const range = this.quill.getSelection(); // Get the current selection range in the Quill editor
        if (range) { // Insert the placeholder text at the current selection range
          this.quill.insertText(range.index, placeholder, {'placeholder': true});
          this.quill.setSelection(range.index + placeholder.length);
        }
      }
    },

    async selectLetterTemplate() {
      // Get the selected letter template from the component's data
      const selectedTemplate = this.letter_template_attributes.selected.letter_template;
      let placeholder = ''; // Initialize an empty placeholder string

      if (selectedTemplate) { // Check if a letter template is selected
        // Replace placeholder variables in the template with actual values
        placeholder = selectedTemplate
          .replace('&lt;patient_name&gt;', this.patient.first_name + ' ' + this.patient.last_name)
          .replace('&lt;patient_address&gt;', this.patient.addresses[0].street_address + ', ' +
            this.patient.addresses[0].city + ', ' + this.patient.addresses[0].post_code + ', ' + this.patient.addresses[0].country)
          .replace('&lt;patient_phone_number&gt;', this.patient.phone_no)
          .replace('&lt;clinic_name&gt;', this.clinic.name);

        const range = this.quill.getSelection();
        // Determine the index where the placeholder will be inserted
        const index = range ? range.index : this.quill.getLength(); // Use getLength() if range is null
        this.quill.clipboard.dangerouslyPasteHTML(index, placeholder); // Insert the placeholder HTML at the calculated index
        this.quill.setSelection(index + placeholder.length); // Set the selection to the end of the inserted placeholder
      }
    },

    async getLetterTemplateList(query = '') {
      try {
        this.letter_template_attributes.data = (await this.$axios.$get('api/admin/letter-templates',
          {params: {'filter[search]': query}}
        )).data.map((x) => ({
          name: x.letter_template_name,
          value: x.id,
          letter_template: x.letter_template
        }))
      } catch (e) {
        if (e.response.data.error === 'permission')
          this.permissions.push(e.response.data.message)
      }
    },
  },

  mounted() {
    this.initializeEditor();
    this.getLetterTemplateList();
  },

};
</script>

<style scoped>

.rich-text-editor {
  display: flex;
  flex-direction: column;
}

.toolbar-container {
  background-color: #f2f2f2;
  display: flex;
  justify-content: center;
  border-radius: 4px;
}

.toolbar button {
  margin-right: 5px;
}

.toolbar {
  width: 100%;
  max-width: 100%; /* Ensure the toolbar does not exceed the width of the editor */
}

.editor-container {
  border: 1px solid #ccc;
  min-height: 400px;
  /*border-radius: 4px;*/
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ql-test {
  width: 100%;
  /* Optional: Add custom styles for the custom button */
}
</style>

