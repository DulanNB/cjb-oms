<template>
  <div class="modal-content">
    <div class="modal-header">
      <div>
        <h5 class="modal-title required">Add Note</h5>
      </div>
      <button aria-label="Close" class="btn-close" data-bs-dismiss="modal" type="button" @click="reset"></button>
    </div>
    <div class="modal-body">
      <div class="w-full">
        <textarea v-model="create_order_note_form.fields.order_note"
                  autocomplete="off" class="w-full form-control"
                  placeholder="Enter your note here..." rows="5" type="text"
                  @input="validate('max:255', create_order_note_form.fields.order_note, 'order_note')">
        </textarea>
        <div class="invalid-feedback">
          {{
            Array.isArray(create_order_note_form.errors.order_note) ? create_order_note_form.errors.order_note[0]
              : create_order_note_form.errors.order_note
          }}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button id="closeModalBtnNote" class="btn me-auto" data-bs-dismiss="modal" type="button" @click="reset">Close</button>
      <button class="btn btn-outline-primary" @click.prevent="reset">Reset</button>
      <button :disabled="is_btn_loading || isCreateNoteButtonDisabled || is_btn_disabled" class="btn btn-primary" type="button" @click="createNote">
        {{ is_btn_loading ? 'Creating...' : 'Create Note' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    create_order_note_form: {
      type: Object,
      default: () => ({
        fields: {
          order_note: ''
        },
        errorMessage: '',
        errors: [],
      }),
    },
    is_btn_loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      is_btn_disabled: true
    };
  },
  computed: {
    isCreateNoteButtonDisabled() {
      return (
        !this.create_order_note_form.fields.order_note.trim()
      );
    },
  },
  methods: {
    reset() {
      this.$emit('reset');
    },
    createNote() {
      this.$emit('createNote');
    },
    validate(validation, value, tag) {
      const message = this.$validation(validation, value);
      if (message) {
        this.create_order_note_form.errors[tag] = message;
      }
      else {
        delete this.create_order_note_form.errors[tag];
      }
      // Check for any remaining validation errors
      this.is_btn_disabled = Object.keys(this.create_order_note_form.errors).length > 0;
    },
  },
};
</script>

<style scoped></style>
