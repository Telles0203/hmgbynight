const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  CORE_BACKGROUNDS,
  getCoreBackground,
  getCoreBackgrounds,
  getInfluenceAreas,
  isCoreBackground,
} = require(
  "../../backend/data/vampire/backgrounds"
);

const {
  isCoreBackground:
    isCatalogBackground,
} = require(
  "../../backend/rules/vampire/lotnr/catalogs"
);


const EXPECTED_BACKGROUNDS = [
  "allies",
  "contacts",
  "fame",
  "generation",
  "herd",
  "influence",
  "mentor",
  "resources",
  "retainers",
];


const EXPECTED_INFLUENCE_AREAS = [
  "bureaucracy",
  "church",
  "finance",
  "health",
  "high_society",
  "industry",
  "legal",
  "media",
  "occult",
  "police",
  "political",
  "street",
  "transportation",
  "underworld",
  "university",
];


test(
  "Laws of the Night Revised core Background catalog is exact",
  () => {
    assert.deepEqual(
      CORE_BACKGROUNDS,
      EXPECTED_BACKGROUNDS
    );


    assert.deepEqual(
      getCoreBackgrounds()
        .map(
          (
            background
          ) =>
            background.value
        ),
      EXPECTED_BACKGROUNDS
    );
  }
);


test(
  "Status is not a core Background",
  () => {
    assert.equal(
      isCoreBackground(
        "status"
      ),
      false
    );


    assert.equal(
      isCatalogBackground(
        "status"
      ),
      false
    );


    assert.equal(
      isCoreBackground(
        "resources"
      ),
      true
    );
  }
);


test(
  "Generation requires Narrator approval",
  () => {
    const generation =
      getCoreBackground(
        "generation"
      );


    assert.equal(
      generation
        ?.requiresNarratorApproval,
      true
    );
  }
);


test(
  "Influence exposes its fifteen areas",
  () => {
    const influence =
      getCoreBackground(
        "influence"
      );


    assert.equal(
      influence
        ?.specialMode,
      "influence"
    );


    assert.deepEqual(
      getInfluenceAreas()
        .map(
          (
            area
          ) =>
            area.value
        ),
      EXPECTED_INFLUENCE_AREAS
    );


    assert.equal(
      getInfluenceAreas().length,
      15
    );
  }
);
