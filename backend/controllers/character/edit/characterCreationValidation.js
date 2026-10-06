function getSectionError(
  section,
  fallback
) {
  const error =
    Array.isArray(
      section?.errors
    )
      ? section.errors.find(
          Boolean
        )
      : "";


  return (
    error ||
    fallback
  );
}


function getWillpowerBlockingError(
  validation
) {
  const willpower =
    validation
      ?.sections
      ?.willpower;


  if (
    willpower?.valid !==
    false
  ) {
    return "";
  }


  return getSectionError(
    willpower,
    "A Força de Vontade ultrapassa o limite permitido pela Geração."
  );
}


function getMoralityBlockingError(
  validation
) {
  const morality =
    validation
      ?.sections
      ?.morality;


  const value =
    morality?.value;


  if (
    typeof value !==
      "number" ||
    !Number.isFinite(
      value
    )
  ) {
    return "";
  }


  const minimum =
    Number.isFinite(
      morality?.minimum
    )
      ? morality.minimum
      : 0;


  const maximum =
    Number.isFinite(
      morality?.maximum
    )
      ? morality.maximum
      : 10;


  if (
    value >=
      minimum &&
    value <=
      maximum
  ) {
    return "";
  }


  return getSectionError(
    morality,
    `A Moralidade deve permanecer entre ${minimum} e ${maximum}.`
  );
}


function getCreationBlockingError(
  validation
) {
  const willpowerError =
    getWillpowerBlockingError(
      validation
    );


  if (
    willpowerError
  ) {
    return willpowerError;
  }


  return getMoralityBlockingError(
    validation
  );
}


module.exports = {
  getCreationBlockingError,
};