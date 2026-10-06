const ATTRIBUTE_CATEGORIES = [
  "physical",
  "social",
  "mental",
];


const PRIORITY_DEFINITIONS = {
  primary: {
    label:
      "Primário",

    target:
      7,
  },

  secondary: {
    label:
      "Secundário",

    target:
      5,
  },

  tertiary: {
    label:
      "Terciário",

    target:
      3,
  },
};


function getPriorities(
  state
) {
  return {
    primary:
      String(
        state
          ?.attributePriorities
          ?.primary ||
        ""
      ),

    secondary:
      String(
        state
          ?.attributePriorities
          ?.secondary ||
        ""
      ),

    tertiary:
      String(
        state
          ?.attributePriorities
          ?.tertiary ||
        ""
      ),
  };
}


function getAssignedPriority(
  priorities,
  category
) {
  return (
    Object.entries(
      priorities
    ).find(
      ([
        ,
        value,
      ]) =>
        value ===
        category
    )?.[0] ||
    ""
  );
}


function getAssignedCategories(
  priorities
) {
  return Object.values(
    priorities
  )
    .filter(
      (
        category
      ) =>
        ATTRIBUTE_CATEGORIES
          .includes(
            category
          )
    );
}


function getRemainingPriority(
  priorities
) {
  return (
    Object.keys(
      PRIORITY_DEFINITIONS
    ).find(
      (
        priority
      ) =>
        !priorities[
          priority
        ]
    ) ||
    ""
  );
}


function getRemainingCategory(
  priorities
) {
  const assigned =
    new Set(
      getAssignedCategories(
        priorities
      )
    );


  return (
    ATTRIBUTE_CATEGORIES.find(
      (
        category
      ) =>
        !assigned.has(
          category
        )
    ) ||
    ""
  );
}


function autoAssignRemainingPriority(
  priorities
) {
  const assignedCategories =
    new Set(
      getAssignedCategories(
        priorities
      )
    );


  if (
    assignedCategories.size !==
    2
  ) {
    return;
  }


  const remainingPriority =
    getRemainingPriority(
      priorities
    );


  const remainingCategory =
    getRemainingCategory(
      priorities
    );


  if (
    !remainingPriority ||
    !remainingCategory
  ) {
    return;
  }


  priorities[
    remainingPriority
  ] =
    remainingCategory;
}


export function getEffectiveAttributePriority(
  state,
  category
) {
  const priorities =
    getPriorities(
      state
    );


  const assigned =
    getAssignedPriority(
      priorities,
      category
    );


  if (
    assigned
  ) {
    return assigned;
  }


  const assignedCategories =
    new Set(
      getAssignedCategories(
        priorities
      )
    );


  if (
    assignedCategories.size !==
      2
  ) {
    return "";
  }


  if (
    assignedCategories.has(
      category
    )
  ) {
    return "";
  }


  return getRemainingPriority(
    priorities
  );
}


export function getAttributePriorityTarget(
  priority
) {
  const target =
    PRIORITY_DEFINITIONS[
      priority
    ]?.target;


  return Number.isInteger(
    target
  )
    ? target
    : 0;
}


export function createAttributePriorityOptions(
  state,
  category
) {
  const priorities =
    getPriorities(
      state
    );


  const selected =
    getEffectiveAttributePriority(
      state,
      category
    );


  const assignedCategories =
    new Set(
      getAssignedCategories(
        priorities
      )
    );


  const fullyAssigned =
    assignedCategories.size ===
    ATTRIBUTE_CATEGORIES.length;


  const available =
    Object.entries(
      PRIORITY_DEFINITIONS
    )
      .filter(
        ([
          value,
        ]) => {
          if (
            fullyAssigned
          ) {
            return true;
          }


          if (
            value ===
            selected
          ) {
            return true;
          }


          return !priorities[
            value
          ];
        }
      );


  const placeholder =
    selected
      ? ""
      : `
        <option value="">
          Selecione
        </option>
      `;


  return `
    ${placeholder}

    ${available
      .map(
        ([
          value,
          config,
        ]) => `
          <option
            value="${value}"
            ${
              value ===
              selected
                ? "selected"
                : ""
            }
          >
            ${config.label}
          </option>
        `
      )
      .join("")}
  `;
}


export function applyAttributePrioritySelection(
  state,
  category,
  selectedPriority
) {
  const priorities =
    getPriorities(
      state
    );


  const selected =
    String(
      selectedPriority ||
      ""
    );


  const currentPriority =
    getAssignedPriority(
      priorities,
      category
    );


  if (
    !selected ||
    !PRIORITY_DEFINITIONS[
      selected
    ]
  ) {
    Object.keys(
      priorities
    ).forEach(
      (
        priority
      ) => {
        if (
          priorities[
            priority
          ] ===
          category
        ) {
          priorities[
            priority
          ] =
            "";
        }
      }
    );


    state.attributePriorities =
      priorities;


    return;
  }


  const occupiedCategory =
    priorities[
      selected
    ];


  if (
    occupiedCategory &&
    occupiedCategory !==
      category
  ) {
    if (
      !currentPriority
    ) {
      return;
    }


    priorities[
      currentPriority
    ] =
      occupiedCategory;
  }


  Object.keys(
    priorities
  ).forEach(
    (
      priority
    ) => {
      if (
        priorities[
          priority
        ] ===
        category
      ) {
        priorities[
          priority
        ] =
          "";
      }
    }
  );


  priorities[
    selected
  ] =
    category;


  autoAssignRemainingPriority(
    priorities
  );


  state.attributePriorities =
    priorities;
}