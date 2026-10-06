export const VIRTUE_DRAFT_VERSION =
  1;


const VIRTUE_DRAFT_PREFIX =
  "bynight_character_virtues_draft_";


function getVirtueDraftKey(
  characterId
) {
  return (
    VIRTUE_DRAFT_PREFIX +
    String(
      characterId
    )
  );
}


export function loadVirtueDraft(
  characterId
) {
  try {
    const raw =
      localStorage.getItem(
        getVirtueDraftKey(
          characterId
        )
      );


    if (!raw) {
      return null;
    }


    const parsed =
      JSON.parse(
        raw
      );


    if (
      parsed?.version !==
        VIRTUE_DRAFT_VERSION ||
      !parsed?.values
    ) {
      return null;
    }


    return parsed;

  } catch (error) {
    console.warn(
      "[CHARACTER] Não foi possível restaurar o rascunho de Virtudes:",
      error
    );


    return null;
  }
}


export function saveVirtueDraftLocal(
  characterId,
  draft
) {
  try {
    localStorage.setItem(
      getVirtueDraftKey(
        characterId
      ),

      JSON.stringify(
        draft
      )
    );

  } catch (error) {
    console.warn(
      "[CHARACTER] Não foi possível salvar o rascunho de Virtudes:",
      error
    );
  }
}


export function removeVirtueDraft(
  characterId
) {
  try {
    localStorage.removeItem(
      getVirtueDraftKey(
        characterId
      )
    );

  } catch (error) {
    console.warn(
      "[CHARACTER] Não foi possível remover o rascunho de Virtudes:",
      error
    );
  }
}