import './controls.less';
import React, { useContext, useState } from 'react';

import { SliderPicker } from 'react-color';
import { BadgeContext } from '../badgeContext.jsx';

const iconAssets = import.meta.glob('../../assets/svg/elderberry-inn-icons/*.svg', { eager: true, query: '?url', import: 'default' });

const icons = Array.from({ length: 192 }, (_, index) => {
	const path = `../../assets/svg/elderberry-inn-icons/${index + 1}.svg`;
	return iconAssets[path] || null;
});

const Controls = () => {
	const { color, badgeSettings, textSettings, iconSettings, setTitle, setText, setColor, setIcon, setRawSVG } = useContext(BadgeContext);
	const { badgeHeight, badgeWidth } = badgeSettings;
	const { title, titleColor, titleFontFamily, text, textColor, textFontSize, textFontFamily } = textSettings;
	const { icon, rawSVG, iconWidth, iconPositionX, iconPositionY } = iconSettings;

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

		reader.onload = (e) => {
			setRawSVG(e.target.result);
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
				<input type='text' className='value' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Your title' />
			</div>

			<div className='field'>
				<label>Text</label>
				<textarea className='value' rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter your text here.' />
			</div>

			<div className='field'>
				<label>Badge Color</label>
				<SliderPicker className='value' color={color} onChange={(colorObj) => setColor(colorObj.hex)} />
			</div>
			<div className='field'>
				<label>Choose an icon</label>

				<div className='iconGrid'>
					{icons.map((src, index) => (
						<button
							key={index}
							type='button'
							className={`iconOption${!rawSVG && icon === index + 1 ? ' selected' : ''}`}
							onClick={() => {
								setIcon(index + 1);
								setRawSVG('');
							}}
							title={`Icon ${index + 1}`}
							aria-label={`Select icon ${index + 1}`}
							aria-pressed={!rawSVG && icon === index + 1}>
							{src && <img src={src} alt='' />}
						</button>
					))}
				</div>
			</div>
			<small>
				Icons by <a href='https://www.instagram.com/anaislalovi/'>Anaislalovi</a> for{' '}
				<a href='https://www.elderberry-inn.com/icons'>Elderberry Inn.</a>{' '}
			</small>
			<br />
			<br />

			<div className='field svg'>
				<label>Upload your own</label>

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
			</div>
		</div>
	);
};

export default Controls;
