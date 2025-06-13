(function () {
  let stylesInjected = false;
  let currentInstance = null;

  function injectExternalStylesOnce() {
    if (stylesInjected) return;
    stylesInjected = true;

    const links = [
      {
        href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
        rel: "stylesheet",
      },
      {
        href: "https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css",
        rel: "stylesheet",
      },
    ];

    links.forEach(({ href, rel }) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      document.head.appendChild(link);
    });
  }

  function createSmartHintSearch(containerId = 'smarthint-search') {

    if (currentInstance) {
      currentInstance.cleanup();
    }

    injectExternalStylesOnce();

    let target = document.getElementById(containerId);
    if (!target) {
      target = document.createElement("div");
      target.id = containerId;
      document.body.insertBefore(target, document.body.firstChild);
    }

    // Leer configuración desde atributos de datos
    const CONFIG = {
      minSearchLength: parseInt(target.dataset.minSearchLength) || 3,
      debounceTime: parseInt(target.dataset.debounceTime) || 300,
      api: {
        shcode: target.dataset.shcode || "SH-251914",
        cluster: target.dataset.cluster || "v3",
        anonymous: target.dataset.anonymous || "c063e8d2-d690-44d7-869f-15ca07bf9555",
        resultsSize: parseInt(target.dataset.resultsSize) || 10,
      },
    };

    const DOM = { target, input: null, results: null };
    const uniqueId = `smart-hint-${Date.now()}`;

    const container = document.createElement("div");
    container.className = "autocomplete-container";

    const inputGroup = document.createElement("div");
    inputGroup.className = "input-with-icon";

    DOM.input = document.createElement("input");
    DOM.input.type = "text";
    DOM.input.placeholder = "Buscar productos e marcas...";
    DOM.input.id = `${uniqueId}-input`;
    DOM.input.className = "form-control";
    DOM.input.setAttribute("aria-label", "Buscar productos");
    DOM.input.setAttribute("role", "combobox");
    DOM.input.setAttribute("aria-expanded", "false");
    DOM.input.setAttribute("aria-controls", `${uniqueId}-results`);

    const icon = document.createElement("i");
    icon.className = "bi bi-search position-absolute top-50 end-0 translate-middle-y me-3 text-muted";
    icon.style.pointerEvents = "none";

    inputGroup.appendChild(DOM.input);
    inputGroup.appendChild(icon);
    container.appendChild(inputGroup);

    DOM.results = document.createElement("div");
    DOM.results.className = "dropdown-menu";
    DOM.results.id = `${uniqueId}-results`;
    DOM.results.setAttribute("role", "listbox");
    container.appendChild(DOM.results);

    DOM.target.appendChild(container);

    let controller;
    let searchTimeout;
    let isLoading = false;

    function setLoading(loading) {
      isLoading = loading;
      DOM.input.classList.toggle('loading', loading);
      DOM.input.setAttribute('aria-busy', loading);
    }

    function showError(message) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "alert alert-danger m-2";
      errorDiv.textContent = message;
      DOM.results.innerHTML = "";
      DOM.results.appendChild(errorDiv);
      DOM.results.style.display = "block";
    }

    DOM.input.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        handleSearch(e.target.value.trim());
      }, CONFIG.debounceTime);
    });

    DOM.input.addEventListener("focus", () => {
      if (DOM.results.innerHTML && DOM.input.value.trim().length >= CONFIG.minSearchLength) {
        DOM.results.style.display = "block";
        DOM.input.setAttribute("aria-expanded", "true");
      }
    });

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".autocomplete-container")) {
        DOM.results.style.display = "none";
        DOM.input.setAttribute("aria-expanded", "false");
      }
    });

    DOM.input.addEventListener("blur", () => {
      setTimeout(() => {
        DOM.results.style.display = "none";
        DOM.input.setAttribute("aria-expanded", "false");
      }, 200);
    });

    async function handleSearch(term) {
      if (term.length < CONFIG.minSearchLength) {
        clearResults();
        return;
      }

      if (controller) controller.abort();
      controller = new AbortController();

      try {
        setLoading(true);
        const url = buildSearchUrl(term);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const data = await res.json();
        displayResults(data?.Products || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          showError("Erro ao buscar produtos. Por favor, tente novamente.");
          console.error("Search error:", err);
        }
      } finally {
        setLoading(false);
      }
    }

    function buildSearchUrl(term) {
      const { shcode, cluster, anonymous, resultsSize } = CONFIG.api;
      return `https://searches.smarthint.co/${cluster}/Search/GetPrimarySearch?shcode=${shcode}&term=${encodeURIComponent(
        term
      )}&from=0&size=${resultsSize}&anonymous=${anonymous}&searchSort=0`;
    }

    function displayResults(products) {
      clearResults();

      if (!products.length) {
        DOM.results.innerHTML =
          '<div class="dropdown-item text-muted" role="option">Nenhum produto encontrado</div>';
        DOM.results.style.display = "block";
        return;
      }

      const fragment = document.createDocumentFragment();

      products.forEach((product, index) => {
        const item = document.createElement("div");
        item.className = "dropdown-item d-flex flex-column flex-md-row align-items-start py-2 border-bottom";
        item.setAttribute("role", "option");
        item.setAttribute("aria-selected", "false");
        item.setAttribute("id", `${uniqueId}-item-${index}`);

        const contentRow = document.createElement("div");
        contentRow.className = "d-flex flex-row align-items-center w-100";
        contentRow.style.minWidth = "0";

        const img = document.createElement("img");
        img.src = product.ImageLink || "https://via.placeholder.com/120x120?text=Sem+Imagem";
        img.alt = product.Title || "Produto";
        img.className = "rounded object-fit-container me-2 flex-shrink-0";

        const infoContainer = document.createElement("div");
        infoContainer.className = "text-truncate";
        infoContainer.style.minWidth = "0";

        const title = document.createElement("div");
        title.className = "fw-semibold text-truncate";
        title.textContent = product.Title || "Produto";

        const price = document.createElement("div");
        price.className = "text-success small";
        price.textContent = product.FinalPrice
          ? `R$${product.FinalPrice.toFixed(2)}`
          : "";

        infoContainer.appendChild(title);
        infoContainer.appendChild(price);

        contentRow.appendChild(img);
        contentRow.appendChild(infoContainer);

        const button = document.createElement("a");
        button.className = "btn btn-sm btn-outline-primary mt-2 ms-auto";
        button.textContent = "Ver produto";
        button.href = product.Url || product.Link || "#";
        button.setAttribute("aria-label", `Ver produto: ${product.Title}`);

        item.appendChild(contentRow);
        item.appendChild(button);

        item.addEventListener("click", (e) => {
          if (!e.target.closest("a")) {
            window.location.href = product.Url || product.Link || "#";
          }
        });

        fragment.appendChild(item);
      });

      DOM.results.appendChild(fragment);
      DOM.results.style.display = "block";
    }

    function clearResults() {
      DOM.results.innerHTML = "";
    }

    // Store cleanup function
    currentInstance = {
      cleanup: () => {
        if (controller) controller.abort();
        clearTimeout(searchTimeout);
        DOM.target.innerHTML = "";
      }
    };

    return currentInstance;
  }

  // Initialize on DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      createSmartHintSearch();
    });
  } else {
    createSmartHintSearch();
  }

  // Expose the widget creation function globally
  window.createSmartHintSearch = createSmartHintSearch;
})();
