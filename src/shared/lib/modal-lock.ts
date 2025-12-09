let lockCount = 0;

export const lockBody = () => {
	lockCount++;
	if (lockCount === 1) {
		document.body.style.overflow = 'hidden';
	}
};

export const unlockBody = () => {
	lockCount--;
	if (lockCount <= 0) {
		lockCount = 0;
		document.body.style.overflow = '';
	}
};
