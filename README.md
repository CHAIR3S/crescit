# Crescit · landing page

Web oficial de Crescit, estudio de software a medida en España.
Next.js 16 (App Router) + TypeScript, GSAP/ScrollTrigger para las escenas ligadas al scroll y Lenis para el desplazamiento suave.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Configuración

Copia `.env.example` como `.env.local` y rellena lo que tengas. Nada se inventa:

| Variable | Qué activa |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | URL canónica, sitemap y Open Graph |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Correo visible en contacto y pie |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Botones de WhatsApp (contacto y resultado del diagnóstico) |
| `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` | Envío real del formulario (`/api/contact`) |

Sin las variables de Resend el formulario valida, pero al enviar dice claramente que no está conectado.

## Estructura

- `src/components/Hero.tsx`: rostro 3D como secuencia de fotogramas en `<canvas>`, guiada por el scroll (`public/hero/d` escritorio 1440×810, `public/hero/m` móvil 640×640). Carga progresiva: primero 1 de cada 16 fotogramas y luego rellena.
- `src/components/diagnosis/engine.ts`: lógica del diagnóstico (preguntas por rama, puntuación y recomendación). `Diagnosis.tsx` es la interfaz.
- `src/components/services/*`: las tres demostraciones de servicio (web que se transforma, panel de gestión interactivo, flujo de automatización).
- `src/components/Work.tsx`: proyectos publicados, con capturas reales en `public/work`.
- `src/app/api/contact/route.ts`: recepción del formulario (validación, campo trampa, límite por IP, envío por Resend).

## Regenerar los fotogramas del hero

Se extrajeron del vídeo original en WebP (310 fotogramas en escritorio, 186 en móvil, recortados en cuadrado). Un ejemplo con ffmpeg:

```bash
ffmpeg -i rostro.mp4 -vf "fps=30,scale=1440:-2" -c:v libwebp -quality 72 -start_number 0 public/hero/d/%03d.webp
```

Los nombres empiezan en `000.webp`; si cambia el número de fotogramas, actualiza `count` en `Hero.tsx`.

## Pendiente antes de publicar

- Páginas de **aviso legal** (LSSI-CE) y **política de privacidad** (RGPD) con los datos de la empresa, enlazadas desde el pie y desde el aviso del formulario.
- Configurar las variables de contacto.
- La web no usa cookies propias ni de terceros, así que no necesita banner de cookies mientras siga así.
