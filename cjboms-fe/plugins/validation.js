export default defineNuxtPlugin(() => {
  const validation = (validation, value, typeform_validation, height_weight) => {
    const list = validation.split("|");
    let message = null

    for (let i = 0; i < list.length; i++) {
      let data = null
      if (list[i].includes(':')) data = list[i].split(":")
      const attribute = data ? data[1] : null

      // Check validation
      switch (data ? data[0] : list[i]) {
        case 'number':
          if(isNaN(value)){
            message = "Must be a number.";
          }
          break;
        case 'positive':
          if (Number(value) <= 0) {
            message = 'Please enter positive numbers';
          }
          break;
        case 'zero':
          if (Number(value) === 0) {
            message = 'Please enter grater than 0';
          }
          break;
        case 'max_height_value':
          if (height_weight === 'cm' && value > 230){
            message = `Please enter value less than ${attribute} cm as a height`;
          }
          if (height_weight === 'feet' && value > 7){
            message = `Please enter value less than ${attribute} feet as a height`;
          }
          if (height_weight === 'inches' && value > 12){
            message = `Please enter value less than ${attribute} inches as a height`;
          }
          break;
        case 'max_weight_value':
          if (height_weight === 'kg' && value > 200) {
            message = `Please enter value less than ${attribute} kg as a weight`;
          }
          if (height_weight === 'stone' && value > 31) {
            message = `Please enter value less than ${attribute} stone as a weight`;
          }
          if (height_weight === 'labs' && value > 14) {
            message = `Please enter value less than ${attribute} lbs as a weight`;
          }
          break;
        case 'required_radio_or_checkbox_typeform':
          if (typeform_validation === true && (value.length < 0 || value === null)) {
            message = 'Field is required.';
          }
          break;
        case 'required_typeform':
          if (typeform_validation === true && value.trim() === '') {
            message = 'Field is required.';
          }
          break;
        case 'max_num':
          if (value && value.length > attribute) {
            message = `You are not allowed to enter more than ${attribute} digits`;
          }
          break;
        case 'weight_height_validation':
          if (!(/^\d{1,3}(\.\d{1,2})?$/).test(value)) {
            message = 'Please enter correct format (XXX.XX || XXX)';
          }
          break;
        case 'weight_height_not_decimal_validation':
          if (!(/^\d{1,4}$/).test(value)) {
            message = 'Please enter the value as an integer (XXX)';
          }
          break;
        case 'date_of_birth':
          const dob = new Date(value);
          const currentDate = new Date();
          const minAgeDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());

          if (dob >= minAgeDate) {
            message = 'Must be at least 18 years old.';
          }
          break;
        case 'email':
          const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          if (!emailRegex.test(value)) {
            message = 'Invalid email format.';
          }
          break;
        case 'max':
          if (value && value.length > attribute) {
            message = `Text exceeds the character limit of ${attribute} characters`;
          }
          break;
        case 'required':
          if (value === null || value === undefined || value.toString().trim() === "") {
            message = 'Field is required.';
          }
          break;
        case 'phone_no':
          const phoneNumberRegex = /^\+(?:44|353)\d{9,10}$|^0(?:0|11)(?:\d{9}|(?:\d{10}))$/;
          if (!phoneNumberRegex.test(value)) {
            message = 'Enter a valid phone number with the country code.';
          }
          break;
        case 'post_code':
          const regex1 = /^([A-Z]){1}([0-9][0-9]|[0-9]|[A-Z][0-9][A-Z]|[A-Z][0-9][0-9]|[A-Z][0-9]|[0-9][A-Z]){1}([ ])?([0-9][A-z][A-z]){1}$/i;
          const regex2 = /(?:^[AC-FHKNPRTV-Y][0-9]{2}|D6W)[ -]?[0-9AC-FHKNPRTV-Y]{4}$/;
          if (!(regex1.test(value) || regex2.test(value))) {
            message = 'Enter a valid postal code.';
          }
          break;
        case 'max_note_length':
          if (value && value.length > attribute) {
            message = `Note exceeds the character limit of ${attribute} characters`;
          }
          break;
        default:
          message = null;
      }
      if (message) break;
    }

    return message;
  };

  // Provide the validation function globally
  return {
    provide: {
      validation
    }
  }
})