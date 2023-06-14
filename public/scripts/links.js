const urlApi = "/api";
const urlApiLinks = urlApi + "/links";
let currentPage = 1;
let isSearchMode = false;
const myModal = document.getElementById("addLinkModal");
const addEditModal = new bootstrap.Modal(myModal);

//let addEditModal = new bootstrap.Modal(document.getElementById("addLinkModal"),{});

//Juste pour tester l'appel AJAX
function getLinks(perPage = 12, page = 1) {
  isSearchMode = false;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const init = {
    method: "GET",
    headers: headers,
  };

  const urlRequete = urlApiLinks + "?perPage=" + perPage + "&page=" + page;
  fetch(urlRequete, init)
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

        myHtml += getCard(
          element.title,
          element.description,
          element.link,
          element.user.forename,
          element.user.surname,
          element.id
        );
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

          myHtml += getCard(
            element.title,
            element.description,
            element.link,
            element.user.forename,
            element.user.surname,
            element.id
          );
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

function editLinkModal(id) {
  document.getElementById("addLinkModalLabel").innerText = "Modifier un lien";
  document.getElementById("btnValidationAddModal").hidden = true;
  document.getElementById("btnValidationEditModal").hidden = false;

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const init = {
    method: "GET",
    headers: headers,
  };

  const urlRequete = urlApiLinks + "/" + id;
  fetch(urlRequete, init)
    .then((response) => {
      return response.json();
    })
    .then((monLien) => {
      document.getElementById("idLinkInput").value = monLien.id;
      document.getElementById("titleInput").value = monLien.title;
      document.getElementById("descriptionInput").value = monLien.description;
      document.getElementById("linksInput").value = monLien.link;
      document.getElementById("idUserInput").value = monLien.user.id;
    })
    .catch((error) => {
      alert(error);
    });
  addEditModal.show();
}

function editLinkAction() {
  let myForm = document.getElementById("addLinkForm");
  let formObj = new FormData(myForm);
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const userId = parseInt(formObj.get("userId"), 10);
  const body = JSON.stringify({
    id: parseInt(formObj.get("idLink"), 10),
    title: formObj.get("title"),
    description: formObj.get("description"),
    link: formObj.get("link"),
    user: `/api/users/${userId}`,
  });

  const init = {
    method: "PUT",
    headers: headers,
    body: body,
  };

  const urlRequete = urlApiLinks + "/" + formObj.get("idLink");

  fetch(urlRequete, init)
    .then((response) => {
      if (response.status == 200) {
        return response.json();
      } else {
        alert("Une erreur est survenue");
        return response;
      }
    })
    .then((element) => {
      //Supprime dans la page la card du lien avant d'être modifié
      document.getElementById("cardLink" + element.id).remove();
      //Je génère la nouvelle card, et l'ajoute dans le html
      var myCard = getCard(
        element.id,
        element.title,
        element.description,
        element.link,
        element.user.forename,
        element.user.surname
      );
      var html = myCard + document.getElementById("linksContainer").innerHTML;
      document.getElementById("linksContainer").innerHTML = html;
      //je reset mon formulaire
      myForm.reset();
      //Je ferme la modale
      addEditModal.hide();
    })
    .catch((error) => {
      alert(error);
    });
}

function showAddLinkModal() {
  document.getElementById("addLinkModalLabel").innerText = "Ajouter un lien";
  document.getElementById("btnValidationAddModal").hidden = false;
  document.getElementById("btnValidationEditModal").hidden = true;
  document.getElementById("idLinkInput").value = "";
  document.getElementById("titleInput").value = "";
  document.getElementById("descriptionInput").value = "";
  document.getElementById("linksInput").value = "";
  document.getElementById("idUserInput").value = undefined;
  addEditModal.show();
}

function addLink() {
  let myForm = document.getElementById("addLinkForm");
  let formObj = new FormData(myForm);

  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const userId = parseInt(formObj.get("userId"), 10);
  const body = JSON.stringify({
    title: formObj.get("title"),
    description: formObj.get("description"),
    link: formObj.get("link"),
    user: `/api/users/${userId}`,
  });

  const init = {
    method: "POST",
    headers: headers,
    body: body,
  };

  const urlRequete = urlApiLinks;
  fetch(urlRequete, init)
    .then((response) => {
      if (response.status == 201) {
        return response.json();
      } else {
        alert("Une erreur est survenue");
        return response;
      }
    })
    .then((element) => {
      alert("le lien a bien été créé.");

      var myCard = getCard(
        element.title,
        element.description,
        element.link,
        element.user.forename,
        element.user.surname,
        element.id
      );
      var html = myCard + document.getElementById("linksContainer").innerHTML;
      document.getElementById("linksContainer").innerHTML = html;
      myForm.reset();
      addEditModal.hide();
    })
    .catch((error) => {
      alert(error);
    });
}

function deleteLink(id) {
  if (confirm("Êtes-vous sûr.e de voulour supprimer ce lien?")) {
    // Si il est ok, on fait l'appel AJAX
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    const init = {
      method: "DELETE",
      headers: headers,
    };

    const urlRequete = urlApiLinks + "/" + id;

    fetch(urlRequete, init)
      .then((response) => {
        if (response.status == 204) {
          document.getElementById("cardLink" + id).remove();
          alert("Votre lien a bien été supprimé");
        } else {
          alert("Une erreur est survenue");
        }
      })
      .catch((error) => {
        alert(error);
      });
  }
}

function getCard(title, description, link, forename, surname, id) {
  let myHtml = `
        <div class="cardLinks" id="cardLink${id}">
          <div class="card h-100">
              <img src="https://picsum.photos/200/100" class="card-img-top" alt="image">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${description}</p>
                <a href="${link}" class="btn btn-primary">Consultez le lien</a>
              </div>
              <div class="card-footer">
                <small class="text-body-secondary">Créé par ${forename} ${surname}</small>
                <button onclick="deleteLink(${id})" class="btn btn-danger btn-delete-link"><i class="bi bi-trash3"></i></button>
                <button onclick="editLinkModal(${id})" class="btn btn-info btn-delete-link"><i class="bi bi-pen"></i></button>
              </div>
            </div>
          </div>
          `;

  return myHtml;
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    getLinks(15, 1);

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
