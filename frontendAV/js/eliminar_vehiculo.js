document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("#tablaVehiculos tbody");

  function cargarVehiculos() {
    fetch("http://localhost:8000/api/vehiculos")
      .then(response => response.json())
      .then(vehiculos => {
        tabla.innerHTML = "";
        vehiculos.forEach(vehiculo => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${vehiculo.id}</td>
            <td>${vehiculo.marca}</td>
            <td>${vehiculo.modelo}</td>
            <td>${vehiculo.anio}</td>
            <td>${vehiculo.categoria}</td>
            <td>${vehiculo.estado}</td>
            <td><button data-id="${vehiculo.id}" class="eliminar">Eliminar</button></td>
          `;
          tabla.appendChild(fila);
        });
      });
  }

  tabla.addEventListener("click", e => {
    if (e.target.classList.contains("eliminar")) {
      const id = e.target.dataset.id;
      if (confirm("¿Estás seguro de que deseas eliminar este vehículo?")) {
        fetch(`http://localhost:8000/api/vehiculos/${id}`, {
          method: "DELETE",
          headers: { "Accept": "application/json" }
        })
          .then(res => res.json())
          .then(data => {
            alert(data.mensaje || "Vehículo eliminado correctamente.");
            cargarVehiculos();
          })
          .catch(err => alert("Error al eliminar el vehículo."));
      }
    }
  });

  cargarVehiculos();
});
