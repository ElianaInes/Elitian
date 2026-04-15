import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'Conocénos | Elitian',
  description: 'Somos Eliana y Cristian. Descubrí nuestra historia, misión y valores detrás de Elitian.',
}

const VALORES = [
  {
    icono: '🌿',
    titulo: 'Autenticidad',
    texto: 'Cada producto que elegimos refleja genuinamente quiénes somos y en qué creemos.',
  },
  {
    icono: '♻️',
    titulo: 'Responsabilidad',
    texto: 'Tomamos decisiones conscientes para reducir nuestro impacto en el planeta.',
  },
  {
    icono: '💚',
    titulo: 'Compromiso',
    texto: 'Nos comprometemos con tu bienestar y con el cuidado de nuestro hogar común.',
  },
  {
    icono: '🤝',
    titulo: 'Amor',
    texto: 'Este proyecto nació del amor — entre nosotros y hacia el mundo que habitamos.',
  },
]

export default function ConocenosPage() {
  return (
    <>

      {/* Hero */}
      <section className="bg-green-800 text-white py-20 px-4 text-center">
        <p className="text-green-300 text-sm font-medium uppercase tracking-widest mb-3">Nuestra historia</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-2xl mx-auto leading-tight">
          Conocénos
        </h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto leading-relaxed">
          Un proyecto nacido del amor, la conciencia ambiental y el deseo de cuidarte de manera natural.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">

        {/* Historia */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold text-stone-800">¡Hola! Somos Eliana y Cristian</h2>
            <p className="text-stone-600 leading-relaxed">
              Unimos nuestro amor y emprendimos juntos este proyecto. Nació del deseo de tomar mayor conciencia
              sobre nuestro medio ambiente y del deseo de cuidar tu piel de manera natural.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Ofrecemos productos de higiene y cosmética natural, pensados y elegidos cuidando nuestro hogar
              compartido: el planeta, y a vos.
            </p>
            <Link
              href="/tienda"
              className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors text-sm"
            >
              Explorar productos →
            </Link>
          </div>

          <div className="flex justify-center">
            <div className="bg-green-50 rounded-3xl p-10 flex items-center justify-center w-72 h-72">
              <Image
                src="/logo.png"
                alt="Logo Elitian"
                width={180}
                height={180}
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* Misión y Visión */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-5">🎯</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Misión</h3>
            <p className="text-stone-600 leading-relaxed">
              En Elitian nos comprometemos a contribuir nuestro granito de arena ofreciendo opciones
              amigables y sostenibles. Nuestra propuesta es brindarte productos que nutran tu piel
              con ingredientes naturales.
            </p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-8">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl mb-5">🌍</div>
            <h3 className="text-xl font-semibold text-stone-800 mb-3">Visión</h3>
            <p className="text-stone-600 leading-relaxed">
              Visualizamos un mundo donde el cuidado personal se mezcla de manera equilibrada con el
              respeto por la Tierra. Aspiramos a ser parte de tu rutina diaria, ofreciéndote productos
              que reflejen una belleza consciente y respetuosa.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section>
          <div className="text-center mb-10">
            <h3 className="text-3xl font-semibold text-stone-800 mb-3">Nuestros valores</h3>
            <p className="text-stone-500 max-w-xl mx-auto">
              En el corazón de Elitian están la autenticidad, la responsabilidad, el compromiso y el amor sobre todo.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {VALORES.map(({ icono, titulo, texto }) => (
              <div key={titulo} className="bg-stone-50 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-4">{icono}</div>
                <h4 className="font-semibold text-stone-800 mb-2">{titulo}</h4>
                <p className="text-stone-500 text-sm leading-relaxed">{texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA reciclaje */}
        <section className="bg-green-50 border border-green-100 rounded-3xl px-8 py-12 text-center">
          <p className="text-4xl mb-4">♻️</p>
          <h3 className="text-2xl font-semibold text-stone-800 mb-3">Cuidamos el planeta juntos</h3>
          <p className="text-stone-600 max-w-md mx-auto mb-6 leading-relaxed">
            Recibimos los envases de los productos que vendemos. Cada gesto cuenta y hace la diferencia.
          </p>
          <Link
            href="/recicla"
            className="inline-block px-6 py-3 bg-green-700 text-white font-semibold rounded-xl hover:bg-green-800 transition-colors text-sm"
          >
            Más sobre reciclaje →
          </Link>
        </section>

      </div>
    </>
  )
}
