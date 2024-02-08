type ButtonHeaderType = {
	vue: boolean;
	setVue: any;
};

function ButtonHeader({ vue, setVue }: ButtonHeaderType) {
	const button_css =
		"w-full h-20 rounded-none text-2xl font-bold hover:bg-[#23262a]";
	const clicked_css = "bg-[#282b30] text-2xl font-bold w-full rounded-none";
	return (
		<div className="flex flex-row bg-[#1a1a1a] h-20">
			<button
				className={(!vue ? clicked_css : button_css) + " rounded-tr-xl"}
				onClick={() => setVue(false)}
			>
				Settings
			</button>
			<button
				className={(vue ? clicked_css : button_css) + " rounded-tl-xl"}
				onClick={() => setVue(true)}
			>
				Moderation
			</button>
		</div>
	);
}

export default ButtonHeader;
