import React, { useState } from 'react';
import './controls.less';

import { SliderPicker } from 'react-color';

// Load all 192 icons
const iconAssets = import.meta.glob('../../assets/svg/elderberry-inn-icons/*.svg', { eager: true, query: '?url', import: 'default' });

const icons = Array.from({ length: 192 }, (_, index) => {
	const path = `../../assets/svg/elderberry-inn-icons/${index + 1}.svg`;
	return iconAssets[path] || null;
});

const Controls = ({ data = { title, text, color, icon, rawSVG }, onChange = () => {} }) => {
	const [hover, setHover] = useState(false);

	const handleChange = (path, value) => {
		onChange({ [path]: value });
	};

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

		reader.onload = (event) => {
			handleChange('rawSVG', event.target.result);
		};

		reader.onerror = () => {
			console.error('Failed to read SVG file.');
		};

		reader.readAsText(file);
		setHover(false);

		if (e.target.value) e.target.value = '';
	};

	return (
		<div className='controls'>
			<div className='field'>
				<label>Title</label>
				<input type='text' className='value' value={data.title} onChange={(e) => handleChange('title', e.target.value)} />
			</div>

			<div className='field'>
				<label>Text</label>
				<textarea className='value' rows={3} value={data.text} onChange={(e) => handleChange('text', e.target.value)} />
			</div>

			<div className='field'>
				<label>Badge Color</label>
				<SliderPicker className='value' color={data.color} onChange={(colorObj) => handleChange('color', colorObj.hex)} />
			</div>
			<div className='field'>
				<label>Choose an icon</label>

				<div className='iconGrid'>
					{icons.map((src, index) => (
						<button
							key={index}
							type='button'
							className={`iconOption${!data.rawSVG && data.icon === index + 1 ? ' selected' : ''}`}
							onClick={() => {
								handleChange('icon', index + 1);
								handleChange('rawSVG', '');
							}}
							title={`Icon ${index + 1}`}
							aria-label={`Select icon ${index + 1}`}
							aria-pressed={!data.rawSVG && data.icon === index + 1}>
							{src && <img src={src} alt='' />}
						</button>
					))}
				</div>
			</div>

			<div className='field svg'>
				<label>Custom SVG</label>

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

					{data.rawSVG && (
						<div className='custom-svg-status'>
							<span>Custom SVG selected</span>
							<button type='button' onClick={() => handleChange('rawSVG', '')}>
								Remove custom SVG
							</button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Controls;
