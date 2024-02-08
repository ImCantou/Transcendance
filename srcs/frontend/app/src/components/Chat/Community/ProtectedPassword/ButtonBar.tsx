type ButtonBarType = {
	backButton: any;
	joinButton: any;
	password: string;
};

function ButtonBar({ backButton, password, joinButton }: ButtonBarType) {
	return (
		<div className="flex flex-row gap-x-2">
			<button onClick={backButton}>Back</button>
			{password.length > 0 ? (
				<button
					className="text-white bg-[#92400e]"
					onClick={() => {
						joinButton(password);
					}}
				>
					Join
				</button>
			) : null}
		</div>
	);
}

export default ButtonBar;
