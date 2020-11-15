let dependency: Set<any> = new Set();
let dependencyMap: Map<string, any> = new Map();
const targetMap: WeakMap<any, any> = new WeakMap();

function reactive( target ) {
	const handler = {
		get( target, key: string, receiver ) {
			console.log( 'Calling GET with ' + key );
			let _result = Reflect.get( target, key, receiver );
			track( target, key );
			return _result;
		},
		set( target, key: string, value, receiver ) {
			console.log( 'Calling SET with ' + key + 'and setting value with ' + value );
			let _oldValue = target[key];
			let _result = Reflect.get( target, key, receiver );
			if ( _result && _oldValue != value ) trigger( target, key );
			return _result;
		}
	};
	return new Proxy( target, handler );
}

function track( target, key: string ) {
	let _depsMap = targetMap.get( target );
	if ( !_depsMap ) targetMap.set( target, ( _depsMap = new Map() ) );

	let _dep = _depsMap.get( key );
	if ( !_dep ) _depsMap.set( key, ( _dep = new Set() ) );
	dependency.add( effect );
}

function trigger( target, key: string ) {
	const _depsMap = targetMap.get( target );
	if ( !_depsMap ) return;

	let _dependency = _depsMap.get( key );
	if ( _dependency ) dependency.forEach( ( effect ) => effect() );
}

let testObj = reactive( { quantity: 4, price: 10 } );
let total;

console.log( 'testObj: ', testObj );
let effect = () => { total = testObj.price * testObj.quantity; };
effect();
console.log( 'total: ', total );

testObj.quantity = 15;
console.log( 'total: ', total );
