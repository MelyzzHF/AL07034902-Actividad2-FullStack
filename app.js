const lista = document.getElementById("listaTarea");

class Tarea {
    constructor(nombre, id = Date.now(), completa = false) {
        this.id = id;
        this.nombre = nombre;
        this.completa = completa;
    }

    toggleCompletada() {
        this.completa = !this.completa;
    }

    editarNombre(nuevoNombre) {
        this.nombre = nuevoNombre;
    }

}

class GestorDeTareas {
    constructor() {
        const guardadas = JSON.parse(localStorage.getItem("mis_tareas")) || [];
        this.tareas = guardadas.map(t => new Tarea(t.nombre, t.id, t.completa));
        this.render();
    }

    guardar() {
        localStorage.setItem("mis_tareas", JSON.stringify(this.tareas));
    }

    agregarTarea(nombre) {
        if (nombre.trim() === "")
            return;
        const nuevaTarea = new Tarea(nombre);
        this.tareas.push(nuevaTarea);
        this.guardar();
        this.render();

    }
    eliminarTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.guardar();
        this.render();
    }
    editarTarea(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            const nuevoNombre = prompt("Edita la tarea:", tarea.nombre);
            if (nuevoNombre && nuevoNombre.trim() !== "") {
                tarea.editarNombre(nuevoNombre);
                this.guardar();
                this.render();
            }
        }
    }
    cambiarEstado(id) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.toggleCompletada();
            this.guardar();
            this.render();
        }
    }

    obtenerTodos() {
        return this.tareas;
    }


    // funcion que realiza el proceso que se muestra
    render() {
        lista.innerHTML = '';

        this.tareas.forEach(tarea => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="task-content">
                    <input type="checkbox" class="check-tarea" ${tarea.completa ? 'checked' : ''}>
                    <span class="${tarea.completa ? 'completada' : ''}">
                        ${tarea.nombre}
                    </span>
                </div>
                <div class="actions">
                    <button class="edit-btn">Editar</button>
                    <button class="delete-btn">Eliminar</button>
                </div>
            `;

            // el checkbox al cambiar se actualiza el estado
            li.querySelector('.check-tarea').onchange = () => this.cambiarEstado(tarea.id);
            li.querySelector('.edit-btn').onclick = () => this.editarTarea(tarea.id);
            li.querySelector('.delete-btn').onclick = () => this.eliminarTarea(tarea.id);

            lista.appendChild(li);
        });
    }
}


const gestor = new GestorDeTareas();
document.getElementById('btnTarea').onclick = () => {
    const input = document.getElementById('nuevaTarea');
    const mensaje = document.getElementById('mensajeError');
    const valor = input.value.trim();

    if (valor === "") {
        mensaje.textContent = "Escribe una tarea válida";
        return;
    }
    mensaje.textContent = "";

    gestor.agregarTarea(input.value);
    input.value = '';
};

