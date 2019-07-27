const { PorterStemmerEs } = require('natural')
const { NeuralNetwork } = require('brain.js')

/*
    {iuterans} --> {inter}

    1. Buenos dias --> saludar
    2. hola --> saludar
    3. buenas tardes --> saludar
    4. quien es tu programador --> programador
    5. quien te ha desarrollado --> programador

    NOTA:
        Ahora bien... Si que tenemos la frase
    "quien es tu desarrollador" es muy similar
    a {5}.
        Aquí lo que tenemos q lograr es que
    dado un texto identificar el "inter".
        Por lo que para entenderla hay que
    cortar las palabras, es decir, a partir de
    un texto obtener la lista de palabas.
        Este proceso se llama Tokenizar, que
    es el paso previo a un Stemer.
        Los Stemmers eliminan los afijos
    morfológicos de las palabras, dejando solo
    la palabra stem.
        Un Stemer lo que haces, de cada
    palabra, calcular su raiz pero primero hay
    que tener las palabras.
*/
const txt = 'quien es tu desarrollador?'
// Tokenizamos:
const tokenize = txt => txt
    // las palabras en mayusculas no son lo
    // mismo que las palabras en mayusculas
    // entonces:
    .toLowerCase()
    .split(
        // aqui podriamos poner los espacios, el
        // priblema es que pueden venir ",", "." o
        // exclamaciones... entonces vamos a usar
        // una expresion regular que es: \W+ con
        // la cual decimis que nos separe por todo
        // aquello que no sea una palabra, con
        // toda cooincidencia que aparezca al
        // menos una o mas veces.
        /\W+/
    ).filter(
        // Por ultimo puede que un signo de
        // interrogacion o exclamacion me generen
        // un string vacios por lo cual hacemos:
        x => x
    )
// Stemmer:
const stem = words => words.map(word => PorterStemmerEs.stem(word))
// console.log(stem(tokenize(txt)))

/*
    NOTA:
        Ahora con esto contruimos nuestra
    inteligencia artificial que entrenaremos
    con las frases "1. 2. 3. 4. 5.".
        Lo que hace por dentro es lo siguiente:
        Se crea un array con las palabras
    diferentes que se encuentra, por Ej.:
        [buen, dia, hola, tard, qui, es,
    tu, desarroll, program] y por cada palabra
    diferente crea un vector de unos y ceros:
    [0, 0, 0, 0, 0, 0, 0, 0]. Entonces como
    representariamos "buenos dias", lo haría
    poniendo un 1 en donde se encuentren esas
    palabras:
    "buenos dias" => [1, 1, 0, 0, 0, 0, 0, 0]
    de este vector tambien aprende las posibles
    salidas, por lo cual tendremos que:
    [1, 1, 0, 0, 0, 0, 0, 0] => [
        1, -> corresponde a "saludar"
        0  -> corresponde a "programador"
    ]
    Así va aprendiendo a crearse esto, entonces
    si tenemos 10 inputs (que se corresponden a
    las features, que serian las palabras) y
    tenemos 2 output, a cada feature conectarla
    con un numero a cada uno de los outputs.
        Por lo tanto, la palabra "buen" tendrá
    un peso (número) para el output "saludar" y
    otro peso para el output "programador".
        Luego cuando viene una frase distinta
    se convierte en un vector de unos y ceros y
    para cada una de las palabras el 1 lo
    multiplico por su peso y al 0 tambien (en
    tal caso dara cero).
        Entonces en "buenos dias" obtendré el
    el peso de "buenos" y el peso de "dias" y
    nada más, sumados si es positivo para ése
    item hay más probabilidades y  lo contrario
    si es negativo.
        Así obtenemos un ranking final, esto es
    lo que hace brain.js a lo que vamos con una
    demo:
*/

// CREAMOS UNA RED NEURONAL CON BRAIN.JS
/*
    NOTA:
        Antes necesitamos crear un "corpus".
        Corpus: Son los datos de entreno de una
    red neuronal de NLP (Natural Language
    Processing)
*/
// CORPUS:
const corpus = [
    {
        input: 'Buenos dias',
        output: 'saludar'
    },
    {
        input: 'hola',
        output: 'saludar'
    },
    {
        input: 'buenas tardes',
        output: 'saludar'
    },
    {
        input: 'quien es tu programador',
        output: 'programador'
    },
    {
        input: 'quien te ha desarrollado',
        output: 'programador'
    },
]
/*
    NOTA:
        Lo que espera brain.js es un objeto
    con la siguiente forma:
        {
            input: {
                Buenos: 1,
                dias: 1,
            },
            output: {
                saludar: 1
            }
        }
    por lo cual lo que harémos es construir ése
    objeto con las funciones que tenemos.
*/
const corpusInputAdapter = input =>
    stem(tokenize(input)).reduce((ant, act) =>
        Object.assign(ant, { [act]: 1 })
    , {})
// {
//     ant[act] = 1
//     return ant
// }, {})
const corpusAdapter = training => training.map(train => ({
        input: corpusInputAdapter(train.input),
        output: { [train.output]: 1 }
    })
)
// console.log(corpusAdapter(corpus))

// a nuestra red neuronal (RN) le pasamos
// una configuracion:
const netConfig = {
    // hiperparametros de la RN:
    // para las capas vamos con la más
    // sencillas de todas, que carece de
    // capas ocultas:
    hiddenLayers: []
}
/*
    NOTA:
        Las RN tienen una topologia, como
    pueden ser las capas que la contienen.
        Estas topologias son las que
    configuramos en los hiperparametros.
        El tiempo que tarde en entrenar va a
    depender e la cantidad de datos
    con la que entrenamos multiplicado por el
    numero de capas.
        Ademas debemos tener en cuenta
    en los hiperparametros el
    learningRate (ratio de aprendizaje).
        * Para un valor mas alto aprende más
        rapido.
        * Cuando es bajo aprende más despacio.
        ¿Porque esto esta sujeto a
    modificacion? a todos nos gustaria que
    nuestra RN aprenda más rapido.
        El problema esta en que los saltos que
    da para aprender son más grandes, y puede
    que no tengamos buenos resultados.
        Por el contrario si le damos un valor
    muy bajo (por ej .00001) va a aprender muy
    bien pero se va a tardar demasiado.
*/

const net = new NeuralNetwork(netConfig)

// Entrenamos la red para activarla.
// Activation function has not been initialized, did you run train()?
console.log(net.train(corpusAdapter(corpus)))

const newTxt = 'Quien te ah hecho tu desarrollo?'

const answer = net.run(corpusInputAdapter(newTxt))

console.log(answer)

/*
    NOTA:
        Como resultado tenemos:
        { error: 0.004959241360503482, iterations: 124 }
        { saludar: 0.05706379562616348,
        programador: 0.9304927587509155 }
        Como podemos ver la probabilidad más alta
        a la pregunta es la de "programador".
*/
