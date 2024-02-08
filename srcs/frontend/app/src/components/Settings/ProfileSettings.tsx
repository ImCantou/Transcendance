import UpdateUsernameButton from "./UpdateUsernameButton/UpdateUsernameButton";
import UpdateProfilePictureButton from "./UpdateProfilePictureButton/UpdateProfilePictureButton";

export function ProfileSettings() {
	return (
		<div className="px-5 mx-2 py-5 mb-10 flex flex-col w-96 border-4 items-center justify-start bg-zinc-700  rounded-md">
			<h2 className="text-white text-xl font-bold py-2">User settings</h2>
			<UpdateUsernameButton />
			<UpdateProfilePictureButton />
		</div>
	);
}
