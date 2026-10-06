import {
  getCharacterById,
  getEditableCreationState,
  applyCreationSaveResult,
} from "./characterCreationState.js";

import {
  appendCharacterCreationMapRow,
  createCharacterCreationSectionEditor,
  readCharacterCreationSection,
} from "./characterCreationForm.js";

import {
  createCharacterCreationSections,
} from "../view/sheet/characterSheetCreation.js";


let activeEditor =
  null;


document.addEventListener(
  "click",
  handleDocumentClick
);


document.addEventListener(
  "submit",
  handleDocumentSubmit
);


function handleDocumentClick(
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


async function handleDocumentSubmit(
  event
) {
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


  const character =
    getCharacterById(
      characterId
    );


  if (
    !character ||
    !section
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


  if (
    activeEditor
  ) {
    cancelEditor();
  }


  const container =
    button.closest(
      `[data-character-creation-section="${CSS.escape(
        section
      )}"]`
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


    refreshCreationView(
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
  if (
    !activeEditor
  ) {
    return;
  }


  const character =
    getCharacterById(
      activeEditor
        .characterId
    );


  activeEditor =
    null;


  if (
    character
  ) {
    refreshCreationView(
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


function refreshCreationView(
  character
) {
  const root =
    document.querySelector(
      `[data-character-creation-root="${CSS.escape(
        String(
          character.id
        )
      )}"]`
    );


  if (
    !root
  ) {
    return;
  }


  const wrapper =
    document.createElement(
      "div"
    );


  wrapper.innerHTML =
    createCharacterCreationSections(
      character,
      character.editState
        ?.canEdit ??
      false
    );


  const replacement =
    wrapper.firstElementChild;


  if (
    replacement
  ) {
    root.replaceWith(
      replacement
    );
  }
}