const test = require(
  "node:test"
);

const assert = require(
  "node:assert/strict"
);

const {
  CLAN_OPTIONS,
} = require(
  "../../backend/data/vampire/clans"
);

const {
  CLAN_DISCIPLINE_MODES,
  CLAN_RULES,
  getClanRule,
  getAllClanRules,
  getClanDisciplines,
  getClanRuleCoverage,
} = require(
  "../../backend/rules/vampire/lotnr/clanRules"
);

const {
  CLAN_DISCIPLINES,
} = require(
  "../../backend/rules/vampire/lotnr/catalogs"
);


test(
  "every supported clan has a clan rule entry",
  () => {
    assert.equal(
      Object.keys(
        CLAN_RULES
      ).length,
      CLAN_OPTIONS.length
    );


    CLAN_OPTIONS.forEach(
      (
        clan
      ) => {
        const rule =
          getClanRule(
            clan.value
          );


        assert.ok(
          rule,
          `Regra ausente para ${clan.value}`
        );


        assert.equal(
          rule.clan,
          clan.value
        );


        assert.equal(
          rule.label,
          clan.label
        );


        assert.ok(
          rule.disciplines
        );


        assert.ok(
          rule.grants
        );


        assert.ok(
          rule.restrictions
        );


        assert.ok(
          rule.implementation
        );
      }
    );
  }
);


test(
  "existing fixed clan Disciplines remain available",
  () => {
    assert.deepEqual(
      getClanDisciplines(
        "nosferatu"
      ),
      [
        "animalism",
        "obfuscate",
        "potence",
      ]
    );


    assert.deepEqual(
      getClanDisciplines(
        "brujah"
      ),
      [
        "celerity",
        "potence",
        "presence",
      ]
    );


    assert.deepEqual(
      getClanDisciplines(
        "tremere"
      ),
      [
        "auspex",
        "dominate",
        "thaumaturgy",
      ]
    );


    assert.deepEqual(
      CLAN_DISCIPLINES
        .ventrue,
      [
        "dominate",
        "fortitude",
        "presence",
      ]
    );
  }
);


test(
  "unconfigured clans are explicit instead of silently pretending to have no Disciplines",
  () => {
    const rule =
      getClanRule(
        "ahrimanes"
      );


    assert.equal(
      rule
        .disciplines
        .mode,
      CLAN_DISCIPLINE_MODES
        .PENDING
    );


    assert.deepEqual(
      rule
        .disciplines
        .values,
      []
    );


    assert.equal(
      rule
        .implementation
        .disciplines,
      false
    );
  }
);


test(
  "clan rule copies are safe for API serialization",
  () => {
    const rules =
      getAllClanRules();


    assert.equal(
      rules.length,
      CLAN_OPTIONS.length
    );


    const nosferatu =
      rules.find(
        (
          rule
        ) =>
          rule.clan ===
          "nosferatu"
      );


    assert.ok(
      nosferatu
    );


    nosferatu
      .disciplines
      .values
      .push(
        "auspex"
      );


    assert.deepEqual(
      getClanDisciplines(
        "nosferatu"
      ),
      [
        "animalism",
        "obfuscate",
        "potence",
      ]
    );
  }
);


test(
  "clan rule coverage exposes pending implementation",
  () => {
    const coverage =
      getClanRuleCoverage();


    assert.equal(
      coverage.total,
      CLAN_OPTIONS.length
    );


    assert.equal(
      coverage
        .disciplinesConfigured >
        0,
      true
    );


    assert.equal(
      coverage
        .pendingDisciplines
        .includes(
          "ahrimanes"
        ),
      true
    );
  }
);
