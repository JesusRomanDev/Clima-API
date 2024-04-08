//Hay 3 piezas importantes en este proyecto
//1-Formulario
//2-Div Resultado
//3-Container

const container = document.querySelector('.container'); //para mostrar los errores
const resultado = document.querySelector('#resultado'); //para mostrar el resultado
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=>{//es similar a document.addEventListener('DOMContentLoaded', )
    formulario.addEventListener('submit', buscarClima); //Cuando se cargue y le demos submit manda llamar esta funcion
})

function buscarClima(e){
    e.preventDefault();
    console.log('Buscando el Clima');

    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;
    console.log(ciudad);
    console.log(pais);
    
    if(ciudad === '' || pais === ''){
        //Hubo un error
        mostrarError('Ambos campos son obligatorios')
    }

    //Consultar la API
    consultarAPI(ciudad, pais);
}

function mostrarError(mensaje){
    const alerta = document.querySelector('.bg-red-100'); //la alerta de abajo NO ES QUE ESTEMOS REASIGNANDO EL VALOOOR DE LA CONSTANTE
    //SOLO ESTAMOS USANDO LOS METODOOOOOSSSS DE UN ELEMENTO HTML
    //Nota: buscame en todo el documento algo que tenga la clase .bg-red-100
    if(!alerta){//SI NO HAY NINGUNA ALERTA CON ESA CLASE
        //Crear una alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class='font-bold'>Error</strong>
        <span class='block'>${mensaje}</span>
        `
        container.appendChild(alerta);

        //Eliminar Alerta despues de 5 segundos
        setTimeout(()=>{
            alerta.remove();
        },5000)
    }
}

function consultarAPI(ciudad, pais){
    //OpenWeather requiere o toma un ID de la aplicacion(no todas requieren de un ID)

    const appId = '3f1b64fa220045f1b0eb5b61ff04665e'; //lo sacamos de la pagina de weather
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`; //ponemos nuestra ciudad, pais e ID
    console.log(url);

    spinner();

    fetch(url)
        .then(respuesta=> respuesta.json()) 
        //.then(datos => console.log(datos)) //nos arroja el objeto
        .then(datos =>{ //puede que en donde escribimos la ciudad no exista, nos arrojara en mensaje de city not found, con el error 404
            console.log(datos);
            limpiarHTML(); //limpiamos para que no se muestren todos los que hemos consultado uno abajo del otro
            if(datos.cod === "404"){ //Si esa ciudad que no existe nos arroja un error con el codigo 404 
                //cod es parte de las propiedades que nos arroja el objeto, tiene algun numero
                mostrarError('Ciudad no encontrada');
                return;
            }

            //Imprime la respuesta en el HTML
            mostrarDatos(datos);
        })
}

function mostrarDatos(datos){
    //Como mencionamos antes, nuestro objeto arroja muchas cosas, entre ellas el cod, y hay otra de main, dentro de esa main tenemos un objeto anidado 
    console.log(datos);
    const {name, main:{temp, temp_max, temp_min}} = datos;
    //Tambien para sacar name, pudimos poner {name} = datos;
    //Ahora bien, la temperatura esta en Kelvin, hay que pasarlo a Celsius
    const celsius = kelvinACentigrados(temp);
    const celsiusMax = kelvinACentigrados(temp_max);
    const celsiusMin = kelvinACentigrados(temp_min);


    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Ciudad: ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const actual = document.createElement('p');
    actual.innerHTML = `
    ${celsius} &#8451; 
    ` //el & con el codigo de arriba es lo que nos va a permitir imprimir como si fueran °centigrados, es una ENTIDAD
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `
    Max: ${celsiusMax} &#8451;
    `
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `
    Min: ${celsiusMin} &#8451;
    `
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);


    resultado.appendChild(resultadoDiv);
}

function kelvinACentigrados(grados){
    return parseInt (grados - 273.15); //el parseInt nos sirve para REMOVER los DECIMALES
}

//La FUNCION DE ARRIBA, se puede simplificar asi
// const kelvinACentigrados = (grados) => parseInt(grados - 237.15);

//LimpiarHTML tambien nos servira para BORRAR EL PARRAFO QUE DICE AGREGA TU CIUDAD Y PAIS, ya que es un child de RESULTADO
function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner(){
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('sk-chase');

    divSpinner.innerHTML=`
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
        <div class="sk-chase-dot"></div>
    `;
    resultado.classList.add('flex','justify-center')
    resultado.appendChild(divSpinner);
}