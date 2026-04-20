<<<<<<< HEAD
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Waves() {
    const { viewport } = useThree()
    const meshRef = useRef<THREE.Mesh>(null)

    const { positions, step } = useMemo(() => {
        const count = 50
        const step = 0.5
        const positions = new Float32Array(count * count * 3)
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                positions[(i * count + j) * 3] = (i - count / 2) * step
                positions[(i * count + j) * 3 + 1] = (j - count / 2) * step
                positions[(i * count + j) * 3 + 2] = 0
            }
        }
        return { positions, step }
    }, [])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (!meshRef.current) return

        const count = 50
        const posArr = meshRef.current.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const x = (i - count / 2) * step
                const y = (j - count / 2) * step
                const z = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) * 0.8
                posArr[(i * count + j) * 3 + 2] = z
            }
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true
        meshRef.current.rotation.z = t * 0.05
    })

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]}>
            <planeGeometry args={[25, 25, 49, 49]} />
            <meshStandardMaterial
                color="#E63946"
                wireframe
                transparent
                opacity={0.15}
                emissive="#E63946"
                emissiveIntensity={0.5}
            />
        </mesh>
    )
}

function FloatingOrbs() {
    const count = 20
    const orbs = useMemo(() => {
        return Array.from({ length: count }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            ],
            size: Math.random() * 0.1 + 0.05,
            speed: Math.random() * 0.5 + 0.2
        }))
    }, [])

    return (
        <>
            {orbs.map((orb, i) => (
                <Orb key={i} {...orb} />
            ))}
        </>
    )
}

function Orb({ position, size, speed }: { position: any, size: number, speed: number }) {
    const ref = useRef<THREE.Mesh>(null)
    useFrame((state) => {
        if (!ref.current) return
        ref.current.position.y += Math.sin(state.clock.getElapsedTime() * speed) * 0.01
        ref.current.position.x += Math.cos(state.clock.getElapsedTime() * speed) * 0.01
    })

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
                color="#E63946"
                emissive="#E63946"
                emissiveIntensity={2}
                transparent
                opacity={0.4}
            />
        </mesh>
    )
}

export default function ThreeBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#E63946" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#444" />
                <Waves />
                <FloatingOrbs />
            </Canvas>
            {/* Vignette effect */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
        </div>
    )
}
=======
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

function Waves() {
    const { viewport } = useThree()
    const meshRef = useRef<THREE.Mesh>(null)

    const { positions, step } = useMemo(() => {
        const count = 50
        const step = 0.5
        const positions = new Float32Array(count * count * 3)
        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                positions[(i * count + j) * 3] = (i - count / 2) * step
                positions[(i * count + j) * 3 + 1] = (j - count / 2) * step
                positions[(i * count + j) * 3 + 2] = 0
            }
        }
        return { positions, step }
    }, [])

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (!meshRef.current) return

        const count = 50
        const posArr = meshRef.current.geometry.attributes.position.array as Float32Array

        for (let i = 0; i < count; i++) {
            for (let j = 0; j < count; j++) {
                const x = (i - count / 2) * step
                const y = (j - count / 2) * step
                const z = Math.sin(x * 0.5 + t) * Math.cos(y * 0.5 + t) * 0.8
                posArr[(i * count + j) * 3 + 2] = z
            }
        }
        meshRef.current.geometry.attributes.position.needsUpdate = true
        meshRef.current.rotation.z = t * 0.05
    })

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 3, 0, 0]}>
            <planeGeometry args={[25, 25, 49, 49]} />
            <meshStandardMaterial
                color="#E63946"
                wireframe
                transparent
                opacity={0.15}
                emissive="#E63946"
                emissiveIntensity={0.5}
            />
        </mesh>
    )
}

function FloatingOrbs() {
    const count = 20
    const orbs = useMemo(() => {
        return Array.from({ length: count }).map(() => ({
            position: [
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 10
            ],
            size: Math.random() * 0.1 + 0.05,
            speed: Math.random() * 0.5 + 0.2
        }))
    }, [])

    return (
        <>
            {orbs.map((orb, i) => (
                <Orb key={i} {...orb} />
            ))}
        </>
    )
}

function Orb({ position, size, speed }: { position: any, size: number, speed: number }) {
    const ref = useRef<THREE.Mesh>(null)
    useFrame((state) => {
        if (!ref.current) return
        ref.current.position.y += Math.sin(state.clock.getElapsedTime() * speed) * 0.01
        ref.current.position.x += Math.cos(state.clock.getElapsedTime() * speed) * 0.01
    })

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial
                color="#E63946"
                emissive="#E63946"
                emissiveIntensity={2}
                transparent
                opacity={0.4}
            />
        </mesh>
    )
}

export default function ThreeBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none transition-opacity duration-1000">
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                <ambientLight intensity={0.2} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#E63946" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#444" />
                <Waves />
                <FloatingOrbs />
            </Canvas>
            {/* Vignette effect */}
            <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />
        </div>
    )
}
>>>>>>> 918101e2642bbe8acb58086013a31c2b3259ffcb
