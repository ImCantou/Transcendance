import Padlock from "../../../../assets/chat/not-clicked/padlock.png";

type PrivateButtonType = {
	privateFunction: any;
};

function PrivateButton({privateFunction}: PrivateButtonType) {
	return (
		<button className="w-9/12 flex flex-col justify-center items-center" onClick={privateFunction}>
			<img src={Padlock} alt="white padlock" className="w-32" />
			<p className="text-lg">Private</p>
		</button>
	);
}

export default PrivateButton;
