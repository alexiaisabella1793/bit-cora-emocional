(function(){
  "use strict";

  /* ---------------- datos de las salas ---------------- */
  var SALAS = [
    {
      id:"nudo", nombre:"El nudo", tono:"var(--nudo)", clase:"r-nudo",
      estado:"Agobio y problemas del día a día",
      desc:"Exámenes, casa, trabajo, discusiones. Lo que se acumula hasta que no cabe.",
      invita:"¿Qué se te ha hecho cuesta arriba hoy?"
    },
    {
      id:"niebla", nombre:"La niebla", tono:"var(--niebla)", clase:"r-niebla",
      estado:"Tristeza y desánimo",
      desc:"Días sin fuerzas, vacíos o largos. Aquí se puede contar sin animar a nadie.",
      invita:"¿Cómo es tu niebla estos días?"
    },
    {
      id:"corriente", nombre:"La corriente", tono:"var(--corriente)", clase:"r-corriente",
      estado:"Ansiedad, rabia y nervios",
      desc:"Cuando todo va demasiado rápido por dentro y no encuentras el freno.",
      invita:"¿Qué te está acelerando?"
    },
    {
      id:"claro", nombre:"El claro", tono:"var(--claro)", clase:"r-claro",
      estado:"Alivios y avances",
      desc:"Lo que has conseguido, por pequeño que parezca. Leerlo aquí le sirve a alguien.",
      invita:"¿Qué has logrado, aunque sea mínimo?"
    }
  ];

  var FRANJAS = ["14-17","18-25","26-40","41+"];
  var ALIAS = ["Farola","Caracola","Roble","Aguacero","Mirlo","Duna","Brasa","Quinto piso","Tinta","Cometa","Estepa","Bruma"];
  var APOYOS = ["Te leo","Yo también","Ánimo","Gracias por contarlo"];

  var SEMILLA = {
    nudo:[
      {alias:"Farola",edad:"14-17",texto:"Llevo dos semanas fingiendo que llevo todo al día y hoy me he quedado en el baño del insti hasta que sonó el timbre. No sé por dónde empezar a recuperar.",apoyos:{"Te leo":12,"Yo también":9}},
      {alias:"Roble",edad:"26-40",texto:"Turno doble, casa sin recoger y la sensación de que solo apago fuegos. No busco soluciones, solo decirlo en alto una vez.",apoyos:{"Te leo":7}}
    ],
    niebla:[
      {alias:"Bruma",edad:"18-25",texto:"No estoy triste por algo concreto, es más bien que nada me llama. Me cuesta hasta contestar mensajes de gente que quiero.",apoyos:{"Yo también":15,"Te leo":6}}
    ],
    corriente:[
      {alias:"Cometa",edad:"18-25",texto:"Me despierto con el corazón a mil antes de que suene la alarma. Alguien sabe cómo bajar de ahí sin pasar el día entero pensándolo.",apoyos:{"Te leo":4,"Ánimo":8}}
    ],
    claro:[
      {alias:"Duna",edad:"26-40",texto:"Hoy he salido a andar veinte minutos. Llevaba un mes sin salir más que a trabajar. Parece poco y para mí no lo es.",apoyos:{"Ánimo":21,"Gracias por contarlo":5}}
    ]
  };

  var SENALES = ["no quiero vivir","quitarme la vida","suicid","hacerme daño","desaparecer para siempre","acabar con todo","no aguanto mas","no aguanto más"];

  /* ---------------- estado + almacenamiento ---------------- */
  var estado = {edad:null, salaActual:null, filtro:"todas", entradas:{}, apoyosDados:0, animos:{}};

  function cargar(){
    try{
      var bruto = localStorage.getItem("bitacora_v1");
      if(bruto){ var g = JSON.parse(bruto); estado.edad=g.edad||null; estado.entradas=g.entradas||{}; estado.apoyosDados=g.apoyosDados||0; estado.animos=g.animos||{}; }
    }catch(e){ /* sin almacenamiento: la app funciona igual durante la sesión */ }
  }
  function guardar(){
    try{
      localStorage.setItem("bitacora_v1", JSON.stringify({edad:estado.edad,entradas:estado.entradas,apoyosDados:estado.apoyosDados,animos:estado.animos}));
    }catch(e){}
  }

  function entradasDe(idSala){
    var propias = estado.entradas[idSala] || [];
    return propias.concat(SEMILLA[idSala] || []);
  }

  /* ---------------- puerta de edad ---------------- */
  var puerta = document.getElementById("puerta");
  var avisoMenor = document.getElementById("aviso-menor");

  puerta.addEventListener("click", function(ev){
    var b = ev.target.closest("button[data-edad]");
    if(!b) return;
    var v = b.getAttribute("data-edad");
    if(v === "menor"){ avisoMenor.classList.add("visible"); return; }
    estado.edad = v; estado.filtro = v;
    guardar(); cerrarPuerta();
  });

  function cerrarPuerta(){ puerta.hidden = true; document.body.style.overflow=""; }

  /* ---------------- mapa ---------------- */
  var rejilla = document.getElementById("rejilla-mapa");
  var contSalas = document.getElementById("salas");
  var vistaMapa = document.getElementById("vista-mapa");

  SALAS.forEach(function(s){
    var b = document.createElement("button");
    b.className = "region " + s.clase;
    b.setAttribute("data-sala", s.id);
    b.innerHTML = '<span class="estado">'+s.estado+'</span>'+
                  '<h3>'+s.nombre+'</h3>'+
                  '<p>'+s.desc+'</p>'+
                  '<span class="pie" data-conteo="'+s.id+'"></span>';
    rejilla.appendChild(b);
    contSalas.appendChild(crearSala(s));
  });

  function crearSala(s){
    var d = document.createElement("div");
    d.className = "sala"; d.id = "sala-" + s.id;
    d.style.setProperty("--tono", s.tono);
    var opciones = FRANJAS.map(function(f){ return '<option value="'+f+'">'+f+' años</option>'; }).join("");
    var chips = '<button class="chip" data-filtro="todas">Todas las edades</button>' +
      FRANJAS.map(function(f){ return '<button class="chip" data-filtro="'+f+'">'+f+'</button>'; }).join("");
    d.innerHTML =
      '<div class="sala-cabecera">'+
        '<div><h2>'+s.nombre+'</h2><p style="margin:.3rem 0 0;color:var(--papel-suave)">'+s.estado+'</p></div>'+
        '<button class="volver" style="margin-left:auto">Volver al mapa</button>'+
      '</div>'+
      '<div class="filtros" role="group" aria-label="Filtrar por edad">'+chips+'</div>'+
      '<div class="compositor">'+
        '<label class="sans" style="font-size:.9rem;color:var(--papel-suave);display:block;margin-bottom:.4rem" for="txt-'+s.id+'">'+s.invita+'</label>'+
        '<textarea id="txt-'+s.id+'" maxlength="700" placeholder="Escribe aquí. Nadie sabrá quién eres."></textarea>'+
        '<div class="aviso-riesgo cuidado oculto" style="margin:.8rem 0">'+
          '<h3>Esto suena a que lo estás pasando muy mal</h3>'+
          '<p style="margin:0;color:var(--papel-suave)">Puedes publicarlo igual, pero habla también con alguien ahora: <b>024</b> (atención a la conducta suicida, 24 h) o <b>112</b>.</p>'+
        '</div>'+
        '<div class="compositor-pie">'+
          '<select aria-label="Tu franja de edad">'+opciones+'</select>'+
          '<span class="contador">0/700</span>'+
          '<button class="publicar" disabled>Publicar en anónimo</button>'+
        '</div>'+
      '</div>'+
      '<ul class="entradas"></ul>';

    var area = d.querySelector("textarea");
    var cont = d.querySelector(".contador");
    var btn  = d.querySelector(".publicar");
    var sel  = d.querySelector("select");
    var riesgo = d.querySelector(".aviso-riesgo");

    area.addEventListener("input", function(){
      var n = area.value.length;
      cont.textContent = n + "/700";
      cont.classList.toggle("pasado", n > 650);
      btn.disabled = area.value.trim().length < 3;
      var t = area.value.toLowerCase();
      var alerta = SENALES.some(function(p){ return t.indexOf(p) !== -1; });
      riesgo.classList.toggle("oculto", !alerta);
    });

    btn.addEventListener("click", function(){
      var texto = area.value.trim();
      if(texto.length < 3) return;
      if(!estado.entradas[s.id]) estado.entradas[s.id] = [];
      estado.entradas[s.id].unshift({
        alias: ALIAS[Math.floor(Math.random()*ALIAS.length)],
        edad: sel.value, texto: texto, apoyos:{}, mia:true
      });
      area.value = ""; cont.textContent = "0/700"; btn.disabled = true;
      riesgo.classList.add("oculto");
      guardar(); pintarEntradas(s.id); pintarConteos(); pintarProgreso();
    });

    d.querySelector(".volver").addEventListener("click", irAlMapa);

    d.querySelector(".filtros").addEventListener("click", function(ev){
      var c = ev.target.closest(".chip"); if(!c) return;
      estado.filtro = c.getAttribute("data-filtro");
      pintarEntradas(s.id);
    });

    d.querySelector(".entradas").addEventListener("click", function(ev){
      var a = ev.target.closest(".apoyo"); if(!a) return;
      if(a.getAttribute("aria-pressed") === "true") return;
      a.setAttribute("aria-pressed","true");
      var n = parseInt(a.getAttribute("data-n"),10) + 1;
      a.setAttribute("data-n", n);
      a.querySelector("span").textContent = n;
      estado.apoyosDados++; guardar(); pintarProgreso();
    });

    if(estado.edad) sel.value = estado.edad;
    return d;
  }

  function pintarEntradas(idSala){
    var sala = document.getElementById("sala-"+idSala);
    var lista = sala.querySelector(".entradas");
    var datos = entradasDe(idSala).filter(function(e){
      return estado.filtro === "todas" || e.edad === estado.filtro;
    });

    sala.querySelectorAll(".chip").forEach(function(c){
      c.setAttribute("aria-pressed", String(c.getAttribute("data-filtro") === estado.filtro));
    });

    lista.innerHTML = "";
    if(!datos.length){
      var v = document.createElement("li");
      v.className = "vacio";
      v.textContent = "Todavía no hay nada en esta franja de edad. Puedes ser quien empiece.";
      lista.appendChild(v);
      return;
    }
    datos.forEach(function(e){
      var li = document.createElement("li");
      li.className = "entrada" + (e.mia ? " mia" : "");
      var botones = APOYOS.map(function(p){
        var n = (e.apoyos && e.apoyos[p]) || 0;
        return '<button class="apoyo" data-n="'+n+'" aria-pressed="false">'+p+' <span>'+n+'</span></button>';
      }).join("");
      li.innerHTML =
        '<div class="entrada-meta"><span class="avatar" aria-hidden="true">'+e.alias.charAt(0)+'</span>'+
        e.alias+' · '+e.edad+' años'+(e.mia ? ' · tu entrada' : '')+'</div>'+
        '<p></p><div class="apoyos">'+botones+'</div>';
      li.querySelector("p").textContent = e.texto;
      lista.appendChild(li);
    });
  }

  function pintarConteos(){
    SALAS.forEach(function(s){
      var el = document.querySelector('[data-conteo="'+s.id+'"]');
      var n = entradasDe(s.id).length;
      el.textContent = n === 1 ? "1 desahogo abierto" : n + " desahogos abiertos";
    });
  }

  /* ---------------- navegación ---------------- */
  function abrirSala(id){
    estado.salaActual = id;
    estado.filtro = estado.edad || "todas";
    vistaMapa.classList.add("oculto");
    document.querySelectorAll(".sala").forEach(function(s){ s.classList.remove("activa"); });
    var sala = document.getElementById("sala-"+id);
    sala.classList.add("activa");
    pintarEntradas(id);
    document.getElementById("mapa").scrollIntoView({behavior:"smooth", block:"start"});
    sala.querySelector("h2").setAttribute("tabindex","-1");
    sala.querySelector("h2").focus();
  }
  function irAlMapa(){
    estado.salaActual = null;
    document.querySelectorAll(".sala").forEach(function(s){ s.classList.remove("activa"); });
    vistaMapa.classList.remove("oculto");
    document.getElementById("mapa").scrollIntoView({behavior:"smooth", block:"start"});
  }

  rejilla.addEventListener("click", function(ev){
    var r = ev.target.closest("[data-sala]"); if(!r) return;
    abrirSala(r.getAttribute("data-sala"));
  });

  document.addEventListener("click", function(ev){
    var b = ev.target.closest("[data-ir]"); if(!b) return;
    var destino = b.getAttribute("data-ir");
    if(destino === "mapa" && estado.salaActual) irAlMapa();
    else document.getElementById(destino).scrollIntoView({behavior:"smooth", block:"start"});
  });

  var enlacesMenu = Array.prototype.slice.call(document.querySelectorAll("nav.menu button"));
  var observador = new IntersectionObserver(function(ent){
    ent.forEach(function(e){
      if(!e.isIntersecting) return;
      enlacesMenu.forEach(function(b){
        b.setAttribute("aria-current", String(b.getAttribute("data-ir") === e.target.id));
      });
    });
  }, {rootMargin:"-45% 0px -50% 0px"});
  ["mapa","progresos","cuidado","proyecto"].forEach(function(id){ observador.observe(document.getElementById(id)); });

  /* ---------------- progresos ---------------- */
  var rejillaDias = document.getElementById("rejilla-dias");
  var registro = document.getElementById("registro-animo");

  function hoyClave(){ return new Date().toISOString().slice(0,10); }
  function claveHace(n){ var d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().slice(0,10); }

  registro.addEventListener("click", function(ev){
    var b = ev.target.closest("button[data-animo]"); if(!b) return;
    estado.animos[hoyClave()] = b.getAttribute("data-animo");
    guardar(); pintarProgreso();
  });

  function pintarProgreso(){
    var dias = Object.keys(estado.animos).length;
    var escritas = Object.keys(estado.entradas).reduce(function(a,k){ return a + estado.entradas[k].length; },0);
    document.getElementById("cifra-dias").textContent = dias;
    document.getElementById("cifra-entradas").textContent = escritas;
    document.getElementById("cifra-apoyos").textContent = estado.apoyosDados;

    rejillaDias.innerHTML = "";
    for(var i=13;i>=0;i--){
      var c = document.createElement("div");
      c.className = "dia";
      var v = estado.animos[claveHace(i)];
      if(v) c.setAttribute("data-animo", v);
      rejillaDias.appendChild(c);
    }
  }

  /* ---------------- arranque ---------------- */
  cargar();
  if(estado.edad){ cerrarPuerta(); } else { document.body.style.overflow = "hidden"; }
  pintarConteos();
  pintarProgreso();
})();
