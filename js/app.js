
const $tiempoRestante = document.querySelector("#tiempoRestante"),
		$btnIniciar = document.querySelector("#btnIniciar"),
		$btnPausar = document.querySelector("#btnPausar"),
		$btnParar = document.querySelector("#btnParar"),
		$minutos = document.querySelector("#minutos"),
		$segundos = document.querySelector("#segundos"),
		$contenedorInput = document.querySelector("#contenedorInput");
	let idInterval = null, diferenciaTemporal = 0,
		fechaFuturo = null;
	
	const cargarSonido = function (fuente) {
		const sonido = document.createElement("audio");
		sonido.src = fuente;
		sonido.loop = true;
		sonido.setAttribute("preload", "auto");
		sonido.setAttribute("controls", "none");
		sonido.style.display = "none"; // <-- oculto
		document.body.appendChild(sonido);
		return sonido;
	};

	const sonido = cargarSonido("la_primera_purga_la_noche_de_las_bestias_alarma.mp3");
	const ocultarElemento = elemento => {
		elemento.style.display = "none";
	}

	const mostrarElemento = elemento => {
		elemento.style.display = "";
	}

	const iniciarTemporizador = (minutos, segundos) => {
		ocultarElemento($contenedorInput);
		mostrarElemento($btnPausar);
		ocultarElemento($btnIniciar);
		ocultarElemento($btnParar);
		if (fechaFuturo) {
			fechaFuturo = new Date(new Date().getTime() + diferenciaTemporal);
			diferenciaTemporal = 0;
		} else {
			const milisegundos = (segundos + (minutos * 60)) * 1000;
			fechaFuturo = new Date(new Date().getTime() + milisegundos);
		}
		clearInterval(idInterval);
		idInterval = setInterval(() => {
			const tiempoRestante = fechaFuturo.getTime() - new Date().getTime();
			if (tiempoRestante <= 0) {
				clearInterval(idInterval);
				sonido.play();
				ocultarElemento($btnPausar);
				mostrarElemento($btnParar);
			} else {
				$tiempoRestante.textContent = milisegundosAMinutosYSegundos(tiempoRestante);
			}
		}, 50);
	};

	const pausarTemporizador = () => {
		ocultarElemento($btnPausar);
		mostrarElemento($btnIniciar);
		mostrarElemento($btnParar);
		diferenciaTemporal = fechaFuturo.getTime() - new Date().getTime();
		clearInterval(idInterval);
	};

	const detenerTemporizador = () => {
		clearInterval(idInterval);
		fechaFuturo = null;
		diferenciaTemporal = 0;
		sonido.currentTime = 0;
		sonido.pause();
		$tiempoRestante.textContent = "00:00.0";
		init();
	};

	const agregarCeroSiEsNecesario = valor => {
		if (valor < 10) {
			return "0" + valor;
		} else {
			return "" + valor;
		}
	}
	const milisegundosAMinutosYSegundos = (milisegundos) => {
		const minutos = parseInt(milisegundos / 1000 / 60);
		milisegundos -= minutos * 60 * 1000;
		const segundos = (milisegundos / 1000);
		return `${agregarCeroSiEsNecesario(minutos)}:${agregarCeroSiEsNecesario(segundos.toFixed(1))}`;
	};
	const init = () => {
		$minutos.value = "";
		$segundos.value = "";
		mostrarElemento($contenedorInput);
		mostrarElemento($btnIniciar);
		ocultarElemento($btnPausar);
		ocultarElemento($btnParar);
	};


	$btnIniciar.onclick = () => {
		const minutos = parseInt($minutos.value);
		const segundos = parseInt($segundos.value);
		if (isNaN(minutos) || isNaN(segundos) || (segundos <= 0 && minutos <= 0)) {
			return;
		}
		iniciarTemporizador(minutos, segundos);
	};
	init();
	$btnPausar.onclick = pausarTemporizador;
	$btnParar.onclick = detenerTemporizador;
