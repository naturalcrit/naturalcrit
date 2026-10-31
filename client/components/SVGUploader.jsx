import React, { useState } from 'react';

const SVGUploader = ({ rawSVG, setRawSVG }) => {
	const [hover, setHover] = useState(false);

	const handleDrop = (e) => {
		e.preventDefault();

		const files = e.target.files || e.dataTransfer.files;
		const file = files?.[0];

		if (!file) return;

		if (file.type !== 'image/svg+xml' && !file.name.endsWith('.svg')) {
			console.error('Please upload an SVG file.');
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => setRawSVG(e.target.result);
		reader.onerror = () => console.error('Failed to read SVG file.');
		reader.readAsText(file);
		setHover(false);
		if (e.target.value) e.target.value = '';
	};

	return (
		<div className='value'>
			<div
				className={`dropZone${hover ? ' hover' : ''}`}
				onDragOver={(e) => {
					e.preventDefault();
					setHover(true);
				}}
				onDragLeave={(e) => {
					e.preventDefault();
					setHover(false);
				}}
				onDrop={handleDrop}>
				<i className='fa fa-arrow-down' />
				<p>Drop SVG here</p>
			</div>
			<input type='file' accept='.svg,image/svg+xml' onChange={handleDrop} />
			<p>
				Upload a custom SVG or download an icon from{' '}
				<a href='https://thenounproject.com/' target='_blank' rel='noopener noreferrer'>
					The Noun Project
				</a>
				.
			</p>
			{rawSVG && (
				<div className='custom-svg-status'>
					<span>Custom SVG selected</span>
					<button type='button' onClick={() => setRawSVG('')}>
						Remove custom SVG
					</button>
				</div>
			)}
		</div>
	);
};

export default SVGUploader;
