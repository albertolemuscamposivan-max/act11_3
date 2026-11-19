
class LecturaBiologica {
    constructor(lote, temperatura) {
        this.lote = lote;
        this.temperatura = parseFloat(temperatura);
        this.estado = this.evaluarEstado();
        this.hora = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }

  
    evaluarEstado() {
        if (this.temperatura < 2 || this.temperatura > 8) {
            return "COMPROMETIDO";
        }
        return "ÓPTIMO";
    }
}


const inputLote = document.getElementById('loteVacuna');
const inputTemp = document.getElementById('tempActual');
const btnRegistrar = document.getElementById('btnRegistrarTemp');
const gridLecturas = document.getElementById('gridLecturas');

const CLAVE_STORAGE = 'cadenaFrioBiologicos';


let lecturas = JSON.parse(localStorage.getItem(CLAVE_STORAGE)) || [];

function guardarLecturas() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(lecturas));
}

function renderizarLecturas() {
    gridLecturas.innerHTML = '';

    lecturas.forEach((item, index) => {
        const esComprometido = item.estado === 'COMPROMETIDO';
        // Clase roja para COMPROMETIDO y verde para ÓPTIMO
        const claseBorde = esComprometido ? 'border-danger' : 'border-success';
        const claseBadge = esComprometido ? 'bg-danger' : 'bg-success';
        const claseTexto = esComprometido ? 'text-danger' : 'text-success';

        const tarjeta = document.createElement('div');
        tarjeta.className = 'col-md-6 mb-3';
        tarjeta.innerHTML = `
            <div class="card shadow-sm border-2 ${claseBorde} h-100">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0 fw-bold">Lote: ${item.lote}</h5>
                        <span class="badge ${claseBadge}">${item.estado}</span>
                    </div>
                    <p class="fs-3 fw-bold ${claseTexto} mb-2">${Number(item.temperatura).toFixed(1)} °C</p>
                    <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                        <small class="text-muted">Hora: ${item.hora || '--:--'}</small>
                        <button type="button" class="btn btn-sm btn-outline-danger" onclick="eliminarLectura(${index})">
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        `;
        gridLecturas.appendChild(tarjeta);
    });
}

btnRegistrar.addEventListener('click', () => {
    const lote = inputLote.value.trim();
    const temp = inputTemp.value.trim();

    if (!lote || temp === '' || Number.isNaN(parseFloat(temp))) {
        alert('Ingresa un código de lote válido y una temperatura.');
        return;
    }

    const nuevaLectura = new LecturaBiologica(lote, temp);
    lecturas.unshift(nuevaLectura);
    guardarLecturas();
    renderizarLecturas();

    inputLote.value = '';
    inputTemp.value = '';
    inputLote.focus();
});

function eliminarLectura(index) {
    lecturas.splice(index, 1);
    guardarLecturas();
    renderizarLecturas();
}


document.addEventListener('DOMContentLoaded', renderizarLecturas);