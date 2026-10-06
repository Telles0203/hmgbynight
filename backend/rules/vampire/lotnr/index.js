const ruleset =
  require(
    "./ruleset"
  );

const catalogs =
  require(
    "./catalogs"
  );

const allocationRules =
  require(
    "./allocationRules"
  );

const derivedRules =
  require(
    "./derivedRules"
  );

const freeTraits =
  require(
    "./freeTraits"
  );

const validation =
  require(
    "./validation"
  );


module.exports = {
  ...ruleset,
  ...catalogs,
  ...allocationRules,
  ...derivedRules,
  ...freeTraits,
  ...validation,
};