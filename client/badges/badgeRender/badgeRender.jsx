import './badgeRender.less';
import React, { useEffect, useRef, useState, useContext } from 'react';
import BadgeTemplate from './badgeTemplate.js';
import { BadgeContext } from '../badgeContext.jsx';

const iconAssets = import.meta.glob('../../assets/svg/elderberry-inn-icons/*.svg', { eager: true, query: '?url', import: 'default' });

const icons = Array.from({ length: 192 }, (_, index) => {
	const path = `../../assets/svg/elderberry-inn-icons/${index + 1}.svg`;
	return iconAssets[path] || null;
});

const escapeXML = (value) =>
	String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const recolorSVG = (svg, color) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(svg, 'image/svg+xml');

	doc.querySelectorAll('path, rect, circle, ellipse, polygon, polyline').forEach((element) => {
		const fill = element.getAttribute('fill');

		if (fill !== 'none') {
			element.setAttribute('fill', color);
		}

		const stroke = element.getAttribute('stroke');

		if (stroke && stroke !== 'none') {
			element.setAttribute('stroke', color);
		}
	});

	return new XMLSerializer().serializeToString(doc.documentElement);
};

const getTextLines = (value, maxWidth = 400) => {
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');

	ctx.font = 'bold 18px Calluna';

	const lines = [];
	let line = '';

	value.split(/\s+/).forEach((word) => {
		const testLine = line ? `${line} ${word}` : word;

		if (line && ctx.measureText(testLine).width > maxWidth) {
			lines.push(line);
			line = word;
		} else {
			line = testLine;
		}
	});

	if (line) lines.push(line);

	return lines;
};

const BadgeRender = () => {
	const { color, badgeSettings, textSettings, iconSettings } = useContext(BadgeContext);
	const { badgeHeight, badgeWidth } = badgeSettings;
	const { title, titleColor, titleFontFamily, text, textColor, textFontSize, textFontFamily } = textSettings;
	const { icon, rawSVG, iconWidth, iconPositionX, iconPositionY } = iconSettings;

	const svgRef = useRef(null);

	const padding = 20;
	const paddingBottom = 100;
	const titlePadding = padding * 3;
	const maxTextWidth = badgeWidth - padding * 2;

	const iconHeight = iconWidth;

	const [iconUrl, setIconUrl] = useState(null);

	useEffect(() => {
		let cancelled = false;

		getIconUrl().then((url) => {
			if (!cancelled) setIconUrl(url);
		});

		return () => {
			cancelled = true;
		};
	}, [icon, rawSVG, color]);

	const getIconUrl = async () => {
		if (rawSVG) {
			const recolored = recolorSVG(rawSVG, color);
			return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(recolored)))}`;
		}

		const url = icons[Number(icon) - 1];
		if (!url) return null;

		const response = await fetch(url);
		const svg = await response.text();

		const recolored = recolorSVG(svg, color);

		return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(recolored)))}`;
	};

	const createSVG = () => {
		const frame = BadgeTemplate(color);

		let titleSize = 35;

		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');

		ctx.font = `${titleSize}px Calluna`;

		while (ctx.measureText(title).width > badgeWidth - titlePadding - 10 && titleSize > 10) {
			titleSize--;
			ctx.font = `${titleSize}px Calluna`;
		}

		const lines = text ? getTextLines(text, maxTextWidth) : [];

		const description = () => {
			return lines
				.map(
					(line, index) => `
          <text
            x="${padding}"
            y="${badgeHeight + padding + index * 20}"
            font-family="${textFontFamily}"
            font-size="${textFontSize}"
            font-weight="bold"
            fill="${textColor}"
          >${escapeXML(line)}</text>
        `,
				)
				.join('');
		};

		return `
	<svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="${badgeWidth}"
        height="${badgeHeight + paddingBottom}"
        viewBox="0 0 ${badgeWidth} ${badgeHeight + paddingBottom}"
      >
        <image
          href="data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(frame)))}"
          x="0"
          y="0"
          width="${badgeWidth}"
          height="${badgeHeight}"
        />

        ${
			iconUrl
				? `
              <image
                href="${iconUrl}"
                x="${badgeWidth / 2 - iconWidth / 2 + iconPositionX}"
                y="${badgeHeight / 2 - iconHeight / 2 + iconPositionY}"
                width="${iconWidth}"
                height="${iconHeight}"
                preserveAspectRatio="xMidYMid meet"
              />
            `
				: ''
		}

        <text
          x="${badgeWidth / 2}"
          y="${badgeHeight - 110}"
          text-anchor="middle"
          dominant-baseline="middle"
          font-family="${titleFontFamily}"
          font-size="${titleSize}"
          fill="${titleColor}"
        >${escapeXML(title)}</text>

        ${description()}

        <text
          x="${badgeWidth / 2 - 47}"
          y="${badgeHeight + paddingBottom - 7}"
          font-family="Arial"
          font-size="9"
          fill="#bbb"
        >Made with NaturalCrit</text>
      </svg>
    `;
	};

	const svgContent = createSVG();

	useEffect(() => {
		const svg = svgRef.current;
		if (!svg) return;

		svg.innerHTML = svgContent.replace(/^<svg[^>]*>|<\/svg>$/g, '');
	}, [svgContent]);

	const handleDownload = () => {
		const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });

		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');

		const filename = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'badge';

		link.download = `${filename}.svg`;
		link.href = url;
		link.click();

		URL.revokeObjectURL(url);
	};

	return (
		<div className='badgeRender'>
			<div ref={svgRef} className='badgePreview' dangerouslySetInnerHTML={{ __html: svgContent }} />
			<div>
				<button onClick={handleDownload}>
					<i className='fa fa-download' />
					Download SVG
				</button>
			</div>
		</div>
	);
};

export default BadgeRender;
