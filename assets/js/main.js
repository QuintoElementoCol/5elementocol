/* =====================================================================
   QUINTO ELEMENTO · JavaScript del sitio (sin librerías externas)
   1. Menú móvil
   2. Filtros del catálogo (categorías y "¿qué usar en cada área?")
   3. Calculadora de costo por litro preparado
   4. Envío del formulario de contacto (Web3Forms)
   5. Año automático en el pie de página
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. Menú móvil ---------- */
  var toggle = document.querySelector(".menu-toggle");
  var nav = document.getElementById("nav-principal");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var abierto = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!abierto));
      nav.classList.toggle("abierto", !abierto);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("abierto"); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("abierto")) {
        toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("abierto"); toggle.focus();
      }
    });
  }

  /* ---------- 2. Filtros del catálogo ---------- */
  var catalogo = document.getElementById("catalogo");
  if (catalogo) {
    var productos = Array.prototype.slice.call(catalogo.querySelectorAll(".producto"));
    var bloques = Array.prototype.slice.call(catalogo.querySelectorAll("[data-bloque]"));
    var filtrosCat = Array.prototype.slice.call(document.querySelectorAll(".filtro"));
    var filtrosArea = Array.prototype.slice.call(document.querySelectorAll(".area-btn"));
    var estado = document.getElementById("estado-filtro");
    var sinRes = document.getElementById("sin-resultados");
    var cat = "todos", area = null;

    function aplicar() {
      var visibles = 0;
      productos.forEach(function (p) {
        var okCat = cat === "todos" || p.dataset.categoria === cat;
        var okArea = !area || (" " + p.dataset.areas + " ").indexOf(" " + area + " ") > -1;
        var ver = okCat && okArea;
        p.hidden = !ver;
        if (ver) visibles++;
      });
      bloques.forEach(function (b) { b.hidden = !b.querySelector(".producto:not([hidden])"); });
      if (sinRes) sinRes.hidden = visibles > 0;
      if (estado) {
        if (area) {
          var btn = document.querySelector('.area-btn[data-area="' + area + '"]');
          var nombre = btn ? btn.dataset.nombre : area;
          estado.innerHTML = "Mostrando " + visibles + " producto(s) recomendados para " + nombre + ". ";
          var limpiar = document.createElement("button");
          limpiar.type = "button"; limpiar.textContent = "Ver todo el portafolio";
          limpiar.addEventListener("click", function () { area = null; cat = "todos"; sincronizar(); aplicar(); });
          estado.appendChild(limpiar);
        } else {
          estado.textContent = "Mostrando " + visibles + " producto(s).";
        }
      }
    }
    function sincronizar() {
      filtrosCat.forEach(function (f) { f.setAttribute("aria-pressed", String(f.dataset.filtro === cat)); });
      filtrosArea.forEach(function (f) { f.setAttribute("aria-pressed", String(f.dataset.area === area)); });
    }
    filtrosCat.forEach(function (f) {
      f.addEventListener("click", function () { cat = f.dataset.filtro; area = null; sincronizar(); aplicar(); });
    });
    filtrosArea.forEach(function (f) {
      f.addEventListener("click", function () {
        area = area === f.dataset.area ? null : f.dataset.area; cat = "todos"; sincronizar(); aplicar();
        if (area) catalogo.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    // Permite enlazar directo a un área: productos.html?area=cocina
    var params = new URLSearchParams(window.location.search);
    if (params.get("area") && document.querySelector('.area-btn[data-area="' + params.get("area") + '"]')) area = params.get("area");
    if (params.get("categoria") && document.querySelector('.filtro[data-filtro="' + params.get("categoria") + '"]')) cat = params.get("categoria");
    sincronizar(); aplicar();
  }

  /* ---------- 3. Calculadora de costo por litro preparado ---------- */
  var calc = document.getElementById("calculadora");
  if (calc) {
    var fmt = new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
    var num = function (id) { var v = parseFloat(String(document.getElementById(id).value).replace(",", ".")); return isNaN(v) ? 0 : v; };
    function calcular() {
      var sel = document.getElementById("calc-producto");
      var opt = sel.options[sel.selectedIndex];
      var costo5e = parseFloat(opt.dataset.costo);          // costo por litro preparado (catálogo 2026)
      var precioActual = num("calc-precio");                 // precio del envase que usa hoy
      var litrosActual = num("calc-litros");                 // litros por envase
      var dosisActual = num("calc-dosis");                   // mL por litro de agua (0 = listo para usar)
      var consumo = num("calc-consumo");                     // litros de solución al mes
      var out = document.getElementById("calc-resultado");
      if (!precioActual || !litrosActual) { out.innerHTML = "Ingrese el precio y el tamaño del envase que usa hoy para ver la comparación."; return; }
      var litrosPreparados = dosisActual > 0 ? (litrosActual * 1000) / dosisActual : litrosActual;
      var costoActual = precioActual / litrosPreparados;
      var dif = costoActual - costo5e;
      var max = Math.max(costoActual, costo5e);
      document.getElementById("barra-actual").style.width = (costoActual / max * 100) + "%";
      document.getElementById("barra-5e").style.width = (costo5e / max * 100) + "%";
      document.getElementById("valor-actual").textContent = fmt.format(costoActual) + " / L";
      document.getElementById("valor-5e").textContent = fmt.format(costo5e) + " / L";
      if (dif > 0) {
        var pct = Math.round(dif / costoActual * 100);
        out.innerHTML = '<span class="ahorro-grande">' + pct + "% menos por litro preparado</span>" +
          "Con un consumo de " + consumo.toLocaleString("es-CO") + " litros de solución al mes, la diferencia estimada es de <strong>" +
          fmt.format(dif * consumo) + " al mes</strong> (" + fmt.format(dif * consumo * 12) + " al año). Valor de referencia: confirme su caso con una cotización.";
      } else {
        out.innerHTML = "Con estos datos su costo actual por litro preparado es igual o menor. Escríbanos: podemos revisar la dosificación real que usa en sitio y ajustar la fórmula a su necesidad.";
      }
    }
    calc.addEventListener("input", calcular);
    calc.addEventListener("change", calcular);
    calcular();
  }

  /* ---------- 4. Formulario de contacto ---------- */
  var form = document.getElementById("form-contacto");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var estadoForm = document.getElementById("form-estado");
      var key = form.querySelector('input[name="access_key"]').value;
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (!key || key.indexOf("REEMPLAZAR") === 0) {
        // Aún no se configuró la clave del servicio de formularios (ver README.md)
        estadoForm.className = "form-estado error";
        estadoForm.textContent = "El formulario está en configuración. Por favor escríbanos por WhatsApp o a contacto@5toelemento.com.";
        return;
      }
      var boton = form.querySelector('button[type="submit"]');
      boton.disabled = true; boton.textContent = "Enviando...";
      fetch(form.action, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok && d.success !== false }; }); })
        .then(function (res) {
          if (res.ok) {
            form.reset();
            estadoForm.className = "form-estado ok";
            estadoForm.textContent = "Gracias. Recibimos su mensaje y un asesor técnico le responderá en horario hábil.";
          } else { throw new Error("envio"); }
        })
        .catch(function () {
          estadoForm.className = "form-estado error";
          estadoForm.textContent = "No pudimos enviar el mensaje. Escríbanos por WhatsApp o a contacto@5toelemento.com.";
        })
        .then(function () { boton.disabled = false; boton.textContent = "Enviar solicitud"; });
    });
  }

  /* ---------- 5. Año en el pie de página ---------- */
  var anio = document.getElementById("anio");
  if (anio) anio.textContent = new Date().getFullYear();
})();
