const searchForm = document.querySelector("#searchForm");

if (searchForm) {
  const searchInput = document.querySelector("#searchInput");
  const searchStatus = document.querySelector("#searchStatus");
  const searchResults = document.querySelector("#searchResults");

  searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();
    searchResults.replaceChildren();

    if (!query) {
      searchStatus.textContent = "Escribe una palabra o concepto para buscar.";
      searchInput.focus();
      return;
    }

    searchStatus.textContent = "Buscando en los siete temas…";

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error("La API de búsqueda devolvió un error.");
      }

      const data = await response.json();

      if (data.count === 0) {
        searchStatus.textContent = `No se encontraron resultados para “${query}”.`;
        return;
      }

      searchStatus.textContent = `${data.count} tema${data.count === 1 ? "" : "s"} encontrado${data.count === 1 ? "" : "s"}.`;

      for (const item of data.results) {
        const result = document.createElement("article");
        result.className = "search-result";

        const link = document.createElement("a");
        link.href = `#${item.sectionId}`;
        link.textContent = `${item.number} · ${item.title}`;

        const excerpt = document.createElement("p");
        excerpt.textContent = item.excerpt;

        result.append(link, excerpt);
        searchResults.append(result);
      }
    } catch {
      searchStatus.textContent = "No se pudo conectar con la búsqueda. Inicia la aplicación ASP.NET Core e inténtalo de nuevo.";
    }
  });
}
