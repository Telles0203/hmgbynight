window.ByNightMain =
  window.ByNightMain || {};

window.ByNightMain.character =
  window.ByNightMain.character || {
    options: null,
    characters: [],
  };

function openCharacterView(
  characterId
) {
  const characters =
    window.ByNightMain
      .character
      .characters;

  const character =
    characters.find(
      (item) =>
        String(item.id) ===
        String(characterId)
    );

  if (!character) {
    console.error(
      "[CHARACTER] Personagem não encontrado."
    );

    return;
  }

  const slider =
    document.getElementById(
      "mainSlider"
    );

  const nameElement =
    document.getElementById(
      "selectedCharacterName"
    );

  const metaElement =
    document.getElementById(
      "selectedCharacterMeta"
    );

  if (
    !slider ||
    !nameElement ||
    !metaElement
  ) {
    return;
  }

  nameElement.textContent =
    character.name;

  const clanName =
    character.clanDisplayName ||
    character.clan ||
    "";

  const sectName =
    window.getSectLabel?.(
      character.sect
    ) ||
    character.sect ||
    "";

  metaElement.textContent =
    [
      clanName,
      sectName,
    ]
      .filter(Boolean)
      .join(" · ");

  slider.classList.add(
    "character-open"
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function closeCharacterView() {
  const slider =
    document.getElementById(
      "mainSlider"
    );

  if (!slider) {
    return;
  }

  slider.classList.remove(
    "character-open"
  );

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

window.openCharacterView =
  openCharacterView;

window.closeCharacterView =
  closeCharacterView;