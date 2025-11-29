import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import BadgeTemplate from './badgeTemplate.js';

import './badgeRender.less';

const replaceAll = (text, target, str)=>text.replace(new RegExp(target, 'g'), str);

const BadgeRender = ({ title = '', text = '', rawSVG = '', color = '#333' })=>{
	const canvasRef = useRef(null);
	const ctxRef = useRef(null);

	useEffect(()=>{
		if (canvasRef.current) {
			ctxRef.current = canvasRef.current.getContext('2d');
			drawBadge({ title, text, rawSVG, color });
		}
	}, []);

	useEffect(()=>{
		drawBadge({ title, text, rawSVG, color });
	}, [title, text, rawSVG, color]);

	const handleDownload = ()=>{
		if (!canvasRef.current) return;
		const target = document.createElement('a');
		const name = title ? _.snakeCase(title) : 'badge';
		target.download = `${name}.png`;
		target.href = canvasRef.current
			.toDataURL('image/png')
			.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
		target.click();
	};

	const clearCanvas = ()=>{
		if (!ctxRef.current || !canvasRef.current) return;
		ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
	};

	const readyFrame = (color)=>new Promise((resolve)=>{
		const frame = new Image();
		frame.src = `data:image/svg+xml;base64,${btoa(BadgeTemplate(color))}`;
		frame.onload = ()=>resolve(frame);
	});

	const readyIconSVG = (props)=>new Promise((resolve)=>{
		if (!props.rawSVG) return resolve();
		const icon = new Image();
		let svg = props.rawSVG || '';
		if (!svg.includes('style=')) {
			svg = _.reduce(
				['path', 'rect', 'polygon', 'circle', 'polyline', 'ellipse'],
				(acc, type)=>replaceAll(acc, `<${type}`, `<${type} style="fill:${props.color}"`),
				svg
			);
		}
		svg = svg.replace(/<text.*<\/text>/, '');
		icon.onload = ()=>resolve(icon);
		icon.src = `data:image/svg+xml;base64,${btoa(svg)}`;
	});

	const drawSVG = (props)=>Promise.all([readyFrame(props.color), readyIconSVG(props)]).then(([frame, icon])=>{
		if (!ctxRef.current) return;
		clearCanvas();
		if (frame) ctxRef.current.drawImage(frame, 0, 0);
		if (icon) {
			const scale = 1.1;
			const newWidth = icon.width * scale;
			const newHeight = icon.height * scale;
			ctxRef.current.drawImage(icon, 150 - newWidth / 2, 120 - newWidth / 2, newWidth, newHeight);
		}
	});

	const drawTitle = (title)=>{
		if (!ctxRef.current) return;
		ctxRef.current.textAlign = 'center';
		ctxRef.current.textBaseline = 'middle';
		ctxRef.current.fillStyle = '#ffffff';
		const trySize = (font)=>{
			ctxRef.current.font = `${font}px Calluna`;
			const length = ctxRef.current.measureText(title).width;
			if (length >= 230) return trySize(font - 1);
			return font;
		};
		const finalSize = trySize(35);
		ctxRef.current.fillText(title, 150, 220);
	};

	const drawText = (text)=>{
		if (!ctxRef.current || !canvasRef.current) return;
		ctxRef.current.textAlign = 'left';
		ctxRef.current.font = 'bold 18px Calluna';
		ctxRef.current.fillStyle = '#000';
		const lines = _.reduce(
			text.split(' '),
			(acc, word)=>{
				const currLine = _.last(acc);
				const length = ctxRef.current.measureText(`${currLine.join(' ')} ${word}`).width;
				if (length >= canvasRef.current.width - 30) {
					acc.push([word]);
				} else {
					currLine.push(word);
				}
				return acc;
			},
			[[]]
		);
		_.each(lines, (line, index)=>{
			ctxRef.current.fillText(line.join(' '), 15, 315 + index * 20);
		});
	};

	const drawAttribution = (svg)=>{
		if (!ctxRef.current || !canvasRef.current) return;
		ctxRef.current.textAlign = 'left';
		ctxRef.current.font = '9px Open Sans';
		ctxRef.current.fillStyle = '#bbb';
		let maxDepth = 95;
		const check = svg.match(/<text.*<\/text>/);
		if (check && check.length) {
			const a = check[0].indexOf('Created by ') + 11;
			const b = check[0].indexOf('</text>');
			const author = check[0].substring(a, b);
			const width = ctxRef.current.measureText(`Icon by ${author}`).width;
			maxDepth = Math.max(maxDepth, width + 3);
			ctxRef.current.fillText(
				`Icon by ${author}`,
				canvasRef.current.width - maxDepth,
				canvasRef.current.height - 17
			);
		}
		ctxRef.current.fillText(
			`Made with NaturalCrit`,
			canvasRef.current.width - maxDepth,
			canvasRef.current.height - 7
		);
	};

	const drawBadge = (props)=>{
		if (!canvasRef.current) return;
		const height = props.text ? 400 : 320;
		if (canvasRef.current.height !== height) canvasRef.current.height = height;
		drawSVG(props).then(()=>{
			drawTitle(props.title);
			drawText(props.text);
			drawAttribution(props.rawSVG);
		});
	};

	return (
		<div className='badgeRender'>
			<canvas ref={canvasRef} width={300} height={320} />
			<div>
				<button onClick={handleDownload}>
					<i className='fa fa-download' />
					Download
				</button>
			</div>
		</div>
	);
};

export default BadgeRender;
