export default {
  methods: {
    convertAndNotifyError(err) {
      if (!(err.response && err.response.data)) return;

      let error_out = "";

      if (err.response.data.errors) {
        error_out = Object.values(err.response.data.errors).flat().join('');
      } else if (err.response.data.error) {
        error_out = err.response.data.error;
        err.response.data.message = "Error";
      } else if (err.response.data.message) {
        const match = err.response.data.message.match(/.*\n((?:.*\n)*.*?)\n.*$/);
        if (match && match[1]) {
          error_out = match[1].replace(/[\{\}"]/g, '');
        } else {
          error_out = err.response.data.message;
        }
      }
      error_out = error_out.charAt(0).toUpperCase() + error_out.slice(1); // Capitalize first letter
      this.$toast.error(error_out);
    },
  }
};
