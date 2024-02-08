type NavButtonType = {
	Image: string;
	description: string;
	action: () => void;
};

function NavButton({ Image, description, action = () => {} }: NavButtonType) {
	const button_style: string = "h-full bg-[#eaecee]";

	return (
		<button className={button_style} onClick={action}>
			<img src={Image} alt={description} className=" w-6 h-6" />
		</button>
	);
}

export default NavButton;
