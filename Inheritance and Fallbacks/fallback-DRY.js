export function toggleUndefinedProperty() {
  if (!document.querySelector("#target").classList.contains("target-for-fix-1"))
    document.querySelector("#target").classList.add("target-for-fix-1");
  else document.querySelector("#target").classList.remove("target-for-fix-1");
}

export function toggleCustomPropertyAsFallback() {
  if (
    !document.querySelector(".purchase").classList.contains("target-for-fix-2")
  )
    document.querySelector(".purchase").classList.add("target-for-fix-2");
  else document.querySelector(".purchase").classList.remove("target-for-fix-2");
}
