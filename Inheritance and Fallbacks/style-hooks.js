export function setDividerWidth(evt) {
  document
    .querySelector("sl-image-comparer")
    .style.setProperty("--divider-width", `${evt.target.value}px`);
}

export function setHandleSize(evt) {
  document
    .querySelector("sl-image-comparer")
    .style.setProperty("--handle-size", `${evt.target.value}rem`);
}

export function setDividerColor(evt) {
  document
    .querySelector("sl-image-comparer")
    .style.setProperty("--divider-color", evt.target.value);
}

export function setHandleColor(evt) {
  document
    .querySelector("sl-image-comparer")
    .style.setProperty("--handle-color", evt.target.value);
}
