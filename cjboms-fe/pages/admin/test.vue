<template>
  <div>
    <div>hi</div>
    <button v-on:click="pay">pay</button>
  </div>
</template>

<script>
import RevolutCheckout from "@revolut/checkout"

export default {
  name: "test",

  methods:{
    pay(){
      RevolutCheckout("83b06a63-0598-4ae6-b921-8cc67ad831fb", "sandbox").then((instance) => {
        instance.payWithPopup({
          onSuccess() {
            window.alert("Thank you!");
          },
          onError(message) {
            window.alert("Oh no :(");
          }
        });
      })
    }
  }
}
</script>

<style scoped>

</style>
