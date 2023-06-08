const urlApi = "/api";
const urlApiLinks = urlApi + "/links";

function getLinks() {
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

        myHtml += `<div class="card" style="width: 18rem;">
            <img src="https://picsum.photos/200" class="card-img-top" alt="image">
            <div class="card-body">
              <h5 class="card-title">${element.title}</h5>
              <p class="card-text">${element.description}</p>
              <a href="${element.description}" class="btn btn-primary">Consultez le lien</a>
            </div>
            <div class="card-footer">
              <small class="text-body-secondary">Créé par ${element.user.forename} ${element.user.surname}</small>
            </div>
          </div>`;
      });
      document.getElementById("linksContainer").innerHTML = myHtml;
    })
    .catch((error) => {
      alert(error);
    });
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    getLinks();
  },
  false
);
