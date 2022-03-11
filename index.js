const jwt_decode = require("jwt-decode");
const $ = require("jquery");

const NAME = "SchullBuss";
const SCHEME = "http";
const HOST = "127.0.0.1";
const PORT = "8000";
const SERVER = `${SCHEME}://${HOST}:${PORT}/api/`;

const ENTRYPOINT = {
  token: `${SERVER}login_check`,
  refresh_token: `${SERVER}token/refresh`,
  articles: `${SERVER}articles`,
  children: `${SERVER}children`,
  buses: `${SERVER}buses`,
};

/**
 * IS RUN ON LOAD
 */
(() => {
  $("#main-content").hide();
  $("#main-content").fadeIn("slow");

  $("#myFormLogin")?.on("submit", function (e) {
    e.preventDefault();
    handleSubmit();
  });

  function handleSubmit() {
    let username = $("#email").val();
    let password = $("#password").val();

    getToken(username, password);
  }
})();

/**
 * ROUTER
 */
const route = window.location.pathname;

switch (route) {
  case "/dashbord":
    getBuses();
    setView();
    break;
  case "/logout":
    clearTokens();
    break;
  case "/dashbord/admin":
    if (sessionStorage.getItem("role") === "ROLE_ADMIN") {
      getChilds();
      setView();
    }
    break;
  default:
    console.log(`Sorry, no route ${route} found.`);
}

function getToken(username = false, password = false) {
  if (!username || !password) {
    return false;
  }

  let datas = JSON.stringify({
    username: username,
    password: password,
  });

  fetchAPI(`${ENTRYPOINT.token}`, "POST", null, datas)
    .then((response) => {
      if (response.message) {
        notify(response.message, "danger");
      }
      if (!response.token && !response.refresh_token) {
        return false;
      }

      storeTokens(response.token, response.refresh_token).then(() => {
        window.location.href = "/dashbord";
      });
    })
    .catch((e) => {
      handleError(e, null);
    });
}

async function getRefreshToken() {
  if (!sessionStorage.getItem("refresh_token")) {
    return false;
  }

  let datas = JSON.stringify({
    refresh_token: sessionStorage.getItem("refresh_token"),
  });

  let data = await fetchAPI(`${ENTRYPOINT.refresh_token}`, "POST", null, datas)
    .then((response) => {
      if (!response.token && !response.refresh_token) {
        return false;
      }

      return response;
    })
    .catch(() => {
      clearTokens();
    });

  return data;
}

function getChilds() {
  if (!sessionStorage.getItem("token")) {
    return false;
  }
  fetchAPI(
    `${ENTRYPOINT.children}`,
    "GET",
    { Authorization: "Bearer " + sessionStorage.getItem("token") },
    null,
    null,
    "application/ld+json"
  )
    .then((response) => {
      if (!response["hydra:member"] instanceof Array) {
        return false;
      }

      showChilds(response["hydra:member"], "#main-page");
    })
    .catch((e) => {
      handleError(e, getChilds);
    });
}

function getBuses() {
  if (!sessionStorage.getItem("token")) {
    return false;
  }

  fetchAPI(
    `${ENTRYPOINT.buses}`,
    "GET",
    { Authorization: "Bearer " + sessionStorage.getItem("token") },
    null,
    null,
    "application/ld+json"
  )
    .then((response) => {
      if (!response["hydra:member"] instanceof Array) {
        return false;
      }

      showBuses(response["hydra:member"], "#main-page");
    })
    .catch((e) => {
      handleError(e, getBuses);
    });
}

/**
 *
 * @param {Object} response
 * @param {Function} callback The function to call eventually
 * @returns
 */
function handleError(response, callback) {
  if (isJwtTokenExpired(response)) {
    getRefreshToken().then((response) => {
      storeTokens(response.token, response.refresh_token).then(() => {
        if (typeof callback !== "function") {
          throw "The callback argument is not a function";
        }

        callback();
      });
    });

    return false;
  }

  notify(
    response?.responseJSON?.message ?? "🥶 Une erreur est survenue",
    "danger"
  );
}

/**
 *
 * @param {String} token
 * @param {String} refresh_token
 */
async function storeTokens(token, refresh_token) {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("refresh_token", refresh_token);
  if (decodedToken()) {
    sessionStorage.setItem(
      "role",
      decodedToken().roles.indexOf("ROLE_ADMIN") < 0
        ? "ROLE_USER"
        : "ROLE_ADMIN"
    );
  }
  // sessionStorage.setItem("role", decodedToken().roles.includes("ROLE_ADMIN")  ? "ROLE_ADMIN" :  "ROLE_USER"  )
}

/**
 *
 * @returns {String} the token decoded
 */
function decodedToken() {
  if (sessionStorage.getItem("token")) {
    return jwt_decode(sessionStorage.getItem("token"));
  }

  return false;
}

function clearTokens() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("refresh_token");
}

/**
 *
 * @param {String} message
 * @param {String} _class
 */
function notify(message = "", _class = "success") {
  $("#notification").addClass(`alert-${_class}`);
  $("#notification").text(message);
  $("#notification").fadeIn("slow");

  setTimeout(() => {
    $("#notification").fadeOut("slow", () => {
      $("#notification").text("");
    });
  }, 3000);
}

function showItems(items = [], selector = "") {
  $(selector).html("");

  items.forEach((item) => {
    $(selector).append(`
      <div class="card bg-dark">
        <div class="card-body">
        <h5 class="card-title">${item?.title ?? "..."}</h5>
        <pclass="card-text">${item?.content ?? "..."}</p>
        <a href="#" id="${
          item["@id"] ?? "..."
        }" class="btn btn-dark active-modify">Modifier</a>
      </div>`);
  });
}

function showChilds(items = [], selector = "") {
  $(selector).html("");

  items.forEach((item) => {
    $(selector).append(`
      <div class="card bg-dark">
        <div class="card-body">
          <h5 class="card-title">${item?.username ?? "..."}</h5>
        </div>
      </div>`);
  });
}
function showBuses(items = [], selector = "") {
  $(selector).html("");

  items?.forEach((item, key) => {
    $(selector).append(`
      <div class="card bg-dark">
        <div class="card-body">
          <h5 class="card-title">${item?.immat ?? "..."}</h5>
          <div class="card-text" id="bus_${key}"></div>
        </div>
      </div>`);

    item?.childs.forEach((child) => {
      $(`#bus_${key}`).append(
        `<span class="text-warning">${child?.username ?? "..."}</span></br>`
      );
    });
  });
}

function setView() {
  if (["ROLE_USER", "ROLE_ADMIN"].includes(sessionStorage.getItem("role"))) {
    $(".navbar-nav").html(
      `<li class="nav-item">
      <a class="nav-link active" aria-current="page" href="/logout" data-route="/logout">Deconnexion</a>
      </li>`
    );
  }
}

function isJwtTokenExpired(response) {
  return (
    (response.status === 401 &&
      response.responseJSON.message === "Expired JWT Token") ||
    (response.code === 401 && response.message === "Expired JWT Token")
  );
}

/**
 *
 * @param {String} entrypoint
 * @param {Object} methods
 * @param {Object} headers
 * @param {Object} datas
 * @returns Mixed request response
 */
async function fetchAPI(
  entrypoint = "",
  methods = "GET",
  headers = {},
  datas = {},
  dataType = "json",
  contentType = "application/json"
) {
  var api_response = null;
  await $.ajax({
    url: entrypoint,
    type: methods,
    headers: headers,
    data: datas,
    dataType: dataType,
    contentType: contentType,
    success: (response) => {
      api_response = response;
    },
    error: (e) => {
      api_response = e;
    },
  });

  return api_response;
}

// console.clear();
const warningTitleCSS =
  "color:red; font-size:60px; font-weight: bold; -webkit-text-stroke: 1px black;";
const warningDescCSS = "font-size: 18px;";

console.log("%cStop!😵‍💫 ", warningTitleCSS);
console.log(
  `%cIl s’agit d’une fonctionnalité de navigateur conçue pour les développeurs. Si quelqu’un vous a invité(e) à copier-coller quelque chose ici pour activer une fonctionnalité ou soit-disant pirater le compte d’un tiers, sachez que c’est une escroquerie permettant à cette personne d’accéder à votre compte ${NAME}.`,
  warningDescCSS
);
