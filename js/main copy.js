$(document).ready(function () {});
console.log("JS Loaded");
// My Javascript vanilla code starts here

// Variables
const plazoData = {
  clasicoPesos: {
    dias: [31, 60, 90, 180, 360],
    tna: [0.92, 0.92, 0.94, 0.97, 1.0],
    tea: [142.7, 135.5, 132.9, 120.9, 100],
  },
  dataResult: {
    montoInicial: {},
    interesesGanados: {},
    netoACobrar: {},
    periodoRenovacion: {},
    tna: {},
    tea: {},
    fechaInicio: ''
  },
  objPlazo: {},
};
const { clasicoPesos, dataResult, plazo } = plazoData;
const localeObj = {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

const bruSubmit = document.getElementById("bruSubmit");
const montoInp = document.querySelector('input[name="amount"]');
const timePeriod = document.querySelector('select[name="timePeriod"]');
const resultItems = document.querySelectorAll(".result__item");

// const getPeriod = timePeriod?Array.from(timePeriod.children).slice(1).map( (el) => {
//    return el.dataset.placeholder
// }) : null

let monto, periodId;

// Handling Events
bruSubmit.addEventListener("click", () => {
  console.log("Calculando intereses ganados");

  verifyInterest();
  storageResults()
});

document.addEventListener("DOMContentLoaded", () => {
  const fieldValidity = new checkValidity("#validity");
  verifyInterest();
  storageResults();
});

montoInp.addEventListener("input", (e) => {
  let inpValue = e.target.value;
  montoInp.value = formatAmount(inpValue);
});

// BruApp functions
class checkValidity {
  isValid = false;
  constructor(el, status) {
    this.el = document.querySelector(el);
  }

  thisFunc() {
    console.log(this);
  }
}

function verifyInterest() {
  monto = parseFloat(montoInp.value.replace(/\./g, ""));
  periodId = timePeriod.value;

  const interes = clasicoPesos.tna[periodId];
  const plazo = clasicoPesos.dias[periodId];
  const intereses = monto * interes * (plazo / 365);
  const interesesGanados = monto + intereses;
  const fechaActual = new Date();
  const fechaFormateada = fechaActual.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  dataResult.montoInicial = `${monto.toLocaleString("es-AR", localeObj)}`;
  dataResult.interesesGanados = `${interesesGanados.toLocaleString(
    "es-AR",
    localeObj
  )}`;
  dataResult.netoACobrar = `${intereses.toLocaleString("es-AR", localeObj)}`;
  dataResult.periodoRenovacion = plazo === 31 ? "1 mes" : `${plazo / 30} meses`;
  dataResult.tna = `${interes * 100}%`;
  dataResult.tea = `${clasicoPesos.tea[periodId]}%`;


  // dataResult.fechaInicio = fechaFormateada;

  setResults(dataResult, resultItems);
  // console.log(`INTERES: ${interes} / PLAZO: ${plazo} / MONTO: ${monto} / intereses: ${intereses} / intGanados: ${interesesGanados}`)
}
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

function setResults(obj, element) {
  Object.entries(obj).forEach(([clave, valor], index) => {
    
    return (element[index].children[1].textContent = valor);
  });
}

function storageResults() {
  // console.log(dataResult)
  //  localStorage.setItem('results', datos)
  const { montoInicial, interesesGanados, periodoRenovacion, fechaInicio } = dataResult;

  objPlazo = {
    monto: montoInicial,
    intereses: interesesGanados,
    periodo: periodoRenovacion,
    inicio: fechaInicio,
    finaliza: fechaInicio + 31,
  };

  console.log(objPlazo);
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
