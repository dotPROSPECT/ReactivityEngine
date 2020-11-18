const targetMap: WeakMap<any, any> = new WeakMap();
let activeEffect: () => any = () => { };

function _track( target, key: string ) {
	if ( activeEffect ) {
		console.log( '_track -> targetMap: ', targetMap );

		let _dependencyMap = targetMap.get( target );
		if ( !_dependencyMap ) targetMap.set( target, ( _dependencyMap = new Map() ) );

		console.log( '_track._dependencyMap: ', _dependencyMap );

		let _dependencySet = _dependencyMap.get( key );
		if ( !_dependencySet ) _dependencyMap.set( key, ( _dependencySet = new Set() ) );
		_dependencySet.add( activeEffect );

		console.log( '_track._dependencySet: ', _dependencySet );
	}
}

function _trigger( target, key: string ) {
	const _depsMap = targetMap.get( target );
	if ( !_depsMap ) return;

	console.log( '_trigger._depsMap: ', _depsMap );

	let _dependencySet = _depsMap.get( key );
	console.log( '_trigger._dependencySet: ', _dependencySet );
	if ( _dependencySet ) _dependencySet.forEach( ( effect ) => effect() );

}

export function reactive( target ) {
	const handler = {
		get( target, key: string, receiver ) {
			console.log( 'Calling proxy [[ GET ]] with {{ ' + key + ' }} and getting value ' + target[key] );

			let _result = Reflect.get( target, key, receiver );
			_track( target, key );
			return _result;
		},
		set( target, key: string, value, receiver ) {
			console.log( 'Calling proxy [[ SET ]] with {{ ' + key + ' }} and setting value with ' + value );

			let _oldValue = target[key];
			let _result = Reflect.get( target, key, receiver );
			if ( _result && _oldValue != value ) _trigger( target, key );
			return _result;
		}
	};
	return new Proxy( target, handler );
}

export function effect( eff ) {
	activeEffect = eff;
	activeEffect();
	activeEffect = () => { };
}

export function ref( raw ) {
	const wrapper = {
		get value() {
			console.log( 'Calling ref [[ GET ]] and getting value ' + raw );

			_track( wrapper, 'value' );
			return raw;
		},
		set value( newValue ) {
			console.log( 'Calling ref [[ SET ]] and setting value with ' + newValue );

			raw = newValue;
			_trigger( wrapper, 'value' );
		}
	};
	return wrapper;
}
