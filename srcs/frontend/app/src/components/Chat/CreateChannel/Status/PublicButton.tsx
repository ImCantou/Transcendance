import Globe from "../../../../assets/chat/not-clicked/global.png";

type PublicButtonType = {
	publicFunction: any;
};

function PublicButton({publicFunction} : PublicButtonType) {
	return (
		<button className="w-9/12 flex flex-col  items-center justify-around" onClick={publicFunction}>
			<img src={Globe} alt="white global" className="w-32" />
			<p className="text-lg">Public</p>
		</button>
	);
}

export default PublicButton;
