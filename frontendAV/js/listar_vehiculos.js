class Vehiculo {
  constructor({ id, marca, modelo, anio, categoria, estado }) {
    this.id        = id;
    this.marca     = marca;
    this.modelo    = modelo;
    this.anio      = anio;
    this.categoria = categoria;
    this.estado    = estado;
  }

  generarFilaHTML(consecutivo) {
    return `
      <tr>
        <td>${consecutivo}</td>
        <td>${this.marca}</td>
        <td>${this.modelo}</td>
        <td>${this.anio}</td>
        <td>${this.categoria}</td>
        <td>${this.estado}</td>
      </tr>
    `;
  }
}

class GestorVehiculos {
  constructor(apiUrl, filtroId, tbodyId) {
    this.apiUrl = apiUrl;
    this.filtro = document.getElementById(filtroId);
    this.tbody  = document.getElementById(tbodyId);
    this.vehiculos = [];
  }

  async obtenerVehiculos() {
    try {
      const respuesta = await fetch(this.apiUrl);
      if (!respuesta.ok) throw new Error("Error al traer vehículos");
      const data = await respuesta.json();
      this.vehiculos = data.map(v => new Vehiculo(v));
    } catch (err) {
      console.error("obtenerVehiculos:", err);
      this.vehiculos = [];
    }
  }

  filtrarPorEstado(vehiculo) {
    const filtroVal = this.filtro.value.toLowerCase().trim();
    if (filtroVal === "todos") return true;
    return vehiculo.estado.toLowerCase().trim() === filtroVal;
  }

  mostrarVehiculos() {
    
    this.tbody.innerHTML = "";
    let contador = 1;
    this.vehiculos.forEach(v => {
      if (this.filtrarPorEstado(v)) {
        this.tbody.innerHTML += v.generarFilaHTML(contador);
        contador++;
      }
    });
    if (contador === 1) {
     
      const colspan = 6;
      this.tbody.innerHTML = `
        <tr>
          <td colspan="${colspan}" style="text-align:center; padding:1em;">
            No hay vehículos que mostrar.
          </td>
        </tr>
      `;
    }
  }

  iniciarEventos() {
    this.filtro.addEventListener("change", () => this.mostrarVehiculos());
  }

  async iniciar() {
    await this.obtenerVehiculos();
    this.iniciarEventos();
    this.mostrarVehiculos();
  }
}


document.addEventListener("DOMContentLoaded", () => {
 
  const gestor = new GestorVehiculos(
    "http://localhost:8000/api/vehiculos",
    "filtro",
    "tabla-vehiculos"
  );
  gestor.iniciar();
});