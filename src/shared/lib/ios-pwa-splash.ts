export default function iosPWASplash(
	iconURL: string,
	backgroundColor: string
): void {
	if (iconURL.length === 0) {
		throw new Error('Invalid icon URL provided');
	}

	const screenWidth = screen.width;
	const screenHeight = screen.height;
	const pixelRatio = window.devicePixelRatio || 1;

	const portraitCanvas = document.createElement('canvas');
	const landscapeCanvas = document.createElement('canvas');

	const portraitContext = portraitCanvas.getContext('2d');
	const landscapeContext = landscapeCanvas.getContext('2d');

	if (!portraitContext || !landscapeContext) {
		throw new Error('Failed to get canvas context');
	}

	const iconImage = new Image();

	iconImage.onerror = function () {
		throw new Error('Failed to load icon image');
	};

	iconImage.src = iconURL;

	iconImage.onload = function () {
		const iconSizeWidth = iconImage.width / (3 / pixelRatio);
		const iconSizeHeight = iconImage.height / (3 / pixelRatio);

		portraitCanvas.width = screenWidth * pixelRatio;
		landscapeCanvas.height = portraitCanvas.width;
		portraitCanvas.height = screenHeight * pixelRatio;
		landscapeCanvas.width = portraitCanvas.height;

		portraitContext.fillStyle = backgroundColor;
		landscapeContext.fillStyle = backgroundColor;
		portraitContext.fillRect(0, 0, portraitCanvas.width, portraitCanvas.height);
		landscapeContext.fillRect(
			0,
			0,
			landscapeCanvas.width,
			landscapeCanvas.height
		);

		const portraitIconX = (portraitCanvas.width - iconSizeWidth) / 2;
		const portraitIconY = (portraitCanvas.height - iconSizeHeight) / 2;
		const landscapeIconX = (landscapeCanvas.width - iconSizeWidth) / 2;
		const landscapeIconY = (landscapeCanvas.height - iconSizeHeight) / 2;

		portraitContext.drawImage(
			iconImage,
			portraitIconX,
			portraitIconY,
			iconSizeWidth,
			iconSizeHeight
		);
		landscapeContext.drawImage(
			iconImage,
			landscapeIconX,
			landscapeIconY,
			iconSizeWidth,
			iconSizeHeight
		);

		const portraitImageDataURL = portraitCanvas.toDataURL('image/png');
		const landscapeImageDataURL = landscapeCanvas.toDataURL('image/png');

		const portraitSplashLink = document.createElement('link');
		portraitSplashLink.setAttribute('rel', 'apple-touch-startup-image');
		portraitSplashLink.setAttribute(
			'media',
			'screen and (orientation: portrait)'
		);
		portraitSplashLink.setAttribute('href', portraitImageDataURL);
		document.head.appendChild(portraitSplashLink);

		const landscapeSplashLink = document.createElement('link');
		landscapeSplashLink.setAttribute('rel', 'apple-touch-startup-image');
		landscapeSplashLink.setAttribute(
			'media',
			'screen and (orientation: landscape)'
		);
		landscapeSplashLink.setAttribute('href', landscapeImageDataURL);
		document.head.appendChild(landscapeSplashLink);
	};
}
