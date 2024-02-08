import Bubble from "../../../assets/chat/bubble-chat.png";

type DefaultType = {
    css: string;
};

function Default({css}: DefaultType) {
    return (
			<div className={css + " overflow-auto"}>
				<div className="flex text-center justify-center items-center flex-col h-full">
					<img src={Bubble} alt="" />
					<h2 className="text-3xl">ft_transcendance chat</h2>
					<p className="text-sl flex items-center justify-center">
						Create or join a channel
					</p>
				</div>
			</div>
    );
}

export default Default;