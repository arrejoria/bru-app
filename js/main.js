$(document).ready(function () {});

// My Javascript vanilla code starts here

// function obtenerCantidadDiasMes(mes, año) {
//   const ultimoDiaMes = new Date(año, mes, 0).getDate();
//   return ultimoDiaMes;
// }

// // Ejemplo de uso
// const mesSeleccionado = 1; // Mes 2 (febrero)
// const añoActual = new Date().getFullYear(); // Obtener el año actual
// const cantidadDias = obtenerCantidadDiasMes(mesSeleccionado, añoActual);
// //
// const fechaHoy = new Date();
// const opcionesFecha = {
//   weekday: "long",
//   year: "numeric",
//   month: "long",
//   day: "numeric",
// };
// const fechaFormateada = fechaHoy.toLocaleDateString("es-ES", opcionesFecha);

// My Javascript vanilla code starts here
const brubankinteress = {
  clasicoPesos: {
    dias: [30, 60, 90, 180, 360],
    tna: [0.92, 0.92, 0.94, 0.97, 1.0],
    tea: [142.7, 135.5, 132.9, 120.9, 100],
  },
  data: {
    montoInicial: {},
    interesesGanados: {},
    netoACobrar: {},
    periodoRenovacion: {},
    tna: {},
    tea: {},
  },
};

const { clasicoPesos, data } = brubankinteress;
const localeObj = {
  style: "decimal",
};

const montoInp = document.querySelector('input[name="amount"]');
const timePeriod = document.querySelector('select[name="timePeriod"]');

let periodId = 0;
let monto = 100000;

function initialize() {
  montoInp.addEventListener("input", handleAmount);
  timePeriod.addEventListener("change", handleTimePeriod);
  calcularIntereses();
}

function handleAmount(e) {
  let num = e.target.value.replace(/\./g, "");
  if (typeof num !== "string") {
    return (num = "");
  }

  switch (num.length) {
    case 8:
      num = `${num.slice(0, -6)}.${num.slice(-6, -3)}.${num.slice(-3)}`;
      break;
    case 7:
      num = `${num.slice(0, -6)}.${num.slice(-6, -3)}.${num.slice(-3)}`;
      break;
    case 6:
      num = `${num.slice(0, 3)}.${num.slice(3)}`;
      break;
    case 5:
      num = `${num.slice(0, 2)}.${num.slice(2)}`;
      break;
    case 4:
      num = `${num.slice(0, 1)}.${num.slice(1)}`;
      break;
    default:
      console.warn(
        "Cuidado el monto a invertir excede o es menor a la cantidad permitida"
      );
  }

  monto = num.replace(/\./g, "");
  if (monto > 10000000) {
    monto = 10000000;
    num = "10.000.000";
  }

  if (monto < 1000) {
    monto = 1000;
    num = "1.000";
  }
  montoInp.value = num;
  calcularIntereses();
}

function handleTimePeriod(e) {
  periodId = e.target.value;
  calcularIntereses();
}

function calcularIntereses() {
  const interes = clasicoPesos.tna[periodId];
  const plazo = clasicoPesos.dias[periodId];
  const intereses = parseFloat(monto) * interes * (plazo / 365);
  const interesesGanados = parseFloat(monto) + intereses;

  data.montoInicial = `$ ${monto.toLocaleString("es-AR")}`;
  data.interesesGanados = `$ ${interesesGanados.toLocaleString("es-AR")}`;
  data.netoACobrar = `$ ${intereses.toLocaleString("es-AR", localeObj)}`;
  data.periodoRenovacion = plazo === 30 ? "1 mes" : `${plazo / 30} meses`;
  data.tna = `${interes * 100}%`;
  data.tea = `${clasicoPesos.tea[periodId]}%`;

  handleResults(data);
}

function handleResults(data) {
  const resultList = document.querySelectorAll(".result__item");
  Object.entries(data).forEach(([clave, valor], index) => {
    resultList[index].children[1].textContent = valor;
  });
}

document.addEventListener("DOMContentLoaded", initialize);

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

  setTimeout(()=>{
    questionSign.classList.add(
      "question__sign-visible",
      "question__sign-animation"
    );
      appWord.classList.add("word-2-animation", 'word-2-visible');
    
  },(time - 3) * 1000)

  // Carga screen laoding animation 4 seg posterior a la animacion de screen words
  setTimeout(function () {
    screenLoading.classList.add("screen-animation");

    // Oculta screen laoding 1.5 seg posterior a la animacion
    setTimeout(() => {
      const mainImg = document.querySelector('.main__image img')

      mainImg.classList.add('main__image-animation')
      screenLoading.style.display = "none";
    }, 1000); // Ajusta el tiempo de espera para que coincida con la duración de la animación (1.5 segundos en este caso)
  }, time * 1000);
}
document.addEventListener('DOMContentLoaded', initAnimations())
function initAnimations(){


}