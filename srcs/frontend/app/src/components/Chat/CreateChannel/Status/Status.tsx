import Header from "../Header";
import Buttons from "./Buttons";

type StatusType = {
	setPosition: any;
	setStatus: any;
};

function Status({setPosition, setStatus}: StatusType) {
	return (
		<>
			<Header title={"Create Room"} description={"Choose the status of your new room"}/>
			<Buttons setPosition={setPosition} setStatus={setStatus}/>
		</>
	);
}

export default Status;
