import React, { useRef, useContext, useState, useEffect } from 'react';
import './tokens.css';
import { TokenContext } from './tokenContext';

const TokenCanvasRender = () => {
    const {
		//ref
        canvasRef,
		tokenImageInputRef,

        //state
		image,
		border,
		imageSettings,
        borderSettings,

		isDragging,
		dragOffset,
		resizeData,
		showImageBox,
        showBorderBox,

        //setters
		setImage,
		setBorder,
		setImageSettings,
        setBorderSettings,
		setIsDragging,
		setDragOffset,
		setResizeData,
        setShowImageBox,
        setShowBorderBox,
        
        //functions
        
	} = useContext(TokenContext);

	const startDrag = (e) => {
		const rect = canvasRef.current.getBoundingClientRect();
		setShowImageBox(true);
		setIsDragging(true);

		setDragOffset({ x: e.clientX - rect.left - imageSettings.x, y: e.clientY - rect.top - imageSettings.y });
	};

	const moveImage = (e, object) => {
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

	const startResize = (e,object, direction) => {
		e.preventDefault();
		e.stopPropagation();

		setShowImageBox(true);
		setIsDragging(false);

		setResizeData({ direction, startX: e.clientX, startY: e.clientY, ...imageSettings });
	};

	const resize = (e, object) => {
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
                        setShowBorderBox(false);
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

                <div
					className='imageControls'
					style={{
						width: borderSettings.width + 20,
						height: borderSettings.height + 20,
						top: borderSettings.y - 11,
						left: borderSettings.x - 11,
					}}
					onClick={(e) => {
						e.stopPropagation();
						setShowBorderBox(true);
                        setShowImageFalse(true);
					}}>
					<div className={`imageControlBox${showBorderBox ? ' visible' : ''}`} onMouseDown={startDrag}>
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
			<canvas width={400} height={400} ref={canvasRef}></canvas>
			{renderCanvasControls()}
		</div>
	);
};

export default TokenCanvasRender;
