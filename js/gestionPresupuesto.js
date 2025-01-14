// TODO: Crear las funciones, objetos y variables indicadas en el enunciado
"use strict";
// TODO: Variable global
let presupuesto = 0;
let gastos = [];
let idGasto = 0;
////
function actualizarPresupuesto(valor) {
    if(valor >= 0 && typeof valor === 'number')
    {
        presupuesto = valor;
        return presupuesto;
    }
    else{
        console.log("Error! Es un valor negativo");
        return -1;
    }
}

function mostrarPresupuesto() {
    return(`Tu presupuesto actual es de ${presupuesto} €`);
}

function CrearGasto(descripcion, valor, fecha=Date.now() , ...etiquetas) { //Función constructora, tiene que empezar por mayus
    this.descripcion = descripcion;
    this.fecha = new Date();
    this.etiquetas = [...etiquetas];
    if(valor >= 0 && typeof valor === 'number'){
        this.valor = valor;
    }
    else{
        this.valor = 0;
    }
    if(typeof fecha === 'string' && !isNaN(Date.parse(fecha))){
        this.fecha = Date.parse(fecha);
    }
    else{
        this.fecha = Date.now();
    }
    //Métodos:
    this.mostrarGasto = function(){
        return(`Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €`);
    },
    this.actualizarDescripcion = function(descripcionActualizada){
        if(typeof descripcionActualizada === 'string'){
            this.descripcion = descripcionActualizada;
        }
    },
    this.actualizarValor = function(valorActualizado){
        if( valorActualizado >= 0 && typeof  valorActualizado === 'number'){
            this.valor = valorActualizado;
        }
    },

    this.mostrarGastoCompleto = function(){
        let res = `Gasto correspondiente a ${this.descripcion} con valor ${this.valor} €.\nFecha: ${new Date(this.fecha).toLocaleString()}\nEtiquetas:\n`;
        for(let i = 0; i < this.etiquetas.length; i++){
            res += "- " + this.etiquetas[i]+`\n`;
        }
        return res;
    },
    this.actualizarFecha = function(nueva_fecha){
        if(typeof nueva_fecha === 'string' && !isNaN(Date.parse(nueva_fecha))){
            this.fecha = Date.parse(nueva_fecha);
        }
    },
    this.anyadirEtiquetas = function(...nueva_etiqueta){
        nueva_etiqueta.forEach(element => {
            if(!this.etiquetas.includes(element)){
                this.etiquetas.push(element);
            }
        });
    },
    this.borrarEtiquetas = function( ...etiqueta_borrada){
        etiqueta_borrada.forEach(element =>{
            if(this.etiquetas.includes(element)){
                this.etiquetas.splice(this.etiquetas.indexOf(element), 1)
            }
        });
    },
    this.obtenerPeriodoAgrupacion = function(periodo){
        let fecha = new Date(this.fecha);
        if(periodo === 'Dia' || periodo === 'dia' || periodo === 'DIA'){
           return fecha.toISOString().substring(0, 10);
        }
        if(periodo === 'Mes' || periodo === 'mes' || periodo === 'MES'){
            return fecha.toISOString().substring(0, 7);
        }
        if(periodo === 'AÑO' || periodo === 'Año' || periodo === 'ANYO' || periodo === 'anyo'){
            return fecha.toISOString().substring(0, 4);
        }
    }
}

function listarGastos(){
    return gastos;
};
function anyadirGasto(gasto){
    gasto.id = idGasto; //También puedes hacer gasto[id] = idGasto
    idGasto++;
    gastos.push(gasto);
};
function borrarGasto(id){
    for(let i = 0; i < gastos.length; i++){
        if(gastos[i].id === id){
            gastos.splice(i, 1);
        }
    }
};
function calcularTotalGastos(){
    let total_gasto = 0;
    gastos.forEach(gasto => {
        total_gasto = total_gasto + gasto.valor;
    });
    return total_gasto;
};
function calcularBalance(){
    return presupuesto - calcularTotalGastos();
};
function filtrarGastos({fechaDesde, 
    fechaHasta, 
    valorMinimo, 
    valorMaximo, 
    descripcionContiene, 
    etiquetasTiene}){
    
    let arrayFiltrado = gastos.filter(function(gasto){
        let contain = true;
        if(fechaDesde)
        {
            if(gasto.fecha < Date.parse(fechaDesde)){
                contain = false;
            }
        }
        if(fechaHasta)
        {
            if(gasto.fecha > Date.parse(fechaHasta)){
                contain = false;
            }   
        }
        if(valorMinimo)
        {
            if(gasto.valor < valorMinimo){
                contain = false;
            } 
        }
        if(valorMaximo)
        {
            if(gasto.valor > valorMaximo){
                contain = false;
            }
        }
        if(descripcionContiene)
        {
            if(!gasto.descripcion.includes(descripcionContiene)){
                contain = false;
            }
        }
        if(etiquetasTiene)
        {
            let contain2 = false;                   
            for (let i = 0; i < gasto.etiquetas.length; i++) 
            {                   
                for (let j = 0; j < etiquetasTiene.length; j++) 
                {
                    if(gasto.etiquetas[i] == etiquetasTiene[j]){
                        contain2 = true; 
                    }                  
                }
            }
            if(contain2 == false){
                contain = false;
            }
        }
        return contain;
    });
    return arrayFiltrado;  
};
function agruparGastos(periodo, etiquetasTiene, fechaDesde, fechaHasta)
{   let filtro, agrupacion;
    filtro = filtrarGastos({fechaDesde, fechaHasta, etiquetasTiene});

    agrupacion = filtro.reduce(function(acc, gasto) {
        acc[gasto.obtenerPeriodoAgrupacion(periodo)] = (acc[gasto.obtenerPeriodoAgrupacion(periodo)] || 0) + gasto.valor;
        return acc;
    },{});
    return agrupacion;
};
function transformarListadoEtiquetas(etiquetasTiene){
    let etiquetas = etiquetasTiene.match(/[a-z0-9]+/gi);
    return etiquetas;
};
function cargarGastos(gastosAlmacenamiento) {
    // gastosAlmacenamiento es un array de objetos "planos"
    // No tienen acceso a los métodos creados con "CrearGasto":
    // "anyadirEtiquetas", "actualizarValor",...
    // Solo tienen guardadas sus propiedades: descripcion, valor, fecha y etiquetas
  
    // Reseteamos la variable global "gastos"
    gastos = [];
    // Procesamos cada gasto del listado pasado a la función
    for (let g of gastosAlmacenamiento) {
        // Creamos un nuevo objeto mediante el constructor
        // Este objeto tiene acceso a los métodos "anyadirEtiquetas", "actualizarValor",...
        // Pero sus propiedades (descripcion, valor, fecha y etiquetas) están sin asignar
        let gastoRehidratado = new CrearGasto();
        // Copiamos los datos del objeto guardado en el almacenamiento
        // al gasto rehidratado
        // https://es.javascript.info/object-copy#cloning-and-merging-object-assign
        Object.assign(gastoRehidratado, g);
        // Ahora "gastoRehidratado" tiene las propiedades del gasto
        // almacenado y además tiene acceso a los métodos de "CrearGasto"
          
        // Añadimos el gasto rehidratado a "gastos"
        gastos.push(gastoRehidratado)
    }
}
    

// NO MODIFICAR A PARTIR DE AQUÍ: exportación de funciones y objetos creados para poder ejecutar los tests.
// Las funciones y objetos deben tener los nombres que se indican en el enunciado
// Si al obtener el código de una práctica se genera un conflicto, por favor incluye todo el código que aparece aquí debajo
export   {
    mostrarPresupuesto,
    actualizarPresupuesto,
    CrearGasto,
    listarGastos,
    anyadirGasto,
    borrarGasto,
    calcularTotalGastos,
    calcularBalance,
    filtrarGastos,
    agruparGastos,
    transformarListadoEtiquetas,
    cargarGastos
}
