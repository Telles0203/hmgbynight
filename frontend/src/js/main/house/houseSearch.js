// =============================================
// House Search
// =============================================


// =============================================
// Search available Houses
// =============================================

export async function searchAvailableHouses(
  searchTerm = "",
  {
    limit = 20,
    signal = undefined,
  } = {}
) {
  const params =
    new URLSearchParams();


  const query =
    String(
      searchTerm ||
      ""
    ).trim();


  if (query) {
    params.set(
      "q",
      query
    );
  }


  params.set(
    "limit",
    String(
      limit
    )
  );


  const response =
    await fetch(
      `/api/houses/search?${params.toString()}`,
      {
        method:
          "GET",

        credentials:
          "include",

        cache:
          "no-store",

        signal,
      }
    );


  const data =
    await response
      .json()
      .catch(() => ({}));


  if (
    !response.ok ||
    !data?.ok
  ) {
    throw new Error(
      data?.error ||
      "Não foi possível pesquisar as Houses."
    );
  }


  const houses =
    Array.isArray(
      data.houses
    )
      ? data.houses
      : [];


  // Ordenação adicional no navegador
  // para garantir a apresentação PT-BR.

  return [
    ...houses,
  ].sort(
    (
      first,
      second
    ) =>
      String(
        first?.name ||
        ""
      ).localeCompare(
        String(
          second?.name ||
          ""
        ),
        "pt-BR",
        {
          sensitivity:
            "base",

          numeric:
            true,
        }
      )
  );
}


// =============================================
// Escape HTML
// =============================================

export function escapeHouseHtml(
  value
) {
  const element =
    document.createElement(
      "div"
    );


  element.textContent =
    String(
      value ?? ""
    );


  return element.innerHTML;
}