/// <reference types="vite/client" />

type Path = string;
function pathString(): Path;

declare module "*.inv" {
	export default pathString();
}
declare module "*.tsv" {
	export default pathString();
}
