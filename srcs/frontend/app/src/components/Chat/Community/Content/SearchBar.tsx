import { FaSearch } from "react-icons/fa";

type SearchBarType = {
	query: string;
	setQuery: any;
};

function SearchBar({ query, setQuery }: SearchBarType) {
	return (
		<>
			<FaSearch className="w-5 h-5" />
			<input
				type="text"
				placeholder="Search for a channel..."
				className="px-2 mx-auto my-3 rounded-md w-[97%] h-12 outline-none bg-zinc-800 text-white"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
			/>
		</>
	);
}

export default SearchBar;
