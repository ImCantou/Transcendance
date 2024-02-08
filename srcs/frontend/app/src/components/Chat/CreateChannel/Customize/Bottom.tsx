type BottomType = {
    previous: number;
    setPosition: any;
}

function Bottom({previous, setPosition} : BottomType) {
    return (
			<div
				id="bottom"
				className="absolute w-full h-[18%] bottom-0 inset-x-0 bg-[#eaecee] flex justify-between"
			>
				<button
                    className="bg-[#eaecee] text-black my-auto ml-4 w-24 h-12"
                    onClick={() => setPosition(previous)}
                >
					Back
				</button>
				<button
                    className="bg-[#cf7200] text-white my-auto mr-4 w-24 h-12"
                    onClick={() => setPosition(3)}
                >
					Create
				</button>
			</div>
    )
}

export default Bottom;