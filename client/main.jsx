import React from 'react';
import { createRoot } from 'react-dom/client';
import Naturalcrit from './naturalcrit/naturalcrit.jsx';

const props = typeof window !== 'undefined' && window.__INITIAL_PROPS__ ? window.__INITIAL_PROPS__ : {};
const { user = null, domain = window.domain, environment = [process.env.NODE_ENV, ''] } = props;

createRoot(document.getElementById('root')).render(
	<Naturalcrit user={user} url={window.location.pathname} tools={[]} domain={domain} environment={environment} />
);
