const tabla = document.getElementById("tabla-reservas");
const mensaje = document.getElementById("mensaje");

let clientes = {};
let vehiculos = {};

Promise.all([
  fetch("http://localhost:8000/api/clientes").then(res => res.json()),
  fetch("http://localhost:8000/api/vehiculos").then(res => res.json())
]).then(([clientesData, vehiculosData]) => {
  clientesData.forEach(c => clientes[c.id] = c.nombre);
  vehiculosData.forEach(v => vehiculos[v.id] = `${v.marca} ${v.modelo}`);

  cargarReservasActivas();
});

function cargarReservasActivas() {
  fetch("http://localhost:8000/api/reservas")
    .then(res => res.json())
    .then(reservas => {
      tabla.innerHTML = "";
      reservas.filter(r => r.estado?.trim().toLowerCase() === "activa")
        .forEach(r => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${r.id}</td>
            <td>${clientes[r.cliente_id] || r.cliente_id}</td>
            <td>${vehiculos[r.vehiculo_id] || r.vehiculo_id}</td>
            <td>${r.fecha_inicio} → ${r.fecha_fin}</td>
            <td>${r.estado}</td>
            <td><button onclick="finalizarReserva(${r.id})">Finalizar</button></td>
          `;
          tabla.appendChild(fila);
        });
    });
}

function finalizarReserva(id) {
  fetch(`http://localhost:8000/api/reservas/${id}/finalizar`, {
    method: "PUT",
    headers: {
      "Accept": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      mensaje.textContent = "✅ " + data.mensaje;
      setTimeout(() => location.reload(), 1000);
    })
    .catch(err => {
      console.error(err);
      mensaje.textContent = "❌ Error al finalizar la reserva.";
    });
}