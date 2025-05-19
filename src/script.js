WebAssembly.instantiateStreaming(fetch("main.wasm"), {})
  .then(
    (value) => {
      sum = value.instance.exports.sum;
      console.log(sum(10, 20));
    }
  )
