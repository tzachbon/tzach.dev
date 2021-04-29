import { Physics, useBox, usePlane } from '@react-three/cannon'
import { ContactShadows, Loader, OrbitControls, Reflector, Sky, Stars, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { Suspense, useEffect } from 'react'
import Effects from './Effect'

function Box(props) {
	const [ref, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }))

	useEffect(() => {
		const callback = ({ code }: KeyboardEvent) => {
			switch (code) {
			case 'ArrowUp':
				console.log(ref.current.up)

				api.velocity.set(0, 5, 0)
				break
			case 'ArrowRight':
				api.velocity.set(5, 0, 0)
				break
			case 'ArrowLeft':
				api.velocity.set(-5, 0, 0)
				break
			default:
				break
			}
		}

		window.addEventListener('keydown', callback)
		return () => { window.removeEventListener('keydown', callback) }
	}, [])

	return (
		<mesh
			ref={ref}
			position={[0, 2, 0]}
		>
			<boxBufferGeometry attach="geometry" />
			<meshLambertMaterial attach="material" color="hotpink" />
		</mesh>
	)
}

function Plane(props) {
	const [ref] = usePlane(() => ({
		position: [0, -0.01, 0],
		rotation: [-Math.PI / 2, 0, 0],
	}))
	return (
		<mesh ref={ref}>
			<planeBufferGeometry attach="geometry" args={[100, 100]} />
			<meshLambertMaterial attach="material" color="lightblue" />
		</mesh>
	)
}

function Ground() {
	const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])

	return (
		//@ts-ignore
		<Reflector resolution={512} args={[100, 100, 4, 4]} mirror={0.4} mixBlur={8} mixStrength={1} rotation={[-Math.PI / 2, 0, Math.PI / 2]} blur={[400, 100]}>
			{(Material, props) => <Material color="#797979" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[1, 1]} {...props} />}
		</Reflector>
	)
}

function SkyScene() {
	return (
		<>
			<Sky
				turbidity={3.3}
				rayleigh={6}
				mieCoefficient={0.005}
				mieDirectionalG={0.8}
				sunPosition={[0, 0, 0]}
			/>
			<Plane rotation-x={Math.PI / 2} args={[100, 100, 4, 4]}>
				<meshBasicMaterial color="black" attach="material" />
			</Plane>
		</>
	)
}

const MAX_POLAR_ANGLE = (Math.PI / 2) - 0.1

interface Props {
	className?: string
}

export default function ThreeD({ className }: Props) {
	return (
		<Suspense fallback={null}>
			<Canvas className={className} mode='concurrent'>
				<color attach="background" args={['black']} />
				{/* @ts-ignore */}
				<ContactShadows position={[0, 0, 0]} width={100} height={20} far={20} rotation={[Math.PI / 2, 0, 0]} />
				{/* @ts-ignore */}
				<OrbitControls maxPolarAngle={MAX_POLAR_ANGLE} maxDistance={10} enableDamping={false} enablePan={false} />
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 55, 10]} angle={1} />
				<Effects />
				<Physics>
					<SkyScene />
					<Box />
					<Ground />
				</Physics>
			</Canvas>
			<Loader />
		</Suspense>
	)
}
