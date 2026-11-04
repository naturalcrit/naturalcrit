import React, { useContext, useEffect } from 'react';
import './tokens.css';
import { TokenContext } from './tokenContext';

const TokenCanvasRender = () => {
	const {
		canvasRef,

		// Data
		image,
		border,
		imageSettings,
		borderSettings,

		// State
		isDragging,
		dragOffset,
		resizeData,
		showImageBox,
		showBorderBox,

		// Setters
		setImageSettings,
		setBorderSettings,
		setIsDragging,
		setDragOffset,
		setResizeData,
		setShowImageBox,
		setShowBorderBox,
	} = useContext(TokenContext);

	// Get settings and setter for selected object
	const getObjectData = (object) => {
		if (object === 'image') {
			return { settings: imageSettings, setSettings: setImageSettings };
		}

		return { settings: borderSettings, setSettings: setBorderSettings };
	};

	// Start dragging
	const startDrag = (e, object) => {
		e.stopPropagation();

		const { settings } = getObjectData(object);
		const rect = canvasRef.current.getBoundingClientRect();

		setShowImageBox(object === 'image');
		setShowBorderBox(object === 'border');

		setIsDragging(true);

		setDragOffset({ x: e.clientX - rect.left - settings.x, y: e.clientY - rect.top - settings.y, object });
	};

	// Move selected object
	const moveImage = (e) => {
		if (resizeData) {
			resize(e);
			return;
		}

		if (!isDragging) return;

		const { object } = dragOffset;
		const { setSettings } = getObjectData(object);

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();

		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		setSettings((prev) => {
			const x = mouseX * scaleX - dragOffset.x;
			const y = mouseY * scaleY - dragOffset.y;

			const minX = -dragOffset.x;
			const minY = -dragOffset.y;

			const maxX = canvas.width - dragOffset.x;
			const maxY = canvas.height - dragOffset.y;

			return { ...prev, x: Math.max(minX, Math.min(x, maxX)), y: Math.max(minY, Math.min(y, maxY)) };
		});
	};

	// Stop dragging or resizing
	const stopDrag = () => {
		setIsDragging(false);
		setResizeData(null);
	};

	// Start resizing
	const startResize = (e, object, direction) => {
		e.preventDefault();
		e.stopPropagation();

		const { settings } = getObjectData(object);

		setShowImageBox(object === 'image');
		setShowBorderBox(object === 'border');

		setIsDragging(false);

		setResizeData({ object, direction, startX: e.clientX, startY: e.clientY, ...settings });
	};

	// Resize selected object
	const resize = (e) => {
		if (!resizeData) return;

		const { object, direction, startX, startY, x, y, width, height } = resizeData;

		const canvas = canvasRef.current;
		const rect = canvas.getBoundingClientRect();

		const scaleX = canvas.width / rect.width;
		const scaleY = canvas.height / rect.height;

		const dx = (e.clientX - startX) * scaleX;
		const dy = (e.clientY - startY) * scaleY;

		const hasLeft = direction.includes('left');
		const hasRight = direction.includes('right');
		const hasTop = direction.includes('top');
		const hasBottom = direction.includes('bottom');

		let newWidth = width;
		let newHeight = height;

		if (hasLeft) newWidth = width - dx;
		if (hasRight) newWidth = width + dx;
		if (hasTop) newHeight = height - dy;
		if (hasBottom) newHeight = height + dy;

		// Maintain aspect ratio when Shift is pressed.
		if (e.shiftKey) {
			let factor;

			if (hasLeft || hasRight) {
				factor = newWidth / width;
			} else {
				factor = newHeight / height;
			}

			factor = Math.max(0.05, factor);

			newWidth = width * factor;
			newHeight = height * factor;
		}

		// Prevent negative or zero dimensions.
		newWidth = Math.max(1, newWidth);
		newHeight = Math.max(1, newHeight);

		let newX = x;
		let newY = y;

		if (e.altKey) {
			// Resize symmetrically around the center.
			newX = x + (width - newWidth) / 2;
			newY = y + (height - newHeight) / 2;
		} else if (e.shiftKey) {
			// Shift: anchor the center of the opposite edge.
			if (hasTop) {
				newX = x + (width - newWidth) / 2;
				newY = y + height - newHeight;
			} else if (hasBottom) {
				newX = x + (width - newWidth) / 2;
				newY = y;
			} else if (hasLeft) {
				newX = x + width - newWidth;
				newY = y + (height - newHeight) / 2;
			} else if (hasRight) {
				newX = x;
				newY = y + (height - newHeight) / 2;
			}
		} else {
			// Normal: anchor the opposite handle.
			if (hasLeft) newX = x + width - newWidth;
			if (hasTop) newY = y + height - newHeight;
		}

		const setters = { image: setImageSettings, border: setBorderSettings };

		setters[object]((prev) => ({ ...prev, x: newX, y: newY, width: newWidth, height: newHeight }));
	};
	// Render selection controls for either object
	const renderObjectControls = (object, settings, visible) => {
		return (
			<div
				className='imageControls'
				style={{ width: settings.width + 20, height: settings.height + 20, top: settings.y - 11, left: settings.x - 11 }}
				onClick={(e) => {
					e.stopPropagation();
					setShowImageBox(object === 'image');
					setShowBorderBox(object === 'border');
				}}>
				<div className={`imageControlBox${visible ? ' visible' : ''}`} onMouseDown={(e) => startDrag(e, object)}>
					<button className='boxButton topleft' onMouseDown={(e) => startResize(e, object, 'topleft')} />
					<button className='boxButton top' onMouseDown={(e) => startResize(e, object, 'top')} />
					<button className='boxButton topright' onMouseDown={(e) => startResize(e, object, 'topright')} />
					<button className='boxButton right' onMouseDown={(e) => startResize(e, object, 'right')} />
					<button className='boxButton bottomright' onMouseDown={(e) => startResize(e, object, 'bottomright')} />
					<button className='boxButton bottom' onMouseDown={(e) => startResize(e, object, 'bottom')} />
					<button className='boxButton bottomleft' onMouseDown={(e) => startResize(e, object, 'bottomleft')} />
					<button className='boxButton left' onMouseDown={(e) => startResize(e, object, 'left')} />
				</div>
			</div>
		);
	};

	// Render canvas
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
			ctx.save();

			ctx.translate(borderSettings.x + borderSettings.width / 2, borderSettings.y + borderSettings.height / 2);

			ctx.rotate((borderSettings.rotation * Math.PI) / 180);

			ctx.drawImage(border, -borderSettings.width / 2, -borderSettings.height / 2, borderSettings.width, borderSettings.height);

			ctx.restore();
		}
	};

	useEffect(() => {
		renderCanvas();
	}, [image, border, imageSettings, borderSettings]);

	return (
		<div className='canvasWrapper' onMouseMove={moveImage} onMouseUp={stopDrag} onMouseLeave={stopDrag}>
			<canvas width={400} height={400} ref={canvasRef} />

			<div className='canvasControls'>
				{image && renderObjectControls('image', imageSettings, showImageBox)}

				{border && renderObjectControls('border', borderSettings, showBorderBox)}
			</div>
		</div>
	);
};

export default TokenCanvasRender;
