document.addEventListener("DOMContentLoaded", (e) => {
  const moviesUrl = "https://japceibal.github.io/japflix_api/movies-data.json";
  fetch(moviesUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Error en la red");
      }
      return response.json()
    })
    .then(data => {
      console.log('movies-data-json', data);
      localStorage.setItem("movies-data-json", JSON.stringify(data));
    })
    .catch(error => {
      console.error("Error al cargar los datos:", error);
    });
});


document.addEventListener("DOMContentLoaded", function () {
  const botonBuscar = document.getElementById("btnBuscar");
  const inputBuscar = document.getElementById("inputBuscar");
  const listaPeliculasContainer = document.getElementById("lista");

  botonBuscar.addEventListener("click", (event) => {
    listaPeliculasContainer.innerHTML = '';

    const textoIngresado = inputBuscar.value.toLowerCase();
    if (!textoIngresado) {
      return;
    } else {
      const listaPeliculasString = localStorage.getItem("movies-data-json");
      const listaPeliculas = JSON.parse(listaPeliculasString);

      const peliculasFiltradas = listaPeliculas.filter(pelicula => {
        return pelicula.title.toLowerCase().includes(textoIngresado) ||
          pelicula.tagline.toLowerCase().includes(textoIngresado) ||
          pelicula.overview.toLowerCase().includes(textoIngresado) ||
          pelicula.genres.some(genero => genero.name.toLowerCase().includes(textoIngresado))
      });

      peliculasFiltradas.forEach(pelicula => {
        listaPeliculasContainer.appendChild(crearItemPelicula(pelicula));
      });
    }
  });
});

function crearItemPelicula(pelicula) {
  const li = document.createElement('li');
  li.className = 'list-group-item bg-dark item-pelicula ';

  li.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div class="d-flex flex-column">
          <span class="text-white">${pelicula.title}</span>
          <span class="text-secondary">${pelicula.tagline}</span>
        </div>
        <div class="text-white">
          ${obtenerEstrellas(pelicula.vote_average)}
        </div>
      </div>
    `;

  li.addEventListener("click", () => { desplegarContenedorSuperior(pelicula) })

  return li;
}

function obtenerEstrellas(promedioDeVotacion) {
  const estrellas = Math.round(promedioDeVotacion / 2);
  let estrellasHtml = '';
  for (let i = 1; i <= 5; i++) {
    estrellasHtml += `<span class="fa fa-star ${i <= estrellas ? 'checked' : ''}"></span>`;
  }
  return estrellasHtml;
}

function desplegarContenedorSuperior(pelicula) {
  const movieOverview = document.getElementById("movieOverview");
  const movieTitle = document.getElementById("movieTitle");
  const movieGenres = document.getElementById("movieGenres");
  const movieYear = document.getElementById("movieYear");
  const movieRuntime = document.getElementById("movieRuntime");
  const movieBudget = document.getElementById("movieBudget");
  const movieRevenue = document.getElementById("movieRevenue");

  movieOverview.innerText = pelicula.overview;
  movieTitle.innerText = pelicula.title;
  movieYear.innerText = pelicula.release_date.split('-')[0];
  movieRuntime.innerText = pelicula.runtime + ' mins';
  movieBudget.innerText = '$' + pelicula.budget;
  movieRevenue.innerText = '$' + pelicula.revenue;

  movieGenres.innerHTML = '';
  pelicula.genres.forEach(genre => {
    const listItem = document.createElement('li');
    listItem.textContent = genre.name;
    movieGenres.appendChild(listItem);
  });

  const detallePelicula = document.getElementById('offcanvas-detalle-pelicula');
  const offcanvas = new bootstrap.Offcanvas(detallePelicula);
  offcanvas.show();
}
