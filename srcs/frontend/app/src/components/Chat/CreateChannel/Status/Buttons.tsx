import PrivateButton from "./PrivateButton";
import PublicButton from "./PublicButton";

type ButtonsType = {
    setPosition: any;
    setStatus: any;
}

function Buttons({setPosition, setStatus}: ButtonsType) {
    return (
			<div
				id="status"
				className="flex flex-col space-y-2 items-center h-full justify-center"
			>
				<PublicButton publicFunction={() => {setPosition(1); setStatus('PUBLIC')}}/>
				<PrivateButton privateFunction={() => {setPosition(2); setStatus('PRIVATE')}}/>
			</div>
    )
}

export default Buttons;