export function easeInOutSine(
  value
) {
  return -(
    Math.cos(
      Math.PI * value
    ) - 1
  ) / 2;
}
