import React, { useRef, useState, useEffect } from 'react';
import './tokens.css';

import NaturalCritIcon from '../assets/svg/naturalcritLogo.jsx';

const Tokens = () => {
	const canvasRef = useRef(null);
	const tokenImageInputRef = useRef(null);
	//data
	const [image, setImage] = useState(null);
	const [border, setBorder] = useState(null);
	//data settings
	const [imageSettings, setImageSettings] = useState({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });

	//controls
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [resizeData, setResizeData] = useState(null);

	//interface
	const [showImageBox, setShowImageBox] = useState(false);

	const handleFileChange = (e) => {
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
				setImage(img);

				setImageSettings({ x: canvas.width / 2 - width / 2, y: canvas.height / 2 - height / 2, width: width, height: height, rotation: 0 });
			};

			img.src = event.target.result;
		};

		reader.readAsDataURL(file);
	};

	const renderMenus = () => {
		return (
			<ul className='interface vertical'>
				<li>
					<button onClick={() => tokenImageInputRef.current.click()}>Upload image</button>
					<input
						ref={tokenImageInputRef}
						type='file'
						name='tokenImage'
						id='tokenImageInput'
						onChange={handleFileChange}
						style={{ display: 'none' }}
					/>
				</li>
				<li>
					<button>Upload border</button>
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

	const startDrag = (e) => {
		const rect = canvasRef.current.getBoundingClientRect();
		setShowImageBox(true);
		setIsDragging(true);

		setDragOffset({ x: e.clientX - rect.left - imageSettings.x, y: e.clientY - rect.top - imageSettings.y });
	};

	const moveImage = (e) => {
		if (resizeData) {
			resize(e);
			return;
		}

		if (!isDragging) return;

		const rect = canvasRef.current.getBoundingClientRect();

		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		setImageSettings((prev) => {
			const x = mouseX - dragOffset.x;
			const y = mouseY - dragOffset.y;

			const minX = -dragOffset.x;
			const minY = -dragOffset.y;

			const maxX = canvasRef.current.width - dragOffset.x;
			const maxY = canvasRef.current.height - dragOffset.y;

			return { ...prev, x: Math.max(minX, Math.min(x, maxX)), y: Math.max(minY, Math.min(y, maxY)) };
		});
	};

	const stopDrag = () => {
		setIsDragging(false);
		setResizeData(null);
	};

	const startResize = (e, direction) => {
		e.preventDefault();
		e.stopPropagation();

		setShowImageBox(true);
		setIsDragging(false);

		setResizeData({ direction, startX: e.clientX, startY: e.clientY, ...imageSettings });
	};

	const resize = (e) => {
		if (!resizeData) return;

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();

		const dx = (e.clientX - resizeData.startX) * (canvas.width / rect.width);
		const dy = (e.clientY - resizeData.startY) * (canvas.height / rect.height);

		const { direction, x, y, width, height } = resizeData;

		const minWidth = 20;
		const minHeight = 20;
		const aspectRatio = width / height;

		let newX = x;
		let newY = y;
		let newWidth = width;
		let newHeight = height;

		let horizontal = 0;
		let vertical = 0;

		if (direction.includes('right')) {
			horizontal = dx;
		} else if (direction.includes('left')) {
			horizontal = -dx;
		}

		if (direction.includes('bottom')) {
			vertical = dy;
		} else if (direction.includes('top')) {
			vertical = -dy;
		}

		//if pressing shift preserve the aspect ratio, should also add a toggle
		if (e.shiftKey) {
			let scale;

			if (horizontal !== 0 && vertical !== 0) {
				scale = Math.abs(horizontal / width) > Math.abs(vertical / height) ? 1 + horizontal / width : 1 + vertical / height;
			} else if (horizontal !== 0) {
				scale = 1 + horizontal / width;
			} else {
				scale = 1 + vertical / height;
			}

			scale = Math.max(minWidth / width, minHeight / height, scale);

			newWidth = width * scale;
			newHeight = height * scale;
		} else {
			if (horizontal !== 0) {
				newWidth = Math.max(minWidth, width + horizontal);
			}

			if (vertical !== 0) {
				newHeight = Math.max(minHeight, height + vertical);
			}
		}

		if (direction.includes('left')) {
			newX = x + width - newWidth;
		}

		if (direction.includes('top')) {
			newY = y + height - newHeight;
		}

		setImageSettings((prev) => ({ ...prev, x: newX, y: newY, width: newWidth, height: newHeight }));
	};

	const toggleOffBoxes = () => {
		setShowImageBox(false);
	};

	const renderCanvasControls = () => {
		return (
			<div className='canvasControls'>
				<div
					className='imageControls'
					style={{
						width: imageSettings.width + 20,
						height: imageSettings.height + 20,
						top: imageSettings.y - 11,
						left: imageSettings.x - 11,
					}}
					onClick={(e) => {
						e.stopPropagation();
						setShowImageBox(true);
					}}>
					<div className={`imageControlBox${showImageBox ? ' visible' : ''}`} onMouseDown={startDrag}>
						<button className='boxButton topleft' onMouseDown={(e) => startResize(e, 'topleft')} />
						<button className='boxButton top' onMouseDown={(e) => startResize(e, 'top')} />
						<button className='boxButton topright' onMouseDown={(e) => startResize(e, 'topright')} />
						<button className='boxButton right' onMouseDown={(e) => startResize(e, 'right')} />
						<button className='boxButton bottomright' onMouseDown={(e) => startResize(e, 'bottomright')} />
						<button className='boxButton bottom' onMouseDown={(e) => startResize(e, 'bottom')} />
						<button className='boxButton bottomleft' onMouseDown={(e) => startResize(e, 'bottomleft')} />
						<button className='boxButton left' onMouseDown={(e) => startResize(e, 'left')} />
					</div>
				</div>
			</div>
		);
	};

	const renderCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (image) {
			ctx.save();
			ctx.translate(imageSettings.x + imageSettings.width / 2, imageSettings.y + imageSettings.height / 2);
			ctx.rotate((imageSettings.rotation * Math.PI) / 180);
			ctx.drawImage(image, -imageSettings.width / 2, -imageSettings.height / 2, imageSettings.width, imageSettings.height);
			ctx.restore();
		}

		if (border) {
			ctx.drawImage(border, 0, 0, canvas.width, canvas.height);
		}
	};

	useEffect(() => {
		renderCanvas();
	}, [image, border, imageSettings]);

	return (
		<div className={`tokens`} onClick={toggleOffBoxes}>
			<NaturalCritIcon />

			<h1>Personalized Tokens for online TTRPG play</h1>
			<p>Want to give your players a little something extra? Create a custom achievement badge just for them!</p>

			<div className='content'>
				{renderMenus()}
				<div className='canvasWrapper' onMouseMove={moveImage} onMouseUp={stopDrag} onMouseLeave={stopDrag}>
					<canvas width={400} height={400} ref={canvasRef}></canvas>
					{renderCanvasControls()}
				</div>
			</div>

			<p className='credit'>Disclaimer: No ai has been used to create any asset or code of this tool.</p>
		</div>
	);
};
export default Tokens;
