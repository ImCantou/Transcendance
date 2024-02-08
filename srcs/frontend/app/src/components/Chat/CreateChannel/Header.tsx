type HeaderType = {
	title: string;
	description: string;
};

function Header({ title, description }: HeaderType) {
	return (
		<div id="header" className="mt-8 h-20">
			<div
				id="header-text"
				className="flex flex-col items-center text-white"
			>
				<h2 className="text-3xl font-bold">{title}</h2>
				<p className="text-sl text-center w-11/12">{description}</p>
			</div>
		</div>
	);
}

export default Header;