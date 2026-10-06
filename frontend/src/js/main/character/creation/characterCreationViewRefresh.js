import {
  createCharacterCreationSections,
} from "../view/sheet/characterSheetCreation.js";


export function refreshCharacterCreationView(
  character
) {
  if (
    !character?.id
  ) {
    return;
  }


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
    !replacement
  ) {
    return;
  }


  root.replaceWith(
    replacement
  );


  initializeCreationPopovers(
    replacement
  );
}


function initializeCreationPopovers(
  container
) {
  if (
    !window.bootstrap
      ?.Popover
  ) {
    return;
  }


  container
    .querySelectorAll(
      '[data-bs-toggle="popover"]'
    )
    .forEach(
      (
        element
      ) => {
        window.bootstrap
          .Popover
          .getOrCreateInstance(
            element
          );
      }
    );
}