'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getAllProfessionals } from '@/lib/data/professionals'
import { Calendar, Star, Clock } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function ProfessionalsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement[]>([])
  const particlesRef = useRef<HTMLDivElement>(null)
  const [professionals, setProfessionals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProfessionals().then(profs => {
      console.log('Professionals loaded:', profs)
      setProfessionals(profs)
      setLoading(false)
    }).catch(err => {
      console.error('Error loading professionals:', err)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    const cards = cardsRef.current
    const particles = particlesRef.current

    if (!section || !particles) return

    // Particles animation
    const particlesTimeline = gsap.timeline({ repeat: -1 })
    particlesTimeline.to(particles.children, {
      y: 'random(-100, 100)',
      x: 'random(-100, 100)',
      rotation: 'random(-180, 180)',
      duration: 'random(10, 20)',
      ease: 'none',
      stagger: {
        each: 0.5,
        from: 'random'
      }
    })

    // Cards entrance animation
    cards.forEach((card, index) => {
      if (!card) return

      gsap.set(card, {
        opacity: 0,
        y: 100,
        rotationY: -30
      })

      ScrollTrigger.create({
        trigger: card,
        start: 'top bottom-=100',
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            rotationY: 0,
            duration: 1,
            delay: index * 0.1,
            ease: 'power3.out'
          })
        }
      })

      // Hover effects
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          scale: 1.05,
          boxShadow: '0 20px 40px rgba(183, 110, 121, 0.3)',
          duration: 0.3
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          scale: 1,
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          duration: 0.3
        })
      })

      // 3D tilt effect
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        
        const rotateX = (y - centerY) / 10
        const rotateY = (centerX - x) / 10

        gsap.to(card, {
          rotationX: rotateX,
          rotationY: rotateY,
          duration: 0.5,
          ease: 'power2.out',
          transformPerspective: 1000
        })
      })

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.5
        })
      })
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
      particlesTimeline.kill()
    }
  }, [professionals])

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white"
      data-menu-color="black"
    >
      {/* Animated particles background */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `linear-gradient(45deg, #B76E79, #6B46C1)`,
              left: `${(i * 16.666) + 8}%`,
              top: `${(i * 15) + 10}%`,
              opacity: 0.3
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-gold to-deep-purple bg-clip-text text-transparent">
            Nossos Profissionais
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Conheça nossa equipe de especialistas prontos para transformar seu visual
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-gold"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {professionals.map((professional, index) => (
            <div
              key={professional.id}
              ref={(el) => { if (el) cardsRef.current[index] = el }}
              className="group relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/20 to-deep-purple/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              
              <div className="relative bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
                {/* Profile Image */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-gold to-deep-purple rounded-full animate-pulse" />
                  <img
                    src={professional.avatar}
                    alt={professional.name}
                    className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-rose-gold to-deep-purple text-white rounded-full p-2">
                    <Star className="w-4 h-4" />
                  </div>
                </div>

                {/* Professional Info */}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {professional.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {professional.specialties.slice(0, 2).join(' • ')}
                  </p>
                </div>

                {/* Bio */}
                {professional.bio && (
                  <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2">
                    {professional.bio}
                  </p>
                )}

                {/* Services Preview */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {professional.servicesOffered.length} serviços
                    </span>
                    <span className="text-rose-gold font-medium">
                      A partir de R$ {Math.min(...professional.servicesOffered.map(s => s.price)).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  href={`/agendamento?professional=${professional.id}`}
                  className="block w-full text-center bg-gradient-to-r from-rose-gold to-deep-purple text-white py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Agendar Horário
                  </span>
                </Link>
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}