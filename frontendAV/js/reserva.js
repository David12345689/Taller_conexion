class Reserva {
  constructor({ cliente_id, vehiculo_id, fecha_inicio, fecha_fin }) {
    this.cliente_id  = parseInt(cliente_id);
    this.vehiculo_id = parseInt(vehiculo_id);
    this.fecha_inicio = fecha_inicio;
    this.fecha_fin    = fecha_fin;
    this.estado       = "activa";
  }
}

class GestorReservas {
  constructor() {
    this.apiURL          = "http://localhost:8000/api/reservas";
    this.formulario      = document.getElementById("formulario");
    this.clienteSelect   = document.getElementById("cliente_id");
    this.vehiculoSelect  = document.getElementById("vehiculo_id");
    this.inputFechaInicio = document.getElementById("fecha_inicio");
    this.inputFechaFin    = document.getElementById("fecha_fin");
    this.mensajeDiv      = document.getElementById("mensaje");
  }

  async cargarClientes() {
    try {
      const resp = await fetch("http://localhost:8000/api/clientes");
      if (!resp.ok) throw new Error("Error cargando clientes");
      return await resp.json();
    } catch (err) {
      console.error("cargarClientes:", err);
      return [];
    }
  }

  async cargarVehiculosDisponibles() {
    try {
      const resp = await fetch("http://localhost:8000/api/vehiculos");
      if (!resp.ok) throw new Error("Error cargando vehículos");
      const todos = await resp.json();
      return todos.filter(
        v => v.estado && v.estado.toLowerCase().trim() === "disponible"
      );
    } catch (err) {
      console.error("cargarVehiculosDisponibles:", err);
      return [];
    }
  }

  async llenarSelects() {
   
    this.clienteSelect.innerHTML  = "";
    this.vehiculoSelect.innerHTML = "";

    const clientes  = await this.cargarClientes();
    const vehiculos = await this.cargarVehiculosDisponibles();

    if (clientes.length === 0) {
      this.clienteSelect.innerHTML = `<option value="">No hay clientes</option>`;
    } else {
      this.clienteSelect.innerHTML = clientes
        .map(c => `<option value="${c.id}">${c.nombre}</option>`)
        .join("");
    }

    if (vehiculos.length === 0) {
      this.vehiculoSelect.innerHTML = `<option value="">No hay vehículos disponibles</option>`;
    } else {
      this.vehiculoSelect.innerHTML = vehiculos
        .map(v => `<option value="${v.id}">${v.marca} ${v.modelo}</option>`)
        .join("");
    }
  }

  async guardarReserva(evt) {
    evt.preventDefault();
    const nueva = new Reserva({
      cliente_id: this.clienteSelect.value,
      vehiculo_id: this.vehiculoSelect.value,
      fecha_inicio: this.inputFechaInicio.value,
      fecha_fin: this.inputFechaFin.value
    });

   
    if (
      !nueva.cliente_id || 
      !nueva.vehiculo_id || 
      !nueva.fecha_inicio || 
      !nueva.fecha_fin
    ) {
      this.mensajeDiv.textContent = "❌ Completa todos los campos.";
      return;
    }
    if (new Date(nueva.fecha_fin) < new Date(nueva.fecha_inicio)) {
      this.mensajeDiv.textContent = "❌ Fecha fin anterior a inicio.";
      return;
    }

    try {
      const resp = await fetch(this.apiURL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          "Accept": "application/json" 
        },
        body: JSON.stringify(nueva)
      });
      if (!resp.ok) throw new Error("Error al crear reserva");
      this.mensajeDiv.textContent = "✅ Reserva creada correctamente.";
      this.formulario.reset();
      
      await this.llenarSelects();
    } catch (err) {
      console.error("guardarReserva:", err);
      this.mensajeDiv.textContent = "❌ Ocurrió un error al crear la reserva.";
    }
  }

  async iniciar() {
    await this.llenarSelects();
    this.formulario.addEventListener("submit", e => this.guardarReserva(e));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gestor = new GestorReservas();
  gestor.iniciar();
});