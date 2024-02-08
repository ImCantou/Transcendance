type TitleType = {
	name: string;
};
function Title({ name }: TitleType) {
	return <h2 className="text-white text-xl">{name} :</h2>;
}

export default Title;
