const DEV_ENV = true;

const targetMap: WeakMap<any, any> = new WeakMap();
let activeEffect: () => any = () => { };

function _track( target, key: string ) {
	if ( activeEffect ) {
		DEV_ENV && console.log( '_track -> targetMap: ', targetMap );

		let _dependencyMap = targetMap.get( target );
		if ( !_dependencyMap ) targetMap.set( target, ( _dependencyMap = new Map() ) );

		DEV_ENV && console.log( '_track._dependencyMap: ', _dependencyMap );

		let _dependencySet = _dependencyMap.get( key );
		if ( !_dependencySet ) _dependencyMap.set( key, ( _dependencySet = new Set() ) );
		_dependencySet.add( activeEffect );

		DEV_ENV && console.log( '_track._dependencySet: ', _dependencySet );
		DEV_ENV && console.log( ' ' );
	}
}

function _trigger( target, key: string ) {
	const _dependencyMap = targetMap.get( target );
	if ( !_dependencyMap ) return;

	DEV_ENV && console.log( '_trigger._dependencyMap: ', _dependencyMap );

	let _dependencySet = _dependencyMap.get( key );
	if ( _dependencySet ) _dependencySet.forEach( ( effect ) => effect() );

	DEV_ENV && console.log( '_trigger._dependencySet: ', _dependencySet );
	DEV_ENV && console.log( ' ' );
}

export function reactive( target ) {
	const handler = {
		get( target, key: string, receiver ) {
			DEV_ENV && console.log( 'Calling proxy [[ GET ]] with {{ ' + key + ' }} and getting value ' + target[key] );
			DEV_ENV && console.log( ' ' );

			let _result = Reflect.get( target, key, receiver );
			_track( target, key );
			return _result;
		},
		set( target, key: string, value, receiver ) {
			DEV_ENV && console.log( 'Calling proxy [[ SET ]] with {{ ' + key + ' }} and setting value with ' + value );
			DEV_ENV && console.log( ' ' );

			let _oldValue = target[key];
			let _result = Reflect.set( target, key, value, receiver );
			if ( _result && _oldValue != value ) _trigger( target, key );
			return _result;
		}
	};
	DEV_ENV && console.log( ' ' );
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
			DEV_ENV && console.log( 'Calling ref [[ GET ]] and getting value ' + raw );
			DEV_ENV && console.log( ' ' );

			_track( wrapper, 'value' );
			return raw;
		},
		set value( newValue ) {
			DEV_ENV && console.log( 'Calling ref [[ SET ]] and setting value with ' + newValue );
			DEV_ENV && console.log( ' ' );

			raw = newValue;
			_trigger( wrapper, 'value' );
		}
	};
	return wrapper;
}
