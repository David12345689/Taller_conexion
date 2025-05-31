class VehiculoMant {
  constructor({ id, marca, modelo, anio, categoria, estado }) {
    this.id        = id;
    this.marca     = marca;
    this.modelo    = modelo;
    this.anio      = anio;
    this.categoria = categoria;
    this.estado    = estado;
  }

  generarFilaHTML() {
    return `
      <tr>
        <td>${this.id}</td>
        <td>${this.marca}</td>
        <td>${this.modelo}</td>
        <td>${this.anio}</td>
        <td>${this.categoria}</td>
        <td>${this.estado}</td>
        <td><button data-id="${this.id}" class="btn-reparar">Reparar</button></td>
      </tr>
    `;
  }
}

class GestorRepararVehiculos {
  constructor(apiUrl, tbodyId) {
    this.apiUrl = apiUrl;
    this.tbody  = document.getElementById(tbodyId);
    this.vehiculosMant = [];
  }

  async cargarVehiculosMant() {
    try {
      const resp = await fetch(this.apiUrl);
      if (!resp.ok) throw new Error("Error cargando vehículos");
      const todos = await resp.json();
      
      this.vehiculosMant = todos
        .filter(v => v.estado && v.estado.toLowerCase().trim() === "mantenimiento")
        .map(v => new VehiculoMant(v));
    } catch (err) {
      console.error("cargarVehiculosMant:", err);
      this.vehiculosMant = [];
    }
  }

  mostrarVehiculosMant() {
    this.tbody.innerHTML = "";
    this.vehiculosMant.forEach(v => {
      this.tbody.innerHTML += v.generarFilaHTML();
    });
    if (this.vehiculosMant.length === 0) {
      const colspan = 7;
      this.tbody.innerHTML = `
        <tr>
          <td colspan="${colspan}" style="text-align:center; padding:1em;">
            No hay vehículos en mantenimiento.
          </td>
        </tr>
      `;
    }
  }

  async repararVehiculo(id) {
    try {
      const resp = await fetch(`${this.apiUrl}/${id}/reparar`, {
        method: "PUT",
        headers: { Accept: "application/json" }
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.mensaje || "Error");
      alert("✅ " + data.mensaje);
      await this.refrescar();
    } catch (err) {
      console.error("repararVehiculo:", err);
      alert("❌ No se pudo reparar el vehículo.");
    }
  }

  iniciarEventos() {
    this.tbody.addEventListener("click", e => {
      if (e.target.classList.contains("btn-reparar")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Quieres reparar este vehículo?")) {
          this.repararVehiculo(id);
        }
      }
    });
  }

  async refrescar() {
    await this.cargarVehiculosMant();
    this.mostrarVehiculosMant();
  }

  async iniciar() {
    await this.refrescar();
    this.iniciarEventos();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gestor = new GestorRepararVehiculos(
    "http://localhost:8000/api/vehiculos",
    "tabla-vehiculos-mant"
  );
  gestor.iniciar();
});