import FormularioContacto from './_components/FormularioContacto'

export const metadata = {
  title: 'Contacto | Elitian',
  description: 'Contactanos por WhatsApp, email o redes sociales. Estamos para ayudarte.',
}

const CANALES = [
  {
    icono: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    color: 'bg-[#25D366] hover:bg-[#1da851]',
    titulo: 'WhatsApp',
    desc: 'La forma más rápida de contactarnos. Te respondemos a la brevedad.',
    etiqueta: 'Escribinos',
    href: 'https://wa.me/+5493624135017',
    externo: true,
  },
  {
    icono: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
    color: 'bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600',
    titulo: 'Instagram',
    desc: 'Seguinos para novedades, productos y contenido sobre vida natural.',
    etiqueta: 'Ir al perfil',
    href: 'https://instagram.com/tienda.elitian',
    externo: true,
  },
  {
    icono: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
      </svg>
    ),
    color: 'bg-green-700 hover:bg-green-800',
    titulo: 'Email',
    desc: 'Para consultas más detalladas o propuestas de colaboración.',
    etiqueta: 'Enviar email',
    href: 'mailto:hola@elitian.com.ar',
    externo: false,
  },
]

export default function ContactoPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-green-800 text-white py-20 px-4 text-center">
        <p className="text-green-300 text-sm font-medium uppercase tracking-widest mb-3">Estamos aquí</p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          ¡Conversemos!
        </h1>
        <p className="text-green-100 text-lg max-w-xl mx-auto leading-relaxed">
          Nos encantaría estar en contacto con vos. No es molestia — nos entusiasma conectarnos
          y compartir el amor por la belleza natural.
        </p>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Canales de contacto */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-semibold text-stone-800 mb-3">¿Cómo preferís contactarnos?</h2>
            <p className="text-stone-500">
              Elegí el canal que más te resulte cómodo. Estamos en todos lados.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {CANALES.map(({ icono, color, titulo, desc, etiqueta, href, externo }) => (
              <div key={titulo} className="bg-white border border-stone-200 rounded-2xl p-7 flex flex-col">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 ${color.split(' ')[0]}`}>
                  {icono}
                </div>
                <h3 className="font-semibold text-stone-800 mb-2">{titulo}</h3>
                <p className="text-stone-500 text-sm leading-relaxed flex-1 mb-5">{desc}</p>
                <a
                  href={href}
                  target={externo ? '_blank' : undefined}
                  rel={externo ? 'noopener noreferrer' : undefined}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm transition-colors ${color}`}
                >
                  {etiqueta}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Info adicional */}
        <section className="grid sm:grid-cols-2 gap-6">
          <div className="bg-stone-50 rounded-2xl p-7">
            <div className="text-3xl mb-4">📍</div>
            <h3 className="font-semibold text-stone-800 mb-2">Ubicación</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Resistencia, Chaco, Argentina.<br />
              Coordinamos envíos y puntos de entrega por WhatsApp.
            </p>
          </div>

          <div className="bg-stone-50 rounded-2xl p-7">
            <div className="text-3xl mb-4">🕐</div>
            <h3 className="font-semibold text-stone-800 mb-2">Horario de atención</h3>
            <p className="text-stone-500 text-sm leading-relaxed">
              Lunes a viernes: 9:00 a 20:00 hs.<br />
              Sábados: 9:00 a 13:00 hs.<br />
              Respondemos a la brevedad.
            </p>
          </div>
        </section>

        {/* Formulario de contacto */}
        <FormularioContacto />

      </div>
    </>
  )
}
