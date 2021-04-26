import { Environment } from '@react-three/drei'
import React, { Suspense } from 'react'

export default function Effects() {

	return (
		<Suspense fallback={null}>
			<Environment preset="forest" />
		</Suspense>
	)
}
