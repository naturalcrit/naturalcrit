import React, { useState } from 'react';
import './controls.less';

import { SliderPicker } from 'react-color';

const Controls = ({ data = { title: '', text: '', color: '#2b4486', icon: 42, rawSVG: '' }, onChange = () => {} }) => {
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

		// Allow selecting the same file again
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
				<label>Color</label>
				<SliderPicker className='value' color={data.color} onChange={(colorObj) => handleChange('color', colorObj.hex)} />
			</div>

			<div className='field'>
				<label>Icon</label>
				<select
					className='value'
					value={data.icon}
					onChange={(e) => {
						handleChange('icon', Number(e.target.value));
						handleChange('rawSVG', '');
					}}>
					{Array.from({ length: 192 }, (_, index) => (
						<option key={index + 1} value={index + 1}>
							Icon {index + 1}
						</option>
					))}
				</select>
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
