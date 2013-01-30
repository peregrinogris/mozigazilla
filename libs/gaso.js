// Port de lateral.netmanagers.com.ar/static/gaso.py a JavaScript

/*
Éste es el módulo gasó.

Éste módulo provee la función gasear. Por ejemplo:

Gaso.gasear('rosarino')
>> 'rosarigasino'
*/

var Gaso = function () {};

Gaso.prototype.gas = function(letra) {
  /*
    dada una letra X devuelve XgasX
    excepto si X es una vocal acentuada, en cuyo caso devuelve
    la primera X sin acento

    >>> gas(u'a')
    u'agasa'

    >>> gas (u'\xf3')
    u'ogas\\xf3'
  */
  var map = {
    "á": "a",
    "é": "e",
    "í": "i",
    "ó": "o",
    "ú": "u"
  };

  if (map.hasOwnProperty(letra)) {
    return map[letra]+"gas"+letra;
  } else {
    return letra+"gas"+letra.toLowerCase();
  }
};

Gaso.prototype.umuda = function(palabra) {
  /*
    Si una palabra no tiene "!":
        Reemplaza las u mudas de la palabra por !

    Si la palabra tiene "!":
        Reemplaza las "!" por u

    >>> umuda (u'queso')
    u'q!eso'

    >>> umuda (u'q!eso')
    u'queso'

    >>> umuda (u'cuis')
    u'cuis'
  */

  if (palabra.indexOf('!') > 0) {
    return palabra.replace('!', 'u');
  }

  if (/([qg])u([ei])/i.test(palabra)) {
    return palabra.replace(/([qg])u([ei])/i, '\$1!\$2');
  }

  return palabra;
};


Gaso.prototype.es_diptongo = function(par) {
/*
  Dado un par de letras te dice si es un diptongo o no

    >>> es_diptongo(u'ui')
    True

    >>> es_diptongo(u'pa')
    False

    >>> es_diptongo(u'ae')
    False

    >>> es_diptongo(u'ai')
    True

    >>> es_diptongo(u'a')
    False

    >>> es_diptongo(u'cuis')
    False
*/

    if (par.length != 2)
      return false;

    if (
      ('aeiou'.indexOf(par[0]) > 0 && 'iu'.indexOf(par[1]) > 0) ||
      ('aeiou'.indexOf(par[1]) > 0 && 'iu'.indexOf(par[0]) > 0)
    ){
      return true;
    }

    return false;
};

Gaso.prototype.elegir_tonica = function(par) {
  /*
    Dado un par de vocales que forman diptongo, decidir cual de las
    dos es la tónica.

    >>> elegir_tonica(u'ai')
    0

    >>> elegir_tonica(u'ui')
    1
  */

  if ('aeo'.indexOf(par[0]) > 0)
      return 0;

  return 1;
};

Gaso.prototype.gasear = function(palabra) {
  /*
    Convierte una palabra de castellano a rosarigasino.

    >>> gasear(u'rosarino')
    u'rosarigasino'

    >>> gasear(u'pas\xe1')
    u'pasagas\\xe1'

    Los diptongos son un problema a veces:

    >>> gasear(u'cuis')
    u'cuigasis'

    >>> gasear(u'caigo')
    u'cagasaigo'


    Los adverbios son especiales para el castellano pero no
    para el rosarino!

    >>> gasear(u'especialmente')
    u'especialmegasente'

  */

  // Si son 3 o menos letras, es un monosilabo
  if (palabra.length < 4)
    return palabra;


  // Primero el caso obvio: acentos.
  // Lo resolvemos con una regexp
  var _this = this;
  if (/[áéíóú]/i.test(palabra)) {
      return palabra.replace(/([áéíóú])/i, function(x){
        return _this.gas(x);
      });
  }

  // Siguiente problema: u muda
  // Reemplazamos gui gue qui que por g!i g!e q!i q!e
  // y lo deshacemos antes de salir
  palabra=this.umuda(palabra);

  // Que hacemos? Vemos en qué termina
  var list = [];
  if ('nsaeiou'.indexOf(palabra[palabra.length-1])){
    // Palabra grave, acento en la penúltima vocal
    // Posición de la penúltima vocal:
    palabra.replace(/[aeiou]/ig, function (x,idx) {
      list.push([x, idx]);
      return x;
    });

    // Si no hay vocales suficientes, es una palabra rara, o nombre
    if (list.length < 2)
      return this.umuda(palabra);

    list.pop();
    pos = (list.pop())[1];
  } else {
    // Palabra aguda, acento en la última vocal
    // Posición de la última vocal:
    palabra.replace(/[aeiou]/ig, function (x,idx) {
      list.push([x, idx]);
      return x;
    });

    // Si no hay vocales suficientes, es una palabra rara, o nombre
    if (list.length < 1)
      return this.umuda(palabra);

    pos = (list.pop())[1];
  }

  // Pero que pasa si esa vocal es parte de un diptongo?

  if (this.es_diptongo(palabra.slice(pos,pos+1))) {
    pos += this.elegir_tonica(palabra.slice(pos-1,pos+1))-1;
  } else if (this.es_diptongo(palabra.slice(pos,pos+2))){
    pos += this.elegir_tonica(palabra.slice(pos,pos+2));
  }

  return this.umuda(
      palabra.slice(0,pos)+this.gas(palabra[pos])+palabra.slice(pos+1)
  );
};

Gaso.prototype.procesar = function(texto) {
  texto = texto.split(" ");
  var textogasino = "";
  for (var i in texto) {
    textogasino += this.gasear(texto[i]) + " ";
  }
  return textogasino;
};

try {
  // Node.js
  module.exports = Gaso;
} catch (e) {
  // Ignore, we are in a browser.
}

// Testing
// var gasino = new Gaso();
// console.log("umuda de queso: ", gasino.umuda("queso"));
// console.log("pa es diptongo? ", gasino.es_diptongo("pa"));
// console.log("tonica de ui = ", gasino.elegir_tonica('ui'));
// console.log("rosarino ==", gasino.gasear('rosarino'));
// console.log("mocasín ==", gasino.gasear('mocasín'));
// console.log("queso ==", gasino.gasear('queso'));
// console.log(gasino.procesar("Esto está en rosarino."));