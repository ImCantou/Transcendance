type InputRoomNameType = {
	result: string;
	setResult: any;
};

function InputRoomName({ result, setResult }: InputRoomNameType) {
	return (
		<div id="name" className="flex flex-col justify-center items-center h-[calc(542px-210px)] w-full my-auto">
			<h3 className="text-white text-xl text-left w-11/12 mx-auto mb-2">
				Room name
			</h3>
			<input
				type="text"
				className="bg-[#27272a] w-11/12 h-8 rounded-sm text-white outline-none mx-auto px-2"
				value={result}
				onChange={(e) => setResult(e.target.value)}
			/>
		</div>
	);
}

export default InputRoomName;