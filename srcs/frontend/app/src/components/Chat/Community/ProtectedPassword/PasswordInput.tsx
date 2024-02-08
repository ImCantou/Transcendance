type PasswordInputType = {
	password: string;
	setPassword: any;
};
function PasswordInput({ password, setPassword }: PasswordInputType) {
	return (
		<input
			type="password"
			placeholder="Enter password..."
			value={password}
			className="rounded w-[80%] mx-auto h-12 outline-none px-2 bg-[#eaecee] text-black"
			onChange={(e) => {
				setPassword(e.target.value);
			}}
		/>
	);
}

export default PasswordInput;
