export async function loadCharacterArchetypes(
  characterId
) {
  const response =
    await fetch(
      `/api/characters/${encodeURIComponent(
        characterId
      )}/archetypes`,
      {
        method:
          "GET",

        credentials:
          "include",

        cache:
          "no-store",
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
      "Não foi possível carregar os arquétipos."
    );
  }


  if (
    !Array.isArray(
      data.archetypes
    )
  ) {
    return [];
  }


  return data.archetypes
    .map(
      (
        archetype
      ) => ({
        ref:
          String(
            archetype?.ref ||
            ""
          ),

        label:
          String(
            archetype?.label ||
            ""
          ),
      })
    )
    .filter(
      (
        archetype
      ) =>
        archetype.ref &&
        archetype.label
    );
}