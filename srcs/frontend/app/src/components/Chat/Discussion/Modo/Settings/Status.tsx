type StatusType = {
	status: string;
	setStatus: any;
	password: string;
	setPassword: any;
};

function Status({ status, setStatus, password, setPassword }: StatusType) {
	return (
		<div className="flex w-full">
			<select
				name="selectedStatus"
				defaultValue={status}
				onChange={(e) => {
					setStatus(e.target.value);
				}}
				className="px-2 py-2 mx-3 rounded-md  text-white font-semibold text-xl"
			>
				<option value="public">Public</option>
				<option value="private">Private</option>
				<option value="protect">Protect</option>
			</select>
			{status == "protect" ? (
				<div className="flex flex-col">
					<h2 className="text-white font-semibold text-xl">
						Password :
					</h2>
					<input
						type="password"
						value={password}
						className="bg-[#424549] rounded-md w-72 h-6 text-xl text-center py-4"
						onChange={(e) => {
							setPassword(e.target.value);
						}}
					/>
				</div>
			) : null}
		</div>
	);
}

export default Status;
