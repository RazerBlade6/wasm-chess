let w: WebAssembly.Module | null = null;

WebAssembly.instantiateStreaming(fetch("main.wasm"), {})
  .then(
    (value) => {
      let sum = value.instance.exports.sum as (a: number, b: number) => number;
      console.log(sum(10, 20));
    }
  )
