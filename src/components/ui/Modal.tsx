<<<<<<< HEAD
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { gsap } from 'gsap'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    maxWidth?: string
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-md',
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
            gsap.fromTo(
                modalRef.current,
                { scale: 0.9, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
            )
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleClose = () => {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
        gsap.to(modalRef.current, {
            scale: 0.9,
            opacity: 0,
            y: 20,
            duration: 0.2,
            onComplete: onClose,
        })
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />
            <div
                ref={modalRef}
                className={`relative w-full ${maxWidth} bg-flux-black-card border border-flux-black-border rounded-2xl shadow-2xl overflow-hidden`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-flux-black-border">
                    <h2 className="text-xl font-bold text-flux-white">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-flux-gray hover:text-flux-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.getElementById('root')!
    )
}
=======
import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { gsap } from 'gsap'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    maxWidth?: string
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    maxWidth = 'max-w-md',
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
            gsap.fromTo(
                modalRef.current,
                { scale: 0.9, opacity: 0, y: 20 },
                { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
            )
        } else {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    const handleClose = () => {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
        gsap.to(modalRef.current, {
            scale: 0.9,
            opacity: 0,
            y: 20,
            duration: 0.2,
            onComplete: onClose,
        })
    }

    return createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
                ref={overlayRef}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={handleClose}
            />
            <div
                ref={modalRef}
                className={`relative w-full ${maxWidth} bg-flux-black-card border border-flux-black-border rounded-2xl shadow-2xl overflow-hidden`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-flux-black-border">
                    <h2 className="text-xl font-bold text-flux-white">{title}</h2>
                    <button
                        onClick={handleClose}
                        className="p-2 text-flux-gray hover:text-flux-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">{children}</div>
            </div>
        </div>,
        document.getElementById('root')!
    )
}
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb
