document.addEventListener("DOMContentLoaded", () => {
    fetch("")
 //fetch("http://localhost:8000/api/reservas?estado=activa")

    .then(response => response.json())
    .then(data => mostrarDevoluciones(data))
    .catch(error => console.error("Error al cargar devoluciones:", error));
});

function mostrarDevoluciones(reservas) {
  const tbody = document.querySelector("#tablaDevoluciones tbody");
  tbody.innerHTML = "";

  reservas.forEach(reserva => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${reserva.id}</td>
      <td>${reserva.cliente_nombre || reserva.cliente?.nombre}</td>
      <td>${reserva.vehiculo_nombre || reserva.vehiculo?.marca + " " + reserva.vehiculo?.modelo}</td>
      <td>${reserva.fecha_fin}</td>
      <td>${reserva.estado}</td>
      <td>
        <button onclick="marcarDevolucion(${reserva.id}, this)" ${reserva.estado !== 'activa' ? 'disabled' : ''}>
          Devolver
        </button>
      </td>
    `;
    tbody.appendChild(fila);
  });
}

function marcarDevolucion(idReserva, boton) {
  if (!confirm("¿Confirmas la devolución de este vehículo?")) return;
  fetch(`/${idReserva}/devolver`, {

  //fetch(`http://localhost:8000/api/reservas/${idReserva}/devolver`, {
    method: "PUT"
  })
    .then(res => res.json())
    .then(() => {
      boton.disabled = true;
      boton.textContent = "Devuelto";
      boton.closest("tr").querySelector("td:nth-child(5)").textContent = "completada";
    })
    .catch(error => {
      console.error("Error al devolver vehículo:", error);
      alert("Error al marcar devolución.");
    });
}
