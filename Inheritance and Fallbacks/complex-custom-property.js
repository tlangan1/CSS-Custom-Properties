// This fails with the following error:
// Failed to execute 'registerProperty' on 'CSS': The syntax provided is not a valid custom property syntax.
// window.CSS.registerProperty({
//   name: "--complex-custom-property-1",
//   syntax: "<length> <length>",
//   inherits: true,
//   initialValue: "100px 100px",
// });

// This succeeds
// window.CSS.registerProperty({
//   name: "--complex-custom-property-2",
//   syntax: "*",
//   inherits: true,
//   initialValue: "100px 100px",
// });
