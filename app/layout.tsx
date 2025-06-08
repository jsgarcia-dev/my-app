import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import {
  Gabarito,
  Playfair_Display,
  Inter,
  Montserrat,
  Space_Grotesk,
  Epilogue,
  Outfit,
} from 'next/font/google'; // Importando fontes do Google Fonts
import './globals.css';
import Menu from '@/components/menu/menu';
import AdobeFonts from '@/components/AdobeFonts';

const gabaritoFont = Gabarito({
  subsets: ['latin'],
  variable: '--font-gabarito',
  display: 'swap',
  // Adicione pesos (weights) específicos se necessário, ex: weight: ['400', '700']
});

const playfairFont = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const interFont = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const montserratFont = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

// Fontes modernas e chamativas para títulos
const spaceGroteskFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const epilogueFont = Epilogue({
  subsets: ['latin'],
  variable: '--font-epilogue',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

const outfitFont = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
});

// As fontes Geist já exportam suas variáveis CSS diretamente
// const geistSans = GeistSans({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// });

// const geistMono = GeistMono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// });

export const metadata: Metadata = {
  metadataBase: new URL('https://studiogarcia.com.br'),
  title:
    'Studio Garcia Beauty Academy - Transforme sua Paixão em Profissão | Itaquaquecetuba',
  description:
    'A melhor academia de beleza de Itaquaquecetuba. Cursos profissionalizantes de cabeleireiro, maquiagem, estética e manicure com certificação reconhecida. Matricule-se agora!',
  keywords:
    'curso de beleza Itaquaquecetuba, escola de estética Itaquaquecetuba, curso de maquiagem profissional, curso de cabeleireiro com certificado, Studio Garcia Beauty Academy',
  authors: [{ name: 'Studio Garcia Beauty Academy' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://studiogarcia.com.br',
    siteName: 'Studio Garcia Beauty Academy',
    title: 'Studio Garcia Beauty Academy - Transforme sua Paixão em Profissão',
    description:
      'A melhor academia de beleza de Itaquaquecetuba. Cursos profissionalizantes com certificação.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Studio Garcia Beauty Academy',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Garcia Beauty Academy - Transforme sua Paixão em Profissão',
    description:
      'A melhor academia de beleza de Itaquaquecetuba. Cursos profissionalizantes com certificação.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#B76E79',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${gabaritoFont.variable} ${playfairFont.variable} ${interFont.variable} ${montserratFont.variable} ${spaceGroteskFont.variable} ${epilogueFont.variable} ${outfitFont.variable} font-articulat antialiased`}
      >
        <AdobeFonts />
        <div className="relative z-40">
          <Menu />
        </div>
        <main className="relative z-0">
          {children}
        </main>
      </body>
    </html>
  );
}
