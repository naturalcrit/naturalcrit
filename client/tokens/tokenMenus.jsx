import React, { useContext, useRef } from 'react';
import { TokenContext } from './tokenContext';

const TokenMenus = () => {
	const { canvasRef, imageSettings, setImage, setBorder, borderSettings, setBorderSettings, setImageSettings } = useContext(TokenContext);

	const tokenImageInputRef = useRef(null);
	const tokenBorderInputRef = useRef(null);
	const handleFileChange = (e, type) => {
		const file = e.target.files[0];
		if (!file) return;
		const canvas = canvasRef.current;

		const reader = new FileReader();

		reader.onload = (event) => {
			const img = new Image();

			img.onload = () => {
				const scale = Math.min(1, 200 / img.naturalWidth);
				const width = img.naturalWidth * scale;
				const height = img.naturalHeight * scale;
				if (type === 'image') {
					setImage(img);

					setImageSettings({
						x: canvas.width / 2 - width / 2,
						y: canvas.height / 2 - height / 2,
						width: width,
						height: height,
						rotation: 0,
					});
				} else {
					setBorder(img);

					setBorderSettings({
						x: canvas.width / 2 - width / 2,
						y: canvas.height / 2 - height / 2,
						width: width,
						height: height,
						rotation: 0,
					});
				}
			};

			img.src = event.target.result;
		};

		reader.readAsDataURL(file);
	};

	return (
		<ul className='interface vertical'>
			<li>
				<button onClick={() => tokenImageInputRef.current.click()}>Upload image</button>
				<input
					ref={tokenImageInputRef}
					type='file'
					name='tokenImage'
					id='tokenImageInput'
					onChange={(e) => handleFileChange(e, 'image')}
					style={{ display: 'none' }}
				/>
			</li>
			<li>
				<button onClick={() => tokenBorderInputRef.current.click()}>Upload border</button>
				<input
					ref={tokenBorderInputRef}
					type='file'
					name='tokenBorder'
					id='tokenBorderInput'
					onChange={(e) => handleFileChange(e, 'token')}
					style={{ display: 'none' }}
				/>
			</li>
			<li>
				<button>Export token</button>
			</li>
			<li>
				<button>reset workspace</button>
			</li>
			<li>
				<button> choose image</button>
			</li>
		</ul>
	);
};

export default TokenMenus;
