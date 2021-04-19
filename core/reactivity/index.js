//防止依赖重复收集
let targetMap = new WeakMap();//对应的是reactive中的obj->对应了一个依赖集合depsMap映射  {target:depsMap}
//这个依赖集合映射
/*
{
  key1:dep1,
  key2:dep2
}
*/
//activeEffect在每次effect执行的时候作为一个中间变量使用
let activeEffect;
function effect(fn) {
 //收集依赖
 activeEffect=fn;
 fn();//调用这个函数
 activeEffect=null;
}
function getDep(target,key)
{
  let depsMap = targetMap.get(target);
  if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()));
    //对象target:Map->依赖集Deps(target,deps):Map->单个依赖dep(key,dep)
  }
  let dep = depsMap.get(key);
	if (!dep) {
    depsMap.set(key, (dep = new Set()));
  }
  return dep;
}
function track(target, key) {
  //console.log(target);
  let dep=getDep(target,key);
  if (!dep.has(activeEffect)&&activeEffect) {
    dep.add(activeEffect);
	}
}

function trigger(target, key) {
  // const depsMap = targetMap.get(target);
  // if (!depsMap) return;
  // depsMap.get(key).forEach(e => effects.add(e))
  let dep=getDep(target,key);
  dep.forEach(fn => {
      fn()
  });
}

function reactive(target) {
  return new Proxy(target, {
    get(target, prop) {
      track(target, prop);
      return Reflect.get(target, prop);
    },
    set(target, prop, newVal) {
      Reflect.set(target, prop, newVal);
      trigger(target, prop);
      /* 
        必须 return true;
        否则会产生警告 'set' on proxy: trap returned falsish for property
      */
      return true;
    }
  })
}

function ref(target) {
  let value = target

  const obj = {
    get value() {
      track(obj, 'value');
      return value;
    },
    set value(newVal) {
      if (newVal !== value) {
        value = newVal;
        trigger(obj, 'value');
      }
    }
  }

  return obj;
}
export {
  reactive,
  ref,
  effect
}