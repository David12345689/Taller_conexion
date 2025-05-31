document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.querySelector("#tablaVehiculos tbody");

  function cargarVehiculosMantenimiento() {
    fetch("http://localhost:8000/api/vehiculos")
      .then(response => response.json())
      .then(vehiculos => {
        tabla.innerHTML = "";

        vehiculos.forEach(vehiculo => {
          if (vehiculo.estado === "mantenimiento") {
            const fila = document.createElement("tr");

            fila.innerHTML = `
              <td>${vehiculo.id}</td>
              <td>${vehiculo.marca}</td>
              <td>${vehiculo.modelo}</td>
              <td>${vehiculo.anio}</td>
              <td>${vehiculo.categoria}</td>
              <td>${vehiculo.estado}</td>
              <td><button data-id="${vehiculo.id}">Reparar</button></td>
            `;

            tabla.appendChild(fila);
          }
        });
      })
      .catch(error => {
        console.error("Error al cargar los vehículos:", error);
        alert("No se pudieron cargar los vehículos.");
      });
  }

  tabla.addEventListener("click", e => {
    if (e.target.tagName === "BUTTON") {
      const id = e.target.getAttribute("data-id");

      fetch(`http://localhost:8000/api/vehiculos/${id}/reparar`, {
        method: "PUT",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          alert(data.mensaje);
          cargarVehiculosMantenimiento();
        })
        .catch(error => {
          console.error("Error al reparar el vehículo:", error);
          alert("No se pudo reparar el vehículo.");
        });
    }
  });

  cargarVehiculosMantenimiento();
});
