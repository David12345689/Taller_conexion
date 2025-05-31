const tabla = document.querySelector("table");
const filtro = document.querySelector("select");

function cargarVehiculos() {
  fetch("http://localhost:8000/api/vehiculos")
    .then(res => res.json())
    .then(data => {
      let contador = 1;
      const estadoSeleccionado = filtro.value;

      tabla.innerHTML = `
        <tr>
          <th>ID</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Categoría</th>
          <th>Estado</th>
        </tr>
      `;

      data.forEach(vehiculo => {
        const estadoVehiculo = vehiculo.estado?.toLowerCase().trim();
        const estadoFiltro = estadoSeleccionado.toLowerCase().trim();

        if (
          estadoFiltro === "todos" ||
          estadoVehiculo === estadoFiltro
        ) {
          tabla.innerHTML += `
            <tr>
              <td>${contador++}</td>
              <td>${vehiculo.marca}</td>
              <td>${vehiculo.modelo}</td>
              <td>${vehiculo.anio}</td>
              <td>${vehiculo.categoria}</td>
              <td>${vehiculo.estado}</td>
            </tr>
          `;
        }
      });
    })
    .catch(() => {
      tabla.innerHTML = `<tr><td colspan="6">❌ Error al cargar vehículos</td></tr>`;
    });
}

filtro.addEventListener("change", cargarVehiculos);
document.addEventListener("DOMContentLoaded", cargarVehiculos);
