
export enum DeviceType {
	MOBILE = 'MOBILE',
	DESKTOP = 'DESKTOP'
}

export function getDeviceType(userAgent: string): DeviceType {
	const isMobile = Boolean(userAgent.match(
		/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
	))

	return isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP
}