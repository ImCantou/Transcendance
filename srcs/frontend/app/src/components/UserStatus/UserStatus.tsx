import { useEffect } from "react";
import io from "socket.io-client";
import apiAddress from "../../utils/apiAddress";

// export function UserStatus() {
// 	useEffect(() => {
// 		const socket = io(apiAddress);
// 		return () => {
// 			socket.disconnect();
// 		};
// 	}, []);

// 	return <></>;
// }
