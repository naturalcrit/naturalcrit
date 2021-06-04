module.exports = (color = '#666')=>{


	function shadeColor2(color, percent) {
		var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
		return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
	}

	const light = shadeColor2(color, 0.4);
	const dark = shadeColor2(color, -0.3);


	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 344.83 341.02"><defs><style>.cls-1{fill:${color};}.cls-2{fill:${light};}.cls-3{fill:${dark};}</style></defs><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polygon class="cls-1" points="344.83 291.26 297.49 291.26 297.49 239.3 344.83 239.3 324.5 264.36 344.83 291.26"/><polygon class="cls-1" points="0 239.3 47.34 239.3 47.34 291.26 0 291.26 20.34 266.2 0 239.3"/><path class="cls-1" d="M172.42,341,93.87,283.33A139.56,139.56,0,0,1,37.13,171.25V32.78L60.05,29.9A429.26,429.26,0,0,0,163.15,3.64L172.43,0l8,3.16A429.34,429.34,0,0,0,283.73,29.73l24,3.06V171.25A139.56,139.56,0,0,1,251,283.33l-6.32-8.61,6.32,8.61ZM58.49,51.62V171.25a118.13,118.13,0,0,0,48,94.87l65.9,48.41,65.9-48.41a118.13,118.13,0,0,0,48-94.87V51.6L281,50.92A450.67,450.67,0,0,1,172.57,23L172.4,23l-1.46.57A450.65,450.65,0,0,1,62.71,51.09Z"/><path class="cls-1" d="M172.42,341,93.87,283.33A139.56,139.56,0,0,1,37.13,171.25V32.78L60.05,29.9A429.26,429.26,0,0,0,163.15,3.64L172.43,0l8,3.16A429.34,429.34,0,0,0,283.73,29.73l24,3.06V171.25A139.56,139.56,0,0,1,251,283.33l-6.32-8.61,6.32,8.61ZM58.49,51.62V171.25a118.13,118.13,0,0,0,48,94.87l65.9,48.41,65.9-48.41a118.13,118.13,0,0,0,48-94.87V51.6L281,50.92A450.67,450.67,0,0,1,172.57,23L172.4,23l-1.46.57A450.65,450.65,0,0,1,62.71,51.09Z"/><path class="cls-1" d="M172.42,302.22l-60-44.09a108.18,108.18,0,0,1-44-86.88V60.37L73,59.7A461.13,461.13,0,0,0,170.5,34.33l1.9-.72,1.9.72a461.12,461.12,0,0,0,97.56,25.35l4.57.67V171.25a108.18,108.18,0,0,1-44,86.88ZM79.08,69.58V171.25a97.46,97.46,0,0,0,39.62,78.27L172.42,289l53.71-39.45a97.46,97.46,0,0,0,39.63-78.27V69.55A471.85,471.85,0,0,1,172.4,45,472,472,0,0,1,79.08,69.58Z"/><rect class="cls-2" x="27.78" y="223.53" width="289.27" height="51.96"/><polygon class="cls-3" points="317.05 275.49 297.49 275.49 297.49 291.26 317.05 275.49"/><polygon class="cls-3" points="27.78 275.49 47.34 275.49 47.34 291.26 27.78 275.49"/></g></g></svg>`;
}