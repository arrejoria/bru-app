console.log("Js Vanilla Loaded");
$(document).ready(function () {
  console.log("JQuery Loaded");
});

// My Javascript vanilla code starts here

// function obtenerCantidadDiasMes(mes, año) {
//   const ultimoDiaMes = new Date(año, mes, 0).getDate();
//   return ultimoDiaMes;
// }

// // Ejemplo de uso
// const mesSeleccionado = 1; // Mes 2 (febrero)
// const añoActual = new Date().getFullYear(); // Obtener el año actual
// const cantidadDias = obtenerCantidadDiasMes(mesSeleccionado, añoActual);
// console.log(`El mes ${mesSeleccionado} tiene ${cantidadDias} días.`);

const brubankinteress = {
  clasicoPesos: {
    dias: [30, 60, 90, 180, 360],
    tna: [0.92, 0.92, 0.94, 0.97, 1.0],
    tea: [142.7, 135.5, 132.9, 120.9, 100],
  },
  data: {},
};
const { clasicoPesos, data } = brubankinteress;

const fechaHoy = new Date();
const opcionesFecha = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};
const fechaFormateada = fechaHoy.toLocaleDateString("es-ES", opcionesFecha);

// console.log(fechaFormateada);
// Escuchar el evento change en el select timePeriod
const timePeriod = document.querySelector('select[name="timePeriod"]');
const montoEl = document.querySelector('input[name="amount"]');

let periodId = 0;
let monto = 0;

document.addEventListener(
  "DOMContentLoaded",
  calcularIntereses(Number(montoEl.value), Number(timePeriod.value))
);
montoEl.addEventListener("input", (e) => {
  handleAmount();
});

timePeriod.addEventListener("change", () => {
  // console.dir("change");
  handleTimePeriod();
});

function handleAmount() {
  monto = Number(montoEl.value);
  periodId = Number(timePeriod.value);
  // console.log("handle amount", typeof monto, monto);
  calcularIntereses(monto, periodId);
}

function handleTimePeriod() {
  monto = Number(montoEl.value);
  periodId = Number(timePeriod.value);

  calcularIntereses(monto, periodId);
}

function calcularIntereses(monto, periodId) {
  const interes = clasicoPesos.tna[periodId];
  const plazo = clasicoPesos.dias[periodId];
  const intereses = monto * interes * (plazo / 365);
  const interesesGanados = monto + intereses;

  // console.log("plazo:", plazo, "monto:", monto, "interes:", interes);
  data.montoInicial = "$ " + monto.toLocaleString("es-AR");
  data.interesesGanados = "$ " + interesesGanados.toLocaleString("es-AR");
  data.netoACobrar = "$ " + intereses.toLocaleString("es-AR");
  data.periodoRenovacion =
    plazo === 30 ? plazo / 30 + " mes" : plazo / 30 + " meses";
  data.tna = interes * 100 + "%";
  data.tea = clasicoPesos.tea[periodId] + "%";
  // console.log(data);

  handleResults(data);
}

function handleResults(data) {
  const resultList = document.querySelectorAll(".result__item");
  // console.log(data)
  Object.entries(data).forEach(([clave, valor], index) => {
    // console.log(clave, valor, index)
    resultList[index].children[1].textContent = valor;
  });
}

var detects = {
  hasjquery: "jQuery" in window,
  itstuesday: function () {
    var d = new Date();
    return d.getDay() === 2;
  },
};
Modernizr.addTest(detects);

const screenLoading = document.querySelector(".screen__loading");
const screenWords = document.querySelectorAll(".animated-words");
let time = 4;

screenWords.forEach((word) => {
  word.style.setProperty("--scren-time", time + "s");
  word.style.setProperty("--load-words", "100%");
});

// Carga animacion de screen lette
setTimeout(() => {
  screenWords[0].classList.add("screen-text-animation");
  screenWords[1].classList.add("screen-text-animation");
}, (time - 1) * 1000);

// Carga screen laoding animation 4 seg posterior a la animacion de screen words
setTimeout(function () {
  screenLoading.classList.add("screen-animation");

  // Oculta screen laoding 1.5 seg posterior a la animacion
  setTimeout(() => {
    screenLoading.style.display = "none";
  }, 1000); // Ajusta el tiempo de espera para que coincida con la duración de la animación (1.5 segundos en este caso)
}, time * 1000);

try {
  console.log("trycatch");
} catch (error) {
  console.error(error);
}

const inpTest = document.getElementById("inpTest");

inpTest.addEventListener("change", (e) => {
  let value = "";
  value = e.target.value;
  const formattedValue = formatNumber(value);
  inpTest.value = formattedValue;
});

function formatNumber(value) {
  const number = parseInt(value);
  console.log(number);
  if (isNaN(number)) {
    return "";
  }
  return number.toLocaleString("es-AR", { style: "decimal", currency: "ARS" });
}

const numberParser = (value) =>
  parseFloat(value.replace(".", "").replace(",", "."));

const numberFormatter = (value) => {
  if (value == null || value === "") {
    return value;
  }
  return value?.toLocaleString();
};

const numero = 100100;
console.log(numero.indexOf())
const result = numberFormatter(num);
const result2 = numberParser(result);
console.log(result);
console.log(result2);

function parseText(num) {
  num = num.toString();
  switch (num.length) {
    case 8:
      console.log(num, "long. 8");
      break;
    case 7:
      console.log(num, "long. 7 con punto");
      break;
    case 6:
      num.splice('3','', '.')
      console.log(num, "long. 6");
      break;
    case 5:
      console.log(num, "long. 5");
      break;
    case 4:
      console.log(num, "long. 4");
      break;
    default:
      console.log('default case, la longitud es < 5 o > a 10')
  }
  console.log(num, typeof num);
}

function parseTextDot(num, length){
  num = num.toString()
  let numLength = num.length

}
parseText(100100);
