type ProfileType = {
	user: {
		id: number;
		name: string;
		image: string;
	};
};

function Profile({ user }: ProfileType) {
	return (
		<div className="flex flex-row items-center p-2 flex-wrap">
			<img src={user.image} alt="" className="h-12 w-12 rounded-full" />
			<h2 className="text-2xl px-2">{user.name}</h2>
		</div>
	);
}

export default Profile;
