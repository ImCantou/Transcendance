type NameType = {
	name: string;
	setName: any;
};

function Name({ name, setName }: NameType) {
	return (
		<div className="flex flex-row items-center w-11/12 mx-auto h-1/3">
			<h2 className="px-1 w-3/12 text-white font-bold text-xl">
				Room name:
			</h2>
			<input
				type="text"
				className="bg-[#424549] rounded-md w-6/12 h-1/4 text-center text-white font-semibold text-xl"
				value={name}
				placeholder="Cannot leave a channel without a name."
				onChange={(e) => setName(e.target.value)}
			/>
		</div>
	);
}

export default Name;
