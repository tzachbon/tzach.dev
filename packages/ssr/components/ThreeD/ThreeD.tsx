import * as THREE from 'three'
import { Physics, useBox, usePlane } from '@react-three/cannon'
import { ContactShadows, Loader, OrbitControls, Reflector, Sky, useTexture } from '@react-three/drei'
import { Canvas, useFrame, } from '@react-three/fiber'
import React, { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { Joystick } from 'react-joystick-component'
import styles from '../../styles/ThreeD.module.css'

function Box({
	joystickState,
	orbitControlRef,
	setBoxPosition,
}) {
	// eslint-disable-next-line react/prop-types
	const orbitPosition = (orbitControlRef as any)?.current?.position || {} as THREE.Vector3
	const [isMoving, setIsMoving] = useState({ up: false, down: false, left: false, right: false })
	const [ref, api] = useBox(() => ({ mass: 1, position: [0, 2, 0] }))

	const handleIsMoving = useCallback(
		(isMovingNow: boolean, position: KeyboardEvent['code'] | 'FORWARD' | 'RIGHT' | 'LEFT' | 'BACKWARD' | null) => {
			switch (position) {
			case 'FORWARD':
			case 'ArrowUp':
				setIsMoving(curr => ({ ...curr, up: isMovingNow }))
				break
			case 'RIGHT':
			case 'ArrowRight':
				setIsMoving(curr => ({ ...curr, right: isMovingNow }))
				break
			case 'LEFT':
			case 'ArrowLeft':
				setIsMoving(curr => ({ ...curr, left: isMovingNow }))
				break
			case 'ArrowDown':
			case 'BACKWARD':
				setIsMoving(curr => ({ ...curr, down: isMovingNow }))
				break
			default:
				setIsMoving({ up: false, down: false, left: false, right: false })
				break
			}
		},
		[],
	)

	const moveBox = useCallback(
		() => {
			const { x = 0, y = 0, z = 0 } = orbitPosition
			const positions = new THREE.Vector3(x, y, z)
			let shouldUpdatePosition = false

			switch (true) {
			case isMoving.up:
				positions.z += -5
				shouldUpdatePosition = true
				break
			case isMoving.right:
				positions.x += 5
				shouldUpdatePosition = true
				break
			case isMoving.left:
				positions.x += -5
				shouldUpdatePosition = true
				break
			case isMoving.down:
				positions.z += 5
				shouldUpdatePosition = true
				break
			default:
				break
			}


			if (shouldUpdatePosition) {
				// eslint-disable-next-line react/prop-types
				positions.applyAxisAngle(new THREE.Vector3(0, 1, 0), orbitControlRef.current.getAzimuthalAngle())
				api.velocity.set(positions.x, positions.y, positions.z)
			}

		},
		[isMoving, api, orbitPosition],
	)

	useEffect(() => {
		api.position.subscribe(setBoxPosition)

	}, [])

	useFrame(() => {
		moveBox()
	})


	useEffect(() => {

		if (joystickState) {

			// eslint-disable-next-line react/prop-types
			const { type, direction } = joystickState
			switch (type) {
			case 'move':
				['FORWARD', 'RIGHT', 'LEFT', 'BACKWARD'].forEach(currentDirection => handleIsMoving(false, currentDirection))
				handleIsMoving(true, direction)
				break
			case 'stop':
				handleIsMoving(false, direction)
				break

			default:
				break
			}
		}
	}, [joystickState, handleIsMoving])

	useEffect(() => {
		const callbackKeydown = ({ code }: KeyboardEvent) => handleIsMoving(true, code)
		const callbackKeyup = ({ code }: KeyboardEvent) => handleIsMoving(false, code)

		window.addEventListener('keyup', callbackKeyup)
		window.addEventListener('keydown', callbackKeydown)
		return () => {
			window.removeEventListener('keyup', callbackKeyup)
			window.removeEventListener('keydown', callbackKeydown)
		}
	}, [handleIsMoving])

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
		<Reflector
			resolution={512}
			args={[100, 100, 4, 4]}
			mirror={0.4}
			mixBlur={8}
			mixStrength={1}
			rotation={[-Math.PI / 2, 0, Math.PI / 2]}
			blur={[400, 100]}
		>
			{/* @ts-ignore */}
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
	isMobile: boolean
}

export default function ThreeD({ className, isMobile }: Props) {

	const [joystickState, setJoystickState] = useState<any>()
	const [boxPosition, setBoxPosition] = useState(new THREE.Vector3())
	const orbitControlRef = useRef() as (typeof OrbitControls)['defaultProps']['ref']

	return (
		<Suspense fallback={null}>
			<Canvas
				className={className}
				mode='concurrent'
				linear
				dpr={[1, 1.5]}
				camera={{
					position: [0, 0, 10],
					near: 0.01,
					far: 10000,
					fov: 70,
				}}
			>
				{/* @ts-ignore */}
				<ContactShadows position={[0, 0, 0]} width={100} height={20} far={20} rotation={[Math.PI / 2, 0, 0]} />
				{/* @ts-ignore */}
				<OrbitControls
					ref={orbitControlRef}
					target={boxPosition}
					maxPolarAngle={MAX_POLAR_ANGLE}
					maxDistance={10}
					enableDamping={false}
					enablePan={false}
				/>
				<ambientLight intensity={0.5} />
				<spotLight position={[10, 55, 10]} angle={1} />
				{/* <Effects /> */}
				<Physics>
					<SkyScene />
					<Box
						{...({
							joystickState,
							orbitControlRef,
							setBoxPosition,
						})}
					/>
					<Ground />
				</Physics>
			</Canvas>
			{
				isMobile && (
					<div className={styles.joystick}>
						<Joystick
							move={(event) => setJoystickState(event)}
							stop={event => setJoystickState(event)}
						/>
					</div>
				)
			}
			<Loader />
		</Suspense>
	)
}
