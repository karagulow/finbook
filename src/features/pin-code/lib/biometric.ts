import { WebAuthnError, platformAuthenticatorIsAvailable } from '@simplewebauthn/browser';

export async function canUsePlatformBiometric() {
	if (typeof window === 'undefined' || !window.PublicKeyCredential) {
		return false;
	}

	try {
		return await platformAuthenticatorIsAvailable();
	} catch {
		return false;
	}
}

export function isBiometricCancel(error: unknown) {
	if (!(error instanceof WebAuthnError)) {
		return false;
	}

	if (error.code === 'ERROR_CEREMONY_ABORTED' || error.name === 'NotAllowedError') {
		return true;
	}

	return error.cause instanceof Error && error.cause.name === 'NotAllowedError';
}
