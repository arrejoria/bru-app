$(document).ready(function () {});

// My Javascript vanilla code starts here

// Variables
const localeObj = {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const bruSubmit = document.getElementById("bruSubmit");
const montoInp = document.querySelector('input[name="amount"]');
const isSaveChecked = document.querySelector("#save-confirm");
// const getPeriod = selectMeses?Array.from(selectMeses.children).slice(1).map( (el) => {
//    return el.dataset.placeholder
// }) : null
let monto, periodId;

const plazoData = {
  clasicoPesos: {
    dias: [],
    tna: [0.92, 0.92, 0.94, 0.97, 1.0],
    tea: [142.7, 135.5, 132.9, 120.9, 100],
  },
};
// Handling Events
bruSubmit.addEventListener("click", () => {
  storageAll();
  showResults();
  // loadPlazo();
});

document.addEventListener("DOMContentLoaded", () => {
  setSelectData();
  storageAll();
  displayPlazo();
});

montoInp.addEventListener("input", (e) => {
  let inpValue = e.target.value;
  montoInp.value = formatAmount(inpValue);
});

// BruApp functions

/**
 *
 * Amount Section Starts here
 */
function formatAmount(num) {
  removeError(".error-message");

  num = num.replace(/\./g, "");
  validateAmount(num);

  switch (num.length) {
    case 8:
    case 7:
      num = `${num.slice(0, -6)}.${num.slice(-6, -3)}.${num.slice(-3)}`;
      //
      break;
    case 6:
      num = `${num.slice(0, 3)}.${num.slice(3)}`;
      //
      break;
    case 5:
      num = `${num.slice(0, 2)}.${num.slice(2)}`;
      //
      break;
    case 4:
      num = `${num.slice(0, 1)}.${num.slice(1)}`;
      //
      break;
    default:
      console.warn(
        "Ups! El monto a invertir excede o es menor a la cantidad permitida."
      );
  }

  return num;
}
let contadorID = 0;

function generarID() {
  contadorID++;
  return contadorID;
}
function validateAmount(num) {
  const minAmount = 1000;
  const maxAmount = 10000000;
  num = Number(num);
  if (num < minAmount || num > maxAmount) {
    montoInp.style.color = "red";
    const msg = "Cantidad invalida, respetar monto min y max.";
    addError("#amountMinMax", msg);
  } else {
    montoInp.style.color = "inherit";
  }
}
function addError(element, message) {
  const fieldError = document.createElement("small");
  fieldError.classList.add("error-message");
  fieldError.textContent = message;

  const amountParent = document.querySelector(element);
  amountParent.insertAdjacentElement("beforebegin", fieldError);
  bruSubmit.disabled = true;
}
function removeError(elements) {
  const errorMsgs = document.querySelectorAll(elements);
  errorMsgs.forEach((errorMsg) => {
    errorMsg.remove();
  });
  bruSubmit.disabled = false;
}
/**
 *
 * Asignar option data attribute al select de meses
 */
const selectMeses = document.querySelector('select[name="selectMeses"]');
const resultItems = document.querySelectorAll(".result__item");
selectMeses.addEventListener("change", setSelectData());

function setSelectData() {
  const selectedOption = selectMeses.options[selectMeses.selectedIndex];
  //
  const monthId = selectedOption.getAttribute("data-month-id");
  selectMeses.setAttribute("data-month-id", monthId);
  //
}
/**
 *
 * Storage Section Starts here
 */

function storageData(obj) {
  if (obj) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key) && obj[key] !== null) {
        try {
          const objString = JSON.stringify(obj[key]); // Almacena el objeto en una variable separada
          localStorage.setItem(`${key}`, objString);
        } catch (error) {
          console.error("Error al almacenar datos en el localStorage:", error);
        }
      }
    }
  }
}

function storageAll() {
  plazoData.clasicoPesos.dias = setDias();
  plazoData.plazoResults = setPlazoResults();
  storageData(plazoData);
  showResults();
  setPlazos();

  return plazoData;
}

function setDias() {
  try {
    const mesCantidad = parseInt(selectMeses.value);
    const fechaInicio = new Date();
    const fechaFinal = new Date();
    fechaFinal.setMonth(fechaFinal.getMonth() + mesCantidad);

    const diferenciaMs = fechaFinal.getTime() - fechaInicio.getTime();
    const diferenciaDias = diferenciaMs / (24 * 60 * 60 * 1000);
    return diferenciaDias;
  } catch (error) {
    console.error("Error al obtener la cantidad de días de los plazos.", error);
  }
}

function setPlazoResults() {
  try {
    const bruInterests = plazoData.clasicoPesos; //JSON.parse(localStorage.getItem("clasicoPesos"));
    const monto = parseFloat(montoInp.value.replace(/\./g, ""));
    const periodId = parseInt(selectMeses.getAttribute("data-month-id"));

    //Verificar que en local storage haya informacion del BCRA
    if (bruInterests) {
      const { dias, tna, tea } = bruInterests;
      const intereses = monto * tna[periodId] * (dias / 365);
      const storedInfo = {
        montoInicial: monto.toLocaleString("es-AR", localeObj),
        interesesGanados: (monto + intereses).toLocaleString(
          "es-AR",
          localeObj
        ),
        netoACobrar: intereses.toLocaleString("es-AR", localeObj),
        periodoRenovacion: dias,
        tna: tna[periodId],
        tea: tea[periodId],
      };
      return storedInfo;
    }
  } catch (error) {
    console.error("Error al almacenar información del plazo fijo:", error);
  }
  return null;
}

function showResults() {
  const results = plazoData.plazoResults; //JSON.parse(localStorage.getItem("plazoResults"));
  if (results) {
    Object.entries(results).forEach(([clave, valor], index) => {
      if (Object.hasOwnProperty.call(results, clave)) {
        if (clave == "periodoRenovacion") valor = valor + " días";
        return (resultItems[index].children[1].textContent = valor);
      }
    });
  }
}

function setPlazos() {
  const objPlazos = JSON.parse(localStorage.getItem("plazoResults")) || {};
  let plazos = [];

  try {
    if (isSaveChecked.checked) {
      const { interesesGanados, netoACobrar, periodoRenovacion } = objPlazos;
      const setPlazo = {
        id: generarID(),
        total: interesesGanados,
        neto: netoACobrar,
        periodo: periodoRenovacion,
        fechas: plazoFechas(),
      };

      if (Object.keys(objPlazos).length !== 0) {
        const existingPlazos = JSON.parse(localStorage.getItem("plazos")) || [];
        plazos = [...existingPlazos];
      }

      plazos.push(setPlazo);

      localStorage.setItem("plazos", JSON.stringify(plazos));

      displayPlazo();
      return plazos;
    }
  } catch (error) {
    console.error("No se pudo generar un plazo: " + error);
  }
}

// Manejar fecha de inicio y final de un plazo fijo y cantidad de dias entre ambas
function plazoFechas() {
  try {
    const fechaActual = new Date();
    const fechaFinal = new Date();
    const mesCantidad = parseInt(selectMeses.value);
    const mesActual = fechaActual.getMonth();

    fechaFinal.setMonth(mesActual + mesCantidad);
    fechaFinal.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const actualFormateada = fechaActual.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const finalFormateada = fechaFinal.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const fechasFormateadas = [actualFormateada, finalFormateada];
    return fechasFormateadas;
  } catch (error) {
    console.error("Error al manejar las fechas de los plazos:", error);
  }
}

/**
 * Generar plazos fijos y almacenarlos en storage
 */

function displayPlazo() {
  const plazosLista = document.querySelector(".bru__storage-list");
  const getPlazos = JSON.parse(localStorage.getItem("plazos"));

  for (let i = 0; i < getPlazos.length; i++) {
    const { id, total, neto, periodo, fechas } = getPlazos[i];

    // Verificar si el elemento con el ID ya existe
    const plazoExistente = document.querySelector(
      `.bru__plazos[data-plazo-id="${id}"]`
    );
    if (plazoExistente) {
      continue; // Saltar a la siguiente iteración si ya existe
    }
    
    const plazoUl = document.createElement("ul");
    plazoUl.classList.add("bru__plazos");
    plazoUl.setAttribute("data-plazo-id", id);

    plazoUl.innerHTML = `
      <li>${total}</li>
      <li>${neto}</li>
      <li>${periodo} Días</li>
      <li>${fechas[0]}</li>
      <li>${fechas[1]}</li>
      <li><button class="add-btn">Agregar</button>
      <button class="del-btn">Eliminar</button></li>`;

    plazosLista.append(plazoUl);
    deletePlazo();
  }
}

function deletePlazo() {
  const delButton = document.querySelectorAll("#del-btn");
  delButton.forEach((element) => {
    element.addEventListener("click", (e) => {
      const plazoUl = e.target.closest(".bru__plazos");
      const plazoID = plazoUl.getAttribute("data-plazo-id");
      console.dir(plazoID);

      // if(id == plazoID){

      // }
    });
  });
}
/**
 * Screen Loading Scripts starts here
 */

const screenLoading = document.querySelector(".screen__loading");
const loadingWord = document.querySelector(".word-1");
const appWord = document.querySelector(".word-2");
const questionSign = document.querySelector(".question__sign");
let time = 4;
if (screenLoading) {
  loadingWord.style.setProperty("--scren-time", time + "s");
  loadingWord.style.setProperty("--width-words", "100%");

  // Carga animacion de screen lette
  setTimeout(() => {
    loadingWord.classList.add("screen-text-animation");
  }, (time - 1) * 1000);

  setTimeout(() => {
    questionSign.classList.add(
      "question__sign-visible",
      "question__sign-animation"
    );
    appWord.classList.add("word-2-animation", "word-2-visible");
  }, (time - 3) * 1000);

  // Carga screen laoding animation 4 seg posterior a la animacion de screen words
  setTimeout(function () {
    screenLoading.classList.add("screen-animation");

    // Oculta screen laoding 1.5 seg posterior a la animacion
    setTimeout(() => {
      const mainImg = document.querySelector(".main__image img");

      mainImg.classList.add("main__image-animation");
      screenLoading.style.display = "none";
    }, 1000); // Ajusta el tiempo de espera para que coincida con la duración de la animación (1.5 segundos en este caso)
  }, time * 1000);
}
