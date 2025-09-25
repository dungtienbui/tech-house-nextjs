export default function Devider({ width = "w-full", borderColor = "border-black", border = "border", margin = "m-0" }: {
    width?: string;
    borderColor?: string;
    border?: string;
    margin?: string;
}) {
    return (
        <div className={`${width} ${border} ${borderColor} ${margin} h-0`} />
    );
}