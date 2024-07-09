// Funcionalidad conversor de monedas
document
.querySelector("#exchangeBtn")
.addEventListener("click", async () => {
// las variables declaradas dentro de la funcion, para que tome los datos
// dentro del input al momento de hacer click en el boton
    const inputAmount = parseFloat(document.querySelector("#currencyInput").value);
    const exchangeAmount = document.querySelector("#currencySelector").value;
    const resultAmount = document.querySelector(".result");

//Condicional si el input esta vacio
    if (!inputAmount) {
      resultAmount.innerHTML = 'Por favor ingrese la cantidad CLP que desea convertir.';
      return;
    }

// operador try - catch, usando la base de datos proporcionda
    try {
      const response = await fetch('https://mindicador.cl/api/');
      const data = await response.json();

      let exchangeRate;

      if (exchangeAmount === 'dolar') {
        exchangeRate = data.dolar.valor;
      } else if (exchangeAmount === 'euro') {
        exchangeRate = data.euro.valor;
      }

// formato para que el resultado tenga solo 2 decimales
      const convertedAmount = (inputAmount / exchangeRate).toFixed(2);
      resultAmount.innerHTML = `<strong>${convertedAmount} ${exchangeAmount}</strong>.`;

// Fetch de los valores historicos para graficas
    const historicalResponse = await fetch(`https://mindicador.cl/api/${exchangeAmount}`);
    const historicalData = await historicalResponse.json();
// ultimos 10 dias
    const chartData = historicalData.serie.slice(-10); 

    const days = chartData.map(day => day.fecha);
    const values = chartData.map(day => day.valor);

// Chart.js 
    const ctx = document.querySelector("#currencyChart").getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{
          label: `Valor de ${exchangeAmount} en los ultimos 10 dias`,
          data: values,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'black',
            },
            ticks: {
              color: 'white', 
            }
          },
          y: {
            grid: {
              color: 'black',
            },
            ticks: {
              color: 'white',
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: 'white' 
            }
          }
        }
      }
    });


    } catch (error) {
      resultAmount.innerHTML = '<span style="color: red;">Surgió un error inesperado</span>';
    }
  });