const COOKIE_NOTICE_KEY =
  "bynight_cookie_notice";


async function loadCookieNotice() {
  const alreadyAccepted =
    localStorage.getItem(
      COOKIE_NOTICE_KEY
    );


  if (
    alreadyAccepted ===
    "accepted"
  ) {
    return;
  }


  try {
    const response =
      await fetch(
        "/src/components/cookieNotice.html"
      );


    if (!response.ok) {
      throw new Error(
        "Não foi possível carregar o aviso de cookies."
      );
    }


    const html =
      await response.text();


    const container =
      document.createElement(
        "div"
      );


    container.id =
      "cookieNoticeContainer";


    container.innerHTML =
      html;


    document.body.appendChild(
      container
    );


    const notice =
      document.getElementById(
        "cookieNotice"
      );


    const acceptButton =
      document.getElementById(
        "acceptCookieNotice"
      );


    if (
      !notice ||
      !acceptButton
    ) {
      container.remove();

      return;
    }


    notice.classList.remove(
      "d-none"
    );


    acceptButton.addEventListener(
      "click",
      () => {
        localStorage.setItem(
          COOKIE_NOTICE_KEY,
          "accepted"
        );


        container.remove();
      }
    );

  } catch (error) {
    console.error(
      "[COOKIE NOTICE] Erro:",
      error
    );
  }
}


document.addEventListener(
  "DOMContentLoaded",
  loadCookieNotice
);