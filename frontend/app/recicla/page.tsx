import Link from 'next/link'

export const metadata = {
  title: 'Reciclá & Reutilizá | Elitian',
  description: 'Recibimos los envases de los productos que vendemos. Conocé cómo colaborar con el reciclado y la reutilización.',
}

const PASOS = [
  {
    numero: '01',
    titulo: 'Primer enjuague',
    texto: 'Cuando terminaste de usar el producto, enjuágalo dos veces con agua caliente para facilitar la remoción de aceites vegetales. Esto también ayudará a remover la etiqueta.',
  },
  {
    numero: '02',
    titulo: 'Enjuague con limpiador',
    texto: 'Realizá un tercer enjuague con un agente limpiador como jabón o detergente y agua caliente para eliminar cualquier residuo.',
  },
  {
    numero: '03',
    titulo: 'Dejá secar',
    texto: 'Dejá secar el envase boca abajo sobre una superficie que respire. ¡Y listo! Ya está para entregar en tu siguiente compra.',
  },
]

const ECOIDEAS = [
  {
    icono: '🪴',
    titulo: 'Maceta creativa',
    texto: 'Los frascos de vidrio son perfectos como macetas para plantas pequeñas o suculentas.',
  },
  {
    icono: '🕯️',
    titulo: 'Portavelas',
    texto: 'Usá los envases de vidrio como portavelas o candelabros decorativos para tu hogar.',
  },
  {
    icono: '🧴',
    titulo: 'Dispensadores',
    texto: 'Convertí los frascos en dispensadores de jabón, aceites o condimentos en tu cocina.',
  },
  {
    icono: '✏️',
    titulo: 'Organizador',
    texto: 'Usá los envases para organizar lápices, pinceles, o cualquier artículo pequeño de tu escritorio.',
  },
]

export default function ReciclaPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-800 text-white py-20 px-4 text-center">
        <p className="text-green-300 text-sm font-medium uppercase tracking-widest mb-3">Cuidá el planeta</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Reciclá <span className="text-green-300">&</span> Reutilizá
        </h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto leading-relaxed">
          Recibimos los envases de los productos que vendemos. El vidrio se reutiliza y los plásticos los enviamos a reciclar.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Compromiso */}
        <section className="text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-6">🤝</div>
          <h2 className="text-3xl font-semibold text-stone-800 mb-4">
            Creemos en el compromiso activo con el medio ambiente
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg">
            Cada envase que devolvés es un paso más hacia un mundo más limpio. Juntos hacemos la diferencia.
          </p>
        </section>

        {/* Cómo lavar los envases */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-stone-800 mb-3">Tips para lavar los envases</h2>
            <p className="text-stone-500">
              Te pedimos entregarlos <strong className="text-stone-700">previamente lavados</strong>. Es más fácil de lo que parece.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PASOS.map(({ numero, titulo, texto }) => (
              <div key={numero} className="bg-white border border-stone-200 rounded-2xl p-7 relative overflow-hidden">
                <span className="absolute top-4 right-5 text-6xl font-black text-stone-100 select-none leading-none">
                  {numero}
                </span>
                <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white font-bold text-sm mb-4">
                  {numero}
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{titulo}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA unirse */}
        <section className="bg-green-50 border border-green-100 rounded-3xl px-8 py-12 text-center">
          <p className="text-4xl mb-4">♻️</p>
          <h2 className="text-2xl font-semibold text-stone-800 mb-3">¿Te sumás al compromiso?</h2>
          <p className="text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
            La próxima vez que hagas una compra, traé tus envases limpios y secos. Nosotros nos encargamos del resto.
          </p>
          <Link
            href="https://wa.me/+5493624135017"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1da851] text-white font-semibold rounded-xl transition-colors text-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Coordiná por WhatsApp
          </Link>
        </section>

        {/* Ecoideas */}
        <section>
          <div className="text-center mb-10">
            <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              Ecoideas
            </span>
            <h2 className="text-3xl font-semibold text-stone-800 mb-3">
              Ideas creativas para reutilizar envases de vidrio
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              Antes de reciclar, pensá si podés darle una segunda vida. Aquí van algunas ideas.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {ECOIDEAS.map(({ icono, titulo, texto }) => (
              <div key={titulo} className="bg-stone-50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{icono}</div>
                <h4 className="font-semibold text-stone-800 mb-2 text-sm">{titulo}</h4>
                <p className="text-stone-500 text-xs leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  )
}
