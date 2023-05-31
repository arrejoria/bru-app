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
const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const fechaFormateada = fechaHoy.toLocaleDateString('es-ES', opcionesFecha);

console.log(fechaFormateada); 
// Escuchar el evento change en el select timePeriod
const timePeriod = document.querySelector('select[name="timePeriod"]');
const montoEl = document.querySelector('input[name="amount"]');

let periodId = 0;
let monto = 0;

document.addEventListener('DOMContentLoaded', calcularIntereses(Number(montoEl.value), Number(timePeriod.value)))
montoEl.addEventListener("input", (e) => {
  handleAmount();
});

timePeriod.addEventListener("change", () => {
  console.dir("change");
  handleTimePeriod();
});

function handleAmount() {
  monto = Number(montoEl.value);
  periodId = Number(timePeriod.value);
  console.log("handle amount", typeof monto, monto);
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

  console.log("plazo:", plazo, "monto:", monto, "interes:", interes);
  data.montoInicial = '$ ' + monto.toLocaleString('es-AR');
  data.interesesGanados = '$ ' + interesesGanados.toLocaleString('es-AR');
  data.netoACobrar = '$ ' + intereses.toLocaleString('es-AR');
  data.periodoRenovacion = plazo === 30 ? plazo / 30 + ' mes' : plazo / 30 + ' meses'
  data.tna = interes * 100 + '%'
  data.tea = clasicoPesos.tea[periodId] + '%'
  console.log(data);

  handleResults(data);
}

function handleResults(data) {
    const resultList = document.querySelectorAll(".result__item");
    console.log(data)
      Object.entries(data).forEach(([clave, valor], index) => {
        console.log(clave, valor, index)
        resultList[index].children[1].textContent = valor
    });
  }
