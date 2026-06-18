(function () {
  const input = document.getElementById("searchInput");
  const region = document.getElementById("regionFilter");
  const type = document.getElementById("typeFilter");
  const year = document.getElementById("yearFilter");
  const cards = Array.from(document.querySelectorAll(".search-item"));
  const empty = document.getElementById("emptyState");

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function getQueryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  function applyFilter() {
    const query = normalize(input ? input.value : "");
    const regionValue = normalize(region ? region.value : "");
    const typeValue = normalize(type ? type.value : "");
    const yearValue = normalize(year ? year.value : "");
    let visible = 0;

    cards.forEach(function (card) {
      const text = normalize([
        card.dataset.title,
        card.dataset.region,
        card.dataset.type,
        card.dataset.year,
        card.dataset.genre,
        card.dataset.tags,
        card.textContent
      ].join(" "));
      const matched = (!query || text.indexOf(query) !== -1) &&
        (!regionValue || normalize(card.dataset.region) === regionValue) &&
        (!typeValue || normalize(card.dataset.type) === typeValue) &&
        (!yearValue || normalize(card.dataset.year) === yearValue);

      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });

    if (empty) {
      empty.classList.toggle("is-visible", visible === 0);
    }
  }

  if (input) {
    input.value = getQueryFromUrl();
    input.addEventListener("input", applyFilter);
  }

  [region, type, year].forEach(function (select) {
    if (select) {
      select.addEventListener("change", applyFilter);
    }
  });

  applyFilter();
})();
