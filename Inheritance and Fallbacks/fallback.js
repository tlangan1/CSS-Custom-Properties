export function setItemCount(evt) {
  var itemCount = evt.target.value;

  if (itemCount == "0") itemCount = 1;
  document
    .querySelector(".images")
    .style.setProperty(
      "--row-count",
      Math.floor((parseInt(itemCount) - 1) / 3) + 1
    );
}
