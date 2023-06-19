$(document).ready(function () {});
console.log("JS Loaded");
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

// const getPeriod = selectMeses?Array.from(selectMeses.children).slice(1).map( (el) => {
//    return el.dataset.placeholder
// }) : null

let monto, periodId;

// Handling Events
bruSubmit.addEventListener("click", () => {
  console.log("Calculando intereses ganados");
  storageAll();
  showResults();
  loadPlazo()
});

document.addEventListener("DOMContentLoaded", () => {
  setSelectData();
  storageAll();
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
      // console.log("case 8 or 7: ", num);
      break;
    case 6:
      num = `${num.slice(0, 3)}.${num.slice(3)}`;
      // console.log("case 6: ", num);
      break;
    case 5:
      num = `${num.slice(0, 2)}.${num.slice(2)}`;
      // console.log("case 5: ", num);
      break;
    case 4:
      num = `${num.slice(0, 1)}.${num.slice(1)}`;
      // console.log("case 4: ", num);
      break;
    default:
      console.warn(
        "Ups! El monto a invertir excede o es menor a la cantidad permitida."
      );
  }

  return num;
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
 * Asignar data attribute de options al select de meses
 */
const selectMeses = document.querySelector('select[name="selectMeses"]');
const resultItems = document.querySelectorAll(".result__item");
selectMeses.addEventListener("change", setSelectData());

function setSelectData() {
  const selectedOption = selectMeses.options[selectMeses.selectedIndex];
  // console.log(selectedOption);
  const monthId = selectedOption.getAttribute("data-month-id");
  selectMeses.setAttribute("data-month-id", monthId);
  // console.log(selectMeses);
}
/**
 *
 * Storage Section Starts here
 */
function storageAll() {
  const plazoData = {
    clasicoPesos: {
      dias: [],
      tna: [0.92, 0.92, 0.94, 0.97, 1.0],
      tea: [142.7, 135.5, 132.9, 120.9, 100],
    },
  };
  plazoData.clasicoPesos.dias = setDias();
  plazoData.plazoResults = setPlazoResults();
  setPlazos()
  storageData(plazoData);
  showResults() 
}

function storageData(obj) {
  if (obj) {
    for (let key in obj) {
      // console.log("inside stdata bf owp", obj, "key:", key);
      console.log("obj prop:", obj[key]);
      if (obj.hasOwnProperty(key) && obj[key] !== null) {
        console.log("inside stdata", obj);
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

function showResults() {

   const results = JSON.parse(localStorage.getItem("plazoResults"));
   if(results !== null)
    console.log('inside set plazo results')
   Object.entries(results).forEach(([clave, valor], index) => {
     if (Object.hasOwnProperty.call(results, clave)) {
       if (clave == "periodoRenovacion") valor = valor + " días";
       return (resultItems[index].children[1].textContent = valor);
     }
   });

 }
 
function setPlazoResults() {
  try {
    const monto = parseFloat(montoInp.value.replace(/\./g, ""));
    const periodId = parseInt(selectMeses.getAttribute("data-month-id"));
    const bruInterests = JSON.parse(localStorage.getItem("clasicoPesos"));
    console.log('bruInterests::',bruInterests)
    if (bruInterests) {
      console.log(bruInterests);
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
      console.log('storedInfo >>>>>>',storedInfo)
      return storedInfo;
    }
  } catch (error) {
    console.error("Error al almacenar información del plazo fijo:", error);
  }
  return null
}

function setPlazos() {
  const objPlazos = JSON.parse(localStorage.getItem("objPlazos")) || {};

  const plazos = {
    monto: montoInicial,
    intereses: interesesGanados,
    periodo: periodoRenovacion,
    fechas: plazoFechas(),
  };

  var clavePlazo = 'plazo'; // Reemplaza 'claveEjemplo' con la clave que desees utilizar

  if (objPlazos.hasOwnProperty(clavePlazo)) {
    // Si la clave existe, agrega el objeto plazos al arreglo existente
    objPlazos[clavePlazo].push(plazos);
  } else {
    // Si la clave no existe, crea un nuevo arreglo con plazos como único elemento
    objPlazos[clavePlazo] = [plazos];
  }

  // Guardar el objeto objPlazos actualizado en el localStorage
  localStorage.setItem("objPlazos", JSON.stringify(objPlazos));
  console.log(plazos)

  return plazos;
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

/**
* Generar plazos fijos y almacenarlos en storage
*/
bruSubmit.addEventListener('click', () => {

})

function loadPlazo(){
  const getPlazos = JSON.parse(localStorage.getItem('objPlazos'));
  for(const plazo in getPlazos){
    console.log(getPlazos)
  }


  const plazoElement = `
  <tr>
  <td>$107.561,644</td>
  <td>$7.561,644</td>
  <td>1 Mes</td>
  <td>11 JUL 2023</td>
  <td>14 AGO 2023</td>
  <td><button>agregar</button></td>
</tr>`
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
