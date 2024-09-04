function calcularAmortizacion() {
    const monto = parseFloat(document.getElementById('monto').value);
    const tasaInteresAnual = parseFloat(document.getElementById('tasa').value) / 100;
    const periodos = parseInt(document.getElementById('periodos').value);
  
    if (isNaN(monto) || isNaN(tasaInteresAnual) || isNaN(periodos)) {
      alert("Por favor, ingrese valores válidos.");
      return;
    }
  
    const n = 12; // Pagos mensuales
    const tasaMensual = tasaInteresAnual / n;
    const cuota = monto * (tasaMensual * Math.pow(1 + tasaMensual, periodos)) / (Math.pow(1 + tasaMensual, periodos) - 1);
    
    let saldo = monto;
    let amortizaciones = [];
    let intereses = [];
    let saldos = [];
  
    const tbody = document.querySelector('#resultados tbody');
    tbody.innerHTML = ''; // Limpiar tabla
  
    for (let i = 1; i <= periodos; i++) {
      const interesPeriodo = saldo * tasaMensual;
      const amortizacion = cuota - interesPeriodo;
  
      intereses.push(interesPeriodo);
      amortizaciones.push(amortizacion);
      saldos.push(saldo);
  
      saldo -= amortizacion;
  
      const row = `<tr>
        <td>${i}</td>
        <td>${cuota.toFixed(2)}</td>
        <td>${interesPeriodo.toFixed(2)}</td>
        <td>${amortizacion.toFixed(2)}</td>
        <td>${saldo.toFixed(2)}</td>
      </tr>`;
      tbody.insertAdjacentHTML('beforeend', row);
    }
  
    const ctx = document.getElementById('grafico').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Array.from({ length: periodos }, (_, i) => i + 1),
        datasets: [
          {
            label: 'Amortización de Capital',
            data: amortizaciones,
            borderColor: 'blue',
            fill: false,
          },
          {
            label: 'Intereses',
            data: intereses,
            borderColor: 'red',
            fill: false,
          },
          {
            label: 'Saldo Remanente',
            data: saldos,
            borderColor: 'green',
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: { title: { display: true, text: 'Periodo' } },
          y: { title: { display: true, text: 'Monto' } }
        },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: function(context) {
                return `Valor: ${context.raw.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }
  