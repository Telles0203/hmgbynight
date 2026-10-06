export function getCharacterById(
  characterId
) {
  const characters =
    window.ByNightMain
      ?.character
      ?.characters;


  if (
    !Array.isArray(
      characters
    )
  ) {
    return null;
  }


  return (
    characters.find(
      (
        character
      ) =>
        String(
          character.id
        ) ===
        String(
          characterId
        )
    ) ||
    null
  );
}
