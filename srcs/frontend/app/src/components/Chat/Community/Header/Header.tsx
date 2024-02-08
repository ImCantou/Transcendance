type HeaderType = {
	togglemodal: any;
};
function Header({ togglemodal }: HeaderType) {
	return (
		<div className="flex justify-between px-3 w-full h-[10%] bg-[#eaecee]">
			<h2 className="bg-[#eaecee] text-black text-4xl  rounded-md flex items-center">
				Community
			</h2>
			<div className="h-full flex flex-row items-center">
				<button onClick={togglemodal} className="h-full bg-[#eaecee]">
					<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" height="32px" width="32px"><path fill="#000000" d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"/></svg>
				</button>
			</div>
		</div>
	);
}

export default Header;
