export default function getUnique<TA, TB>(inputA:Array<TA>, inputB:Array<TB>, callback:(uniqueA:Array<TA>, uniqueB:Array<TB>) => any):void
{
	callback(inputA.filter(a => (inputB.indexOf(<any> a) < 0)), inputB.filter(b => (inputA.indexOf(<any> b) < 0)));
}
