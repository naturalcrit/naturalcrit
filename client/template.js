module.exports = function (vitreum) {
	return `
<!DOCTYPE html>
<html>
	<head>
		<link href="//use.fontawesome.com/releases/v6.5.1/css/all.css" rel="stylesheet" type="text/css">
		<link href="//fonts.googleapis.com/css?family=Open+Sans:400,300,600,700" rel="stylesheet" type="text/css" />

		<!--Favicons for desktop, apple and android apps-->
		<link rel="icon" type="image/png" href="/assets/favicon/favicon-96x96.png" sizes="96x96" />
		<link rel="icon" type="image/svg+xml" href="/assets/favicon/favicon.svg" />
		<link rel="shortcut icon" href="/assets/favicon/favicon.ico" />
		<link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-touch-icon.png" />

		<title>NaturalCrit - D&D Tools</title>
		${vitreum.head}
	</head>
	<body>
		<main id="reactRoot">${vitreum.body}</main>
	</body>
	${vitreum.js}
</html>
`;
};
