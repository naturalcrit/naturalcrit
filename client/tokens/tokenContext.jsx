import React, { createContext, useEffect, useRef, useState } from 'react';

const TokenContext = createContext(null);

const TokenProvider = ({ parentRef, children }) => {
	const canvasRef = useRef(null);

	//data
	const [image, setImage] = useState(null);
	const [border, setBorder] = useState(null);
	//data settings
	const [imageSettings, setImageSettings] = useState({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });
    const [borderSettings, setBorderSettings] = useState({ x: 0, y: 0, width: 0, height: 0, rotation: 0 });

	//controls
	const [isDragging, setIsDragging] = useState(false);
	const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
	const [resizeData, setResizeData] = useState(null);

	//interface
	const [showImageBox, setShowImageBox] = useState(false);
    const [showBorderBox, setShowBorderBox] = useState(false);

	useEffect(() => {
		if (!parentRef.current) return null;
		parentRef.current.addEventListener('click', () =>toggleBoxesOff());
		return () => parentRef.current.removeEventListener('click', () =>toggleBoxesOff());
	}, []);


    const toggleBoxesOff = ()=>{
        setShowImageBox(false);
        setShowBorderBox(false);
    }

	const value = {
		canvasRef,

		image,
		border,
		imageSettings,
        borderSettings,

		isDragging,
		dragOffset,
		resizeData,
		showImageBox,
        showBorderBox,

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
	};

	return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>;
};

export { TokenContext };
export default TokenProvider;
