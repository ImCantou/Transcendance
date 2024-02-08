import { useContext } from "react";
import SocketWrapper, {
	SocketWrapperContext,
	SocketWrapperProvider
} from "../../utils/websockets/SocketWrapper";
import { UserProvider } from "../../utils/contexts/userContext";
import PongLayout from "../../layouts/PongLayout/PongLayout";

function GamePage() {
	const sm: SocketWrapper = useContext(SocketWrapperContext);

	return (
			<SocketWrapperProvider value={sm}>
				<PongLayout />
			</SocketWrapperProvider>
	);
}

export default GamePage;
