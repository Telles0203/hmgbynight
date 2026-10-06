function getCreationBlockingError(
  validation
) {
  const willpower =
    validation
      ?.sections
      ?.willpower;


  if (
    willpower?.valid ===
    false
  ) {
    const error =
      Array.isArray(
        willpower.errors
      )
        ? willpower.errors.find(
            Boolean
          )
        : "";


    return (
      error ||
      "A Força de Vontade ultrapassa o limite permitido pela Geração."
    );
  }


  return "";
}


module.exports = {
  getCreationBlockingError,
};