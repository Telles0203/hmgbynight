import {
  getCharacterById,
} from "../../../characterLookup.js";

import {
  resolveCharacterClanResourceGrants,
} from "../../data/clanRuleCatalog.js";

import {
  getBackgroundLabel,
} from "../background/characterCreationBackgroundCatalog.js";

import {
  readBackgroundAllocationPeerValues,
} from "../background/characterCreationBackgroundAllocation.js";

import {
  getInfluenceLabel,
} from "./characterCreationInfluenceCatalog.js";

import {
  createInfluenceRows,
  readInfluences,
} from "./characterCreationInfluenceRows.js";

import {
  refreshInfluencePicker,
} from "./characterCreationInfluencePicker.js";

import {
  refreshCharacterCreationInfluenceEditor,
} from "./characterCreationInfluenceProgress.js";

import {
  createClanInfluenceChoiceEditor,
  readClanInfluenceChoiceSelections,
} from "./characterCreationInfluenceClanGrants.js";


function normalizeLevel(
  value
) {
  const level =
    Number(
      value
    );


  return (
    Number.isInteger(
      level
    ) &&
    level >
      0
      ? level
      : 0
  );
}


function readPreviousSelections(
  form
) {
  const selections =
    {};


  form
    ?.querySelectorAll(
      "[data-creation-clan-background-influence-choice]"
    )
    .forEach(
      (
        select
      ) => {
        const id =
          String(
            select.dataset
              .creationClanBackgroundInfluenceChoice ||
            ""
          )
            .trim()
            .toLowerCase();


        const value =
          String(
            select.dataset
              .creationClanChoicePreviewValue ||
            ""
          )
            .trim()
            .toLowerCase();


        if (
          id &&
          value
        ) {
          selections[
            id
          ] =
            value;
        }
      }
    );


  return selections;
}


function createPreviewState({
  backgrounds,
  influences,
  selections,
}) {
  return {
    backgrounds: {
      ...backgrounds,
    },

    influences: {
      ...influences,
    },

    clanGrantChoices: {
      backgroundInfluence: {
        ...selections,
      },
    },
  };
}


function findSectionOverflow({
  purchased,
  previousGrants,
  nextGrants,
  maximum,
  getLabel,
  type,
}) {
  const keys =
    new Set([
      ...Object.keys(
        previousGrants ||
        {}
      ),

      ...Object.keys(
        nextGrants ||
        {}
      ),
    ]);


  for (
    const key of
    keys
  ) {
    const previousGrant =
      normalizeLevel(
        previousGrants?.[
          key
        ]
      );


    const nextGrant =
      normalizeLevel(
        nextGrants?.[
          key
        ]
      );


    if (
      nextGrant <=
      previousGrant
    ) {
      continue;
    }


    const purchasedLevel =
      normalizeLevel(
        purchased?.[
          key
        ]
      );


    const effectiveLevel =
      purchasedLevel +
      nextGrant;


    if (
      effectiveLevel >
      maximum
    ) {
      return {
        type,

        key,

        label:
          getLabel(
            key
          ),

        purchasedLevel,

        grantedLevel:
          nextGrant,

        effectiveLevel,

        maximum,
      };
    }
  }


  return null;
}


function findChoiceOverflow({
  backgrounds,
  influences,
  previousGrants,
  nextGrants,
  maximum,
}) {
  return (
    findSectionOverflow({
      purchased:
        backgrounds,

      previousGrants:
        previousGrants
          .backgrounds,

      nextGrants:
        nextGrants
          .backgrounds,

      maximum,

      getLabel:
        getBackgroundLabel,

      type:
        "Antecedente",
    }) ||

    findSectionOverflow({
      purchased:
        influences,

      previousGrants:
        previousGrants
          .influences,

      nextGrants:
        nextGrants
          .influences,

      maximum,

      getLabel:
        getInfluenceLabel,

      type:
        "Influência",
    })
  );
}


function createInfluenceEntries(
  influences
) {
  return Object.entries(
    influences ||
    {}
  )
    .map(
      ([
        influence,
        level,
      ]) => ({
        influence,

        level:
          normalizeLevel(
            level
          ),
      })
    )
    .filter(
      (
        entry
      ) =>
        entry.level >
        0
    );
}


function restorePreviousSelection(
  select
) {
  select.value =
    String(
      select.dataset
        .creationClanChoicePreviewValue ||
      ""
    );
}


function showOverflowWarning(
  overflow
) {
  window.alert(
    `${overflow.type} ${overflow.label} chegaria ao nível ${overflow.effectiveLevel}, acima do limite de ${overflow.maximum}. Reduza os níveis comprados antes de escolher este benefício de clã.`
  );
}


function refreshChoiceEditor(
  form,
  character,
  state
) {
  const container =
    form.querySelector(
      "[data-creation-clan-resource-choices]"
    );


  if (!container) {
    return;
  }


  container.outerHTML =
    createClanInfluenceChoiceEditor(
      character,
      state
    );
}


function refreshInfluenceRows(
  form,
  influences,
  grants,
  maximum
) {
  const list =
    form.querySelector(
      "[data-creation-influence-list]"
    );


  if (!list) {
    return;
  }


  list.innerHTML =
    createInfluenceRows(
      createInfluenceEntries(
        influences
      ),
      maximum,
      {},
      grants
    );
}


function getCharacterFromSelect(
  select
) {
  const owner =
    select.closest(
      "[data-character-id]"
    );


  const characterId =
    String(
      owner
        ?.dataset
        ?.characterId ||
      ""
    );


  if (!characterId) {
    return null;
  }


  return getCharacterById(
    characterId
  );
}


export function handleCharacterCreationInfluenceClanChoiceChange(
  select,
  suppliedCharacter = null
) {
  if (
    !(select instanceof
      Element) ||
    !select.matches(
      "[data-creation-clan-background-influence-choice]"
    )
  ) {
    return false;
  }


  const form =
    select.closest(
      "[data-character-creation-inline-form]"
    );


  const character =
    suppliedCharacter ||
    getCharacterFromSelect(
      select
    );


  if (
    !form ||
    !character
  ) {
    return false;
  }


  const backgrounds =
    readBackgroundAllocationPeerValues(
      form,
      "backgrounds"
    );


  const influences =
    readInfluences(
      form
    );


  const previousSelections =
    readPreviousSelections(
      form
    );


  const nextSelections =
    readClanInfluenceChoiceSelections(
      form
    );


  const previousState =
    createPreviewState({
      backgrounds,
      influences,

      selections:
        previousSelections,
    });


  const nextState =
    createPreviewState({
      backgrounds,
      influences,

      selections:
        nextSelections,
    });


  const previousGrants =
    resolveCharacterClanResourceGrants(
      character,
      previousState
    );


  const nextGrants =
    resolveCharacterClanResourceGrants(
      character,
      nextState
    );


  const maximum =
    Number(
      form.dataset
        .influenceMaximum
    ) ||
    5;


  const overflow =
    findChoiceOverflow({
      backgrounds,
      influences,
      previousGrants,
      nextGrants,
      maximum,
    });


  if (overflow) {
    restorePreviousSelection(
      select
    );


    showOverflowWarning(
      overflow
    );


    return true;
  }


  refreshChoiceEditor(
    form,
    character,
    nextState
  );


  refreshInfluenceRows(
    form,
    influences,
    nextGrants.influences,
    maximum
  );


  refreshInfluencePicker(
    form
  );


  refreshCharacterCreationInfluenceEditor(
    form
  );


  return true;
}


function handleDocumentChange(
  event
) {
  const target =
    event.target instanceof
      Element
      ? event.target
      : null;


  if (
    !target ||
    !target.matches(
      "[data-creation-clan-background-influence-choice]"
    )
  ) {
    return;
  }


  handleCharacterCreationInfluenceClanChoiceChange(
    target
  );
}


document.addEventListener(
  "change",
  handleDocumentChange
);
