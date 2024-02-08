import { useState } from "react";
import { useNavigate } from "react-router";
import { FaSearch } from "react-icons/fa";
import {usernameProtection} from "../../utils/regexUsernameProtection";
import { notifyError } from "../../utils/notify";

export function SearchUserInput() {
	const [search, setSearch] = useState("");
	const navigate = useNavigate();
	function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
		setSearch(event.target.value);
	}
	function handleEnterKey(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key == "Enter") {
			if (!usernameProtection(search))
				notifyError("Username not valid")
			else
				navigate("/profile/" + search);
			setSearch("");
		}
	}
	return (
		<div className="flex items-center">
			<div className="flex items-center h-14 bg-zinc-700 px-5 py-2 rounded-full">
				<FaSearch className="w-5 h-5" />
				<input
					className=" px-2 w-48 bg-zinc-700 outline-none"
					type="search"
					placeholder="Search a user..."
					value={search}
					onKeyDown={handleEnterKey}
					onChange={handleSearch}
				></input>
			</div>
		</div>
	);
}
