let dependency: Set<any> = new Set();
let dependencyMap: Map<string, any> = new Map();
const targetMap: WeakMap<any, any> = new WeakMap();

function reactive( target: Record<string, string | number> ) {
	const handler = {
		get( target: Record<string, string | number>, key: string, receiver ) {
			console.log( 'Calling GET with ' + key );
			return Reflect.get( target, key, receiver );
		},
		set( target: Record<string, string | number>, key: string, value, receiver ) {
			console.log( 'Calling SET with ' + key + 'and setting value with ' + value );
			return Reflect.get( target, key, receiver );
		}
	};
	return new Proxy( target, handler );
}

function track( target: Record<string, string | number>, key: string ) {
	let _depsMap = targetMap.get( target );
	let _dep = _depsMap.get( key );

	if ( !_depsMap ) targetMap.set( target, ( _depsMap = new Map() ) );
	if ( !_dep ) _depsMap.set( key, ( _dep = new Set() ) );
	dependency.add( effect );
}

function trigger( target: Record<string, string | number>, key: string ) {
	const _depsMap = targetMap.get( target );
	if ( !_depsMap ) return;
	let _dependency = _depsMap.get( key );
	if ( _dependency ) dependency.forEach( ( effect ) => effect() );
}

let testObj = reactive( { quantity: 4, price: 10 } );
let total;

let effect = () => { total = testObj.price * testObj.quantity; };
track( testObj );
effect();
