type RoomInputType = {
	query: string;
	setQuery: any;
	direct: boolean;
};

function RoomInput({ query, setQuery, direct }: RoomInputType) {
	return (
		<div className="h-20 w-full flex justify-center items-center">
			<div className="flex w-11/12 h-12 mx-auto bg-[#2b2a33] rounded items-center">
				<svg
					fill="currentColor"
					viewBox="0 0 512 512"
					className="px-2 flex items-center justify-center"
					height="40px"
					width="40px"
				>
					<path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
				</svg>
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="rounded-none h-full px-2 w-full outline-none bg-[#2b2a33]"
					placeholder={
						direct ? "Search for a DM..." : "Search for a room..."
					}
				/>
			</div>
		</div>
	);
}

export default RoomInput;
