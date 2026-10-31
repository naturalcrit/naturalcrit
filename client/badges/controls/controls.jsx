import './controls.less';
import React, { useContext } from 'react';

import SVGUploader from '../../components/SVGUploader.jsx';
import { BadgeContext } from '../badgeContext.jsx';

const iconAssets = import.meta.glob('../../assets/svg/elderberry-inn-icons/*.svg', { eager: true, query: '?url', import: 'default' });

const icons = Array.from({ length: 192 }, (_, index) => {
	const path = `../../assets/svg/elderberry-inn-icons/${index + 1}.svg`;
	return iconAssets[path] || null;
});

const Controls = () => {
	const {
		color,
		badgeSettings,
		textSettings,
		iconSettings,
		setBadgeHeight,
		setBadgeWidth,
		setTitle,
		setTitleColor,
		setTitleFontFamily,
		setText,
		setTextColor,
		setTextFontSize,
		setTextFontFamily,
		setColor,
		setIcon,
		setRawSVG,
		setIconWidth,
		setIconPositionX,
		setIconPositionY,
	} = useContext(BadgeContext);

	const { badgeHeight, badgeWidth } = badgeSettings;

	const { title, titleColor, titleFontFamily, text, textColor, textFontSize, textFontFamily } = textSettings;

	const { icon, rawSVG, iconWidth, iconPositionX, iconPositionY } = iconSettings;

	return (
		<div className='controls'>
			<fieldset>
				<legend>Badge settings</legend>

				<div className='field'>
					<label>Badge width: {badgeWidth}px</label>
					<input
						type='range'
						className='value'
						min='200'
						max='800'
						value={badgeWidth}
						onChange={(e) => setBadgeWidth(Number(e.target.value))}
					/>
				</div>

				<div className='field'>
					<label>Badge height: {badgeHeight}px</label>
					<input
						type='range'
						className='value'
						min='200'
						max='800'
						value={badgeHeight}
						onChange={(e) => setBadgeHeight(Number(e.target.value))}
					/>
				</div>

				<div className='field'>
					<label>Badge color</label>
					<input defaultValue = '#2c3e50' value={color} type='color' onChange={(e) => setColor(e.target.value)} />
				</div>
			</fieldset>

			<fieldset>
				<legend>Text settings</legend>

				<div className='field'>
					<label>Title</label>
					<input type='text' className='value' value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Your title' />
				</div>

				<div className='field'>
					<label>Title color</label>
					<input defaultValue={titleColor} type='color' onChange={(e) => setTitleColor(e.target.value)} />
				</div>

				<div className='field'>
					<label>Title font family</label>
					<input
						type='text'
						className='value'
						value={titleFontFamily}
						onChange={(e) => setTitleFontFamily(e.target.value)}
						placeholder='Calluna'
					/>
				</div>

				<div className='field label-top'>
					<label>Text</label>
					<textarea className='value' rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder='Enter your text here.' />
				</div>

				<div className='field'>
					<label>Text color</label>
					<input defaultValue={textColor} type='color' onChange={(e) => setTextColor(e.target.value)} />
				</div>

				<div className='field'>
					<label>Text font family</label>
					<input
						type='text'
						className='value'
						value={textFontFamily}
						onChange={(e) => setTextFontFamily(e.target.value)}
						placeholder='Calluna'
					/>
				</div>

				<div className='field'>
					<label>Text font size: {textFontSize}px</label>
					<input
						type='range'
						className='value'
						min='8'
						step='1'
						max='48'
						value={textFontSize}
						onChange={(e) => setTextFontSize(Number(e.target.value))}
					/>
				</div>
			</fieldset>

			<fieldset>
				<legend>Icon settings</legend>

				<div className='field label-top'>
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

				<div className='field svg label-top'>
					<label>Upload your own</label>
					<SVGUploader rawSVG={rawSVG} setRawSVG={setRawSVG} />
				</div>

				<div className='field'>
					<label>Icon width: {iconWidth}px</label>
					<input
						type='range'
						className='value'
						min='20'
						step='10'
						max='400'
						value={iconWidth}
						onChange={(e) => setIconWidth(Number(e.target.value))}
					/>
				</div>

				<div className='field'>
					<label>Icon horizontal position: {iconPositionX}px</label>
					<input
						type='range'
						className='value'
						min='-200'
						step='10'
						max='200'
						value={iconPositionX}
						onChange={(e) => setIconPositionX(Number(e.target.value))}
					/>
				</div>

				<div className='field'>
					<label>Icon vertical position: {iconPositionY}px</label>
					<input
						type='range'
						className='value'
						min='-200'
						step='10'
						max='200'
						value={iconPositionY}
						onChange={(e) => setIconPositionY(Number(e.target.value))}
					/>
				</div>
			</fieldset>
		</div>
	);
};

export default Controls;
