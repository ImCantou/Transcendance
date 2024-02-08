type ButtonNavType = {
	action: any;
	actionValue: boolean;
	image_clicked: string;
	image_not_clicked: string;
	title: string;
};

function ButtonNav({
	action,
	actionValue,
	image_clicked,
	image_not_clicked,
	title
}: ButtonNavType) {
	const not_clicked =
		"w-full bg-[#242424] hover:bg-amber-800 px-5 py-2 rounded-md flex justify-center rounded-none";
	const clicked =
		"w-full bg-[#242424] px-5 py-2 rounded-md flex justify-center";

	return (
		<button
			onClick={() => action(!actionValue)}
			className={actionValue ? clicked : not_clicked}
			title={title}
		>
			<img src={actionValue ? image_clicked : image_not_clicked} />
		</button>
	);
}

export default ButtonNav;
