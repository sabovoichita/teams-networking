export function $(selector) {
  return document.querySelector(selector);
}

export function mask(selector) {
  return $(selector).classList.add("loading-mask");
}
export function unmask(selector) {
  return $(selector).classList.remove("loading-mask");
}
