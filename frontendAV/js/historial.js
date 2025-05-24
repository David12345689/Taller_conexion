document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8000/api/reservas") 
    .then(response => response.json())
    .then(data => mostrarHistorial(data))
    .catch(error => console.error("Error al cargar historial:", error));
});

function mostrarHistorial(reservas) {
  const tbody = document.querySelector("#tablaHistorial tbody");
  tbody.innerHTML = "";

  reservas.forEach(reserva => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${reserva.id}</td>
      <td>${reserva.cliente_nombre || reserva.cliente?.nombre}</td>
      <td>${reserva.vehiculo_nombre || reserva.vehiculo?.marca + ' ' + reserva.vehiculo?.modelo}</td>
      <td>${reserva.fecha_inicio}</td>
      <td>${reserva.fecha_fin}</td>
      <td>${reserva.estado}</td>
    `;
    tbody.appendChild(fila);
  });
}
