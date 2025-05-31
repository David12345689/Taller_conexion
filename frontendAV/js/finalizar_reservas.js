class ReservaActiva {
  constructor({ id, cliente_id, vehiculo_id, fecha_inicio, fecha_fin, estado }) {
    this.id           = id;
    this.cliente_id   = cliente_id;
    this.vehiculo_id  = vehiculo_id;
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin    = fecha_fin;
    this.estado       = estado;
  }

  generarFilaHTML(clienteNombre, vehiculoModelo) {
    return `
      <tr>
        <td>${this.id}</td>
        <td>${clienteNombre}</td>
        <td>${vehiculoModelo}</td>
        <td>${this.fecha_inicio} → ${this.fecha_fin}</td>
        <td>${this.estado}</td>
        <td><button data-id="${this.id}" class="btn-finalizar">Finalizar</button></td>
      </tr>
    `;
  }
}

class GestorFinalizarReservas {
  constructor(apiUrl, tbodyId, mensajeId) {
    this.apiUrl        = apiUrl;
    this.tbody         = document.getElementById(tbodyId);
    this.mensajeDiv    = document.getElementById(mensajeId);
    this.clientesMap   = {};
    this.vehiculosMap  = {};
    this.reservasActivas = [];
  }

  async cargarClientesVehiculos() {
    try {
      const [resC, resV] = await Promise.all([
        fetch("http://localhost:8000/api/clientes"),
        fetch("http://localhost:8000/api/vehiculos")
      ]);
      if (!resC.ok || !resV.ok) throw new Error("Error cargando datos");
      const clientesData  = await resC.json();
      const vehiculosData = await resV.json();
      
      clientesData.forEach(c => { this.clientesMap[c.id] = c.nombre; });
      vehiculosData.forEach(v => { this.vehiculosMap[v.id] = `${v.marca} ${v.modelo}`; });
    } catch (err) {
      console.error("cargarClientesVehiculos:", err);
      this.clientesMap  = {};
      this.vehiculosMap = {};
    }
  }

  async cargarReservasActivas() {
    try {
      const resp     = await fetch(this.apiUrl);
      if (!resp.ok) throw new Error("Error cargando reservas");
      const datos    = await resp.json();
      this.reservasActivas = datos
        .filter(r => r.estado && r.estado.toLowerCase().trim() === "activa")
        .map(r => new ReservaActiva(r));
    } catch (err) {
      console.error("cargarReservasActivas:", err);
      this.reservasActivas = [];
    }
  }

  mostrarReservas() {
    this.tbody.innerHTML = "";
    this.reservasActivas.forEach(r => {
      const cNombre = this.clientesMap[r.cliente_id] || "Desconocido";
      const vModelo = this.vehiculosMap[r.vehiculo_id] || "Desconocido";
      this.tbody.innerHTML += r.generarFilaHTML(cNombre, vModelo);
    });
    if (this.reservasActivas.length === 0) {
      const colspan = 6;
      this.tbody.innerHTML = `
        <tr>
          <td colspan="${colspan}" style="text-align:center; padding:1em;">
            No hay reservas activas.
          </td>
        </tr>
      `;
    }
  }

  async finalizarReserva(id) {
    try {
      const resp = await fetch(`${this.apiUrl}/${id}/finalizar`, {
        method: "PUT",
        headers: { Accept: "application/json" }
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.mensaje || "Error");
      this.mensajeDiv.textContent = "✅ " + data.mensaje;
      
      await this.refrescar();
    } catch (err) {
      console.error("finalizarReserva:", err);
      this.mensajeDiv.textContent = "❌ No se pudo finalizar la reserva.";
    }
  }

  iniciarEventos() {
    this.tbody.addEventListener("click", e => {
      if (e.target.classList.contains("btn-finalizar")) {
        const id = e.target.getAttribute("data-id");
        if (confirm("¿Deseas finalizar esta reserva?")) {
          this.finalizarReserva(id);
        }
      }
    });
  }

  async refrescar() {
    await this.cargarClientesVehiculos();
    await this.cargarReservasActivas();
    this.mostrarReservas();
  }

  async iniciar() {
    await this.refrescar();
    this.iniciarEventos();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gestor = new GestorFinalizarReservas(
    "http://localhost:8000/api/reservas",
    "tabla-reservas",
    "mensaje"
  );
  gestor.iniciar();
});