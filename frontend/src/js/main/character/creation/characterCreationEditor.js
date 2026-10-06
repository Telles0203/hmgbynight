import {
  getCharacterById,
  getEditableCreationState,
  applyCreationSaveResult,
} from "./characterCreationState.js";

import {
  appendCharacterCreationMapRow,
  createCharacterCreationSectionEditor,
  readCharacterCreationSection,
  addAttributeTraitSelection,
  removeAttributeTraitSelection,
  handleAttributePriorityChange,
} from "./characterCreationForm.js";

import {
  adjustWillpowerCreation,
} from "./form/characterCreationWillpowerForm.js";

import {
  adjustMoralityCreation,
} from "./form/characterCreationMoralityForm.js";

import {
  refreshCharacterCreationView,
} from "./characterCreationViewRefresh.js";


let activeEditor =
  null;


document.addEventListener(
  "click",
  handleDocumentClick
);


document.addEventListener(
  "change",
  handleDocumentChange
);


document.addEventListener(
  "submit",
  handleDocumentSubmit
);


function handleDocumentClick(
  event
) {
  reconcileActiveEditorState();


  const target =
    event.target instanceof
      Element
      ? event.target
      : null;


  if (
    !target
  ) {
    return;
  }


  const editButton =
    target.closest(
      "[data-character-creation-edit]"
    );


  if (
    editButton
  ) {
    event.preventDefault();


    openSectionEditor(
      editButton
    );


    return;
  }


  const cancelButton =
    target.closest(
      '[data-character-creation-action="cancel"]'
    );


  if (
    cancelButton
  ) {
    event.preventDefault();


    cancelEditor();


    return;
  }


  const willpowerButton =
    target.closest(
      "[data-character-creation-willpower-action]"
    );


  if (
    willpowerButton
  ) {
    event.preventDefault();


    adjustWillpowerCreation(
      willpowerButton
    );


    return;
  }


  const moralityButton =
    target.closest(
      "[data-character-creation-morality-action]"
    );


  if (
    moralityButton
  ) {
    event.preventDefault();


    adjustMoralityCreation(
      moralityButton
    );


    return;
  }


  const addAttributeTraitButton =
    target.closest(
      "[data-character-creation-add-attribute-trait]"
    );


  if (
    addAttributeTraitButton
  ) {
    event.preventDefault();


    addAttributeTraitSelection(
      addAttributeTraitButton
    );


    return;
  }


  const removeAttributeTraitButton =
    target.closest(
      "[data-character-creation-remove-attribute-trait]"
    );


  if (
    removeAttributeTraitButton
  ) {
    event.preventDefault();


    removeAttributeTraitSelection(
      removeAttributeTraitButton
    );


    return;
  }


  const removeButton =
    target.closest(
      "[data-character-creation-remove-row]"
    );


  if (
    removeButton
  ) {
    event.preventDefault();


    removeMapRow(
      removeButton
    );


    return;
  }


  const addButton =
    target.closest(
      "[data-character-creation-add-row]"
    );


  if (
    addButton
  ) {
    event.preventDefault();


    addMapRow(
      addButton
    );
  }
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
    !target
  ) {
    return;
  }


  if (
    target.matches(
      "[data-creation-attribute-priority]"
    )
  ) {
    handleAttributePriorityChange(
      target
    );
  }
}


async function handleDocumentSubmit(
  event
) {
  reconcileActiveEditorState();


  const form =
    event.target;


  if (
    !(form instanceof
      HTMLFormElement) ||
    !form.matches(
      "[data-character-creation-inline-form]"
    )
  ) {
    return;
  }


  event.preventDefault();


  await saveEditor(
    form
  );
}


function reconcileActiveEditorState() {
  if (
    !activeEditor
  ) {
    return;
  }


  if (
    !(activeEditor.container instanceof
      Element) ||
    !activeEditor.container
      .isConnected
  ) {
    activeEditor =
      null;
  }
}


function getCreationSectionContainer(
  characterId,
  section
) {
  const root =
    document.querySelector(
      `[data-character-creation-root="${CSS.escape(
        String(
          characterId
        )
      )}"]`
    );


  if (
    !root
  ) {
    return null;
  }


  return root.querySelector(
    `[data-character-creation-section="${CSS.escape(
      String(
        section
      )
    )}"]`
  );
}


function openSectionEditor(
  button
) {
  const characterId =
    String(
      button.dataset
        .characterId ||
      button.closest(
        "[data-character-id]"
      )?.dataset
        ?.characterId ||
      ""
    );


  const section =
    String(
      button.dataset
        .characterCreationEdit ||
      ""
    );


  if (
    !characterId ||
    !section
  ) {
    return;
  }


  const character =
    getCharacterById(
      characterId
    );


  if (
    !character
  ) {
    return;
  }


  if (
    character.editState
      ?.canEdit ===
    false
  ) {
    window.alert(
      "Esta ficha não está disponível para edição neste estado."
    );


    return;
  }


  reconcileActiveEditorState();


  if (
    activeEditor &&
    String(
      activeEditor.characterId
    ) ===
      characterId &&
    activeEditor.section ===
      section
  ) {
    return;
  }


  if (
    activeEditor
  ) {
    cancelEditor();
  }


  const container =
    getCreationSectionContainer(
      characterId,
      section
    );


  if (
    !container
  ) {
    return;
  }


  const state =
    getEditableCreationState(
      character
    );


  const markup =
    createCharacterCreationSectionEditor(
      character,
      section,
      state
    );


  if (
    !markup
  ) {
    return;
  }


  activeEditor = {
    characterId,

    section,

    container,
  };


  container.classList.add(
    "is-editing"
  );


  container.innerHTML =
    markup;
}


async function saveEditor(
  form
) {
  reconcileActiveEditorState();


  if (
    !activeEditor
  ) {
    return;
  }


  const {
    characterId,
    section,
  } =
    activeEditor;


  const character =
    getCharacterById(
      characterId
    );


  if (
    !character
  ) {
    activeEditor =
      null;


    return;
  }


  const saveButton =
    form.querySelector(
      '[data-character-creation-action="save"]'
    );


  if (
    saveButton
  ) {
    saveButton.disabled =
      true;

    saveButton.textContent =
      "Salvando...";
  }


  try {
    const currentState =
      getEditableCreationState(
        character
      );


    const creation =
      readCharacterCreationSection(
        form,
        section,
        currentState
      );


    const response =
      await fetch(
        `/api/characters/${encodeURIComponent(
          character.id
        )}/creation`,
        {
          method:
            "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body:
            JSON.stringify({
              creation,
            }),
        }
      );


    const data =
      await response
        .json()
        .catch(
          () => ({})
        );


    if (
      !response.ok ||
      !data?.ok
    ) {
      throw new Error(
        data?.error ||
        "Não foi possível salvar a alteração."
      );
    }


    applyCreationSaveResult(
      character,
      data
    );


    activeEditor =
      null;


    refreshCharacterCreationView(
      character
    );

  } catch (error) {
    console.error(
      "[CHARACTER CREATION] Erro ao salvar:",
      error
    );


    window.alert(
      error?.message ||
      "Não foi possível salvar a alteração."
    );


    if (
      saveButton
    ) {
      saveButton.disabled =
        false;

      saveButton.textContent =
        character.editState
          ?.mode ===
          "approval_draft"
          ? "Salvar rascunho"
          : "Salvar";
    }
  }
}


function cancelEditor() {
  reconcileActiveEditorState();


  if (
    !activeEditor
  ) {
    return;
  }


  const currentEditor =
    activeEditor;


  activeEditor =
    null;


  if (
    !currentEditor
      .container
      ?.isConnected
  ) {
    return;
  }


  const character =
    getCharacterById(
      currentEditor
        .characterId
    );


  if (
    character
  ) {
    refreshCharacterCreationView(
      character
    );
  }
}


function addMapRow(
  button
) {
  const mapName =
    String(
      button.dataset
        .characterCreationAddRow ||
      ""
    );


  if (
    !mapName
  ) {
    return;
  }


  const form =
    button.closest(
      "[data-character-creation-inline-form]"
    );


  const container =
    form?.querySelector(
      `[data-character-creation-map-container="${CSS.escape(
        mapName
      )}"]`
    );


  if (
    !container
  ) {
    return;
  }


  appendCharacterCreationMapRow(
    container,
    mapName,
    button.dataset
      .characterCreationAddType ||
    "level"
  );
}


function removeMapRow(
  button
) {
  const row =
    button.closest(
      ".character-creation-map-row"
    );


  const container =
    row?.parentElement;


  if (
    !row ||
    !container
  ) {
    return;
  }


  const mapName =
    String(
      container.dataset
        .characterCreationMapContainer ||
      ""
    );


  const type =
    row.dataset
      .creationMapType ||
    "level";


  row.remove();


  if (
    container.children.length ===
      0
  ) {
    appendCharacterCreationMapRow(
      container,
      mapName,
      type
    );
  }
}