const urlApi = "/api";
const urlApiLinks = urlApi + "/links";
let currentPage = 1;
let isSearchMode = false;

//Juste pour tester l'appel AJAX
function getLinks() {
  isSearchMode = false;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const init = {
    method: "GET",
    headers: headers,
  };

  fetch(urlApiLinks, init)
    .then((response) => {
      return response.json();
    })
    .then((json) => json["hydra:member"])
    .then((response) => {
      // Déclare une chaine de caractère
      let myHtml = "";

      //Pour chaque lien que je reçoit de ma requête ajax
      response.forEach((element) => {
        // Je créé un élément en html, qui corresponds à l'affichage de mon lien

        myHtml += `
        <div class="cardLink">
          <div class="card h-100">
              <img src="https://picsum.photos/200/100" class="card-img-top" alt="image">
              <div class="card-body">
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">${element.description}</p>
                <a href="${element.description}" class="btn btn-primary">Consultez le lien</a>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary">Créé par ${element.user.forename} ${element.user.surname}</small>
              </div>
            </div>
          </div>
          `;
      });
      if (page == 1) {
        // Premier affichage, on vide le contenu de la div
        document.getElementById("linksContainer").innerHTML = myHtml;
      } else {
        // Etape de pagination ajoute le conenu en dessous
        document.getElementById("linksContainer").innerHTML += myHtml;
      }
    })
    .catch((error) => {
      alert(error);
    });
}

function paginate() {
  currentPage++;
  getLinks(12, currentPage);
}

function searchLinks() {
  isSearchMode = true;
  currentPage = 1;

  const search = document.getElementById("searchBarInput").value;

  if (search == "" || search == undefined) {
    getLinks(12, currentPage);
  } else {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const init = {
      method: "GET",
      headers: headers,
    };

    const urlRequete = urlApiLinks + "?title=" + search;

    fetch(urlRequete, init)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Une erreur est survenue");
        }
      })
      .then((json) => json["hydra:member"])
      .then((response) => {
        if (response.length === 0) {
          throw new Error("Aucun élément ne correspond à cette recherche");
        }
        // Déclare une chaine de caractère
        let myHtml = "";

        //Pour chaque lien que je reçoit de ma requête ajax
        response.forEach((element) => {
          // Je créé un élément en html, qui corresponds à l'affichage de mon lien

          myHtml += `
        <div class="cardLink">
          <div class="card h-100">
              <img src="https://picsum.photos/200/100" class="card-img-top" alt="image">
              <div class="card-body">
                <h5 class="card-title">${element.title}</h5>
                <p class="card-text">${element.description}</p>
                <a href="${element.description}" class="btn btn-primary">Consultez le lien</a>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary">Créé par ${element.user.forename} ${element.user.surname}</small>
              </div>
            </div>
          </div>
          `;
        });
        document.getElementById("linksContainer").innerHTML = myHtml;
      })
      .catch((error) => {
        document.getElementById(
          "linksContainer"
        ).innerHTML = `<span class="text-danger">${error.message}</span>`;
      });
  }
}

function addLink() {
  alert("Ajouter le lien");
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    getLinks();

    window.addEventListener("scroll", () => {
      const {
        scrollTop, // Ce qui est au dessus de mon écran (j'ai déjà scrollé cette partie)
        scrollHeight, // La hauteur totale de mon site
        clientHeight, // La hauteur de mon écran
      } = document.documentElement;

      if (!isSearchMode) {
        if (scrollTop + clientHeight >= scrollHeight - 5) {
          paginate();
        }
      }
    });
  },
  false
);
