type HeaderType = {
	query: string;
	setQuery: any;
	setType: any;
};

function Header({ query, setQuery, setType }: HeaderType) {
	return (
		<div
			id="header"
			className="flex flex-col w-full h-20 justify-center mt-2"
		>
			<input
				type="text"
				className="bg-[#424549] rounded-2xl outline-none w-[90%] h-16 px-4 mx-auto"
				placeholder="Search User..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
			<div className="flex flex-row-reverse h-5 pt-2 w-[90%] mx-auto items-center">
				<div className="flex flex-row">
					<p className="px-1">Bans :</p>
					<input
						type="radio"
						value={1}
						onChange={(e) => {
							setType(e.target.value);
						}}
						name="type"
					/>
				</div>
				<div className="flex flex-row">
					<p className="px-1">Users :</p>
					<input
						type="radio"
						value={0}
						onChange={(e) => {
							setType(e.target.value);
						}}
						name="type"
					/>
				</div>
			</div>
		</div>
	);
}

export default Header;
